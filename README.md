# 🚀 BeeHive - Open Source Collaboration Platform
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116.1-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![SendGrid](https://img.shields.io/badge/SendGrid-Email-0099FF?style=for-the-badge&logo=sendgrid&logoColor=white)
![Jinja2](https://img.shields.io/badge/Jinja2-Templates-B41717?style=for-the-badge&logo=jinja&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-Markup-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
## 💡 Project Overview

BeeHive is a web-based collaboration and team management system designed to help startups, freelancers, hackathon teams, and coding groups work efficiently under a single, unified platform. Built using HTML, CSS, JavaScript, and Python, the system focuses on **clarity, collaboration, and momentum** — three essential elements every growing team needs.

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
<img width="1919" height="877" alt="Screenshot 2026-03-20 144528" src="https://github.com/user-attachments/assets/94402c3c-f37d-46a1-a007-85649d4f99d4" />

### Approve Pending Signups
<img width="2560" height="1600" alt="admin-approvals" src="https://github.com/user-attachments/assets/c6dd9163-f6c7-4464-8ebf-8b1d08898d59" />

### Project Status
<img width="1919" height="878" alt="Screenshot 2026-03-20 144547" src="https://github.com/user-attachments/assets/6d6b1633-2497-4aec-b72d-cd417210ea6c" />

### Task Status
<img width="1919" height="878" alt="Screenshot 2026-03-20 144604" src="https://github.com/user-attachments/assets/9f0df7ab-b2c1-4ec9-9212-3adda5fa4715" />

### Member's Profile
<img width="2560" height="1600" alt="members-profile" src="https://github.com/user-attachments/assets/f03b0810-c850-42fd-8b36-7d6fa42b3438" />


## Member's Page
### Dashboard
<img width="1919" height="872" alt="Screenshot 2026-03-20 145758" src="https://github.com/user-attachments/assets/2ca853a0-23c1-42bd-8d6f-5b42b93a7337" />

### Member's Profile
<img width="2560" height="1600" alt="profile-client" src="https://github.com/user-attachments/assets/38e1c96e-edd2-40d0-a71f-dcb822036ddf" />

### Projects Assigned to Members    
<img width="1919" height="874" alt="Screenshot 2026-03-20 145900" src="https://github.com/user-attachments/assets/ee58bc49-2905-4856-91e6-6cb4706d5e93" />

### Tasks Assigned to Members
<img width="1919" height="874" alt="Screenshot 2026-03-20 150134" src="https://github.com/user-attachments/assets/7b0987c3-f599-4f83-ad1b-dc9ff9243e0e" />

### Community Chat (Admin/Members)
<img width="1919" height="875" alt="Screenshot 2026-03-01 175004" src="https://github.com/user-attachments/assets/a20cab9a-84cd-40b8-b401-a2589febc505" />

## 🤝 Contributing
We welcome contributions from the community! Here's how you can help:

### Ways to Contribute
- 🐛 Bug Fixes - Identify and fix issues
- ✨ New Features - Add requested or innovative features
- 🎨 UI Improvements - Enhance the user experience
- 📚 Documentation - Improve guides and documentation
- 🔧 Performance Optimizations - Make the platform faster

**Star this repository if you find it helpful!**
