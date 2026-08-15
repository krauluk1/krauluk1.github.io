# Lukas Kraus — Autonomous Systems & Robotics Interactive Portfolio

[![CI & Deployment Verification](https://github.com/krauluk1/krauluk1.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/krauluk1/krauluk1.github.io/actions/workflows/ci.yml)

A modern, gamified interactive portfolio website for **Lukas Kraus** (Software Engineer @ Robert Bosch GmbH, specializing in **Autonomous Driving / ADAS**, **Robotics & 3D Vision**, and **CI/CD**).

Visitors take the wheel of an **Autonomous Exploration Rover** equipped with real-time **LIDAR scanning**, particle exhaust, and physics to explore and unlock career milestones across 4 high-tech sectors.

---

## 🎮 Game Sectors & Highlights

- **🚗 Sector 01: ADAS & Autonomous Parking (Robert Bosch GmbH)**:
  - Parking Space Detection (PSD), Anywhere Parking Trailer (APT), Garage Park Assist (GPA), Remote/Intelligent Park Assist (RPA/IPA).
  - Platform interfaces (FD3), PoDIUM 5G Sensor Cloud Streaming, and Automated Valet Parking (AVP) CI/CD pipelines in Docker/Jenkins.
- **🤖 Sector 02: Robotics & 3D Vision Lab (FHWS & Team SWOT)**:
  - Master of Engineering (Robotics & 3D Vision, Grade 1.3).
  - RoboCup@Work World Championship (4th place worldwide).
  - ROS, Point Cloud Library (PCL), OpenCV, and mobile manipulator kinematics.
- **⚡ Sector 03: Tech Matrix & Power Core (Skills & Certifications)**:
  - C++14/17, Python, Bash, SQL, Linux, Git, Jenkins, Docker, Conan, CANape, CANoe.
  - Scrum.org **PSM I** (Scrum Master) & **PSD I** (Scrum Developer) Certified.
  - IHK Ausbildereignung (AdA nach AEVO).
- **🧗 Sector 04: Off-Duty Basecamp (Lifestyle & Adventures)**:
  - Bouldering routes, Partner Dancing (Salsa, Bachata, West Coast Swing, Standard/Latin), Oslo travel log, and Advent of Code.

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

Run the local test suite (link integrity, syntax, asset verification, and privacy compliance):
```bash
npm test
```

### GitHub Actions CI
On every push/PR to `main`, GitHub Actions automatically:
- Runs `scripts/test-assets.js` to ensure zero broken asset links and zero privacy violations.
- Deploys the static web app to **GitHub Pages**.

---

## 🛡️ Privacy & Compliance
This public portfolio strictly complies with privacy regulations:
- **No private phone numbers, private home addresses, private emails, or birth dates** are included.
- Public professional contacts: [LinkedIn](https://www.linkedin.com/in/lukaskraus97/), [Xing](https://www.xing.com/profile/Lukas_Kraus13/), [GitHub](https://github.com/krauluk1/).
