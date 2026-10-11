@api
Feature: HTTP responses

  Scenario: Robots file points crawlers to the sitemap
    When I request the page "/robots.txt"
    Then the response status is 200
    And the response text contains "Sitemap: https://www.eye4artstudio.com/sitemap.xml"