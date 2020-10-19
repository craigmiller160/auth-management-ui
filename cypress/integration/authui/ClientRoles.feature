Feature: Client Roles Page

  Background:
    Given I login to the application
    And I click on the clients link
    Then I am on the clients page

  Scenario: Client roles displayed
    When I click on the client named "Test Client"
    When I click on the "Roles" tab
    Then the roles page is displayed
    | role       |
    | ROLE_READ  |

  Scenario: Add role
    When I click on the client named "Test Client"
    When I click on the "Roles" tab
    Then the roles page is displayed
      | role       |
      | ROLE_READ  |
    When I click on the add role button
    Then the role dialog is visible with "" in the text field
    When I enter "admin" into the text field
    Then the role dialog is visible with "ADMIN" in the text field
    When I click the "save" button in the roles dialog
    Then the roles page is displayed
      | role       |
      | ROLE_ADMIN |
      | ROLE_READ  |


  Scenario: Edit role
    When I click on the client named "Test Client"
    When I click on the "Roles" tab
    Then the roles page is displayed
      | role       |
      | ROLE_READ  |
    When I click on the "edit" button for role 0
    Then the role dialog is visible with "READ" in the text field
    When I enter "admin" into the text field
    Then the role dialog is visible with "ADMIN" in the text field
    When I click the "save" button in the roles dialog
    Then the roles page is displayed
      | role       |
      | ROLE_ADMIN |

  Scenario: Delete role
    When I click on the client named "Test Client"
    When I click on the "Roles" tab
    Then the roles page is displayed
      | role       |
      | ROLE_READ  |
    When I click on the "delete" button for role 0
    Then the role delete dialog is visible
    When I click the "confirm" button in the role delete dialog
    Then the roles page is displayed
      | role       |

  Scenario: Validate dialog cancel buttons
    When I click on the client named "Test Client"
    When I click on the "Roles" tab
    Then the roles page is displayed
      | role       |
      | ROLE_READ  |
    When I click on the "delete" button for role 0
    Then the role delete dialog is visible
    When I click the "cancel" button in the role delete dialog
    Then the roles page is displayed
      | role       |
      | ROLE_READ  |
    When I click on the add role button
    Then the role dialog is visible with "" in the text field
    When I click the "cancel" button in the roles dialog
    Then the roles page is displayed
      | role       |
      | ROLE_READ  |
