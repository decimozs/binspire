# Data Analysis and Reports

This section explains how the Data Analysis and Reports feature of the Binspire system operated during deployment. The dashboard generated analytical summaries based on real-time data received from the smart bins and the Raspberry Pi. The system stored bin activity, waste-level changes, and completed collections to support reporting and decision-making.

## Purpose of the Data Analysis and Reports Module

The reporting module allowed the system to:

- track waste trends over time
- analyze the frequency of waste collection
- provide decision-support data for improving collection schedules
- automatically record and archive collection history

These reports helped administrators monitor system performance without manually reviewing bin activity.

## How Data Was Collected

1. The ultrasonic sensor measured waste levels inside the smart bin.
2. The Raspberry Pi processed the sensor output and converted the values into bin status categories (Not Full, Almost Full, Full, Overflowing).
3. Each update was transmitted to the backend database and stored with a timestamp and bin ID.

Every bin event (alert, status change, collection) was logged automatically.

## How Reports Were Viewed on the Dashboard (Step-by-Step)

1. User logged into the dashboard using their system account.
2. User clicked **History** or **Reports** from the dashboard navigation panel.
3. A table displayed all logged activities:
   - bin ID
   - status changes
   - timestamps
   - collector who completed the pickup
   - route used during collection
4. User filtered the report by **date**, **collection status**, or **bin location**.

Reports could be used to validate collection performance and system responsiveness.

## Insights Generated from the Data

The reporting module allowed administrators to:

| Insight Produced | Example Usage |
|------------------|---------------|
| Identify bins that reached Full state more frequently | Allowed potential relocation or additional bin placement |
| Determine peak waste disposal hours/days | Adjusted collection schedules |
| Monitor collector performance | Verified if scheduled routes were followed |
| Review power and sensor stability data | Scheduled preventive maintenance |

Patterns such as rapid bin filling or repeated overflow alerts helped refine scheduling and bin placement strategies.

## Exporting and Documentation

The system stored report logs directly in the backend database. Administrators reviewed these logs during evaluation and documentation. Exporting logs allowed analysis of trends throughout testing and pilot deployment.

The stored history served as evidence of real-time system performance.

