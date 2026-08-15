/**
 * PortfolioContent - Verified Privacy-Safe Resume & Project Data Store
 * All information is structured for progressive game unlock.
 * Strictly free of private personal data (no phone, no home address, no private email, no birth date).
 */
export const PORTFOLIO_CONTENT = {
  header: {
    name: "Lukas Kraus",
    tagline: "Software Engineer — Autonomous Systems, ADAS & Robotics",
    status: "Active Developer @ Robert Bosch GmbH",
    badge: "M.Eng. Robotics & 3D Vision (1.3)"
  },

  sectors: {
    sector1: {
      id: "sector1",
      name: "Sector 01: ADAS & Autonomous Parking",
      category: "Professional Experience",
      shortTitle: "Robert Bosch GmbH",
      timeframe: "Since 03.2022",
      role: "Software Engineer (Embedded / Automotive)",
      company: "Robert Bosch GmbH",
      location: "Automotive Technology Campus",
      icon: "car-autonomous",
      color: "#00e5ff",
      summary: "Agile engineering, validation, and debugging for cutting-edge autonomous driving and automated parking functions (ADAS).",
      highlights: [
        {
          title: "Parking Space Detection (PSD) & AI Algorithms",
          desc: "AI-assisted C++ software development for real-time parking space detection, Parkout (POP), Anywhere Parking Trailer (APT), and Garage Park Assist (GPA) with custom debug visualizers."
        },
        {
          title: "Intelligent & Remote Park Assist (IPA / RPA)",
          desc: "System maintenance, change-request implementation, and resolving complex software bugs for intelligent driver-assistance systems."
        },
        {
          title: "Platform Communication & Base Software (FD3)",
          desc: "Architected and implemented inter-component communication interfaces (COM, DIAG, FM, PDM) on the next-gen FD3 platform."
        },
        {
          title: "PoDIUM 5G Cloud & Infrastructure Streaming",
          desc: "Implemented real-time 5G sensor data streaming to cloud backends and secured smart parking garage server communications."
        },
        {
          title: "CI/CD & DevOps Automation (AVP)",
          desc: "Automated Jenkins pipelines for Automated Valet Parking using Docker containers, Conan package management, and Python static analysis."
        }
      ],
      tags: ["C++14/17", "ADAS", "Automated Valet Parking", "Docker", "Jenkins", "Python", "5G Cloud", "Conan"]
    },

    sector2: {
      id: "sector2",
      name: "Sector 02: Robotics & 3D Vision Lab",
      category: "Academics & Research",
      shortTitle: "Robotics & RoboCup@Work",
      timeframe: "2020 — 2022",
      role: "Master of Engineering (Grade 1.3)",
      company: "FHWS (Hochschule Würzburg-Schweinfurt)",
      location: "Robotics Research Institute",
      icon: "robot-arm",
      color: "#a855f7",
      summary: "Master of Engineering in Electrical & Information Engineering with specialization in Robotics & 3D Computer Vision.",
      highlights: [
        {
          title: "RoboCup@Work World Competition (4th Place)",
          desc: "Competed with Team SWOT as a newcomer team at RoboCup@Work 2021, achieving an outstanding 4th place worldwide with mobile manipulators."
        },
        {
          title: "Master Thesis: Mobile Manipulation",
          desc: "Autonomous workpiece handling and manipulation using a mobile robot platform, ROS, and 3D computer vision."
        },
        {
          title: "Point Cloud Library (PCL) & 3D Vision",
          desc: "Developed 3D point-cloud processing pipelines, feature extraction, and robot vision algorithms in C++ and Linux."
        },
        {
          title: "Demonstrator Testbeds & Lab Mentorship",
          desc: "Constructed hardware-in-the-loop testbeds with ROS/Linux and supervised laboratory student practicals in automation."
        }
      ],
      links: [
        { label: "Read RoboCup@Work Article", url: "blog-details/roboCupAtWork1.html" }
      ],
      tags: ["ROS", "PCL", "3D Vision", "Mobile Manipulation", "RoboCup@Work", "C++", "Linux", "Qt"]
    },

    sector3: {
      id: "sector3",
      name: "Sector 03: Tech Matrix & Power Core",
      category: "Skills & Certifications",
      shortTitle: "Technical Skill Arsenal",
      timeframe: "Continuous Mastery",
      role: "Core Competencies & Verified Credentials",
      company: "Certified Expertise",
      location: "Engineering Stack",
      icon: "cpu-chip",
      color: "#00ff88",
      summary: "Comprehensive technical capabilities spanning low-level embedded algorithms to scalable CI/CD pipelines and agile methodologies.",
      skills: [
        { group: "Programming Languages", items: ["C++14/17 (Advanced)", "Python (Advanced)", "Bash", "SQL", "JavaScript", "HTML/CSS"] },
        { group: "Frameworks & Toolchains", items: ["ROS", "PCL", "Docker", "Jenkins", "Conan", "Git", "Qt", "CANape", "CANoe", "Matlab/Simulink"] },
        { group: "Operating Systems", items: ["Linux / Ubuntu (Advanced)", "Windows", "ROS Embedded Nodes"] },
        { group: "Methodologies", items: ["CI/CD Pipeline Architecture", "Agile (Scrum / Kanban)", "Clean Code", "Defensive Programming"] }
      ],
      certifications: [
        {
          title: "Professional Scrum Master (PSM I) & Scrum Developer (PSD I)",
          issuer: "Scrum.org",
          desc: "Certified knowledge in agile software development, sprint dynamics, and Scrum leadership."
        },
        {
          title: "Ausbildereignung (AdA-Schein nach AEVO)",
          issuer: "IHK Würzburg-Schweinfurt",
          desc: "Certified pedagogical qualification for training and mentoring new engineering talents."
        },
        {
          title: "Deep Learning with TensorFlow Workshop",
          issuer: "FH Würzburg-Schweinfurt",
          desc: "Neural network architectures, deep computer vision, and machine learning models."
        },
        {
          title: "SQL for Data Science",
          issuer: "UC Davis",
          desc: "Database querying, structured data analysis, and relational data structures."
        }
      ],
      tags: ["Scrum Master", "Scrum Developer", "AEVO AdA", "Deep Learning", "CI/CD Architect"]
    },

    sector4: {
      id: "sector4",
      name: "Sector 04: Off-Duty Basecamp",
      category: "Lifestyle & Passions",
      shortTitle: "Bouldering, Dance & Adventures",
      timeframe: "Passions & Beyond",
      role: "Problem Solver on & off the Wall",
      company: "Life & Community",
      location: "Worldwide",
      icon: "compass-spark",
      color: "#ff007f",
      summary: "Balancing intense engineering with physical agility, musical rhythm, world travel, and coding challenges.",
      highlights: [
        {
          title: "🧗 Bouldering & Athletic Agility",
          desc: "Tackling complex boulder routes—where physical movement meets algorithmic problem-solving and spatial awareness."
        },
        {
          title: "💃 Partner Dancing (Standard & Latin)",
          desc: "Passionate about partner dances: Salsa, Bachata, West Coast Swing, Kizomba, Discofox, and ballroom standard."
        },
        {
          title: "🌍 Travel Explorations & Photo Logs",
          desc: "Exploring new cultures, landscapes, and architectures—from the vibrant fjords and museums of Oslo to international student integrations."
        },
        {
          title: "🧩 Advent of Code & Fun Coding Puzzles",
          desc: "Solving festive algorithmic puzzles and experimenting with creative web programming."
        }
      ],
      links: [
        { label: "Explore Oslo Travel Gallery", url: "blog-details/osloNorwegen1.html" },
        { label: "View Advent of Code Solutions", url: "https://github.com/krauluk1/AoC-2021" }
      ],
      tags: ["Bouldering", "Salsa & Bachata", "West Coast Swing", "Advent of Code", "Traveler"]
    }
  },

  socialLinks: [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/lukaskraus97/", icon: "fab fa-linkedin" },
    { name: "Xing", url: "https://www.xing.com/profile/Lukas_Kraus13/", icon: "fab fa-xing-square" },
    { name: "GitHub", url: "https://github.com/krauluk1/", icon: "fab fa-github" }
  ]
};
