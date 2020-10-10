Feature: Clients Management Pages

  Background:
    Given I login to the application
    And I click on the clients link
    Then I am on the clients page

  Scenario: Creating a new client
    When I click the new client button
    Then I am on the client details page
    And the client config tab is selected with "new" client information
    When I click the save button
    Then the "new" client is saved successfully
    And I click on the clients link
    Then I am on the clients page
    And the created client is in the list
