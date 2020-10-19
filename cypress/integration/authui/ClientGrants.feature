Feature: Client List Page

  Background:
    Given I login to the application
    And I click on the clients link
    Then I am on the clients page

  Scenario: Client grants displayed
    When I click on the client named "Test Client"
    When I click on the "Grants" tab
    Then the client grants page is displayed "without" a user selected
      | users     | roles | selectedUser |
      | Test User |       |              |
    When I select user 0
    Then the client grants page is displayed "with" a user selected
      | users     | roles     | selectedUser |
      | Test User | ROLE_READ | Test User    |

  Scenario: Add user to client
    # TODO finish this

  Scenario: Remove user from client
    When I click on the client named "Test Client"
    When I click on the "Grants" tab
    Then the client grants page is displayed "without" a user selected
      | users     | roles | selectedUser |
      | Test User |       |              |
    When I click on the "remove" button of user 0
    Then the remove user dialog is visible
    When I click on the "confirm" button of the remove user dialog
    Then the client grants page is displayed "without" a user selected
      | users     | roles | selectedUser |
      |           |       |              |


  Scenario: Add role to user within client
    # TODO finish this

  Scenario: Remove role from user within client
    When I click on the client named "Test Client"
    When I click on the "Grants" tab
    Then the client grants page is displayed "without" a user selected
      | users     | roles | selectedUser |
      | Test User |       |              |
    When I select user 0
    Then the client grants page is displayed "with" a user selected
      | users     | roles     | selectedUser |
      | Test User | ROLE_READ | Test User    |
    When I click on the "remove" button for role 0
    Then the remove role dialog is visible
    When I click on the "confirm" button of the remove role dialog
    Then the client grants page is displayed "with" a user selected
      | users     | roles     | selectedUser |
      | Test User |           | Test User    |


  Scenario: Navigate to user page from client grant
    When I click on the client named "Test Client"
    When I click on the "Grants" tab
    Then the client grants page is displayed "without" a user selected
      | users     | roles | selectedUser |
      | Test User |       |              |
    When I click on the "go" button of user 0
    Then I am on the user config page for "test@gmail.com"

  Scenario: Validate dialog cancel buttons
    When I click on the client named "Test Client"
    When I click on the "Grants" tab
    Then the client grants page is displayed "without" a user selected
      | users     | roles | selectedUser |
      | Test User |       |              |
    When I select user 0
    Then the client grants page is displayed "with" a user selected
      | users     | roles     | selectedUser |
      | Test User | ROLE_READ | Test User    |
    When I click on the "remove" button for role 0
    Then the remove role dialog is visible
    When I click on the "cancel" button of the remove role dialog
    Then the client grants page is displayed "with" a user selected
      | users     | roles     | selectedUser |
      | Test User | ROLE_READ | Test User    |
    When I click on the "remove" button of user 0
    Then the remove user dialog is visible
    When I click on the "cancel" button of the remove user dialog
    Then the client grants page is displayed "with" a user selected
      | users     | roles     | selectedUser |
      | Test User | ROLE_READ | Test User    |