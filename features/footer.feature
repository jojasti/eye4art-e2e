Feature: Footer

  Scenario: Footer contact links are correct
    Given I open the home page
    Then the footer contact links are correct

  Scenario Outline: Footer has a link to the "<productCategory>" category page
    Given I open the home page
    Then the footer has a link to the "<productCategory>" category page

    Examples:
      | productCategory   |
      | turntable-shelves |
      | audio-equipment   |
      | retro-lamps       |
      | side-tables       |
      | nightstands       |

  Scenario: Floating WhatsApp button has the correct link
    Given I open the home page
    Then the WhatsApp button link is correct

  Scenario Outline: Footer shows the "<footerHeading>" heading
    Given I open the home page
    Then the footer shows the "<footerHeading>" heading

    Examples:
      | footerHeading |
      | Brzi linkovi |
      | Proizvodi |
      | Kontakt |

  Scenario Outline: Footer quick link "<linkName>" goes to the right page
    Given I open the home page
    Then the footer quick link "<linkName>" goes to "<pageLink>"

        Examples:
      | linkName  | pageLink  |
      | Početna   | /         |
      | O nama    | /about    |
      | Proizvodi | /products |
      | Blog      | /blog     |
      | Kontakt   | /contact  |

      Scenario Outline: Footer shows the static text "<footerText>"
    Given I open the home page
    Then the footer shows the static text "<footerText>"

    Examples:
      | footerText                                    |
      | DIZAJNIRANO DA TRAJE, NAPRAVLJENO DA SE VOLI! |
      | Handcrafted in Serbia                         |
      | Sva prava zadržana.                           |
   