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

  Scenario Outline: Opening "<categoryName>" from the products index navigates to the right category page
    Given I open the products page
    When I open the "<categoryName>" category
    Then I am on the "<productCategory>" category page

    Examples:
      | categoryName                 | productCategory    |
      | Police i stalci za gramofon  | turntable-shelves  |
      | Audio oprema                 | audio-equipment    |
      | Retro lampe i lusteri        | retro-lamps        |
      | Pomoćni stočići              | side-tables        |
      | Noćni stočići                | nightstands        |