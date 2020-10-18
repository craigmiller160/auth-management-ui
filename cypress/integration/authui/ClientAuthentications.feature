Feature: Client List Page

  Background:
    Given I login to the application
    And I click on the clients link
    Then I am on the clients page

  Scenario: Client authentications displayed
    When I click on the client named "Test Client"
    When I click on the "Authentications" tab
    Then the authentications page is displayed
    | userEmail      |
    | test@gmail.com |

  Scenario: Remove Client Authentication
    When I click on the client named "Test Client"
    When I click on the "Authentications" tab
    Then the authentications page is displayed
      | userEmail      |
      | test@gmail.com |
    When I click the revoke button for authentication 0
    Then the authentications page is displayed
      | userEmail      |