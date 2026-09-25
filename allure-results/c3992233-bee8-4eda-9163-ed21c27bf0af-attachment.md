# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features\about.feature.spec.js >> About page >> About page shows its main heading and core values
- Location: .features-gen\features\about.feature.spec.js:6:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'AUTENTIČN', exact: true, level: 3 })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'AUTENTIČN', exact: true, level: 3 }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'AUTENTIČN', exact: true, level: 3 })

```

```yaml
- region "Notifications (F8)":
    - list
- region "Notifications alt+T"
- banner:
    - navigation:
        - link "EYE4ART STUDIO":
            - /url: /
        - button "Srpski": RS
        - text: /
        - button "English": EN
        - button "Toggle menu":
            - img
- main:
    - main:
        - heading "DIZAJNIRANO DA TRAJE, NAPRAVLJENO DA SE VOLI!" [level=1]
        - paragraph: '"Ja zapravo dolazim da nađem svoj mir ovde uveče. Kad ti je dosta problema, kad ti je dosta rasprave u kući. Finansijske krize, raznoraznih problema. Dođeš na neko mesto koje je za tebe pravi zen i u koje želiš samo da uđeš i da ćutiš, da ne pričaš ni sa kim, kao što će biti večeras, da pričaš sam sa sobom."'
        - paragraph: — MIRKO RAŠIĆ
        - heading "GDE RUKE PIŠU ISTORIJU" [level=2]
        - paragraph: Eye4Art Studio počiva na temeljima kreativnog rešavanja problema u radionici. Svoj mir pronalazimo među alatima, drvetom i metalom. Verujemo da radionica nije samo mesto rada, to je utočište gde buka spoljašnjeg sveta nestaje, a fokus se seli na stvaranje nečeg smislenog i opipljivog.
        - paragraph: Eye4Art Studio je beogradska radionica u kojoj sirovi metal pretvaramo u predmete sa dušom. Sve je počelo iz lične potrebe,pravili smo predmete koje smo želeli za sopstveni prostor, to mesto gde se povlačimo nakon dugog dana. Želeli smo komade koji imaju težinu, karakter i dušu.
        - paragraph: Ono što je počelo kao naš lični ventil, ubrzo je privuklo ljude koji su prepoznali tu istu iskrenost u našem radu. Shvatili smo da nismo jedini koji traže toplinu ručnog rada i nameštaj koji nije samo funkcionalan, već saputnik u svakodnevnom životu.
        - paragraph: Naš moto 'Dizajnirano da traje, napravljeno da se voli' rođen je prirodno. Kada provedete sate bruseći jedan komad drveta ili pažljivo spajajući metalne elemente, u taj predmet ugrađujete deo sopstvenog mira. Zato naša estetika spaja retro šarm sa dugovečnošću koja prkosi vremenu. Dizajniramo ono što volimo i u šta verujemo.
        - img "Eye4Art Workshop"
        - text: ←
        - paragraph: Klikni i povuci levo desno da vidiš celu radionicu
        - text: →
        - img "Workshop Panorama"
        - heading "ONO ZA ŠTA SE ZALAŽEMO" [level=2]
        - heading "AUTENTIČNOST" [level=3]
        - paragraph: Svaki komad je jedinstven, ručno rađen sa fokusom na specifičan karakter materijala.
        - heading "DUGOVEČNOST" [level=3]
        - paragraph: Koristimo čelik i puno drvo kako bismo osigurali da naš nameštaj traje generacijama.
        - heading "PO MERI" [level=3]
        - paragraph: Vaše ideje pretvaramo u stvarnost kroz personalizovan pristup svakom projektu.
- contentinfo:
    - link "EYE4ART STUDIO":
        - /url: /
    - paragraph: DIZAJNIRANO DA TRAJE, NAPRAVLJENO DA SE VOLI!
    - link "Dodaj Eye4Art Studio kao preferirani izvor na Google-u":
        - /url: https://www.google.com/preferences/source?q=eye4artstudio.com
        - img "Dodaj Eye4Art Studio kao preferirani izvor na Google-u"
    - heading "Brzi linkovi" [level=3]
    - link "Početna":
        - /url: /
    - link "O nama":
        - /url: /about
    - link "Proizvodi":
        - /url: /products
    - link "Blog":
        - /url: /blog
    - link "Kontakt":
        - /url: /contact
    - heading "Proizvodi" [level=3]
    - link "Police za Gramofon":
        - /url: /products/turntable-shelves
    - link "Industrijske Lampe":
        - /url: /products/retro-lamps
    - link "Pomoćni Stočići":
        - /url: /products/side-tables
    - link "Noćni Stočići":
        - /url: /products/nightstands
    - link "Postolja za Zvučnike":
        - /url: /products/audio-equipment
    - heading "Kontakt —" [level=3]
    - link "+381 65 510 7517":
        - /url: tel:+381655107517
        - text: +381 65 510 7517
        - img
    - link "nemanja.kopanlija@gmail.com":
        - /url: mailto:nemanja.kopanlija@gmail.com
        - text: nemanja.kopanlija@gmail.com
        - img
    - text: Beograd, Srbija
    - img
    - link "Instagram":
        - /url: https://instagram.com/eye4art_studio
        - text: Instagram
        - img
    - link "Facebook":
        - /url: https://www.facebook.com/profile.php?id=61588624504665
        - text: Facebook
        - img
- link "Kontaktirajte nas na WhatsApp":
    - /url: https://wa.me/381655107517?text=Zdravo%2C%20zainteresovan%20sam%20za%20va%C5%A1e%20proizvode.
    - img
```

# Test source

```ts
  1  | import { expect } from '@playwright/test';
  2  | import { BasePage } from './BasePage';
  3  | import { ABOUT } from './constants/links';
  4  |
  5  | export class AboutPage extends BasePage {
  6  |   async goto() {
  7  |     await this.open(ABOUT);
  8  |   }
  9  |
  10 |   async verifyValueHeadingsAreShown() {
  11 |     for (const value of ['AUTENTIČN', 'DUGOVEČNOST', 'PO MERI']) {
  12 |       await expect(
  13 |         this.page.getByRole('heading', { level: 3, name: value, exact: true }),
> 14 |       ).toBeVisible();
     |         ^ Error: expect(locator).toBeVisible() failed
  15 |     }
  16 |   }
  17 | }
  18 |
```
