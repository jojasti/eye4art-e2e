# Findings — content/behavior mismatches found on production

Found while exploring the site with Playwright MCP for `TEST_PLAN.md` on 2026-09-21, by
comparing what each page _says_ against what it actually _shows_. These are not bugs in the
test suite — they are logged here per CLAUDE.md instead of being "fixed" by changing test
expectations to match the site.

---

### 1. Turntable-shelves intro text undercounts models and understates the top price

- **Page:** `/products/turntable-shelves`
- **Expected:** The intro paragraph says "Pet modela, od 85€ do 250€." (Five models, from €85
  to €250).
- **Actual:** The page shows **7** models, and the most expensive one ("The Master Stack") costs
  **280€**, not 250€.
- **Evidence:** Intro paragraph text: `"Pet modela, od 85€ do 250€."` Product headings on the
  page: Spin & Store (155€), Industrial Deck (230€), Vertical Vibe (190€), Groove Cube (250€),
  Vertical Vibe Glass (210€), Turntable Stand (85€), The Master Stack (280€) — 7 cards total.
- **Status:** Fixed on production. Intro paragraph now reads "Modeli od 85€, svaki se može
  prilagoditi vašem prostoru." — no longer states a fixed model count or a price ceiling.

### 2. Footer logo's accessible name drops the "4" from the brand name

- **Page:** every page (shared footer component)
- **Expected:** The footer's "EYE4ART STUDIO" logo link should be identifiable the same way the
  header's is.
- **Actual:** The header logo's "4" character is in the accessibility tree, so its accessible
  name is "EYE4ART STUDIO". The footer logo's "4" span has `aria-hidden="true"`, so its
  accessible name is **"EYEART STUDIO"** (the "4" is dropped), even though the visible text and
  `textContent` are identical in both places.
- **Evidence:** `nav a[href="/"]` inner HTML: `<span>4</span>` with no `aria-hidden`.
  `footer a[href="/"]` inner HTML: `<span aria-hidden="true">4</span>`. Confirmed via a
  Playwright accessibility snapshot: the header link's accessible name reads "EYE4ART STUDIO"
  while the footer link's reads "EYEART STUDIO".
- **Status:** Fixed. The footer logo's "4" span no longer has `aria-hidden`, confirmed via DOM
  inspection — both links now expose the same accessible name.

### 3. "The Master Stack" is called a new model while it's discontinued

