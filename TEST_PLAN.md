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

| #   | Scenario                                                               | Checks                                                                               | Why it matters                                                                                                                                                                                                                                                                                                              | Priority                                                                                                                                            |
| --- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Order button is enabled for `<model>` — **audio-equipment** (8 models) | Same as existing turntable-shelves check, new Examples rows                          | Order button is the only path to a sale on this page; currently only 1 of 5 categories is covered                                                                                                                                                                                                                           | **critical** `@critical`                                                                                                                            |
| 2   | Order button is enabled for `<model>` — **retro-lamps** (5 models)     | Same                                                                                 | Same                                                                                                                                                                                                                                                                                                                        | **critical** `@critical`                                                                                                                            |
| 3   | Order button is enabled for `<model>` — **side-tables** (3 models)     | Same                                                                                 | Same                                                                                                                                                                                                                                                                                                                        | **critical** `@critical`                                                                                                                            |
| 4   | Order button is enabled for `<model>` — **nightstands** (2 models)     | Same                                                                                 | Same                                                                                                                                                                                                                                                                                                                        | **critical** `@critical`                                                                                                                            |
| 5   | Stock status is shown for `<model>`                                    | The paragraph under the order button matches one of 3 allowed states — `/✓ Na stanju | Izrada \d+-\d+ radnih dana                                                                                                                                                                                                                                                                                                  | NIJE NA STANJU/` — checked generically for every card, **never** mapped to a specific model, since which model has which state changes week to week | Customers rely on this line to know when they'll receive the item — wrong/missing status is a support-ticket generator | high |
| 6   | "Nazad na proizvode" link returns to the products index                | Clicking it lands on `/products`                                                     | Broken breadcrumb strands a shopper mid-funnel                                                                                                                                                                                                                                                                              | high                                                                                                                                                |
| 7   | Quiz modal opens from "uradi quiz" button (turntable-shelves only)     | Modal shows "Question 1 of 5" / "PITANJE 1 OD 5" heading and answer options          | Confirmed via MCP: button exists only on turntable-shelves; it's a conversion-assist tool → business wants it working                                                                                                                                                                                                       | high                                                                                                                                                |
| 8   | Quiz modal closes via "Close"/"Zatvori"                                | Modal is gone, page underneath usable again                                          | A stuck modal blocks the whole page, including the order buttons                                                                                                                                                                                                                                                            | high                                                                                                                                                |
| 9   | Materials and dimensions text exists for `<model>`                     | The two `<p>` lines under the description are non-empty                              | Factual spec data (not marketing copy) — missing data is a real defect, but exact wording will change per product, so only existence is checked                                                                                                                                                                             | normal                                                                                                                                              |
| 10  | Price is shown for `<model>`                                           | The card shows a `€` price above the order button                                    | **Finding #6**: confirmed missing entirely on retro-lamps, side-tables and nightstands today. This scenario is written to the correct expectation and will be tagged `@fixme` on those 3 categories' Examples rows, pointing at Finding #6, when implemented — turntable-shelves and audio-equipment rows should pass as-is | **critical** `@critical`                                                                                                                            |

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

## Summary

- **critical**: 13 scenarios (all `@critical`) — order buttons and prices across all 5 categories,
  category-card navigation from both `/products` and the homepage, the entire contact page, and
  the global footer/WhatsApp contact channels.
- **high**: 10 scenarios — stock status, breadcrumb, quiz modal, homepage secondary CTA, language
  toggle (EN), footer product links, and the 3 new SEO scenarios.
- **normal**: 6 scenarios — spec text existence, reviews section, language toggle (RS restore),
  about page, blog index/detail.

New page objects needed: `ContactPage.ts`, `AboutPage.ts`, `BlogPage.ts`, `FooterPage.ts`, `SeoPage.ts`.
Existing page objects to extend: `CategoryPage.ts`, `ProductsPage.ts`, `HomePage.ts`, `MainMenu.ts`.
`pages/constants/generic.ts` gets a new `EMAILJS_URL_PATTERN` (`/api\.emailjs\.com/`), blocked
globally in `fixtures/fixtures.ts` next to `ANALYTICS_URL_PATTERN`.

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
