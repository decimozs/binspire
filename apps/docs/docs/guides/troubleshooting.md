# Troubleshooting

This section describes how troubleshooting was performed when issues occurred in the Binspire: Smart Community Waste Management System with IoT. It also explains how errors were handled and how maintenance logs or issue reports were recorded in the system. The procedures were based on actual deployment and recorded system behavior in the project documentation.

## Purpose of Troubleshooting

Troubleshooting ensured that the smart bin and dashboard continued to operate even when unexpected errors occurred, such as:

- loss of data transmission
- unstable power from the UPS HAT/solar panel
- failed sensor readings
- dashboard or route generation issues

Troubleshooting prevented system downtime and supported continuous monitoring.

## Troubleshooting Common Issues

### No Data Appeared on the Dashboard

| Possible Cause | Action Taken |
|----------------|--------------|
| The Raspberry Pi lost Wi-Fi connection | Checked Wi-Fi availability, moved the bin to a stronger signal area |
| Sensor script stopped running | Restarted the Raspberry Pi; monitoring resumed automatically |
| Dashboard API did not receive data packets | Verified backend connection and checked logs |

If the system still did not update, the collector or administrator filed an issue report.

### Incorrect Sensor Readings

| Possible Cause | Action Taken |
|----------------|--------------|
| Dirt or waste blocked the ultrasonic sensor | Cleaned the sensor area and ensured no obstruction |
| Sensor calibration drifted | Recalibrated sensor via Settings module |
| Wiring/GPIO issue | Checked wiring and GPIO mapping based on assembly configuration |

### No Power / System Shutdown

| Possible Cause | Action Taken |
|----------------|--------------|
| UPS HAT battery depleted | Recharged or replaced the UPS battery |
| Solar panel produced insufficient voltage | Checked buck converter output and repositioned the panel for sunlight |

Solar-powered charging variability was documented in the hardware performance section.

### Dashboard Not Loading / Error 500

| Possible Cause | Action Taken |
|----------------|--------------|
| Backend API was offline | Restarted backend service |
| Slow network speed | Reloaded dashboard or switched to another connection |

## Error Handling Workflow

When any malfunction occurred, the system followed this workflow:

1. The system displayed a notification in the dashboard under the Alerts & Activity module
2. The affected bin was tagged with a warning symbol (⚠️)
3. If no data was received after a certain period, the system flagged the bin for maintenance
4. The user responsible (collector or administrator) reviewed the alert and performed troubleshooting

The system automatically prevented further route generation on malfunctioning bins to avoid wasted resources.

## Issue Reporting and Maintenance Logs

The Issue Reporting / History Log module documented issues detected during monitoring or field collection. Each report stored:

- bin ID and location
- reported problem
- time and date
- assigned personnel
- resolution notes

### How issue reporting was performed

1. The collector opened the dashboard
2. Selected the problematic bin from the bin list
3. Clicked Report Issue
4. Added a short description (ex: “sensor unresponsive”, “camera blocked”)
5. Submitted the report; the issue was logged automatically and assigned to an administrator

All reports were traceable through the audit history.

### Maintenance Log Example

| Bin ID | Issue Reported | Assigned To | Status | Resolution |
|--------|----------------|-------------|--------|------------|
| BIN-04 | No sensor reading detected | Admin | Completed | Restarted Pi and cleaned sensor |

### Automatic System Safeguards

The system automatically:

- flagged bins that remained "Full" over an extended period
- logged no-data bins to the audit module
- notified administrators for escalation

These safeguards reduced manual monitoring and improved response time.