- **Page:** `/products/turntable-shelves`
- **Expected:** A discontinued/out-of-stock showcase item shouldn't be marketed as new.
- **Actual:** Its description reads: _"Novi model premium police za gramofon..."_ ("New model of
  premium turntable shelf...") while the same card shows the "NIJE NA STANJU" (disabled) order
  button and an "OUT OF STOCK" badge.
- **Evidence:** Card description text: `"Novi model premium police za gramofon. Dizajnirana da
primi gramofon na vrhu..."`; order button text `NIJE NA STANJU` (`disabled: true`).
- **Status:** Fixed on production. Description now reads "Premium polica iz naše ranije
  kolekcije, više se ne izrađuje." ("Premium shelf from our earlier collection, no longer made.")
  — correctly describes it as discontinued instead of new.

### 4. "Out of Stock" badge is in English on an otherwise Serbian page

- **Page:** `/products/turntable-shelves`, The Master Stack card
- **Expected:** All visible text on the Serbian-language page is in Serbian (the order button
  itself correctly says "NIJE NA STANJU").
- **Actual:** The image overlay badge on the same card reads **"OUT OF STOCK"** in English.
- **Evidence:** `imgWrapper.innerText` for that card resolves to `"OUT OF STOCK"` alongside a
  Serbian button label and Serbian description.
- **Status:** Won't fix — owner decision. Confirmed still "OUT OF STOCK" in English on production
  as of 2026-09-22.

### 5. Footer category names don't match the actual category page headings

- **Page:** footer, present on every page, linking to the 5 category pages
- **Expected:** Footer link text should match (or clearly correspond to) the destination page's
  own heading.
- **Actual:** 4 of 5 footer labels use different product names than the pages they link to:

  | Footer label           | Links to                      | Actual page `<h1>`                                                                     |
  | ---------------------- | ----------------------------- | -------------------------------------------------------------------------------------- |
  | "Police za Gramofon"   | `/products/turntable-shelves` | "Police i stalci za gramofon"                                                          |
  | "Industrijske Lampe"   | `/products/retro-lamps`       | "Retro lampe i lusteri"                                                                |
  | "Noćni Ormarići"       | `/products/nightstands`       | "Noćni stočići" (different noun — "ormarići" = cabinets, not "stočići" = small tables) |
  | "Postolja za Zvučnike" | `/products/audio-equipment`   | "Audio oprema" (unrelated name)                                                        |

  Only "Pomoćni Stočići" → `/products/side-tables` ("Pomoćni stočići") matches, aside from
  capitalization.

- **Evidence:** Footer `<a>` text vs. each target page's `<h1>`, read directly from the DOM on
  each of the 5 category pages.
- **Status:** Partly fixed. The nightstands footer label was changed from "Noćni Ormarići" to
  "Noćni Stočići", now matching the page heading. The other 3 mismatched labels ("Police za
  Gramofon", "Industrijske Lampe", "Postolja za Zvučnike") are unchanged and stay as-is on
  purpose — an owner decision for SEO (these labels target different search keywords than the
  page headings themselves).

### 6. Every page ships two conflicting `<meta name="description">` tags

- **Pages:** all pages checked (`/`, `/about`, `/products`, all 5 category pages, `/blog`, a
  blog post, `/contact`) — confirmed via raw HTML (`curl`), not the client-rendered DOM.
- **Expected:** One `<meta name="description">` per page, matching that page's own content.
- **Actual:** Each page's raw HTML contains **two** description tags: a generic, identical,
  site-wide one (no `data-rh` attribute — looks like a static default baked into `index.html`)
  that appears **first**, followed by the page-specific one that React Helmet renders (marked
  `data-rh="true"`). Since crawlers generally use the first matching meta tag, the page-specific
  descriptions that were clearly written per page (and are good, keyword-relevant copy) may
  never actually reach search results — Google may be indexing the same generic description for
  every single page instead.
- **Evidence:** `curl https://www.eye4artstudio.com/products/turntable-shelves` contains, in
  order:
  ```html
  <meta
    name="description"
    content="Ručno rađene police za gramofon i vinil ploče, industrijske lampe od metala, pomoćni stočići, noćni ormarići i postolja za zvučnike. Unikatni industrijski nameštaj od metala i drveta po meri. Eye4Art Studio Beograd."
  />
  ...
  <meta
    name="description"
    content="Police i stalci za gramofon i vinil ploče, ručna izrada. Metal i drvo, dimenzije po meri. Spin &amp; Store, Industrial Deck, Vertical Vibe. Beograd."
    data-rh="true"
  />
  ```
  Same two-tag pattern confirmed on all 10 other URLs checked. `<title>` and `<link
rel="canonical">` are each present exactly once per page and correct — only the description
  tag is duplicated.
- **Status:** Fixed on production. `/products/turntable-shelves` now ships exactly one
  `meta[name="description"]` tag (the page-specific one, `data-rh="true"`) — the generic
  sitewide default is gone.

### 7. Parts of the UI stay in Serbian after switching to English

Found on 2026-09-25 with Playwright MCP while adding the English coverage. After clicking
`English` (`localStorage["eye4art-lang"] = "en"`), headings, menu and most labels switch, but
these UI strings do not:

- **Page:** `/contact`
  - **Expected:** every contact form label in English, like its siblings.
  - **Actual:** the phone field label stays **"Telefon"**, while the other labels read
    "YOUR NAME", "YOUR EMAIL", "YOUR MESSAGE" and the button reads "SEND MESSAGE".
  - **Evidence:** snapshot of the form in English mode: `text: YOUR NAME`,
    `text: YOUR EMAIL`, `text: Telefon`, `text: YOUR MESSAGE`, `button "SEND MESSAGE"`.
- **Page:** `/`
  - **Expected:** the Google reviews link in English, like the contact page's
    "See all reviews and leave yours".
  - **Actual:** link text stays **"Sve recenzije na Google-u"**.
  - **Evidence:** `main a` in English mode: `"Sve recenzije na Google-u" -> https://share.google/QIooFGi7nJu3SztKv`.
- **Page:** `/blog`
  - **Expected:** the blog list UI (not the posts themselves) in English.
  - **Actual:** every card still shows **"Čitaj više"** and **"min čitanja"**, and dates
    are in Serbian Cyrillic (e.g. "6. август 2026."). Post titles are Serbian too, which may be
    intentional (Serbian-only content).
  - **Evidence:** card link text in English mode:
    `"6. август 2026.•3 min čitanjaPostolje ili Stalak za Zvučnik ..."`, `"Čitaj više→"`.
- **Not tested yet:** the correct English wording is the owner's call, so no `@fixme` scenario
  was written with an invented expected text. Once the English strings are decided, add them
  to the English scenario in `navigation.feature`.
