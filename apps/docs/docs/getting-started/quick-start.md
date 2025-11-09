# Quick Start  
**How to Use the System and Smart Trash Bin — Step-by-Step Guide**

This section provides a step-by-step guide on how the **Binspire: Smart Community Waste Management System with IoT** operates.  

It explains how the smart bin is powered, how real-time monitoring is performed, and how collectors, administrators, and community users interact with the system.

## A. Powering the Smart Bin (Startup Procedure)

1. **Turn on the power**
   - The smart bin is powered using the UPS HAT and XL4016 buck converter connected to the solar module.  
   - When the power switch is turned on, the Raspberry Pi automatically boots and initializes its components.

2. **Verify network connection**
   - The Raspberry Pi automatically connects to the configured Wi-Fi network and begins transmitting data to the dashboard.

3. **Activate sensors and camera**
   - The ultrasonic sensor performs its first measurement and the camera initializes for classification.

4. **Open the monitoring dashboard**
   - Administrators or collectors log in using assigned credentials and confirm that the bin displays a valid status (Not Full / Almost Full / Full / Overflowing).

Once powered, the system launches the monitoring script automatically and requires no manual intervention.

## B. How Collectors Use the System (Daily Workflow)

1. **Receive alerts**
   - Collectors receive automatic notifications on the dashboard when a bin becomes Full or Overflowing.

2. **Accept the task and view optimized route**
   - The system generates an optimized route using Vehicle Routing Problem (VRP) logic, minimizing time and travel distance.

3. **Perform collection**
   - The collector navigates to the bin, opens the lid, and removes the trash following standard collection procedures.  
   - The collector then marks the task as completed on the dashboard, resetting the bin status.

4. **Report issues if necessary**
   - If the bin fails to transmit data or the hardware malfunctions, the collector files a report using the Issue module.

## C. How Administrators Use the System (Management and Monitoring)

1. **User and role management**
   - Administrators approve new users and assign roles (admin or collector) following role-based access control rules.

2. **Monitor bin and device health**
   - Administrators monitor bin status, telemetry (battery, voltage/current from UPS HAT and buck converter), and camera/sensor operation.

3. **Respond to system alerts**
   - The system flags bins that stay full for too long or fail to transmit data, prompting administrators to schedule maintenance.

4. **Adjust collection threshold and scheduling**
   - Administrators review analytics and optimize pickup scheduling based on fill patterns.

## D. How Community Users Use the Smart Trash Bin

1. Open the bin lid and place waste inside the opening.
2. Ensure waste is dropped directly under the ultrasonic sensor and camera field.
3. Avoid blocking or touching internal components such as sensors and camera.
4. Close the lid after use.

Users do not need to operate any system or device — they simply dispose of trash normally.

## E. Routine Maintenance (Periodic)

1. **Visual inspection**
   - Check the lid, camera, sensor area, and solar panel weekly for cleanliness and obstructions.

2. **Power and charging check**
   - Verify voltage and current values from the solar panel and buck converter to ensure proper charging.

3. **Sensor calibration & software updates**
   - Recalibrate sensors and update system scripts when performance drift occurs.

4. **Review data logs**
   - Analyze historical bin logs to improve route planning and system accuracy.

## F. Troubleshooting (Emergency)

| Issue | Quick Action |
|-------|-------------|
| No data being transmitted | Check Wi-Fi and reboot the Raspberry Pi |
| Sensor malfunction | Verify wiring/GPIO pin mapping, then replace or remount sensor |
| Low solar charge | Adjust bin location to better sunlight or switch to charger |

## Completion

Once collection is completed and confirmed by the collector through the dashboard, the system automatically resets the bin status and resumes real-time monitoring, requiring no manual restart.

