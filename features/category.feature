Feature: Category page

  Scenario: Turntable shelves category shows products
    Given I open the "turntable-shelves" category page
    Then I see the category heading "Police i stalci za gramofon"
    And I see the products