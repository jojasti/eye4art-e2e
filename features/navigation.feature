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

  Scenario Outline: "<menuItem>" page shows the "<englishHeading>" heading after switching to English
    Given I open the home page
    When I switch the language to English
    And I open "<menuItem>" from the main menu
    Then the level <headingLevel> heading "<englishHeading>" is shown

    Examples:
      | menuItem | headingLevel | englishHeading                      |
      | Home     | 2            | OUR COLLECTION                      |
      | Home     | 3            | Vinyl Storage Stations              |
      | About Us | 1            | DESIGNED TO LAST, MADE TO BE LOVED! |
      | About Us | 2            | WHAT WE STAND FOR                   |
      | Products | 1            | OUR COLLECTION                      |
      | Products | 2            | Artisan Nightstands                 |
      | Contact  | 1            | CONTACT US                          |
      | Contact  | 2            | CONTACT INFORMATION                 |
