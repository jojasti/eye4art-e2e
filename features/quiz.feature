Feature: Model quiz

  The quiz is offered only on the turntable shelves category page. It asks six questions
  about the buyer and then recommends one shelf from that page.

  Scenario: The quiz asks its six questions with their answers
    Given I open the quiz on the turntable shelves page
    Then question 1 of 6 asks "Šta sve imaš?"
    And the answers are "Samo gramofon i ploče", "Gramofon + receiver/pojačalo" and "Kompletan Hi-Fi sistem"
    When I answer "Samo gramofon i ploče"
    Then question 2 of 6 asks "Gde ti sad stoji gramofon?"
    And the answers are "Na komodi ili polici koju već imam", "Sve stoji jedno na drugom" and "Još ga nemam, tek kupujem"
    When I answer "Sve stoji jedno na drugom"
    Then question 3 of 6 asks "Koliko ploča imaš?"
    And the answers are "Do pedesetak", "Stane u jednu gajbu, oko sto" and "Ne stižem da ih sredim"
    When I answer "Do pedesetak"
    Then question 4 of 6 asks "Koliko mesta imaš, odoka?"
    And the answers are "Uska rupa između nameštaja", "Normalan zid, ima prostora" and "Šta god stane, nije problem"
    When I answer "Normalan zid, ima prostora"
    Then question 5 of 6 asks "Kako držiš ploče?"
    And the answers are "Vadim ih stalno, hoću da su pri ruci", "Retko ih diram, više stoje" and "Ima dece ili mačaka pa volim da su sklonjene"
    When I answer "Vadim ih stalno, hoću da su pri ruci"
    Then question 6 of 6 asks "Koliko ti je bitno kako izgleda?"
    And the answers are "Hoću da se primeti, da bude komad", "Neka se uklopi, ja biram dezen" and "Svejedno, bitno je da radi posao"

  Scenario: The first question offers no way back
    Given I open the quiz on the turntable shelves page
    Then question 1 of 6 asks "Šta sve imaš?"
    And there is no back button

  Scenario: The back button returns to the previous question
    Given I open the quiz on the turntable shelves page
    When I answer "Samo gramofon i ploče"
    And I answer "Sve stoji jedno na drugom"
    And I go back to the previous question
    Then question 2 of 6 asks "Gde ti sad stoji gramofon?"

  Scenario: Closing the quiz and opening it again starts from the first question
    Given I open the quiz on the turntable shelves page
    When I answer "Samo gramofon i ploče"
    And I close the quiz
    Then the quiz is closed
    When I open the quiz again
    Then question 1 of 6 asks "Šta sve imaš?"
    And there is no back button

  Scenario: "Ponovi quiz" starts the quiz over
    Given I open the quiz on the turntable shelves page
    When I answer "Samo gramofon i ploče"
    And I answer "Sve stoji jedno na drugom"
    And I answer "Do pedesetak"
    And I answer "Uska rupa između nameštaja"
    And I answer "Vadim ih stalno, hoću da su pri ruci"
    And I answer "Hoću da se primeti, da bude komad"
    And I retake the quiz
    Then question 1 of 6 asks "Šta sve imaš?"
    And there is no back button

  @critical
  Scenario Outline: The quiz recommends "<recommendedModel>"
    Given I open the quiz on the turntable shelves page
    When I answer "<equipment>"
    And I answer "<placement>"
    And I answer "<collection>"
    And I answer "<space>"
    And I answer "<handling>"
    And I answer "<looks>"
    Then the recommended model is "<recommendedModel>"
    And the recommendation shows a price

    Examples:
      | equipment                    | placement                         | collection   | space                      | handling                             | looks                             | recommendedModel    |
      | Samo gramofon i ploče        | Na komodi ili polici koju već imam | Do pedesetak | Uska rupa između nameštaja | Vadim ih stalno, hoću da su pri ruci | Hoću da se primeti, da bude komad | Turntable Stand     |
      | Samo gramofon i ploče        | Sve stoji jedno na drugom         | Do pedesetak | Uska rupa između nameštaja | Vadim ih stalno, hoću da su pri ruci | Hoću da se primeti, da bude komad | Groove Cube         |
      | Samo gramofon i ploče        | Sve stoji jedno na drugom         | Do pedesetak | Uska rupa između nameštaja | Vadim ih stalno, hoću da su pri ruci | Neka se uklopi, ja biram dezen    | Vertical Vibe       |
      | Samo gramofon i ploče        | Sve stoji jedno na drugom         | Do pedesetak | Uska rupa između nameštaja | Ima dece ili mačaka pa volim da su sklonjene | Hoću da se primeti, da bude komad | Vertical Vibe Glass |
      | Samo gramofon i ploče        | Sve stoji jedno na drugom         | Do pedesetak | Šta god stane, nije problem | Vadim ih stalno, hoću da su pri ruci | Neka se uklopi, ja biram dezen    | Spin & Store        |
      | Kompletan Hi-Fi sistem       | Na komodi ili polici koju već imam | Do pedesetak | Uska rupa između nameštaja | Vadim ih stalno, hoću da su pri ruci | Neka se uklopi, ja biram dezen    | Industrial Deck     |

  # Width is a hard rule. "Spin & Store" is 90 cm wide; every other shelf on this page is
  # 52-56 cm, so it is the only model that can be too wide for the space the buyer picked.
  # Each row below is an answer path that does end on "Spin & Store" once the space answer
  # is "Šta god stane, nije problem" - see the scenario after this one.
  @critical
  Scenario Outline: "<space>" with "<collection>" is never sent to the 90 cm "Spin & Store"
    Given I open the quiz on the turntable shelves page
    When I answer "Samo gramofon i ploče"
    And I answer "<placement>"
    And I answer "<collection>"
    And I answer "<space>"
    And I answer "<handling>"
    And I answer "<looks>"
    Then the recommended model is not "Spin & Store"

    Examples:
      | placement                 | collection                   | space                      | handling                             | looks                             |
      | Sve stoji jedno na drugom | Do pedesetak                 | Uska rupa između nameštaja | Vadim ih stalno, hoću da su pri ruci | Neka se uklopi, ja biram dezen    |
      | Sve stoji jedno na drugom | Do pedesetak                 | Normalan zid, ima prostora | Vadim ih stalno, hoću da su pri ruci | Neka se uklopi, ja biram dezen    |
      | Još ga nemam, tek kupujem | Stane u jednu gajbu, oko sto | Uska rupa između nameštaja | Retko ih diram, više stoje           | Svejedno, bitno je da radi posao  |
      | Još ga nemam, tek kupujem | Stane u jednu gajbu, oko sto | Normalan zid, ima prostora | Retko ih diram, više stoje           | Svejedno, bitno je da radi posao  |
      | Sve stoji jedno na drugom | Ne stižem da ih sredim       | Uska rupa između nameštaja | Vadim ih stalno, hoću da su pri ruci | Neka se uklopi, ja biram dezen    |
      | Sve stoji jedno na drugom | Ne stižem da ih sredim       | Normalan zid, ima prostora | Vadim ih stalno, hoću da su pri ruci | Neka se uklopi, ja biram dezen    |

  # The same answers, with the space answer opened up, do reach the 90 cm model - so the
  # scenario above cannot pass just because "Spin & Store" is never recommended at all.
  @critical
  Scenario Outline: "Šta god stane, nije problem" with "<collection>" does reach the 90 cm "Spin & Store"
    Given I open the quiz on the turntable shelves page
    When I answer "Samo gramofon i ploče"
    And I answer "<placement>"
    And I answer "<collection>"
    And I answer "Šta god stane, nije problem"
    And I answer "<handling>"
    And I answer "<looks>"
    Then the recommended model is "Spin & Store"

    Examples:
      | placement                 | collection                   | handling                             | looks                            |
      | Sve stoji jedno na drugom | Do pedesetak                 | Vadim ih stalno, hoću da su pri ruci | Neka se uklopi, ja biram dezen   |
      | Još ga nemam, tek kupujem | Stane u jednu gajbu, oko sto | Retko ih diram, više stoje           | Svejedno, bitno je da radi posao |
      | Sve stoji jedno na drugom | Ne stižem da ih sredim       | Vadim ih stalno, hoću da su pri ruci | Neka se uklopi, ja biram dezen   |

  @critical
  Scenario Outline: The recommended "<recommendedModel>" can be ordered from the page
    Given I open the quiz on the turntable shelves page
    When I answer "<equipment>"
    And I answer "<placement>"
    And I answer "Do pedesetak"
    And I answer "<space>"
    And I answer "Vadim ih stalno, hoću da su pri ruci"
    And I answer "<looks>"
    Then the recommended model is "<recommendedModel>"
    When I open the recommended model
    Then the quiz is closed
    And the recommended model card is in view
    And the recommended model can be ordered

    Examples:
      | equipment              | placement                          | space                       | looks                             | recommendedModel |
      | Samo gramofon i ploče  | Na komodi ili polici koju već imam | Uska rupa između nameštaja  | Hoću da se primeti, da bude komad | Turntable Stand  |
      | Samo gramofon i ploče  | Sve stoji jedno na drugom          | Uska rupa između nameštaja  | Hoću da se primeti, da bude komad | Groove Cube      |
      | Samo gramofon i ploče  | Sve stoji jedno na drugom          | Šta god stane, nije problem | Neka se uklopi, ja biram dezen    | Spin & Store     |
      | Kompletan Hi-Fi sistem | Na komodi ili polici koju već imam | Uska rupa između nameštaja  | Neka se uklopi, ja biram dezen    | Industrial Deck  |

  @critical
  Scenario: "PORUČI odmah" offers the real order channels for the recommended model
    Given I open the quiz on the turntable shelves page
    When I answer "Samo gramofon i ploče"
    And I answer "Sve stoji jedno na drugom"
    And I answer "Do pedesetak"
    And I answer "Šta god stane, nije problem"
    And I answer "Vadim ih stalno, hoću da su pri ruci"
    And I answer "Neka se uklopi, ja biram dezen"
    Then the recommended model is "Spin & Store"
    When I open the order options
    Then the order options offer WhatsApp, a phone call and email for the recommended model

  # The quiz no longer asks for a budget, so no recommendation may carry the old
  # "over budget" note any more.
  Scenario: The recommendation carries no over-budget note
    Given I open the quiz on the turntable shelves page
    When I answer "Samo gramofon i ploče"
    And I answer "Sve stoji jedno na drugom"
    And I answer "Do pedesetak"
    And I answer "Uska rupa između nameštaja"
    And I answer "Vadim ih stalno, hoću da su pri ruci"
    And I answer "Hoću da se primeti, da bude komad"
    Then the recommended model is "Groove Cube"
    And there is no over-budget note
