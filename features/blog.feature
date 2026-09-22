Feature: Blog

  Scenario: Blog index lists posts
    Given I open the blog page
    Then posts are listed

  Scenario: Opening a post shows the full article
    Given I open the blog page
    When I open the first post
    Then the post heading matches the selected post
    And the back to blog link is shown
