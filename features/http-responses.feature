@api
Feature: HTTP responses

  Scenario: Robots file points crawlers to the sitemap
    When I request the page "/robots.txt"
    Then the response status is 200
    And the response text contains "Sitemap: https://www.eye4artstudio.com/sitemap.xml"

  Scenario: Sitemap is served as XML
    When I request the page "/sitemap.xml"
    Then the response status is 200
    And the response header "content-type" contains "xml"
    And the response text contains "<urlset"

  @fixme
  Scenario: Unknown page returns not found status
    When I request the page "/this-page-does-not-exist"
    Then the response status is 404