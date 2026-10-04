# Test plan — eye4artstudio.com

Built by exploring the live production site with Playwright MCP on 2026-09-21.
Covers every route currently reachable from the main navigation and footer:
`/`, `/about`, `/products`, `/products/<category>` (×5), `/blog`, `/blog/<post>`, `/contact`.

Legend: **critical** = sales, ordering, contact (money-impacting or lead-impacting).
**high** = navigation/funnel integrity. **normal** = content/brand, low business risk.

No test in this plan submits the contact form for real. The contact form posts through EmailJS
(`api.emailjs.com`) — that domain is blocked globally in the test fixture, the same way analytics
is, so **no test run can ever send a real message, even by mistake.** Scenario 19 then re-routes
that same blocked pattern with its own `page.route` handler to inspect the intercepted request
instead of letting it through.

`FINDINGS.md` already has 7 confirmed content/behavior mismatches from this exploration pass —
see the note at the end of this plan for how each one is handled.

---

## 1. `category.feature` → `category.steps.ts` → `pages/CategoryPage.ts` (existing file, extend)

Already implemented: category heading + products visible for all 5 categories; order button
enabled for the 6 turntable-shelves models; order button disabled for "The Master Stack" (done).

Gaps found by exploring all 5 category pages:

| #   | Scenario                                                                    | Checks                                                                                        | Why it matters                                                                                                                                                                                                                                                                                                              | Priority                                                                                                                                            |
| --- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Order button is enabled for `<model>` — **audio-equipment** (8 models)      | Same as existing turntable-shelves check, new Examples rows                                   | Order button is the only path to a sale on this page; currently only 1 of 5 categories is covered                                                                                                                                                                                                                           | **critical** `@critical`                                                                                                                            |
| 2   | Order button is enabled for `<model>` — **retro-lamps** (5 models)          | Same                                                                                          | Same                                                                                                                                                                                                                                                                                                                        | **critical** `@critical`                                                                                                                            |
| 3   | Order button is enabled for `<model>` — **side-tables** (3 models)          | Same                                                                                          | Same                                                                                                                                                                                                                                                                                                                        | **critical** `@critical`                                                                                                                            |
| 4   | Order button is enabled for `<model>` — **nightstands** (2 models)          | Same                                                                                          | Same                                                                                                                                                                                                                                                                                                                        | **critical** `@critical`                                                                                                                            |
| 5   | Stock status is shown for `<model>`                                         | The paragraph under the order button matches one of 3 allowed states — `/✓ Na stanju          | Izrada \d+-\d+ radnih dana                                                                                                                                                                                                                                                                                                  | NIJE NA STANJU/` — checked generically for every card, **never** mapped to a specific model, since which model has which state changes week to week | Customers rely on this line to know when they'll receive the item — wrong/missing status is a support-ticket generator | high |
| 6   | "Nazad na proizvode" link returns to the products index                     | Clicking it lands on `/products`                                                              | Broken breadcrumb strands a shopper mid-funnel                                                                                                                                                                                                                                                                              | high                                                                                                                                                |
| 7   | The quiz button is shown on turntable-shelves and on no other category page | The `uradi quiz` button is visible on `/products/turntable-shelves` and absent on the other 4 | **Rewritten 2026-09-28.** The category page owns only the quiz _entry point_; everything inside the modal moved to `quiz.feature` (section 10) when the quiz was rebuilt with 6 questions. The quiz only recommends turntable shelves, so offering it on lamps or nightstands would point buyers at the wrong products      | high                                                                                                                                                |
| 8   | Quiz modal closes via "Close"/"Zatvori"                                     | Modal is gone, page underneath usable again                                                   | **Moved 2026-09-28 to section 10** — closing, reopening and restarting the quiz are covered there now, together with the rest of the modal. A stuck modal blocks the whole page, including the order buttons                                                                                                                | high                                                                                                                                                |
| 9   | Materials and dimensions text exists for `<model>`                          | The two `<p>` lines under the description are non-empty                                       | Factual spec data (not marketing copy) — missing data is a real defect, but exact wording will change per product, so only existence is checked                                                                                                                                                                             | normal                                                                                                                                              |
| 10  | Price is shown for `<model>`                                                | The card shows a `€` price above the order button                                             | **Finding #6**: confirmed missing entirely on retro-lamps, side-tables and nightstands today. This scenario is written to the correct expectation and will be tagged `@fixme` on those 3 categories' Examples rows, pointing at Finding #6, when implemented — turntable-shelves and audio-equipment rows should pass as-is | **critical** `@critical`                                                                                                                            |

