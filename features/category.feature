Feature: Category page

  Scenario Outline: "<categoryName>" category shows products
    Given I open the "<productCategory>" category page
    Then I see the category heading "<categoryName>"
    And I see the products

    Examples:
      | productCategory   | categoryName                |
      | turntable-shelves | Police i stalci za gramofon |
      | audio-equipment   | Audio oprema                |
      | retro-lamps       | Retro lampe i lusteri       |
      | side-tables       | Pomoćni stočići             |
      | nightstands       | Noćni stočići               |

  Scenario Outline: Order button is enabled for "<model>"
    Given I open the "<productCategory>" category page
    When I find the "<model>" product
    Then the order button is enabled

    Examples:
      | productCategory   | model               |
      | turntable-shelves | Spin & Store        |
      | turntable-shelves | Industrial Deck     |
      | turntable-shelves | Vertical Vibe       |
      | turntable-shelves | Groove Cube         |
      | turntable-shelves | Vertical Vibe Glass |
      | turntable-shelves | Turntable Stand     |
      | audio-equipment   | VISOKI STALCI ZA ZVUČNIKE |
      | audio-equipment   | VISOKI STALCI ZA ZVUČNIKE V2 |
      | audio-equipment   | STONI STALAK ZA ZVUČNIK |
      | audio-equipment   | STALAK ZA ZVUČNIK BEZ POSTOLJA |
      | audio-equipment   | STALAK SA METALNOM PLOČOM |
      | audio-equipment   | STALAK ZA ZVUČNIK- CRNI METAL |
      | audio-equipment   | STALAK ZA ZVUČNIK- DRVO/METAL |
      | audio-equipment   | POSTOLJE ZA ZVUČNIK |
      | retro-lamps       | Industrijski luster |
      | retro-lamps       | INDUSTRIJSKA STONA LAMPA |
      | retro-lamps       | RETRO DRVENA LAMPA |
      | retro-lamps       | LAMPA SA ABAŽUROM OD KANAPA |
      | retro-lamps       | INDUSTRIJSKA LAMPA 'Z-LINE' |
      | side-tables       | STOČIĆ - GRIFOVANI METAL |
      | side-tables       | STOČIĆ - DRVENA PODLOGA |
      | side-tables       | STOČIĆ - HRASTOV KOMAD |
      | nightstands       | NOĆNI STOČIĆ MODEL 1 |
      | nightstands       | NOĆNI STOČIĆ MODEL 2 |

  Scenario: Order button is disabled for discontinued "The Master Stack"
    Given I open the "turntable-shelves" category page
    When I find the "The Master Stack" product
    Then the order button shows "NIJE NA STANJU" and is disabled

  Scenario Outline: Every product in "<categoryName>" shows an allowed stock status
    Given I open the "<productCategory>" category page
    Then every product shows an allowed stock status

    Examples:
      | productCategory   | categoryName                |
      | turntable-shelves | Police i stalci za gramofon |
      | audio-equipment   | Audio oprema                |
      | retro-lamps       | Retro lampe i lusteri       |
      | side-tables       | Pomoćni stočići             |
      | nightstands       | Noćni stočići               |

  Scenario: "Nazad na proizvode" returns to the products index
    Given I open the "turntable-shelves" category page
    When I go back to the products index
    Then I am back on the products page

  Scenario: Quiz modal opens from the turntable-shelves category page
    Given I open the "turntable-shelves" category page
    When I open the quiz
    Then the quiz modal is open

  Scenario: Quiz modal closes
    Given I open the "turntable-shelves" category page
    When I open the quiz
    And I close the quiz
    Then the quiz modal is closed

  Scenario Outline: Materials are shown for "<model>"
    Given I open the "<productCategory>" category page
    When I find the "<model>" product
    Then materials are shown

    Examples:
      | productCategory   | model                    |
      | turntable-shelves | Spin & Store             |
      | audio-equipment   | POSTOLJE ZA ZVUČNIK      |
      | retro-lamps       | Industrijski luster      |
      | side-tables       | STOČIĆ - GRIFOVANI METAL |
      | nightstands       | NOĆNI STOČIĆ MODEL 1     |

  # retro-lamps, side-tables and nightstands are made to order and don't list dimensions upfront.
  Scenario Outline: Dimensions are shown for "<model>"
    Given I open the "<productCategory>" category page
    When I find the "<model>" product
    Then dimensions are shown

    Examples:
      | productCategory   | model               |
      | turntable-shelves | Spin & Store        |
      | audio-equipment   | POSTOLJE ZA ZVUČNIK |

  # retro-lamps, side-tables and nightstands are made to order and don't list a price upfront.
  Scenario Outline: Price is shown for "<model>"
    Given I open the "<productCategory>" category page
    When I find the "<model>" product
    Then the price is shown

    Examples:
      | productCategory   | model               |
      | turntable-shelves | Spin & Store        |
      | audio-equipment   | POSTOLJE ZA ZVUČNIK |
