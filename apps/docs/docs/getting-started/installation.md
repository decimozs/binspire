# Installation

This section describes the installation process of the **Binspire: Smart Community Waste Management System with IoT**.  

The installation involves preparing the hardware, installing the required software on the Raspberry Pi, configuring the network connection, and deploying the system for live operation.

## Hardware Installation

The Raspberry Pi 4, ultrasonic sensor, night vision camera, UPS HAT power module, XL4016 buck converter, and solar power supply are installed inside the smart bin prototype.  

The ultrasonic sensor is positioned at the top of the bin to detect waste levels, while the camera module is mounted to capture visual bin status.

Each component is secured inside the bin to ensure stability during operation.

## Software Installation

The Raspberry Pi operating system is installed and configured. Required libraries and dependencies for sensor communication, image processing, and data transmission are installed.  

These modules enable the system to process waste-level readings and convert them into bin status classifications (Not Full, Almost Full, Full, Overflowing).

Python scripts are installed to continuously read sensor values and send bin data to the dashboard.

## Network Installation

The system requires an internet connection to transmit real-time data to the dashboard. The Raspberry Pi is connected to Wi-Fi, and network parameters are configured to allow automatic data logging and synchronization.

Once configured, the device transmits sensor readings to the backend without manual input.

## Dashboard and API Installation

The backend API and web dashboard are deployed on the server. The Raspberry Pi sends bin data to the API, which stores the information in the database and displays it on the dashboard in real time.

This installation step ensures that users can remotely monitor bin status.

## Algorithm Deployment

The Dynamic Scheduling Algorithm and Vehicle Routing optimization are installed on the system backend.  

These algorithms enable the system to automatically prioritize full bins and generate optimized collection routes.

After installation, route generation becomes automatic once a full-bin alert is triggered.

