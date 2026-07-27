<p align="center">
  <img src="landing page/public/logo.png" width="120" alt="BeeHive Logo" />
</p>

<h1 align="center">BeeHive</h1>

<p align="center">
  <strong>Open Source Collaboration Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/frontend-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/styling-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/language-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/backend-Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/framework-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/images-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/email-SendGrid-1A82E2?style=for-the-badge&logo=sendgrid&logoColor=white" alt="SendGrid" />
  <img src="https://img.shields.io/badge/deploy-Render-000000?style=for-the-badge&logo=render&logoColor=white" alt="Render" />
  <img src="https://img.shields.io/badge/deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p align="center">
  🌐 <strong><a href="https://beehivecollab.onrender.com/">Official Page</a></strong> &nbsp;|&nbsp; 
  📚 <strong><a href="https://beehivecollab.onrender.com/docs">Documentation</a></strong> &nbsp;|&nbsp; 
  🛠️ <strong><a href="https://beehivecollab.onrender.com/setup">Setup & Deployment</a></strong>
</p>

## 💡 Project Overview

BeeHive is a self-hostable, open-source collaboration platform designed to help organizations efficiently manage teams, projects, and workflows from a single unified workspace. It is ideal for startups, hackathon teams, freelance agencies, coding communities, educational groups, and other collaborative environments.

## 🎯 What Problem Does It Solve?

Managing teams becomes difficult when:
- **Tasks are scattered** across multiple tools(like paper, excel, etc.)
- **Communication lacks structure** and organization
- **Team leaders can't track progress** clearly
- **Remote collaboration feels disconnected**

This project solves these challenges by providing **integrated task management, leadership hierarchy, and real-time collaboration** in one cohesive platform.

## ✨ Key Features

### 👥 Team & Leadership Management
- Create teams with one or multiple team leaders
- Assign roles and responsibilities clearly
- Visual organization and team directories

### 📋 Task & Project Assignment
- Assign tasks and projects to specific team members
- Track progress with visual indicators
- Set deadlines and priority levels
- Get real-time notifications for task/project updates

### 💬 Community Chat Room
- Built-in real-time team chat system
- File sharing and media support [Currently working on it]
- Encourages open discussion, brainstorming, and problem-solving
- Centralized and transparent communication

### 🔓 Fully Open Source & Self-Hostable
- 100% open source — no vendor lock-in
- Deploy it for your own team or organization
- Host locally or on your preferred cloud platform
- Customize, extend, and scale freely
- Community-driven development

## 🎯 Target Users

This system is especially useful for:

- **🚀 Startups** managing small to medium teams
- **💼 Freelancing teams** working remotely
- **🧑‍💻 Hackathon groups** collaborating under time pressure
- **👨‍👩‍👧‍👦 Coding communities & student teams**
- **📚 Educational groups** working on projects together

## 🛠️ Tech Stack

### Frontend
- **HTML5** 
- **CSS3** 
- **JavaScript (ES6+)** 

### Backend
- **Python** 
- **FastAPI** 

### Architecture
- Lightweight and modular design
- RESTful API architecture
- Real-time communication capabilities

## 🌱 Project Vision

The goal of BeeHive is to create a simple yet powerful collaboration tool that:

- **Reduces friction** in teamwork and coordination
- **Encourages transparency** and open communication
- **Empowers teams** without forcing them into closed ecosystems
- **Adapts to various workflows** and team structures
- **Thrives on community contributions** and shared innovation

## 📦 Getting Started
### Configuration
**Open `settings.json` file to configure the operations.** <br>
***Keys and their meaning***
- **sendgrid** -> to controll emailed notifications via sendgrid
    - `email_verification` : to verify email and otp during sign-up
    - `projects` : to notify user that he hass been assigned project
    - `tasks` : to notify user that he has been assigned task
    - `approvals` : to notify user that he has been approved by the admin

 **NOTE :** *The sendgrid configuration can be helpful to you when you don't have sendgrid API.Update the key's value to false for each one and no sendgrid API required. Just create a sendgrid variable in `.env` folder and pass an empty string.*
### Setup

- **Step-1**: Clone the repository
- **Step-2**: Navigate to project directory
- **Step-3**: Create a .env file
- **Step-4**: Add the following variables to the `.env` file

```
MONGO_URI = "mongodb://localhost:27017"
SENDGRID_API_KEY = "your_sendgrid_api_key"
EMAIL = "your_email" 
DOC_USERNAME = "your_doc_username" # it can be anything
DOC_PASSWORD = "your_doc_password" # it can be anything

ADMIN_USERNAME = "admin" # create a admin username
ADMIN_PASSWORD = "admin" # create a admin password

DEV_ID = "your_dev_id" # it can be anything

```
- **Step-5**: Create a virtual environment (optional but recommended)
- **Step-6**: Activate the virtual environment
- **Step-7**: Install dependencies
- **Step-8**: Run the application

### Installation
```bash
# Clone the repository
git clone https://github.com/codex-yv/bee_hive.git

# Navigate to project directory
cd bee_hive

# Create a virtual environment (optional but recommended)
python -m venv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate

# On macOS and Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
uvicorn main:app --reload
```

# Screenshots
## Admin Page
### Dashboards
<img alt="Admin Dashboard" src="landing page/public/features/adminDash.png" />

### Approve Pending Signups
<img alt="Approve Pending Signups" src="landing page/public/features/members3.png" />

### Project Status
<img alt="Project Status" src="landing page/public/features/project.png" />

### Task Status
<img alt="Task Status" src="landing page/public/features/task.png" />

### Member's Profile
<img alt="Member Profile" src="landing page/public/features/members1.png" />


## Member's Page
### Dashboard
<img alt="Member Dashboard" src="landing page/public/features/userdash.png" />

### Member's Profile
<img alt="Member Profile" src="landing page/public/features/userprofile.png" />

### Projects Assigned to Members    
<img alt="Projects Assigned to Members" src="landing page/public/features/userproj.png" />

### Tasks Assigned to Members
<img alt="Tasks Assigned to Members" src="landing page/public/features/usertask.png" />

### Community Chat (Admin/Members)
<img alt="Community Chat" src="landing page/public/features/community.png" />

## 🤝 Contributing
We welcome contributions from the community! Here's how you can help:

### Ways to Contribute
- 🐛 Bug Fixes - Identify and fix issues
- ✨ New Features - Add requested or innovative features
- 🎨 UI Improvements - Enhance the user experience
- 📚 Documentation - Improve guides and documentation
- 🔧 Performance Optimizations - Make the platform faster

**Star this repository if you find it helpful!**
