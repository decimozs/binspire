# Settings

This section describes how the Settings module of the Binspire: Smart Community Waste Management System with IoT was used during deployment. The Settings page allowed administrators to configure user roles, thresholds, scheduling behavior, alert conditions, and other operational parameters essential for the smart waste monitoring workflow.

## Purpose of the Settings Module

The Settings module served as the control center for system customization. It allowed administrators to:

- update threshold values for waste level classification
- adjust scheduling parameters for waste collection
- configure permissions based on Role-Based Access Control (RBAC)
- modify system behavior related to notifications, routing, and monitoring intervals

Updating settings ensured that the system adapted to real-world operational changes.

## Configuration Options Available

| Configuration Area | Description |
|-------------------|-------------|
| Waste Level Thresholds | Defined the distance and level limits used to classify bin conditions (Not Full, Almost Full, Full, Overflowing) |
| Scheduling Parameters | Adjusted values used by the Dynamic Scheduling Algorithm to trigger route generation |
| User Roles & Permissions | Controlled account access (Administrator and Collector) |
| System Behavior Settings | Included refresh intervals, alert settings, and routing logic preferences |

All configuration values modified here affected real-time monitoring, routing, and reporting workflows.

## How Administrators Used the Settings Page

1. The administrator logged into the dashboard
2. Navigated to Settings from the sidebar menu
3. Selected the category to modify (Thresholds, Scheduling, User Roles, etc.)
4. Updated the configuration values and clicked Save
5. The dashboard applied the new settings immediately without requiring a restart

Any configuration change affected active monitoring and routing logic automatically.

## Effect of Changes

- Waste-level alerts were generated based on updated thresholds
- Optimized routes were recalculated using new route/scheduling values
- Permission changes applied instantly to affected accounts
- System logs recorded configuration updates for audit tracking

Changes were monitored automatically under the History/Audit module.

## Access and Security

Only Administrators had access to the Settings module.  
Collectors were restricted from modifying settings to prevent operational disruptions.

This ensured the security and integrity of the smart waste management system.

