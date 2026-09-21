Feature: Products page

  Scenario Outline: Products page shows the "<category>" category
    Given I open the products page
    Then I see the category "<category>"

    Examples:
      | category                    |
      | Police i stalci za gramofon |
      | Audio oprema                |
      | Retro lampe i lusteri       |
      | Pomoćni stočići             |
      | Noćni stočići               |