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
    # TODO test for redirect URIs separately
    When I click the save button
    Then the client "new" is saved successfully
    And the client config tab is selected with these values for "existing" client
      | name       | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | New Client | 300           | 3600           | 60          | true    | true                    | true              |           |
    # TODO test for redirect URIs separately
    And I click on the clients link
    Then I am on the clients page
    And the list contains a client with the name "New Client"

  Scenario: Editing existing client config
    When I click on the client named "Edit Client"
    Then I am on the client details page for a "existing" client
    And the client config tab is selected with these values for "new" client
      | name        | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | Edit Client | 10            | 20            | 30           | false   | true                    | false             | ABCDEFG   |
    # TODO test for redirect URIs separately
    Then I generate a new client "key"
    Then I generate a new client "secret"
    Then I set the following client config values
      | name          | accessTimeout | refreshTimeout | codeTimeout | enabled |
      | Edit Client 2 | 40            | 50             | 60          | true    |
    # TODO add, edit, and remove redirect URIs
    When I click the save button
    Then the client "###" is saved successfully
    And the client config tab is selected with these values for "existing" client
      | name       | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | New Client | 300           | 3600           | 60          | true    | true                    | true              |           |
    # TODO test for redirect URIs separately

  Scenario: Cannot navigate away with unsaved config value changes
    When I click the new client button
    Then I am on the client details page for a "new" client
    Then I set the following client config values
      | name          | accessTimeout | refreshTimeout | codeTimeout | enabled |
      | Edit Client 2 | 40            | 50             | 60          | true    |
    And I click on the clients link
    Then I am on the client details page for a "new" client

  Scenario: Cannot navigate away with unsaved redirect URIs
    # TODO finish this

  Scenario: Deleting a client
    When I click on the client named "Edit Client"
    Then I am on the client details page for a "existing" client
    And the client config tab is selected with these values for "new" client
      | name        | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | Edit Client | 10            | 20            | 30           | false   | true                    | false             | ABCDEFG   |
    # TODO test for redirect URIs separately
    When I click the delete button, and confirm the prompt
    Then I am on the clients page
    # TODO alert for successful delete
    And the client "Edit Client" is not in the list

  Scenario: Add/Edit/Delete client roles
    # TODO finish this

  Scenario: Add/remove user grants & roles
    # TODO finish this

  Scenario: Navigate to user page from client grant
    # TODO finish this

  Scenario: View/remove user authentications
    # TODO finish this

