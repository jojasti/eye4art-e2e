Feature: Footer

  Scenario: Footer contact links are correct
    Given I open the home page
    Then the footer contact links are correct

  Scenario Outline: Footer has a link to the "<productCategory>" category page
    Given I open the home page
    Then the footer has a link to the "<productCategory>" category page

    Examples:
      | productCategory   |
      | turntable-shelves |
      | audio-equipment   |
      | retro-lamps       |
      | side-tables       |
      | nightstands       |

  Scenario: Floating WhatsApp button has the correct link
    Given I open the home page
    Then the WhatsApp button link is correct