Removed from the original draft: visibility checks for the "like" and "Preporuči prijatelju"
buttons. Both are dropped per review — they added no coverage worth the upkeep.

Note on #1–4: model names collected via MCP (`page.evaluate` reading each card's `h3`), so
Examples tables will use only names that actually exist on the live page, per CLAUDE.md.

---

## 2. `products.feature` → `products.steps.ts` → `pages/ProductsPage.ts` (existing file, extend)

Already implemented: each of the 5 category cards is visible on `/products`.
`ProductsPage.openCategoryByName()` already exists but **no scenario calls it** — found during
exploration.

| #   | Scenario                                                                            | Checks                                                      | Why it matters                                                                                                                                    | Priority                 |
| --- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 11  | Opening "`<category>`" from the products index navigates to the right category page | Click the card, assert URL is `/products/<productCategory>` | This is the only link between the category-overview page and the actual sales pages; a wrong `href` silently sends shoppers to the wrong products | **critical** `@critical` |

---

## 3. `home.feature` → `home.steps.ts` → `pages/HomePage.ts` (existing file, extend)

Already implemented: title contains "Eye4Art Studio".

| #   | Scenario                                                            | Checks                                                                                                  | Why it matters                                                                                         | Priority                 |
| --- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------ |
| 12  | "Istraži proizvode" hero link goes to `/products`                   | URL after click                                                                                         | Primary hero CTA — first click most visitors make                                                      | **critical** `@critical` |
| 13  | "Pogledaj sve modele" link goes to `/products/turntable-shelves`    | URL after click                                                                                         | Secondary CTA pointing straight at the flagship category                                               | high                     |
| 14  | Each of the 5 "NAŠI PROIZVODI" grid links goes to its category page | `Scenario Outline`, URL per `<category>`                                                                | Second, more visible entry point into every category — same business risk as #11 but from the homepage | **critical** `@critical` |
| 15  | Google reviews section shows a rating and at least one review       | "5.0" and one testimonial paragraph visible — do **not** assert the review carousel rotates (animation) | Social proof block; only existence is meaningful, per the "no timers/animations" rule                  | normal                   |

---

## 4. `navigation.feature` → `navigation.steps.ts` → `pages/MainMenu.ts` (existing file, extend)

Already implemented: each of the 5 main menu items navigates to the right path.

| #   | Scenario                                                                              | Checks                                                                                                                                             | Why it matters                                                                                                    | Priority |
| --- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------- |
| 16  | Switching to "English" changes the menu labels                                        | After clicking `English`, menu shows HOME / ABOUT US / PRODUCTS / BLOG / CONTACT (confirmed via MCP)                                               | Site serves a bilingual audience; a broken translation toggle degrades the experience for English-speaking buyers | high     |
| 17  | Switching back to "Srpski" restores the original labels                               | Menu shows Početna / O nama / Proizvodi / Blog / Kontakt                                                                                           | Confirms the toggle is reversible, not one-way                                                                    | normal   |
| 17a | "`<menuItem>`" page shows the "`<englishHeading>`" heading after switching to English | Switch to English on home, open Home / About Us / Products / Contact from the English menu, assert 2 real English headings per page (read via MCP) | Proves translation reaches page content, not just the menu, and persists across navigation                        | high     |

