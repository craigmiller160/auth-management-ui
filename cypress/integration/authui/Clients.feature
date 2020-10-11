Feature: Clients Management Pages

  Background:
    Given I login to the application
    And I click on the clients link
    Then I am on the clients page

  Scenario: Creating a new client
    When I click the new client button
    Then I am on the client details page for a "new" client
    And the client config tab is selected with these values for "new" client
      | name       | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | New Client | 300           | 3600           | 60          | true    | false                   | false             |           |
    When I click the save button
    Then the client "new" is saved successfully
    And the client config tab is selected with these values for "existing" client
      | name       | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | New Client | 300           | 3600           | 60          | true    | true                    | true              |           |
    And I click on the clients link
    Then I am on the clients page
    And the list contains a client with the name "New Client"

  Scenario: Editing existing client config
    When I click on the client named "Edit Client"
    Then I am on the client details page for a "existing" client
    And the client config tab is selected with these values for "new" client
      | name        | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | Edit Client | 10            | 20            | 30           | false   | true                    | false             | ABCDEFG   |
    Then I generate a new client "key"
    Then I generate a new client "secret"