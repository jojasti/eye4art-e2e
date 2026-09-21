Feature: Product catalog

  Scenario: Turntable shelves category shows products
    Given I open the home page
    When I open "Proizvodi" from the main menu
    And I open the "Police i stalci za gramofon" category
    Then I see the category heading "Police i stalci za gramofon"
    And I see at least one product