->Vendor Cab and Driver Onboarding & Vendor Hierarchy Management

This project is a dashboard for managing vendors, their drivers, cabs, and the overall vendor hierarchy.
The idea is to give a super vendor full control over multiple sub-vendors, and to make onboarding and monitoring easy.

It mainly focuses on:

Onboarding vendors, drivers, and vehicles
Maintaining multi-level hierarchy
Delegation and control for super vendors
Simple UI for viewing and managing data

⭐ What This Project Does

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

🛠️ Technologies Used

Next.js – To structure the application and make it fast

React – For building UI components

Tailwind CSS – For simple and clean styles

ShadCN UI – For ready-made UI components

React Flow – For showing the vendor hierarchy

Mock data – Used for testing and demo view

🧩 Project Structure (Simple Overview)

app/ → All pages (dashboard, hierarchy, delegation, etc.)

components/ → Reusable UI components

data/ → Mock JSON data for vendors, drivers, and hierarchy

lib/ → Utility functions for formatting and calculations

🚀 How to Run

Install dependencies
->npm install


Start the development server
->npm run dev


Open the app
->http://localhost:3000

## Live Link
 - Access the live version here: [Vendor-Management-UI](https://vendor-management-ui-five.vercel.app/)
## Video Demonstration
[![Watch the video](https://img.youtube.com/vi/aBy5BN3VppQ/maxresdefault.jpg)](https://youtu.be/aBy5BN3VppQ)

