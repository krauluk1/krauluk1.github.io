# Lukas Kraus — Autonomous Systems & Robotics Interactive Portfolio

[![CI & Deployment Verification](https://github.com/krauluk1/krauluk1.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/krauluk1/krauluk1.github.io/actions/workflows/ci.yml)

A modern, gamified interactive portfolio website for **Lukas Kraus** (Software Engineer @ Robert Bosch GmbH, specializing in **Autonomous Driving / ADAS**, **Robotics & 3D Vision**, and **CI/CD**).

Visitors take the wheel of an **Autonomous Exploration Rover** equipped with real-time **LIDAR scanning**, particle exhaust, and physics to explore career milestones across 5 high-tech sectors and collect 26 sub-item milestones while navigating around planetary crater obstacles.

---

## 🎮 Game Sectors & Highlights

- **🚗 Sector 01: Work Experience (Automotive & Robotics Proving Ground)**:
  - Parking Space Detection (PSD), Anywhere Parking Trailer (APT), Garage Park Assist (GPA), Remote/Intelligent Park Assist (RPA/IPA).
  - Platform interfaces (FD3), PoDIUM 5G Sensor Cloud Streaming, and Automated Valet Parking (AVP) CI/CD pipelines in Docker/Jenkins.
  - FHWS Robotics Demonstrator testbeds and IAV GmbH driving scenario visualization & bus data analysis tools.
- **🤖 Sector 02: Academic Education (FHWS Robotics & 3D Vision Lab)**:
  - Master of Engineering in Electrical Engineering & Information Technology (Robotics & 3D Vision, Grade 1.3).
  - RoboCup@Work World Championship 2021 (4th place worldwide with Team SWOT).
  - ROS Melodic, Point Cloud Library (PCL), 3D perception, and cartesian trajectory planning with UR3e & RealSense.
  - Bachelor of Engineering in Electrical Engineering (Automation Technology, Grade 2.1) & Bus Signal Processing Thesis.
- **⚡ Sector 03: IT & Technical Skills (Technical Power Matrix)**:
  - C++14/17, Python, Bash, SQL, Linux / Ubuntu, Git, Jenkins, Docker, Conan, ROS, PCL, Qt, CANape, CANoe.
  - CI/CD Pipeline Architecture, Test Automation, Defensive Programming, and Clean Code.
- **🛡️ Sector 04: Qualifications & Certificates (Credentials Vault)**:
  - Scrum.org **PSM I** (Professional Scrum Master I) & **PSD I** (Professional Scrum Developer I) Certified.
  - IHK Ausbildereignung (AdA-Schein nach AEVO) for technical apprenticeship instruction.
  - Deep Learning with TensorFlow (FHWS) and SQL for Data Science (UC Davis).
  - Mobility: German Driver's License Class B.
- **🧗 Sector 05: Volunteering & Interests (Off-Duty Basecamp)**:
  - International Students Club (FHWS ISC) intercultural integration and event management.
  - Bouldering & physical route problem-solving.
  - Partner Dancing (Standard & Latin ballroom, Salsa, Bachata, West Coast Swing, Kizomba).
  - Oslo travel photography log and Advent of Code algorithmic challenges.

---

## 🏗️ Architecture & Features

- **JSON Data Layer**: Portfolio data, deep-dive articles, privacy policies, and legal notices are organized in structured JSON files (`assets/data/portfolio.json`, `assets/data/articles.json`, `assets/data/legal.json`).
- **Obstacle & Crater Physics**: Impact craters with glowing neon lips and shadow depths require rover steering; collision detection provides smooth tangent sliding, dust particle bursts, and synthesized audio rumble.
- **Embedded YouTube Media**: Responsive embedded YouTube video player in the RoboCup@Work article.
- **Non-blocking Navigation**: All article, privacy, and legal links open in separate windows/tabs (`target="_blank"`), preserving active rover position and gameplay state across browser sessions via `localStorage`.

---

## 🚀 How to Run Locally

### Option A: VS Code Tasks (1-Click)
1. Open this repository folder in **VS Code**.
2. Press `Ctrl + Shift + B` (or menu: **Terminal $\rightarrow$ Run Build Task...**).
3. Select **"Start Local Website Server"**.
4. Open your browser at `http://localhost:8000`.

### Option B: Node.js / NPM
```bash
npm install # (optional)
npm start   # Starts static server on http://localhost:8000
```

### Option C: Python
```bash
python -m http.server 8000
```

---

## 🧪 Automated Testing & CI/CD

Run the test suites (link integrity, syntax, asset verification, JSON schemas, and privacy compliance):
```bash
npm test
node scripts/verify-all.js
```

### GitHub Actions CI
On every push/PR to `main`, GitHub Actions automatically:
- Runs `scripts/test-assets.js` and `scripts/verify-all.js` to ensure zero broken asset links and zero privacy violations.
- Deploys the static web app to **GitHub Pages**.

---

## 🛡️ Privacy & Compliance
This public portfolio strictly complies with privacy regulations:
- **No private phone numbers, private home addresses, private emails, or birth dates** are included.
- Public professional contacts: [LinkedIn](https://www.linkedin.com/in/lukaskraus97/), [Xing](https://www.xing.com/profile/Lukas_Kraus13/), [GitHub](https://github.com/krauluk1/).
