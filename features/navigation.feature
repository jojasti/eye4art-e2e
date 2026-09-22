Feature: Main navigation

  Scenario Outline: Main menu opens the "<item>" page
    Given I open the home page
    When I open "<item>" from the main menu
    Then I am on the "<path>" page

    Examples:
      | item      | path      |
      | Početna   | /         |
      | O nama    | /about    |
      | Proizvodi | /products |
      | Blog      | /blog     |
      | Kontakt   | /contact  |

  Scenario: Switching to English changes the menu labels
    Given I open the home page
    When I switch the language to English
    Then the menu labels are in English

  Scenario: Switching back to Srpski restores the original labels
    Given I open the home page
    When I switch the language to English
    And I switch the language to Srpski
    Then the menu labels are in Serbian