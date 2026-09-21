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
