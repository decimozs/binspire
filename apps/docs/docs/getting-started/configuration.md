# Configuration

This section describes how the hardware and software components of the **Binspire: Smart Community Waste Management System with IoT** are configured during development and deployment.  

Configuration involves assembling the smart bin hardware, setting up the Raspberry Pi environment, connecting all required modules, and configuring the system for real-time data monitoring.

## Hardware Configuration

The hardware configuration includes installing the Raspberry Pi 4, ultrasonic sensor, camera module, UPS HAT power module, XL4016 buck converter, and solar power supply inside the prototype smart bin.  

The ultrasonic sensor is mounted at the top of the bin to measure waste height, while the camera module provides visual confirmation.

The Raspberry Pi serves as the main controller, receiving sensor readings and sending bin status to the web dashboard.  

The UPS HAT and buck converter are configured to regulate power from the solar panel to ensure stable operation of the Raspberry Pi and its peripherals.

## Software Configuration

The Raspberry Pi operating system and required libraries are installed to enable sensor communication, camera operation, and data transmission to the dashboard.  

The system processes inputs from the ultrasonic sensor and converts them into bin status categories (Not Full, Almost Full, Full, Overflowing).

Automated scripts handle sensor polling and dashboard data updates.  

The backend API and dashboard are configured to receive and display real-time data once the Raspberry Pi transmits the bin status.

## Network Configuration

The smart bin requires a stable internet connection to send real-time data to the dashboard.  
The Raspberry Pi is configured to connect to Wi-Fi and automatically transmit sensor data to the database.

Once configured, the system synchronizes bin data at set intervals without requiring user intervention.

## Route and Scheduling Configuration

The dashboard applies the **Dynamic Scheduling Algorithm** and routing logic based on the Vehicle Routing Problem (VRP).  

Once a bin reaches the defined threshold, the system automatically generates the optimized pickup route for the garbage collector.

Configuration of routing rules ensures that the bin with the highest urgency is prioritized for collection.

