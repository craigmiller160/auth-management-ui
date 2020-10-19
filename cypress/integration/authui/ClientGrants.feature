Feature: Client List Page

  Background:
    Given I login to the application
    And I click on the clients link
    Then I am on the clients page

  Scenario: Client grants displayed
    When I click on the client named "Test Client"
    When I click on the "Grants" tab
    Then the client grants page is displayed
      | users     | roles | selectedUser |
      | Test User |       |              |
    When I select user 0
    Then the client grants page is displayed
      | users     | roles     | selectedUser |
      | Test User | ROLE_READ | Test User    |

  Scenario: Add user to client
    When I click on the client named "Test Client"
    When I click on the "Grants" tab
    Then the client grants page is displayed
      | users     | roles | selectedUser |
      | Test User |       |              |
    When I click the Add User button
    Then the user dialog is visible
    And I select "test2@gmail.com" in the user dialog
    When I click on the "select" button in the user dialog
    Then the client grants page is displayed
      | users      | roles | selectedUser |
      | Test2 User |       |              |

  Scenario: Remove user from client
    When I click on the client named "Test Client"
    When I click on the "Grants" tab
    Then the client grants page is displayed
      | users     | roles | selectedUser |
      | Test User |       |              |
    When I click on the "remove" button of user 0
    Then the remove user dialog is visible
    When I click on the "confirm" button of the remove user dialog
    Then the client grants page is displayed
      | users     | roles | selectedUser |
      |           |       |              |


  Scenario: Add role to user within client
    When I click on the client named "Test Client"
    When I click on the "Grants" tab
    Then the client grants page is displayed
      | users     | roles | selectedUser |
      | Test User |       |              |
    When I select user 0
    Then the client grants page is displayed
      | users     | roles     | selectedUser |
      | Test User | ROLE_READ | Test User    |
    When I click on the add role button
    Then the role dialog is visible
    And I select "ROLE_WRITE" in the role dialog
    When I click on the "select" button in the role dialog
    Then the client grants page is displayed
      | users     | roles      | selectedUser |
      | Test User | ROLE_READ  | Test User    |
      |           | ROLE_WRITE |              |

  Scenario: Remove role from user within client
    When I click on the client named "Test Client"
    When I click on the "Grants" tab
    Then the client grants page is displayed
      | users     | roles | selectedUser |
      | Test User |       |              |
    When I select user 0
    Then the client grants page is displayed
      | users     | roles     | selectedUser |
      | Test User | ROLE_READ | Test User    |
    When I click on the "remove" button for role 0
    Then the remove role dialog is visible
    When I click on the "confirm" button of the remove role dialog
    Then the client grants page is displayed
      | users     | roles     | selectedUser |
      | Test User |           | Test User    |


  Scenario: Navigate to user page from client grant
    When I click on the client named "Test Client"
    When I click on the "Grants" tab
    Then the client grants page is displayed
      | users     | roles | selectedUser |
      | Test User |       |              |
    When I click on the "go" button of user 0
    Then I am on the user config page for "test@gmail.com"

  Scenario: Validate dialog cancel buttons
    When I click on the client named "Test Client"
    When I click on the "Grants" tab
    Then the client grants page is displayed
      | users     | roles | selectedUser |
      | Test User |       |              |
    When I select user 0
    Then the client grants page is displayed
      | users     | roles     | selectedUser |
      | Test User | ROLE_READ | Test User    |
    When I click on the "remove" button for role 0
    Then the remove role dialog is visible
    When I click on the "cancel" button of the remove role dialog
    Then the client grants page is displayed
      | users     | roles     | selectedUser |
      | Test User | ROLE_READ | Test User    |
    When I click on the "remove" button of user 0
    Then the remove user dialog is visible
    When I click on the "cancel" button of the remove user dialog
    Then the client grants page is displayed
      | users     | roles     | selectedUser |
      | Test User | ROLE_READ | Test User    |
    When I click the Add User button
    Then the user dialog is visible
    When I click on the "cancel" button in the user dialog
    Then the client grants page is displayed
      | users     | roles     | selectedUser |
      | Test User | ROLE_READ | Test User    |
    When I click on the add role button
    Then the role dialog is visible
    When I click on the "cancel" button in the role dialog
    Then the client grants page is displayed
      | users     | roles     | selectedUser |
      | Test User | ROLE_READ | Test User    |

    # TODO need a scenario that tests for disabling the add role and add user buttons when all are added