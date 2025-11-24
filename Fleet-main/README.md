## Vendor Cab and Driver Onboarding & Vendor Hierarchy Management

This project is a dashboard for managing vendors, their drivers, cabs, and the overall vendor hierarchy.
The idea is to give a super vendor full control over multiple sub-vendors, and to make onboarding and monitoring easy.

## It mainly focuses on:

Onboarding vendors, drivers, and vehicles
Maintaining multi-level hierarchy
Delegation and control for super vendors
Simple UI for viewing and managing data

##  What This Project Does

1. Vendor Hierarchy Management
The system supports multiple levels of vendors.
A Super Vendor can have many Sub-Vendors, and each of them can further have their own teams.
The hierarchy is displayed visually using React Flow, so you can clearly understand:
Who reports to whom
Which vendor owns which cabs and drivers

2. Vendor, Driver & Cab Onboarding
Each vendor can add:
New drivers
New vehicles
Basic details like name, ID, vehicle number, etc.
This keeps everything organized and helps in tracking fleet details.

3. Delegation by Super Vendor
Super vendors can:
Assign work to sub-vendors
View all vendors under them
Track activity and onboarded units
Monitor hierarchy visually

4. Simple Dashboard Pages
The project includes basic pages for:
Driver and vehicle tables
Delegation management
Vendor list
Vendor hierarchy tree
Dashboard summaries
These pages use mock data but represent how a real dashboard would function.



## Project Structure (Simple Overview)

app/ → All pages (dashboard, hierarchy, delegation, etc.)

components/ → Reusable UI components

data/ → Mock JSON data for vendors, drivers, and hierarchy

lib/ → Utility functions for formatting and calculations

## How to Run

Install dependencies
->npm install


Start the development server
->npm run dev


Open the app

->http://localhost:3000

## Screenshot

![Screenshot_23-11-2025_18433_localhost](https://github.com/user-attachments/assets/aa79887e-e1b6-4bbf-9ffb-3ac85db498a6)

 ![Screenshot_23-11-2025_18416_localhost](https://github.com/user-attachments/assets/ca84011e-b0e7-4338-a4fc-6f4e967f574c)
 
![Screenshot_23-11-2025_18353_localhost](https://github.com/user-attachments/assets/30ff4c60-a708-456c-9b91-2047682b692c)

![Screenshot_23-11-2025_1839_localhost](https://github.com/user-attachments/assets/f0efae58-8852-4be9-b87c-d42b43a2f6de)



 


