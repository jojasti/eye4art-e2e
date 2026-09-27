Feature: Turntable shelf quiz

  Background:
    Given I open the turntable shelves page

  Scenario: Quiz opens on the first question
    When I open the quiz
    Then I see "Pitanje 1 od 5" asking "Šta sve imaš?"

  Scenario: Quiz closes
    When I open the quiz
    And I close the quiz
    Then the quiz is closed

  Scenario: Quiz asks five questions in order with their answers
    When I open the quiz
    Then I see "Pitanje 1 od 5" asking "Šta sve imaš?"
    And the quiz answers are:
      | Samo gramofon i ploče        |
      | Gramofon + receiver/pojačalo |
      | Kompletan Hi-Fi sistem       |
    When I answer "Samo gramofon i ploče"
    Then I see "Pitanje 2 od 5" asking "Gde bi stajala?"
    And the quiz answers are:
      | Nemam ništa, kupujem od nule                       |
      | Imam komodu ili policu, treba mi mesto za gramofon |
      | Nisam siguran, otvoren sam za predlog              |
    When I answer "Nemam ništa, kupujem od nule"
    Then I see "Pitanje 3 od 5" asking "Koji je tvoj budžet?"
    And the quiz answers are:
      | Do 160€         |
      | Do 200€         |
      | Bez ograničenja |
    When I answer "Do 160€"
    Then I see "Pitanje 4 od 5" asking "Koliko ploča imaš u kolekciji?"
    And the quiz answers are:
      | Do 50 ploča       |
      | 50 do 150 ploča   |
      | Više od 150 ploča |
    When I answer "Do 50 ploča"
    Then I see "Pitanje 5 od 5" asking "Koliko prostora imaš za policu?"
    And the quiz answers are:
      | Do 60cm širine      |
      | 60 do 80cm širine   |
      | Više od 80cm širine |

  Scenario: "Nazad" returns to the previous question
    When I open the quiz
    And I answer "Kompletan Hi-Fi sistem"
    And I go back one question
    Then I see "Pitanje 1 od 5" asking "Šta sve imaš?"

  @critical
  Scenario Outline: "<equipment>" with "<budget>" and "<availableSpace>" gets "<recommendedModel>"
    When I open the quiz
    And I answer "<equipment>"
    And I answer "<placement>"
    And I answer "<budget>"
    And I answer "<collectionSize>"
    And I answer "<availableSpace>"
    Then the quiz recommends "<recommendedModel>" for "<price>"

    Examples:
      | equipment                    | placement                                          | budget          | collectionSize    | availableSpace      | recommendedModel | price |
      | Samo gramofon i ploče        | Nemam ništa, kupujem od nule                       | Do 160€         | Do 50 ploča       | Više od 80cm širine | Spin & Store     | 155€  |
      | Samo gramofon i ploče        | Nemam ništa, kupujem od nule                       | Bez ograničenja | 50 do 150 ploča   | 60 do 80cm širine   | Vertical Vibe    | 190€  |
      | Samo gramofon i ploče        | Imam komodu ili policu, treba mi mesto za gramofon | Do 160€         | Do 50 ploča       | Do 60cm širine      | Turntable Stand  | 85€   |
      | Gramofon + receiver/pojačalo | Nisam siguran, otvoren sam za predlog              | Do 160€         | Više od 150 ploča | Više od 80cm širine | Spin & Store     | 155€  |
      | Gramofon + receiver/pojačalo | Nemam ništa, kupujem od nule                       | Do 200€         | 50 do 150 ploča   | Do 60cm širine      | Vertical Vibe    | 190€  |
      | Kompletan Hi-Fi sistem       | Nemam ništa, kupujem od nule                       | Bez ograničenja | Više od 150 ploča | Do 60cm širine      | Industrial Deck  | 230€  |

  # Width is a hard constraint, budget only a preference. With "Do 160€" the 90 cm wide
  # Spin & Store is the only shelf inside the budget, so it is the model most likely to be
  # recommended for a space it does not fit. The width is read from the model's own card.
  @critical
  Scenario Outline: "<equipment>" in "<availableSpace>" never gets a model wider than <maxWidthCm> cm
    When I open the quiz
    And I answer "<equipment>"
    And I answer "Nemam ništa, kupujem od nule"
    And I answer "Do 160€"
    And I answer "Više od 150 ploča"
    And I answer "<availableSpace>"
    Then the recommended model is at most <maxWidthCm> cm wide

    Examples:
      | equipment                    | availableSpace    | maxWidthCm |
      | Samo gramofon i ploče        | Do 60cm širine    | 60         |
      | Samo gramofon i ploče        | 60 do 80cm širine | 80         |
      | Gramofon + receiver/pojačalo | Do 60cm širine    | 60         |
      | Gramofon + receiver/pojačalo | 60 do 80cm širine | 80         |
      | Kompletan Hi-Fi sistem       | Do 60cm širine    | 60         |
      | Kompletan Hi-Fi sistem       | 60 do 80cm širine | 80         |

  Scenario: Recommendation over the chosen budget says so
    When I open the quiz
    And I answer "Samo gramofon i ploče"
    And I answer "Nemam ništa, kupujem od nule"
    And I answer "Do 160€"
    And I answer "Do 50 ploča"
    And I answer "Do 60cm širine"
    Then the quiz recommends "Vertical Vibe" for "190€"
    And the over-budget note is shown

  Scenario: Recommendation within the chosen budget has no over-budget note
    When I open the quiz
    And I answer "Samo gramofon i ploče"
    And I answer "Nemam ništa, kupujem od nule"
    And I answer "Bez ograničenja"
    And I answer "Do 50 ploča"
    And I answer "Do 60cm širine"
    Then the quiz recommends "Vertical Vibe" for "190€"
    And the over-budget note is not shown

  Scenario: "Ponovi quiz" starts the quiz again
    When I open the quiz
    And I answer "Kompletan Hi-Fi sistem"
    And I answer "Nemam ništa, kupujem od nule"
    And I answer "Bez ograničenja"
    And I answer "Više od 150 ploča"
    And I answer "Do 60cm širine"
    And I retake the quiz
    Then I see "Pitanje 1 od 5" asking "Šta sve imaš?"

  # Turntable Stand is used because its card is below the first row of products, which is
  # already in view when the quiz opens on desktop, so the scroll is actually tested.
  Scenario: "Pogledaj model" closes the quiz and shows the recommended model
    When I open the quiz
    And I answer "Samo gramofon i ploče"
    And I answer "Imam komodu ili policu, treba mi mesto za gramofon"
    And I answer "Do 160€"
    And I answer "Do 50 ploča"
    And I answer "Do 60cm širine"
    And I view the recommended model
    Then the quiz is closed
    And the recommended model's card is in view
