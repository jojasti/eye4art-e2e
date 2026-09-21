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