Blog is not in 17a: its h1 is "Blog" in both languages and its UI stays Serbian (Finding #7).

Note: confirmed via MCP that the language toggle is client-side state (URL does not change,
e.g. no `/en` route) and persists across navigation — tests must not assert on URL for this.

---

## 5. `contact.feature` → `contact.steps.ts` → `pages/ContactPage.ts` (new)

Not covered at all today. This is the site's lead-capture page.

| #   | Scenario                                                            | Checks                                                                                                                                                                        | Why it matters                                                                      | Priority                 |
| --- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------ |
| 18  | Contact page shows the contact form fields                          | Name, Email, Phone, Message inputs and "POŠALJI PORUKU" button are visible                                                                                                    | If any field silently disappears, visitors can't reach the business at all          | **critical** `@critical` |
| 19  | ~~Submitting the contact form sends the expected request (mocked)~~ | **Dropped by owner decision (2026-09-25): no scenario clicks the send button, even mocked.** `EMAILJS_URL_PATTERN` is still aborted globally in `fixtures.ts` as a safety net | -                                                                                   | -                        |
| 20  | Contact info links are correct                                      | `tel:+381655107517`, `mailto:nemanja.kopanlija@gmail.com`, Instagram and Facebook links have the right `href`                                                                 | These are direct sales channels; a wrong phone/email link loses a customer silently | **critical** `@critical` |

---

## 6. `about.feature` → `about.steps.ts` → `pages/AboutPage.ts` (new)

Not covered at all today. Brand/marketing page, low direct sales impact.

| #   | Scenario                                                                            | Checks                                                    | Why it matters                                                                                           | Priority |
| --- | ----------------------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------- |
| 21  | About page shows the main heading and the 3 "ONO ZA ŠTA SE ZALAŽEMO" value headings | "AUTENTIČNOST", "DUGOVEČNOST", "PO MERI" headings visible | Confirms the page renders its core content; exact paragraph copy is excluded per the marketing-copy rule | normal   |

(The draggable "Workshop Panorama" pan strip is a drag interaction with no assertable
end-state found during exploration — excluded from the plan rather than tested weakly.)

---

## 7. `blog.feature` → `blog.steps.ts` → `pages/BlogPage.ts` (new)

Not covered at all today. SEO/content page, no ordering involved.

| #   | Scenario                                                | Checks                                                                                          | Why it matters                                                        | Priority |
| --- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------- |
| 22  | Blog index lists posts                                  | At least one article card with a heading and a "Čitaj više" link is visible                     | Confirms the content list renders (14 posts found during exploration) | normal   |
| 23  | Opening a post from "Čitaj više" shows the full article | Post page shows an `h1` matching the card's heading, and a "Nazad na blog" link back to `/blog` | Broken article links would make the blog (and its SEO value) useless  | normal   |

---

## 8. `footer.feature` → `footer.steps.ts` → `pages/FooterPage.ts` (new)

The footer (quick links, product links, contact block, WhatsApp floating button) is identical
on every page — tested once via the home page rather than repeated per page.

| #   | Scenario                                            | Checks                                                                                                                                                                                                                          | Why it matters                                                                                                  | Priority                 |
| --- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 24  | Footer contact links are correct                    | Phone (`tel:`), email (`mailto:`), Instagram, Facebook hrefs in the footer                                                                                                                                                      | Same customer-reachability risk as #20, duplicated site-wide — a footer regression breaks it everywhere at once | **critical** `@critical` |
| 25  | Footer product links go to the right category pages | 5 links under "Proizvodi" match the 5 category routes — this checks `href` correctness only, **not** that the link text matches the destination page's heading (see Finding #5, which is a content mismatch, not a broken link) | Another funnel entry point into sales pages, present on literally every page of the site                        | high                     |
| 26  | Floating WhatsApp button has the correct link       | `href` starts with `https://wa.me/381655107517`                                                                                                                                                                                 | Direct-to-sale channel that's always on screen; broken link loses a warm lead instantly                         | **critical** `@critical` |

Note: this batch does **not** include a scenario asserting the footer logo's accessible name — see
Finding #2. If a future scenario needs to select the footer logo link by role/name, it must use
`"EYEART STUDIO"` (the actual, currently-broken accessible name), and that scenario should be
tagged `@fixme` pointing at Finding #2 rather than silently asserting the broken value as correct.

---

## 9. `seo.feature` → `seo.steps.ts` → `pages/SeoPage.ts` (new)

Not covered at all today. Checked via `curl` (raw prerendered HTML, no JS) and confirmed the same
result persists after full hydration in a real browser. `SeoPage.goto()` takes a path directly
(same pattern as `CategoryPage.goto(productCategory)`), since this feature spans routes rather
than belonging to one page. Examples cover one instance of every route template found on the
site: `/`, `/about`, `/products`, each of the 5 category pages, `/blog`, one blog post, `/contact`
— not all 14 blog posts individually, since the concern is the templating mechanism, not each post.

| #   | Scenario                                                     | Checks                                                                                  | Why it matters                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Priority |
| --- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 27  | "`<page>`" has a title                                       | `<title>` is non-empty and contains "Eye4Art Studio"                                    | Missing/empty titles are a basic SEO and browser-tab regression                                                                                                                                                                                                                                                                                                                                                                                                      | high     |
| 28  | "`<page>`" has one canonical link pointing to the www domain | Exactly one `link[rel="canonical"]`, `href` starts with `https://www.eye4artstudio.com` | Duplicate or missing canonicals split search ranking across URL variants (e.g. non-www vs www)                                                                                                                                                                                                                                                                                                                                                                       | high     |
| 29  | "`<page>`" has one meta description                          | Exactly one `meta[name="description"]`                                                  | **Finding #7**: confirmed today every page ships 2 conflicting description tags (a generic sitewide default plus a page-specific one), which likely means Google indexes the same generic description for every page. This scenario is written to the correct expectation and will be implemented already tagged `@fixme` on every row, pointing at Finding #7 — it is not a new discovery made during implementation, it's already known from this exploration pass | high     |

---

## 10. `quiz.feature` → `quiz.steps.ts` → `pages/QuizPage.ts` (new)

**Dropped by owner decision 2026-10-04.** The quiz is not a core sales path and
the full coverage was expensive to maintain and kept breaking as the quiz logic
changed. Only the entry point stays, in `category.feature`: the quiz button is
offered on turntable-shelves and nowhere else. The description below is kept for
reference only and describes an older version of the quiz.

Re-explored from scratch with Playwright MCP on **2026-09-28**, after the owner rebuilt the quiz.
The old 5-question version (with a budget question and an "over budget" note) is gone. Everything
below was read off the live page — no question, answer or model name is invented.

### How the new quiz behaves

The quiz is reached from the `🎯 Nisam siguran koji model — uradi quiz →` button, which exists
**only** on `/products/turntable-shelves` (checked on all 5 category pages). It opens a modal
overlay that carries no `data-testid` and no `dialog` role, so its parts are located by role +
accessible name and by text.

Six questions, all about the buyer rather than the product, each with exactly three answers:

| #   | Question                         | Answers                                                                                                          |
| --- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | Šta sve imaš?                    | Samo gramofon i ploče / Gramofon + receiver/pojačalo / Kompletan Hi-Fi sistem                                    |
| 2   | Gde ti sad stoji gramofon?       | Na komodi ili polici koju već imam / Sve stoji jedno na drugom / Još ga nemam, tek kupujem                       |
| 3   | Koliko ploča imaš?               | Do pedesetak / Stane u jednu gajbu, oko sto / Ne stižem da ih sredim                                             |
| 4   | Koliko mesta imaš, odoka?        | Uska rupa između nameštaja / Normalan zid, ima prostora / Šta god stane, nije problem                            |
| 5   | Kako držiš ploče?                | Vadim ih stalno, hoću da su pri ruci / Retko ih diram, više stoje / Ima dece ili mačaka pa volim da su sklonjene |
| 6   | Koliko ti je bitno kako izgleda? | Hoću da se primeti, da bude komad / Neka se uklopi, ja biram dezen / Svejedno, bitno je da radi posao            |

Navigation: the counter reads `Pitanje N od 6`; question 1 has **no** `← Nazad` button, questions
2–6 do, and it steps back one question at a time. `Zatvori` closes the modal and resets it —
reopening starts at question 1. There is **no** budget question and **no** over-budget note
anywhere (the `detail.quiz.budget` string still ships in the JS bundle but never renders).

The result screen shows `Naš predlog za tebe`, the model name, its price, a rationale paragraph,
and four buttons: `Pogledaj model →` (closes the modal and scrolls the model's card into view),
`PORUČI odmah` (opens a "Kako želite da naručite?" dialog with WhatsApp / phone / email links that
carry the model name), `Ponovi quiz` (back to question 1) and `Zatvori`.

### The recommendation rules, mapped exhaustively

All **729** answer combinations (3⁶) were walked on the live page. Six of the seven models on the
page are reachable; the discontinued, out-of-stock **"The Master Stack" is never recommended**.

- Question 2 = "Na komodi ili polici koju već imam" and question 1 ≠ "Kompletan Hi-Fi sistem"
  → always **Turntable Stand**.
- Question 5 = "Ima dece ili mačaka..." → **Vertical Vibe Glass** (the model with glass doors).
- Question 6 = "Hoću da se primeti..." → **Groove Cube**; question 1 = "Kompletan Hi-Fi sistem"
  brings in **Industrial Deck**; the remaining paths land on **Vertical Vibe**.
- **Width gate:** **Spin & Store** is reached **only** when question 4 = "Šta god stane, nije
  problem" — in all 729 combinations, never for "Uska rupa između nameštaja" or "Normalan zid,
  ima prostora".

Widths as listed on the cards themselves: Spin & Store **90 cm**, Industrial Deck 56, Groove Cube
56, Vertical Vibe 52, Vertical Vibe Glass 52, Turntable Stand "po zahtevu". Spin & Store is
therefore the only model that can be too wide for the space a buyer picked, which is exactly what
the width scenarios below pin down.

### Scenarios

| #   | Scenario                                                                | Checks                                                                                                                                   | Why it matters                                                                                                                      | Priority                 |
| --- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 30  | The quiz asks its six questions with their answers                      | Walks all 6 questions, asserting `Pitanje N od 6`, the question text and its three answer buttons                                        | Pins the whole questionnaire, so dropping or renaming a question or an answer fails loudly. Also proves there is no budget question | high                     |
| 31  | The first question offers no way back                                   | No `← Nazad` button on question 1                                                                                                        | A back button on the first step would have nowhere to go                                                                            | normal                   |
| 32  | The back button returns to the previous question                        | Answer 2 questions, go back, land on question 2                                                                                          | Buyers correct themselves; a broken back button means restarting the funnel                                                         | high                     |
| 33  | Closing the quiz and opening it again starts from the first question    | `Zatvori` hides the modal; reopening shows question 1 and no back button                                                                 | A modal that reopens mid-questionnaire strands the buyer                                                                            | high                     |
| 34  | "Ponovi quiz" starts the quiz over                                      | From the result screen, back to question 1                                                                                               | Same funnel-integrity concern, from the result screen                                                                               | normal                   |
| 35  | The quiz recommends `<recommendedModel>`                                | 6 verified answer paths, one per reachable model, each asserting the model name and that a price is shown                                | The recommendation **is** the conversion moment; a wrong or missing match wastes the lead                                           | **critical** `@critical` |
| 36  | `<space>` with `<collection>` is never sent to the 90 cm "Spin & Store" | 6 paths across both narrow space answers — every one of them a path that **does** end on Spin & Store once the space answer is opened up | **Hard width rule.** Recommending a 90 cm shelf for "a narrow gap between furniture" produces a return, not a sale                  | **critical** `@critical` |
| 37  | "Šta god stane, nije problem" does reach the 90 cm "Spin & Store"       | The same 3 paths as #36 with the space answer opened up, asserting Spin & Store **is** recommended                                       | Keeps #36 honest — it must not pass just because Spin & Store is never recommended at all                                           | **critical** `@critical` |
| 38  | The recommended `<recommendedModel>` can be ordered from the page       | `Pogledaj model →` closes the modal, the model's card is in the viewport and its `PORUČI` button is enabled                              | A recommendation pointing at a card that can't be ordered is a dead end at the moment of purchase                                   | **critical** `@critical` |
| 39  | "PORUČI odmah" offers the real order channels                           | The order dialog shows the recommended model and WhatsApp / `tel:` / `mailto:` links carrying that model name                            | This is the only checkout the site has; a wrong number, address or model name loses the order                                       | **critical** `@critical` |
| 40  | The recommendation carries no over-budget note                          | No `prelazi budžet` text on the result screen                                                                                            | Regression guard: the budget question was removed, so its leftover note must never come back                                        | normal                   |

Deliberately not tested: the rationale paragraph under each recommendation (marketing copy, per
CLAUDE.md), the exact price value (changes over time), and the scroll animation itself — #38
asserts the card ends up in the viewport with a web-first `toBeInViewport`, not that it animated.

Not covered in this batch: the quiz is **fully** translated into English (verified with MCP — all
6 questions, all answers and the result screen, so this is not a repeat of finding #7). English
coverage needs the language switch, which belongs to `MainMenu` / `navigation.feature`, so it
stays out of `quiz.feature` to keep one page object per feature. Worth a follow-up batch.

---

## Summary

- **critical**: 13 scenarios (all `@critical`) — order buttons and prices across all 5 categories,
  category-card navigation from both `/products` and the homepage, the entire contact page, and
  the global footer/WhatsApp contact channels.
- **high**: 10 scenarios — stock status, breadcrumb, quiz modal, homepage secondary CTA, language
  toggle (EN), footer product links, and the 3 new SEO scenarios.
- **normal**: 6 scenarios — spec text existence, reviews section, language toggle (RS restore),
  about page, blog index/detail.

Section 10 (`quiz.feature`, added 2026-09-28 after the quiz was rebuilt) adds 11 more scenarios on
top of that: 5 `@critical` (#35–39, the recommendation itself, the width rule and the order path),
3 high (#30, #32, #33) and 3 normal (#31, #34, #40). The two old quiz scenarios in
`category.feature` were replaced by the entry-point check in row 7, so the quiz has exactly one
home.

New page objects needed: `ContactPage.ts`, `AboutPage.ts`, `BlogPage.ts`, `FooterPage.ts`, `SeoPage.ts`,
`QuizPage.ts`.
Existing page objects to extend: `CategoryPage.ts`, `ProductsPage.ts`, `HomePage.ts`, `MainMenu.ts`.
`pages/constants/generic.ts` gets a new `EMAILJS_URL_PATTERN` (`/api\.emailjs\.com/`), blocked
globally in `fixtures/fixtures.ts` next to `ANALYTICS_URL_PATTERN`, and a `WHATSAPP_URL` used by
the quiz's order options.

## Findings from this pass (see `FINDINGS.md` for full detail)

7 confirmed content/behavior mismatches, found by comparing what pages say against what they
actually show — not something to silently "fix" by changing test expectations:

1. Turntable-shelves intro text says "5 models, 85€–250€" but there are 7 models, one at 280€.
2. Footer logo's accessible name drops the "4" (`aria-hidden` only on the footer's span) —
   affects any future scenario selecting it by role/name (see note under footer.feature above).
3. "The Master Stack" is described as a new model while it's discontinued/out of stock.
4. Its "OUT OF STOCK" badge is in English on an otherwise all-Serbian page.
5. Footer category link labels don't match 4 of 5 destination pages' own headings (routing itself
   is still correct — see note under footer.feature above).
6. **retro-lamps, side-tables and nightstands show no price at all** on any product card — the
   most business-significant finding, now covered by scenario #10 above (`@fixme` on those 3
   categories once implemented).
7. Every page ships two conflicting `<meta name="description">` tags — now covered by seo.feature
   scenario #29 (`@fixme` on every row once implemented).

Findings #1, #3 and #4 are not turned into scenarios: they're marketing-copy/content-specific
wording, which CLAUDE.md says not to lock in with exact-text assertions. They stay documented in
`FINDINGS.md` only.

Waiting for approval before implementing any of this. Once approved, planned order (one
feature/batch at a time, per CLAUDE.md): **category.feature gaps → products.feature → home.feature
→ contact.feature → footer.feature → navigation.feature (language) → about.feature → blog.feature
→ seo.feature**, critical items first.
