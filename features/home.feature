Feature: Home page

  Scenario: Home page opens
    Given I open the home page
    Then the page title contains "Eye4Art Studio"

  Scenario: "Istraži proizvode" hero link goes to the products page
    Given I open the home page
    When I open the explore products link
    Then I am taken to the products page

  Scenario: "Pogledaj sve modele" link goes to the turntable-shelves category page
    Given I open the home page
    When I open the view all turntable models link
    Then I am taken to the turntable-shelves category page

  Scenario Outline: "<categoryName>" product grid link goes to the right category page
    Given I open the home page
    When I open the "<categoryName>" category from the products grid
    Then I land on the "<productCategory>" category page

    Examples:
      | categoryName                 | productCategory    |
      | Police i stalci za gramofon  | turntable-shelves  |
      | Audio oprema                 | audio-equipment    |
      | Retro lampe i lusteri        | retro-lamps        |
      | Pomoćni stočići              | side-tables        |
      | Noćni stočići                | nightstands        |

  Scenario: Google reviews section shows a rating and reviews with text and author
    Given I open the home page
    Then the reviews rating is shown
    And reviews have text and author