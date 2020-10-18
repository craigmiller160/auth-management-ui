Feature: Client Config Page

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
    And the client config page contains these redirect uris
      | uri |
    When I click the save button
    Then a "success" alert appears with a message containing "Successfully saved client"
    And the client config tab is selected with these values for "existing" client
      | name       | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | New Client | 300           | 3600           | 60          | true    | true                    | true              |           |
    And the client config page contains these redirect uris
      | uri |
    And I click on the clients link
    Then I am on the clients page
    And the list "does" contain a client with the name "New Client"

  Scenario: Editing existing client config
    When I click on the client named "Test Client"
    Then I am on the client details page for a "existing" client
    And the client config tab is selected with these values for "existing" client
      | name        | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | Test Client | 10            | 20            | 30           | false   | true                    | false             | ABCDEFG   |
    And the client config page contains these redirect uris
      | uri                            |
      | https://localhost:123/authcode |
    Then I generate a new client "clientKey"
    Then I generate a new client "clientSecret"
    Then I set the following client config values
      | name          | accessTimeout | refreshTimeout | codeTimeout | enabled |
      | Test Client 2 | 40            | 50             | 60          | true    |
    When I click the save button
    Then a "success" alert appears with a message containing "Successfully saved client"
    And the client config tab is selected with these values for "existing" client
      | name          | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | Test Client 2 | 40            | 50             | 60          | true    | true                    | true              |           |
    And the client config page contains these redirect uris
      | uri                            |
      | https://localhost:123/authcode |

  Scenario: Deleting a client
    When I click on the client named "Test Client"
    Then I am on the client details page for a "existing" client
    And the client config tab is selected with these values for "existing" client
      | name        | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | Test Client | 10            | 20            | 30           | false   | true                    | false             | ABCDEFG   |
    And the client config page contains these redirect uris
      | uri                            |
      | https://localhost:123/authcode |
    When I click the delete button, and confirm the prompt
    Then I am on the clients page
    Then a "success" alert appears with a message containing "Successfully deleted client"
    And the list "does not" contain a client with the name "Test Client"

  Scenario: Redirect uri dialog cancel button
    When I click on the client named "Test Client"
    Then I am on the client details page for a "existing" client
    When I click on the Add Redirect URI button
    Then the redirect uri dialog appears with "" in its text field
    And I click the "cancel" button for the redirect uri dialog
    Then the redirect uri dialog disappears

  Scenario: Adding a redirect URI
    When I click on the client named "Test Client"
    Then I am on the client details page for a "existing" client
    And the client config tab is selected with these values for "existing" client
      | name        | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | Test Client | 10            | 20            | 30           | false   | true                    | false             | ABCDEFG   |
    And the client config page contains these redirect uris
      | uri                            |
      | https://localhost:123/authcode |
    When I click on the Add Redirect URI button
    Then the redirect uri dialog appears with "" in its text field
    When I type the uri "https://localhost:456/authcode" into the redirect uri dialog
    And I click the "save" button for the redirect uri dialog
    Then I am on the client details page for a "existing" client
    And the client config page contains these redirect uris
      | uri                            |
      | https://localhost:123/authcode |
      | https://localhost:456/authcode |
    When I click the save button
    Then a "success" alert appears with a message containing "Successfully saved client"
    And I click on the clients link
    Then I am on the clients page
    When I click on the client named "Test Client"
    Then I am on the client details page for a "existing" client
    And the client config tab is selected with these values for "existing" client
      | name        | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | Test Client | 10            | 20            | 30           | false   | true                    | false             | ABCDEFG   |
    And the client config page contains these redirect uris
      | uri                            |
      | https://localhost:123/authcode |
      | https://localhost:456/authcode |


  Scenario: Editing a redirect URI
    When I click on the client named "Test Client"
    Then I am on the client details page for a "existing" client
    And the client config tab is selected with these values for "existing" client
      | name        | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | Test Client | 10            | 20            | 30           | false   | true                    | false             | ABCDEFG   |
    And the client config page contains these redirect uris
      | uri                            |
      | https://localhost:123/authcode |
    When I click on the "edit" button for URI 0
    Then the redirect uri dialog appears with "https://localhost:123/authcode" in its text field
    When I type the uri "https://localhost:456/authcode" into the redirect uri dialog
    And I click the "save" button for the redirect uri dialog
    Then I am on the client details page for a "existing" client
    And the client config page contains these redirect uris
      | uri                            |
      | https://localhost:456/authcode |
    When I click the save button
    Then a "success" alert appears with a message containing "Successfully saved client"
    And I click on the clients link
    Then I am on the clients page
    When I click on the client named "Test Client"
    Then I am on the client details page for a "existing" client
    And the client config tab is selected with these values for "existing" client
      | name        | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | Test Client | 10            | 20            | 30           | false   | true                    | false             | ABCDEFG   |
    And the client config page contains these redirect uris
      | uri                            |
      | https://localhost:456/authcode |

  Scenario: Removing a redirect URI
    When I click on the client named "Test Client"
    Then I am on the client details page for a "existing" client
    And the client config tab is selected with these values for "existing" client
      | name        | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | Test Client | 10            | 20            | 30           | false   | true                    | false             | ABCDEFG   |
    And the client config page contains these redirect uris
      | uri                            |
      | https://localhost:123/authcode |
    When I click on the "remove" button for URI 0
    Then I am on the client details page for a "existing" client
    And the client config page contains these redirect uris
      | uri |
    When I click the save button
    Then a "success" alert appears with a message containing "Successfully saved client"
    And I click on the clients link
    Then I am on the clients page
    When I click on the client named "Test Client"
    Then I am on the client details page for a "existing" client
    And the client config tab is selected with these values for "existing" client
      | name        | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
      | Test Client | 10            | 20            | 30           | false   | true                    | false             | ABCDEFG   |
    And the client config page contains these redirect uris
      | uri                            |


#  Scenario: Cannot navigate away with unsaved config value changes
#    When I click the new client button
#    Then I am on the client details page for a "new" client
#    And the client config tab is selected with these values for "new" client
#      | name       | accessTimeout | refreshTimeout | codeTimeout | enabled | clientSecretPlaceholder | useSavedClientKey | clientKey |
#      | New Client | 300           | 3600           | 60          | true    | false                   | false             |           |
#    And I click on the clients link
#    Then I am on the client details page for a "new" client
#
#  Scenario: Cannot navigate away with unsaved redirect URIs
#    # TODO finish this