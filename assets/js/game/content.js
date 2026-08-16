/**
 * PortfolioContent - Verified Privacy-Safe Resume & Project Data Store
 * Structured for progressive gamified unlock across 5 main CV sectors.
 * Strictly free of private personal data (no private phone, home address, or birth date).
 */
export const PORTFOLIO_CONTENT = {
  header: {
    name: "Lukas Kraus",
    tagline: "Software Engineer — Autonomous Systems, ADAS & Robotics",
    status: "Software Engineer @ Robert Bosch GmbH",
    badge: "M.Eng. Robotics & 3D Vision (Grade: 1.3)",
    location: "Stuttgart / Schweinfurt, Germany",
    summary: "Specialized in Autonomous Driving (ADAS), Parking Space Detection (PSD), Automated Valet Parking (AVP), Point Cloud 3D Vision, and CI/CD Automation."
  },

  sectors: {
    sector1: {
      id: "sector1",
      name: "Sector 01: Work Experience",
      category: "Professional Experience",
      shortTitle: "Automotive & Robotics Proving Ground",
      timeframe: "Since 2019 — Present",
      role: "Software Engineer (Embedded / Automotive)",
      company: "Robert Bosch GmbH / FHWS / IAV",
      location: "Stuttgart & Weissach, Germany",
      icon: "car-autonomous",
      color: "#00e5ff",
      summary: "Agile engineering, validation, and debugging for cutting-edge autonomous driving, automated parking functions (ADAS), and mobile robotics.",
      highlights: [
        {
          title: "Parking Space Detection (PSD) Algorithms (Bosch)",
          desc: "C++ software development for real-time Parking Space Detection (PSD) including the subfunctions Parkout (POP), Anywhere Parking Trailer (APT), and Garage Park Assist (GPA), as well as designing custom debug visualizers for error analysis."
        },
        {
          title: "Intelligent & Remote Park Assist (IPA / RPA - Bosch)",
          desc: "Sustainable bug fixing, technical requirement definition, and change request implementation for production-grade driver assistance systems."
        },
        {
          title: "Platform Basic SW & Vehicle Interfaces (FD3 - Bosch)",
          desc: "Architected and implemented vehicle-internal inter-component communication interfaces (COM, DIAG, FM, PDM) on the next-generation FD3 platform."
        },
        {
          title: "PoDIUM 5G Cloud & Infrastructure Streaming (Bosch)",
          desc: "Implemented 5G high-throughput sensor streaming from vehicles to the cloud and hardened parking garage server communication interfaces."
        },
        {
          title: "CI/CD & DevOps Automation (AVP - Bosch)",
          desc: "Setup and automated robust Jenkins pipelines for static code analysis, unit testing, and Docker containerization with Conan package management and Python in Automated Valet Parking."
        },
        {
          title: "Robotics Demonstrator Environments (FHWS)",
          desc: "Built and extended testing environments for autonomous mobile robots with ROS, C++, and Python on Linux; supervised automation labs."
        },
        {
          title: "Driving Scenario Visualizer & Bus Data Tools (IAV GmbH)",
          desc: "Developed graphical driving scenario simulation tools with Python/Qt and vehicle bus signal processing tools with SQL, CANape, and CANoe."
        }
      ],
      links: [
        { label: "Bosch Automated Valet Parking (AVP) Official", url: "https://www.bosch-mobility.com/en/solutions/parking/automated-valet-parking/" },
        { label: "EU Project PoDIUM (5G Connected Mobility)", url: "https://podium-project.eu/" }
      ],
      tags: ["C++14/17", "ADAS", "Automated Valet Parking", "Docker", "Jenkins", "Python", "5G Cloud", "Conan", "ROS", "CANape"]
    },

    sector2: {
      id: "sector2",
      name: "Sector 02: Academic Education",
      category: "Academics & Research",
      shortTitle: "FHWS Robotics & 3D Vision Lab",
      timeframe: "2016 — 2022",
      role: "M.Eng. (Grade 1.3) & B.Eng. (Grade 2.1)",
      company: "FHWS (University of Applied Sciences Würzburg-Schweinfurt)",
      location: "Schweinfurt, Germany",
      icon: "robot-arm",
      color: "#a855f7",
      summary: "Master of Engineering in Electrical Engineering & Information Technology (Specialization: Robotics & 3D Vision) and Bachelor of Engineering (Specialization: Automation Technology).",
      highlights: [
        {
          title: "Master of Engineering (Grade: 1.3 - ECTS A)",
          desc: "Specialization in Robotics & 3D Computer Vision at FHWS. Master thesis: Handling of components with a mobile robot in the context of the international RoboCup@Work competition."
        },
        {
          title: "RoboCup@Work World Competition — 4th Place (Team SWOT)",
          desc: "Responsible for 3D Vision & Object Recognition (PCL) and 6-DoF Robotic Grasping (UR3e Arm). Achieved 4th place worldwide in mobile manipulation."
        },
        {
          title: "3D Vision & Point Cloud Library (PCL)",
          desc: "Developed 3D point cloud segmentation, object pose estimation, and obstacle avoidance pipelines using ROS and C++ on Linux."
        },
        {
          title: "Bachelor of Engineering (Grade: 2.1)",
          desc: "Specialization in Automation Technology. Bachelor thesis: Development of a graphical program for the display, analysis, and signal processing of automotive bus signals with an intuitive UI."
        }
      ],
      links: [
        { label: "Read RoboCup@Work Article & Video", url: "article.html?id=robocup" },
        { label: "Official RoboCup@Work League", url: "https://atwork.robocup.org/" }
      ],
      tags: ["ROS", "PCL", "3D Vision", "Mobile Manipulation", "RoboCup@Work", "C++", "Linux", "Qt"]
    },

    sector3: {
      id: "sector3",
      name: "Sector 03: IT & Technical Skills",
      category: "Skills & Technologies",
      shortTitle: "Technical Power Matrix",
      timeframe: "Continuous Mastery",
      role: "Core Stack & Engineering Toolchain",
      company: "Engineering Architecture",
      location: "Embedded & Cloud Stack",
      icon: "cpu-chip",
      color: "#00ff88",
      summary: "Full-spectrum software engineering competencies spanning embedded real-time algorithms, 3D perception, scalable CI/CD pipelines, and modern agile workflows.",
      skills: [
        {
          group: "Programming Languages",
          items: ["C++14/17 (Advanced)", "Python (Advanced)", "Bash Scripting", "SQL", "JavaScript (ES6+)", "HTML5 / CSS3", "VBA"]
        },
        {
          group: "Tools & Frameworks",
          items: ["ROS (Robot Operating System)", "PCL (Point Cloud Library)", "Docker", "Jenkins", "Conan", "Git", "Qt", "CANape", "CANoe", "Matlab/Simulink"]
        },
        {
          group: "Operating Systems & Platforms",
          items: ["Linux / Ubuntu (Advanced)", "Windows (Confident)", "Embedded Real-Time ROS Nodes", "Docker Containers"]
        },
        {
          group: "Methodologies & Architecture",
          items: ["CI/CD Pipeline Design", "Agile (Scrum / Kanban)", "Clean Code", "Test Automation", "Defensive Programming", "Automotive SPICE"]
        }
      ],
      tags: ["C++17", "Python", "ROS", "PCL", "Docker", "Jenkins", "Linux", "CI/CD", "CANape"]
    },

    sector4: {
      id: "sector4",
      name: "Sector 04: Qualifications & Certificates",
      category: "Certifications & Credentials",
      shortTitle: "Credentials & Certifications Vault",
      timeframe: "Verified Qualifications",
      role: "Certified Scrum Master, Developer & Instructor",
      company: "Scrum.org / IHK / UC Davis",
      location: "International Standards",
      icon: "certificate-shield",
      color: "#f59e0b",
      summary: "Internationally accredited credentials in agile project management, software development, pedagogy, and data analysis.",
      certifications: [
        {
          title: "Professional Scrum Developer I (PSD I) & Scrum Master I (PSM I)",
          issuer: "Scrum.org",
          desc: "Certified knowledge and hands-on application of Scrum principles, sprint dynamics, and agile project delivery in software engineering."
        },
        {
          title: "Instructor Aptitude Certification (AEVO / AdA-Schein)",
          issuer: "IHK Würzburg-Schweinfurt",
          desc: "Official proof of vocational and occupational pedagogical qualifications for training and mentoring junior engineering professionals."
        },
        {
          title: "Deep Learning with TensorFlow Workshop",
          issuer: "FH Würzburg-Schweinfurt",
          desc: "Coursework covering Artificial Intelligence and Machine Learning fundamentals, neural network concepts, and computer vision workflows."
        },
        {
          title: "SQL for Data Science Certification",
          issuer: "University of California, Davis (UC Davis)",
          desc: "Specialized coursework in relational database querying, filtering, aggregation, and data analysis pipelines."
        },
        {
          title: "Mobility & Driving",
          issuer: "German Federal Driving License Authority",
          desc: "Driver's license class B (Automotive passenger vehicles)."
        }
      ],
      tags: ["Scrum Master", "Scrum Developer", "AEVO AdA", "TensorFlow Workshop", "SQL", "Driver Class B"]
    },

    sector5: {
      id: "sector5",
      name: "Sector 05: Volunteering & Interests",
      category: "Lifestyle & Community",
      shortTitle: "Off-Duty Basecamp & Passions",
      timeframe: "Community & Beyond",
      role: "Community Member & Physical Problem Solver",
      company: "Life, Sports & Culture",
      location: "Worldwide",
      icon: "compass-spark",
      color: "#ff007f",
      summary: "Balancing complex algorithmic engineering with intercultural student mentoring, bouldering problem-solving, competitive partner dancing, and travel photography.",
      highlights: [
        {
          title: "International Students Club (FHWS ISC)",
          desc: "Active member organizing intercultural events, integration assistance, and social activities for international students in Schweinfurt."
        },
        {
          title: "🧗 Bouldering & Athletic Agility",
          desc: "Tackling intricate boulder routes where physical movement, spatial awareness, and dynamic route solving intersect."
        },
        {
          title: "💃 Partner Dancing (Standard & Latin, Salsa, Bachata, WCS)",
          desc: "Passionate partner dancer across Ballroom Standard & Latin, Salsa, Bachata, Kizomba, and competitive West Coast Swing (WSDC Registered Competitor)."
        },
        {
          title: "🌍 Travel & Photo Expeditions",
          desc: "Exploring world destinations and capturing scenic landscapes, including the Nordic fjords, architecture, and museums of Oslo."
        },
        {
          title: "🧩 Advent of Code & Algorithmic Puzzles",
          desc: "Solving yearly festive programming puzzles to explore new paradigms and keep algorithmic thinking sharp."
        }
      ],
      links: [
        { label: "Read Partner Dancing & WSDC Competition Article", url: "article.html?id=dancing" },
        { label: "Explore Oslo Travel & Photo Gallery", url: "article.html?id=oslo" },
        { label: "Advent of Code Solutions on GitHub", url: "https://github.com/krauluk1/AoC-2021" }
      ],
      tags: ["Partner Dance", "West Coast Swing", "WSDC Competitor", "Bouldering", "ISC Volunteering", "Travel Photography", "Advent of Code"]
    }
  },

  subItems: [
    { id: "sub_psd", sectorId: "sector1", x: 560, y: 620, label: "PSD Algorithm", category: "Work Experience", color: "#00e5ff", desc: "Parking Space Detection: C++ algorithmic development for Parkout (POP), Anywhere Parking Trailer (APT), and GPA." },
    { id: "sub_ipa", sectorId: "sector1", x: 840, y: 600, label: "IPA / RPA", category: "Work Experience", color: "#00e5ff", desc: "Intelligent & Remote Park Assist: System maintenance, bug-fixing, and technical requirement specifications." },
    { id: "sub_fd3", sectorId: "sector1", x: 580, y: 800, label: "FD3 Platform", category: "Work Experience", color: "#00e5ff", desc: "Base SW Interfaces: Inter-component communication (COM, DIAG, FM, PDM) on the next-gen FD3 platform." },
    { id: "sub_podium", sectorId: "sector1", x: 820, y: 790, label: "5G PoDIUM", category: "Work Experience", color: "#00e5ff", desc: "5G Sensor Streaming: High-speed cloud data streaming and parking garage server security hardening." },
    { id: "sub_avp", sectorId: "sector1", x: 700, y: 550, label: "AVP CI/CD", category: "Work Experience", color: "#00e5ff", desc: "Automated Valet Parking: Jenkins pipeline automation with Docker, Conan package manager, and Python." },
    { id: "sub_iav", sectorId: "sector1", x: 700, y: 880, label: "IAV ADAS", category: "Work Experience", color: "#00e5ff", desc: "Driving Scenario Visualizer in Python/Qt & CANape/CANoe bus signal processing tools." },

    { id: "sub_meng", sectorId: "sector2", x: 2360, y: 620, label: "M.Eng. 1.3", category: "Education", color: "#a855f7", desc: "Master of Engineering: Electrical & Information Technology (Specialization in Robotics & 3D Vision, Grade 1.3)." },
    { id: "sub_robocup", sectorId: "sector2", x: 2640, y: 610, label: "RoboCup 4th", category: "Education", color: "#a855f7", desc: "RoboCup@Work 2021: 4th place worldwide with Team SWOT in 3D Vision (PCL) and robotic manipulation." },
    { id: "sub_pcl", sectorId: "sector2", x: 2380, y: 790, label: "PCL 3D Vision", category: "Education", color: "#a855f7", desc: "Point Cloud Library: 3D point cloud segmentation, object pose determination, and spatial reconstruction." },
    { id: "sub_beng", sectorId: "sector2", x: 2620, y: 800, label: "B.Eng. 2.1", category: "Education", color: "#a855f7", desc: "Bachelor of Engineering: Electrical Engineering & Automation Technology (Grade 2.1)." },
    { id: "sub_bthesis", sectorId: "sector2", x: 2500, y: 890, label: "Bus Signals", category: "Education", color: "#a855f7", desc: "Bachelor Thesis: Interactive software for automotive bus signal display, analysis, and processing." },

    { id: "sub_cpp", sectorId: "sector3", x: 580, y: 2400, label: "C++14/17", category: "IT Skills", color: "#00ff88", desc: "Advanced modern C++ programming: Low-latency embedded algorithms, clean memory management, and OOP." },
    { id: "sub_python", sectorId: "sector3", x: 820, y: 2390, label: "Python", category: "IT Skills", color: "#00ff88", desc: "Advanced Python: Data processing, tool development, PyQt UI frameworks, automation, and testing." },
    { id: "sub_ros", sectorId: "sector3", x: 570, y: 2600, label: "ROS Nodes", category: "IT Skills", color: "#00ff88", desc: "Robot Operating System (Melodic/Noetic): Node architecture, cartesian_ros_control, and SLAM navigation." },
    { id: "sub_docker", sectorId: "sector3", x: 830, y: 2610, label: "Docker & Jenkins", category: "IT Skills", color: "#00ff88", desc: "Containerized CI/CD: Automated builds, multi-stage pipelines, static analysis, and Conan caching." },
    { id: "sub_linux", sectorId: "sector3", x: 700, y: 2700, label: "Linux / Ubuntu", category: "IT Skills", color: "#00ff88", desc: "Linux power user: Shell scripting, kernel interface configuration, Git workflows, and package management." },

    { id: "sub_scrum", sectorId: "sector4", x: 2370, y: 2400, label: "PSM I & PSD I", category: "Certifications", color: "#f59e0b", desc: "Scrum.org certified Professional Scrum Master I & Professional Scrum Developer I." },
    { id: "sub_aevo", sectorId: "sector4", x: 2630, y: 2410, label: "AEVO AdA", category: "Certifications", color: "#f59e0b", desc: "IHK certified Instructor Aptitude (AdA-Schein nach AEVO) for mentoring and training apprentices." },
    { id: "sub_deeplearn", sectorId: "sector4", x: 2360, y: 2600, label: "TensorFlow Workshop", category: "Certifications", color: "#f59e0b", desc: "Deep Learning with TensorFlow workshop: Introduction to neural network concepts and vision workflows." },
    { id: "sub_sql", sectorId: "sector4", x: 2640, y: 2590, label: "SQL Data Science", category: "Certifications", color: "#f59e0b", desc: "UC Davis certified SQL for Data Science: Relational schema querying, join optimization, and analytics." },
    { id: "sub_driver", sectorId: "sector4", x: 2500, y: 2700, label: "Driver Class B", category: "Certifications", color: "#f59e0b", desc: "German Driver's License Class B (Passenger vehicles)." },

    { id: "sub_isc", sectorId: "sector5", x: 1470, y: 380, label: "ISC Volunteer", category: "Interests", color: "#ff007f", desc: "International Students Club (FHWS): Cross-cultural integration and event coordination for international students." },
    { id: "sub_boulder", sectorId: "sector5", x: 1730, y: 370, label: "Bouldering", category: "Interests", color: "#ff007f", desc: "Bouldering & Fitness: Spatial agility, physical endurance, and dynamic route solving." },
    { id: "sub_dance", sectorId: "sector5", x: 1460, y: 520, label: "Partner Dance & WCS", category: "Interests", color: "#ff007f", desc: "Partner Dancing: Standard & Latin, Salsa, Bachata, Kizomba, and West Coast Swing (WSDC Registered Competitor, 1 Point at BaroqueSwing)." },
    { id: "sub_travel", sectorId: "sector5", x: 1740, y: 530, label: "Oslo Travel", category: "Interests", color: "#ff007f", desc: "Travel Photography: Exploring Scandinavian culture, modern architecture, and scenic fjord landscapes in Oslo." },
    { id: "sub_aoc", sectorId: "sector5", x: 1600, y: 280, label: "Advent of Code", category: "Interests", color: "#ff007f", desc: "Advent of Code: Annual algorithmic puzzle challenges tackling graphs, trees, and optimization algorithms." }
  ],

  socialLinks: [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/lukaskraus97/", icon: "fab fa-linkedin" },
    { name: "Xing", url: "https://www.xing.com/profile/Lukas_Kraus13/", icon: "fab fa-xing-square" }
  ]
};
