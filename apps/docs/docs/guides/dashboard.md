# Dashboard

This section explains how the dashboard of the Binspire: Smart Community Waste Management System with IoT is used during deployment. The dashboard serves as the central interface where users view bin status, monitor alerts, track routes, and manage waste collection activities. It displays all active smart bins with their real-time status transmitted from the Raspberry Pi.

## Dashboard Overview

Once logged in, users are redirected to their dashboard depending on their role (Administrator or Collector). The dashboard displays:

- real-time bin status (Not Full, Almost Full, Full, Overflowing)
- timestamp of the last sensor update
- bin locations on the map
- route suggestions during alert conditions

The dashboard serves as the command center for monitoring and decision-making.

## Dashboard Components

| Section | Description |
|---------|-------------|
| Map View | Displays the locations of all deployed smart bins. |
| Bin Status Table | Lists bin ID, fill level status, and last update timestamp. |
| Alerts Panel | Shows bins that reached Full or Overflowing status. |
| Route Planning Module | Generates optimized routes for collectors based on active alerts. |
| User Menu | Allows logout, account configuration, and access to history logs. |

These components provide users with both a visual and data-driven perspective of bin activity.

## How to Use the Dashboard (Step-by-Step)

1. **Login**
   - User logs in using assigned username and password.
   - The system authenticates the account and redirects the user to their respective dashboard view.

2. **Monitor Smart Bin Status**
   - User views the map to identify bin locations.
   - Each bin displays a color-coded indicator based on fill level (Not Full → Overflowing).
   - The most recent timestamp confirms data freshness.

3. **Respond to Alerts**
   - If a bin reaches Full or Overflowing, an alert appears in the notification panel.
   - Urgent bins are marked with priority indicators.

4. **View Collection Route (Collectors Only)**
   - Collector clicks View Route to see the optimized pickup route.
   - The route is auto-generated using Dynamic Scheduling + VRP logic.

5. **Mark Collection as Completed**
   - After collecting waste, the collector selects the bin and clicks Mark as Collected.
   - The system clears the alert and resets the bin status on the dashboard.

All activity is logged in the system history to support accountability.

## User Access in the Dashboard

| Role | Allowed Dashboard Features |
|------|---------------------------|
| Administrator | approve accounts, view history logs, monitor system activity, manage alert escalation |
| Collector | view alerts, access route planning, confirm pick-ups |

Role-Based Access Control (RBAC) ensures users only access features needed for their responsibilities.

