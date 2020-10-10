Feature: Logging in With Auth Server

  Scenario: Logging in and out
    Given I am on the home page, but not authenticated
    When I click the login button
    Then I am redirected to the login page
    When I login
    Then I am redirected to the home page, and fully authenticated
    When I click the logout button
    Then I am on the home page, but not authenticated