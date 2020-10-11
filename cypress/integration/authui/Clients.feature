Feature: Clients Management Pages

  Background:
    Given I login to the application
    And I click on the clients link
    Then I am on the clients page

  Scenario: Creating a new client
    When I click the new client button
    Then I am on the client details page for a "new" client
    And the client config tab is selected with these values for "new" client
      | name       | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder |
      | New Client | 300           | 3600           | 60          | true    | false                   |
    When I click the save button
    Then the client "new" is saved successfully
    And the client config tab is selected with these values for "existing" client
      | name       | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder |
      | New Client | 300           | 3600           | 60          | true    | true                    |
    And I click on the clients link
    Then I am on the clients page
    And the list contains a client with the name "New Client"
