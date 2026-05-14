# Pulse-Check-API ("Watchdog Sentinel")

## 1. Project Title & Description

Pulse-Check-API is a backend monitoring service designed to track the health of remote devices using a heartbeat-based mechanism.

Each device is registered as a monitor with a defined timeout period. The system continuously expects heartbeat signals from the device. If no heartbeat is received within the configured timeout window, the device is marked as DOWN and an alert is triggered.

This simulates real-world monitoring systems used for infrastructure tracking in unstable or remote environments.

## 2. System Overview

The system is built around an in-memory, timer-based monitoring model.

- A monitor is created using a unique device ID and a timeout value.
- Once registered, a countdown timer begins immediately.
- Each heartbeat request resets the timer and updates heartbeat timestamps.
- If the timer expires without receiving a heartbeat:
  - The monitor status changes to DOWN
  - An alert is triggered via console logging
- Monitors can be paused to temporarily stop tracking.
- When a paused monitor receives a heartbeat, it automatically resumes and restarts monitoring.

This design uses Node.js setTimeout to simulate real-time failure detection.

## 3. Architecture Diagram

The system architecture is illustrated in the diagram below:

![Pulse Check Flow Diagram](./assets/architecture-diagram.png)

### System Summary

The system follows a state-based monitoring flow:

- A device registers a monitor via POST /monitors
- The server starts a countdown timer immediately
- Heartbeats reset the timer and update timestamps
- If no heartbeat is received before timeout, the monitor transitions to DOWN
- A pause state temporarily stops monitoring
- When paused, heartbeat can resume normal monitoring



## 4. API Documentation

### 1. Register Monitor

**Endpoint**
```http
POST /monitors
```

**Purpose**

Create a new device monitor and start a countdown timer.

**Request Body**
```json
{
  "id": "device-1",
  "timeout": 30,
  "alert_email": "test@mail.com"
}
```

**Response**
```json
{
    "message": "Monitor registered successfully",
    "monitor": {
        "id": "device-1",
        "timeout": 60,
        "alert_email": "test@mail.com",
        "status": "active",
        "previousHeartbeatAt": null,
        "previousHeartbeatReadable": null,
        "lastHeartbeatAt": 1778752663692,
        "lastHeartbeatReadable": "14/05/2026, 9:57:43 am"
    }
}
```
### 2. Heartbeat

**Endpoint**
```http
POST /monitors/:id/heartbeat
```

**Purpose**

Reset the monitor timer and update heartbeat timestamps.

**Response**
```json
{
    "message": "Heartbeat received, timer reset",
    "monitor": {
        "id": "device-1",
        "timeout": 60,
        "alert_email": "test@mail.com",
        "status": "active",
        "previousHeartbeatAt": 1778752488878,
        "previousHeartbeatReadable": "14/05/2026, 9:54:48 am",
        "lastHeartbeatAt": 1778752547760,
        "lastHeartbeatReadable": "14/05/2026, 9:55:47 am"
    }
}
```
### 3. Pause Monitor

**Endpoint**
```http
POST /monitors/:id/pause
```

**Purpose**

Temporarily stop monitoring a device.

**Response**
```json
{
  "message": "Monitor paused successfully",
  "monitor": {
    "id": "device-1",
    "status": "paused"
  }
}
```
### 4. Get All Monitors

**Endpoint**
```http
GET /monitors
```

**Purpose**

Retrieve all registered monitors.

**Response**
```json
{
  "monitors": [
    {
      "id": "device-1",
      "timeout": 60,
      "alert_email": "test@mail.com",
      "status": "active",
      "previousHeartbeatAt": 1778370376615,
      "previousHeartbeatReadable": "09/05/2026, 11:46:16 pm",
      "lastHeartbeatAt": 1778370388541,
      "lastHeartbeatReadable": "09/05/2026, 11:46:28 pm"
    },
    {
      "id": "device-2",
      "timeout": 120,
      "alert_email": "admin@mail.com",
      "status": "paused",
      "previousHeartbeatAt": 1778370300000,
      "previousHeartbeatReadable": "09/05/2026, 11:45:00 pm",
      "lastHeartbeatAt": 1778370325000,
      "lastHeartbeatReadable": "09/05/2026, 11:45:25 pm"
    }
  ]
}
```
### 5. Get Single Monitor

**Endpoint**
```http
GET /monitors/:id
```

**Purpose**

Retrieve details of a specific monitor.

**Response**
```json
{
  "monitor": {
    "id": "device-1",
    "timeout": 60,
    "alert_email": "test@mail.com",
    "status": "active",
    "previousHeartbeatAt": 1778370376615,
    "previousHeartbeatReadable": "09/05/2026, 11:46:16 pm",
    "lastHeartbeatAt": 1778370388541,
    "lastHeartbeatReadable": "09/05/2026, 11:46:28 pm"
  }
}
```
## 5. Developer’s Choice Feature
Custom Observability Enhancement

In addition to the required functionality, I implemented observability-focused GET endpoints to improve system transparency and debugging capability.

Implemented Endpoints:
- GET /monitors
- GET /monitors/:id

### Purpose

These endpoints allow administrators to:

- view all registered monitors in real time
- inspect individual device states
- monitor system health without triggering side effects
- debug device behavior during runtime

### Value Added

While the core system focuses on state transitions (ACTIVE, PAUSED, DOWN), these endpoints introduce a read-only observability layer that improves system usability.

This makes it easier to:

- verify system state during testing
- monitor device lifecycle progression
- support debugging and operational visibility
## Summary

This enhancement was implemented independently beyond the original project requirements and improves system observability without affecting core functionality.


## 6. Setup Instructions

### Clone Repository

```bash
git clone https://github.com/NanaYawAustin/Pulse-Check-API.git
cd Pulse-Check-API
```

### Install Dependencies
```bash
npm install
```
### Start Server
```bash
npm start
```
### Base URL
```text
http://localhost:3000
```

## 7. Final Checklist
- Repository is public and accessible
- Server runs successfully with npm start
- All API endpoints tested and functional
- Architecture diagram included in README
- No node_modules or unnecessary files committed
- README fully replaces original assignment instructions