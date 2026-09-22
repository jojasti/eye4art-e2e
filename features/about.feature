Feature: About page

  Scenario: About page shows its main heading and core values
    Given I open the about page
    Then the main heading is shown
    And the value headings are shown
