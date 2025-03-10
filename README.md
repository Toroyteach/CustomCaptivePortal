# Captive Portal Monorepo

## Overview

This monorepo hosts two core applications:  
- **Backend (NestJS)**: Handles authentication, authorization, and communication with the RADIUS server for managing internet access.  
- **Frontend (ReactJS)**: Provides an admin interface to monitor, manage, and configure access.  
- **Captive Portal Sign-in Pages**: Hosts the user-facing login pages for internet access.

## Backend (NestJS)

- Implements **authentication & authorization** via a **RADIUS server**.
- Communicates with **Cisco routers** for **internet access monitoring**.
- Exposes REST APIs for the frontend to interact with.
- Uses **TypeORM with MySQL** for data management.
- Ensures **secure handling of user authentication**.

## Frontend (ReactJS)

- Provides an **admin dashboard** to monitor user access.
- Displays **network usage statistics** and allows **configuration of user permissions**.
- Uses **React, Tailwind CSS, and Inertia.js** for UI/UX.
- Fetches data from the backend API.

## Captive Portal Sign-in Pages

- Provides a simple login interface for users accessing the network.
- Captures credentials and submits them for authentication.
- Redirects users upon successful login.

## Getting Started

### 1. Clone the Repository
