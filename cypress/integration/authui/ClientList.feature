Feature: Client List Page

  Background:
    Given I login to the application
    And I click on the clients link
    Then I am on the clients page

  Scenario: Validate Client list page
    And the client list ui is displayed