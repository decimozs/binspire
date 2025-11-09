# Monitoring

This section explains how the monitoring feature of the Binspire: Smart Community Waste Management System with IoT functioned during deployment. The monitoring module displayed real-time waste levels from the smart bin, allowing users to track bin activity and status from the dashboard. Monitoring occurred continuously and updated automatically based on the sensor readings collected by the Raspberry Pi.

## How Monitoring Worked (System Flow)

1. The ultrasonic sensor measured the height of the waste inside the bin.
2. The Raspberry Pi processed the sensor reading and determined the correct bin status:
   - Not Full
   - Almost Full
   - Full
   - Overflowing
3. The processed data was sent to the backend database.
4. The dashboard updated the status in real time and displayed the latest timestamp.

The monitoring process operated automatically without requiring manual input.

## What Users Saw on the Monitoring Dashboard

The dashboard displayed real-time monitoring information, including:

- bin ID and location
- current waste-level status (color-coded)
- timestamp of the most recent reading
- battery/power status from the UPS HAT and buck converter (where applicable)

This allowed the system to visualize bin activity and detect abnormalities, such as sudden rapid filling or lack of transmitted data.

## Step-by-Step Guide: How Monitoring Was Used

1. The user logged into the dashboard.
2. The user selected **Monitoring** from the navigation menu.
3. The user viewed the smart bin list or map view showing the fill-level status.
4. If a bin approached Full or Overflowing, the dashboard marked it as a priority item.
5. The system automatically generated a pickup route once the threshold was reached.

Monitoring enabled proactive planning rather than reactive waste collection.

## Automated Monitoring Behavior

| System Action | Trigger |
|---------------|----------|
| Status updated on dashboard | New sensor reading detected |
| Alert generated | Bin reached Full or Overflowing |
| Route generation activated | Multiple bins reached collection threshold |
| Status reset | Collector completed bin collection in dashboard |

These behaviors ensured that the system remained autonomous and continuously operational during the pilot testing.

## Monitoring During Field Deployment

During deployment, the monitoring module helped validate system performance by:

- confirming that the Raspberry Pi transmitted correct and timely data
- verifying sensor accuracy in real waste conditions
- confirming real-time tracking of bin fill patterns over time

Monitoring served as the core function that enabled Alerts, Notifications, and Data Reporting.

