# Account

This section provides a guided walkthrough on how users create accounts, log in, and access the system according to their assigned role.  
The system uses Role-Based Access Control (RBAC), which assigns different permissions to Administrators and Collectors.

## Creating an Account (User Registration)

Follow these steps to create a user account:

1. Open the system login page.
2. Click "Create Account" or "Register".
3. Enter the required user information (name, email, username, and password).
4. Submit the registration form.

At this point, the account is created but not yet usable.  

The system stores the new user as "Pending" until reviewed by the Administrator.  
Users cannot log in until their registration is approved.

## Approval of Account (Administrator Only)

The Administrator follows these steps to enable user access:

1. Log into the system using admin credentials.
2. Navigate to the Account Management or Pending Accounts tab.
3. Review the pending user registration request.
4. Click Approve or Reject based on authorization.
5. Assign the user’s role (Collector or Administrator).

Approved users can immediately log in.

## Logging Into the System (All Users)

After approval, users access their accounts using these steps:

1. Go to the system login page.
2. Enter username and password.
3. Click Login.

The system authenticates credentials and determines the user role.  
Invalid usernames or passwords are rejected for security.

## After Login — Role-Based System Navigation

Once logged in, the system automatically redirects users based on their role:

| Role | Dashboard View | User Capabilities |
|------|----------------|-----------------|
| Administrator | System analytics dashboard | Manage accounts, approve registrations, view activity logs |
| Collector | Collection activities dashboard | View assigned bins, see optimized collection routes, mark tasks completed |

This RBAC approach ensures secure and appropriate access per user.

## Logging Out

1. Click the Profile or Account menu in the dashboard.
2. Select Logout.

The system ends the active session and returns to the login page.  
Sessions automatically expire after inactivity for security.

