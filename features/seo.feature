Feature: SEO metadata

  Scenario Outline: "<page>" has a title
    Given I open the "<page>" page
    Then the page has a title

    Examples:
      | page                                        |
      | /                                            |
      | /about                                       |
      | /products                                    |
      | /products/turntable-shelves                  |
      | /products/audio-equipment                    |
      | /products/retro-lamps                        |
      | /products/side-tables                        |
      | /products/nightstands                        |
      | /blog                                        |
      | /blog/kako-odabrati-policu-za-gramofon       |
      | /contact                                     |

  Scenario Outline: "<page>" has a canonical link pointing to the www domain
    Given I open the "<page>" page
    Then the canonical link is correct

    Examples:
      | page                                        |
      | /                                            |
      | /about                                       |
      | /products                                    |
      | /products/turntable-shelves                  |
      | /products/audio-equipment                    |
      | /products/retro-lamps                        |
      | /products/side-tables                        |
      | /products/nightstands                        |
      | /blog                                        |
      | /blog/kako-odabrati-policu-za-gramofon       |
      | /contact                                     |

  Scenario Outline: "<page>" has one meta description
    Given I open the "<page>" page
    Then the meta description is correct

    Examples:
      | page                                        |
      | /                                            |
      | /about                                       |
      | /products                                    |
      | /products/turntable-shelves                  |
      | /products/audio-equipment                    |
      | /products/retro-lamps                        |
      | /products/side-tables                        |
      | /products/nightstands                        |
      | /blog                                        |
      | /blog/kako-odabrati-policu-za-gramofon       |
      | /contact                                     |
