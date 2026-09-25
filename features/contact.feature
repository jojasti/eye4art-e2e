Feature: Contact

  Scenario: Verify that page can be opened
    Given I open a contact page
    Then Contact page is opened

  @critical
  Scenario: Contact form fields and send button are visible
    Given I open a contact page
    Then Contact form is shown

  @critical
  Scenario: Contact info links have the right href
    Given I open a contact page
    Then Contact info is shown
    And Contact links have the right href

  Scenario: Link to all Google reviews is shown
    Given I open a contact page
    Then All reviews link is shown
