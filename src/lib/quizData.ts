export type QuestionType = "text" | "select" | "multi-select" | "rating" | "textarea";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  category: string;
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  difficulty?: "basic" | "intermediate" | "advanced";
}

export const questions: Question[] = [
  // ═══════════════════════════════════════════════
  // BASIC (Questions 1-3) — Easy warm-up questions
  // ═══════════════════════════════════════════════
  {
    id: "name",
    category: "Introduction",
    difficulty: "basic",
    question: "What's your name?",
    type: "text",
    placeholder: "e.g., Rahul Sharma",
    required: true,
    helperText: "Just your first name is fine too",
  },
  {
    id: "major",
    category: "Introduction",
    difficulty: "basic",
    question: "What's your major or field of study?",
    type: "select",
    options: [
      { value: "cs", label: "Computer Science" },
      { value: "it", label: "Information Technology" },
      { value: "ece", label: "Electronics & Communication" },
      { value: "ee", label: "Electrical Engineering" },
      { value: "me", label: "Mechanical Engineering" },
      { value: "ce", label: "Civil Engineering" },
      { value: "chem", label: "Chemical Engineering" },
      { value: "biotech", label: "Biotechnology" },
      { value: "aids", label: "AI & Data Science" },
      { value: "other", label: "Other Engineering" },
    ],
    required: true,
  },
  {
    id: "year",
    category: "Introduction",
    difficulty: "basic",
    question: "What year are you currently in?",
    type: "select",
    options: [
      { value: "1st", label: "1st Year" },
      { value: "2nd", label: "2nd Year" },
      { value: "3rd", label: "3rd Year" },
      { value: "final", label: "Final Year" },
      { value: "graduated", label: "Recently Graduated" },
    ],
    required: true,
  },

  // ═══════════════════════════════════════════════════
  // INTERMEDIATE (Questions 4-10) — Skills & preferences
  // ═══════════════════════════════════════════════════
  {
    id: "languages",
    category: "Technical Skills",
    difficulty: "intermediate",
    question: "Which programming languages are you proficient in?",
    type: "multi-select",
    options: [
      { value: "python", label: "Python" },
      { value: "javascript", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "java", label: "Java" },
      { value: "c", label: "C" },
      { value: "cpp", label: "C++" },
      { value: "csharp", label: "C#" },
      { value: "go", label: "Go" },
      { value: "rust", label: "Rust" },
      { value: "kotlin", label: "Kotlin" },
      { value: "swift", label: "Swift" },
      { value: "ruby", label: "Ruby" },
      { value: "php", label: "PHP" },
      { value: "scala", label: "Scala" },
      { value: "r", label: "R" },
      { value: "matlab", label: "MATLAB" },
      { value: "dart", label: "Dart" },
      { value: "perl", label: "Perl" },
      { value: "haskell", label: "Haskell" },
      { value: "lua", label: "Lua" },
      { value: "elixir", label: "Elixir" },
      { value: "sql", label: "SQL" },
      { value: "bash", label: "Bash / Shell" },
      { value: "assembly", label: "Assembly" },
      { value: "objective_c", label: "Objective-C" },
      { value: "vhdl", label: "VHDL / Verilog" },
      { value: "solidity", label: "Solidity" },
      { value: "julia", label: "Julia" },
      { value: "zig", label: "Zig" },
      { value: "clojure", label: "Clojure" },
      { value: "fortran", label: "Fortran" },
      { value: "cobol", label: "COBOL" },
      { value: "groovy", label: "Groovy" },
      { value: "f_sharp", label: "F#" },
      { value: "erlang", label: "Erlang" },
    ],
    required: true,
    helperText: "Select all languages you've worked with",
  },
  {
    id: "favorite_subjects",
    category: "Education",
    difficulty: "intermediate",
    question: "Which B.Tech subjects have you enjoyed the most?",
    type: "multi-select",
    options: [
      { value: "dsa", label: "Data Structures & Algorithms" },
      { value: "ml", label: "Machine Learning / AI" },
      { value: "dbms", label: "Database Management Systems" },
      { value: "os", label: "Operating Systems" },
      { value: "cn", label: "Computer Networks" },
      { value: "oops", label: "Object-Oriented Programming" },
      { value: "toc", label: "Theory of Computation" },
      { value: "compiler", label: "Compiler Design" },
      { value: "se", label: "Software Engineering" },
      { value: "discrete_math", label: "Discrete Mathematics" },
      { value: "probability", label: "Probability & Statistics" },
      { value: "linear_algebra", label: "Linear Algebra" },
      { value: "digital_electronics", label: "Digital Electronics" },
      { value: "microprocessor", label: "Microprocessors & Microcontrollers" },
      { value: "signals", label: "Signals & Systems" },
      { value: "control_systems", label: "Control Systems" },
      { value: "web_tech", label: "Web Technologies" },
      { value: "cloud_computing", label: "Cloud Computing" },
      { value: "cybersecurity", label: "Cybersecurity" },
      { value: "embedded", label: "Embedded Systems" },
      { value: "computer_graphics", label: "Computer Graphics" },
      { value: "computer_architecture", label: "Computer Architecture" },
      { value: "distributed_systems", label: "Distributed Systems" },
      { value: "iot", label: "Internet of Things" },
      { value: "data_mining", label: "Data Mining & Warehousing" },
      { value: "image_processing", label: "Image Processing" },
      { value: "nlp", label: "Natural Language Processing" },
      { value: "robotics", label: "Robotics" },
    ],
    required: true,
    helperText: "Select your top 3-5 favorite subjects",
  },
  {
    id: "proficiency",
    category: "Technical Skills",
    difficulty: "intermediate",
    question: "How would you rate your overall coding proficiency?",
    type: "select",
    options: [
      { value: "beginner", label: "Beginner — I can write simple programs" },
      { value: "intermediate", label: "Intermediate — I've built projects independently" },
      { value: "advanced", label: "Advanced — I'm comfortable with complex architectures" },
      { value: "expert", label: "Expert — I've shipped production-grade software" },
    ],
    required: true,
  },
  {
    id: "tools",
    category: "Technical Skills",
    difficulty: "intermediate",
    question: "What tools & frameworks do you use regularly?",
    type: "multi-select",
    options: [
      { value: "react", label: "React / Next.js" },
      { value: "angular", label: "Angular" },
      { value: "vue", label: "Vue.js" },
      { value: "node", label: "Node.js / Express" },
      { value: "django", label: "Django / Flask" },
      { value: "spring", label: "Spring Boot" },
      { value: "tensorflow", label: "TensorFlow / PyTorch" },
      { value: "docker", label: "Docker / Kubernetes" },
      { value: "aws", label: "AWS / GCP / Azure" },
      { value: "git", label: "Git / GitHub" },
      { value: "figma", label: "Figma / Design Tools" },
      { value: "linux", label: "Linux" },
      { value: "flutter", label: "Flutter / React Native" },
      { value: "unity", label: "Unity / Unreal Engine" },
      { value: "tableau", label: "Tableau / Power BI" },
    ],
    helperText: "Select all that apply",
  },
  {
    id: "interests",
    category: "Interests",
    difficulty: "intermediate",
    question: "What areas of tech excite you the most?",
    type: "multi-select",
    options: [
      { value: "ai_ml", label: "AI & Machine Learning" },
      { value: "web_dev", label: "Web Development" },
      { value: "mobile", label: "Mobile App Development" },
      { value: "data", label: "Data Science & Analytics" },
      { value: "security", label: "Cybersecurity" },
      { value: "cloud", label: "Cloud & DevOps" },
      { value: "iot", label: "IoT & Embedded" },
      { value: "blockchain", label: "Blockchain / Web3" },
      { value: "game", label: "Game Development" },
      { value: "product", label: "Product Management" },
      { value: "arvr", label: "AR / VR / Metaverse" },
      { value: "quantum", label: "Quantum Computing" },
    ],
    required: true,
    helperText: "Select 2-4 that excite you most",
  },
  {
    id: "work_style",
    category: "Work Preferences",
    difficulty: "intermediate",
    question: "How would you describe your preferred work style?",
    type: "select",
    options: [
      { value: "analytical", label: "Analytical — I love solving complex logical problems" },
      { value: "creative", label: "Creative — I enjoy building beautiful, user-facing products" },
      { value: "mixed", label: "Mixed — I like a balance of both" },
      { value: "research", label: "Research — I love exploring new ideas and publishing findings" },
    ],
    required: true,
  },

  // ═══════════════════════════════════════════════════════
  // ADVANCED (Questions 11-20) — Deep, thought-provoking
  // ═══════════════════════════════════════════════════════
  {
    id: "projects",
    category: "Experience",
    difficulty: "advanced",
    question: "Describe your most significant project(s). What problem did you solve and what was the technical architecture?",
    type: "textarea",
    placeholder: "e.g., Built a recommendation system using Python and collaborative filtering with a Flask backend + React frontend, deployed on AWS EC2 with PostgreSQL...",
    required: true,
    helperText: "Be detailed — mention the tech stack, scale, and impact",
  },
  {
    id: "hackathons",
    category: "Experience",
    difficulty: "advanced",
    question: "Have you participated in hackathons, coding competitions, or open-source contributions?",
    type: "textarea",
    placeholder: "e.g., Won 2nd place at college hackathon building a healthcare chatbot, contributed to scikit-learn, participated in Google Summer of Code...",
  },
  {
    id: "work_pace",
    category: "Work Preferences",
    difficulty: "advanced",
    question: "What kind of environment do you thrive in?",
    type: "select",
    options: [
      { value: "fast", label: "Fast-paced startup — Chaos, rapid iteration, high ownership" },
      { value: "moderate", label: "Mid-size company — Balanced pace with clear goals" },
      { value: "structured", label: "Large corporate — Methodical, well-planned, deep specialization" },
      { value: "freelance", label: "Freelance / Remote — Independence and flexibility" },
    ],
    required: true,
  },
  {
    id: "collaboration",
    category: "Work Preferences",
    difficulty: "advanced",
    question: "Do you prefer working in teams or solo?",
    type: "select",
    options: [
      { value: "team", label: "Team — I thrive in collaborative environments" },
      { value: "solo", label: "Solo — I do my best work independently" },
      { value: "lead", label: "Lead — I prefer guiding a team" },
      { value: "mixed", label: "Mixed — Depends on the task" },
    ],
    required: true,
  },
  {
    id: "salary_importance",
    category: "Career Goals",
    difficulty: "advanced",
    question: "How do you prioritize salary vs. passion vs. stability?",
    type: "select",
    options: [
      { value: "salary_first", label: "Salary first — I want to maximize earnings early" },
      { value: "passion_first", label: "Passion first — I'll take less pay for meaningful work" },
      { value: "stability_first", label: "Stability first — Predictable income and job security" },
      { value: "balanced", label: "Balanced — A mix of all three" },
    ],
    required: true,
  },
  {
    id: "growth_priority",
    category: "Career Goals",
    difficulty: "advanced",
    question: "Where do you see yourself in 5-7 years?",
    type: "select",
    options: [
      { value: "technical", label: "Deep technical expert / Staff Engineer / Architect" },
      { value: "leadership", label: "Engineering Manager / VP of Engineering" },
      { value: "entrepreneurial", label: "Running my own startup or product" },
      { value: "research", label: "Research scientist / Academic / PhD" },
      { value: "consulting", label: "Independent consultant / Freelancer" },
    ],
    required: true,
  },
  {
    id: "constraints",
    category: "Reality Check",
    difficulty: "advanced",
    question: "Are there any constraints or pressures influencing your career choice?",
    type: "textarea",
    placeholder: "e.g., Family wants me to get a stable corporate job, prefer to stay in my home city, financial constraints, visa limitations...",
    helperText: "Be honest — this helps us tailor recommendations realistically",
  },
  {
    id: "failure_handling",
    category: "Mindset",
    difficulty: "advanced",
    question: "How do you handle failure or rejection in your career journey?",
    type: "select",
    options: [
      { value: "resilient", label: "I bounce back fast — failure motivates me" },
      { value: "reflective", label: "I reflect deeply and adjust my approach" },
      { value: "struggle", label: "I struggle initially but eventually recover" },
      { value: "avoid", label: "I try to minimize risk and avoid failure" },
    ],
    required: true,
  },
  {
    id: "pre_confidence",
    category: "Self-Assessment",
    difficulty: "advanced",
    question: "How confident are you about your career direction right now?",
    type: "rating",
    required: true,
    helperText: "1 = Completely lost, 10 = Crystal clear",
  },
  {
    id: "confusion_areas",
    category: "Self-Assessment",
    difficulty: "advanced",
    question: "What's the single biggest thing holding you back from feeling confident about your career path?",
    type: "textarea",
    placeholder: "e.g., I can't decide between ML and web dev, I'm not sure if my skills are good enough for top companies, I don't know what the job market looks like for my interests...",
    required: true,
    helperText: "Be specific — vague answers lead to vague recommendations",
  },
];

export interface CareerRecommendation {
  rank: number;
  career_title: string;
  fit_score: number;
  why_fits: string;
  role_description: string;
  skills_you_have: string[];
  skills_to_develop: string[];
  career_outlook: {
    salary_entry: string;
    salary_experienced: string;
    growth_potential: string;
    work_life_balance: string;
    job_availability: string;
  };
  next_steps: string[];
}

export interface AnalysisResult {
  recommendations: CareerRecommendation[];
  summary: {
    top_recommendation: string;
    confidence_level: "High" | "Medium" | "Low";
    confidence_explanation: string;
  };
}

export const mockResults: AnalysisResult = {
  recommendations: [
    {
      rank: 1,
      career_title: "Machine Learning Engineer",
      fit_score: 92,
      why_fits: "Your strong foundation in Python, hands-on ML projects, and genuine excitement for AI make this an exceptional match. Your analytical work style and preference for deep technical growth align perfectly with the daily demands of an ML Engineer role.",
      role_description: "Design, build, and deploy machine learning models to solve real-world business problems. Collaborate with data scientists and software engineers to productionize AI solutions at scale.",
      skills_you_have: [
        "Python programming (Advanced)",
        "Machine Learning fundamentals",
        "Data Structures & Algorithms",
        "Project experience with real ML applications",
      ],
      skills_to_develop: [
        "MLOps and deployment (Docker, Kubernetes)",
        "Cloud ML platforms (AWS SageMaker, GCP Vertex AI)",
        "Production ML frameworks (TensorFlow Serving, MLflow)",
        "System design for ML pipelines",
      ],
      career_outlook: {
        salary_entry: "₹8-15 LPA",
        salary_experienced: "₹20-45 LPA (3-5 years)",
        growth_potential: "Very High",
        work_life_balance: "Moderate",
        job_availability: "High — Growing demand in Bangalore, Hyderabad, Pune",
      },
      next_steps: [
        "Build 2-3 end-to-end ML projects (training → deployment) and host on GitHub",
        "Learn Docker basics and deploy one ML model to a cloud platform",
        "Contribute to 1-2 open-source ML projects (Hugging Face, scikit-learn)",
        "Complete Andrew Ng's ML Specialization if not done already",
        "Apply for ML Engineer internships at AI startups or product companies",
        "Practice ML system design interview questions",
      ],
    },
    {
      rank: 2,
      career_title: "Full-Stack Developer",
      fit_score: 81,
      why_fits: "Your JavaScript skills and web development projects show real aptitude for building user-facing products. Your creative side combined with technical depth makes full-stack a strong fit — especially given the high job availability and family-friendly stability.",
      role_description: "Build both frontend interfaces and backend APIs for web applications. Own features end-to-end, from database design to pixel-perfect UI implementation.",
      skills_you_have: [
        "JavaScript / TypeScript",
        "React framework experience",
        "Database fundamentals",
        "Git version control",
      ],
      skills_to_develop: [
        "Backend frameworks (Node.js/Express or Django)",
        "Cloud deployment (AWS, Vercel, Railway)",
        "System design fundamentals",
        "Testing and CI/CD pipelines",
      ],
      career_outlook: {
        salary_entry: "₹6-12 LPA",
        salary_experienced: "₹18-35 LPA (3-5 years)",
        growth_potential: "High",
        work_life_balance: "Good",
        job_availability: "Very High — Largest job market segment",
      },
      next_steps: [
        "Build a full-stack project with auth, database, and deployment",
        "Learn a backend framework deeply (Node.js or Django)",
        "Deploy a project to production using Vercel or AWS",
        "Contribute to open-source web projects",
        "Practice system design and DSA for interviews",
      ],
    },
    {
      rank: 3,
      career_title: "Data Scientist",
      fit_score: 76,
      why_fits: "Your interest in data, statistics background, and Python skills provide a solid foundation. Your analytical mindset and curiosity about patterns in data make this a natural fit, though you'd benefit from deeper statistical modeling experience.",
      role_description: "Extract insights from large datasets, build statistical models, and communicate findings to stakeholders. Bridge the gap between raw data and business decisions.",
      skills_you_have: [
        "Python programming",
        "Statistical thinking",
        "SQL and database knowledge",
        "Data visualization basics",
      ],
      skills_to_develop: [
        "Advanced statistics and probability",
        "Business domain knowledge",
        "Data storytelling and presentation",
        "Tools: Pandas, NumPy, Matplotlib, Tableau",
      ],
      career_outlook: {
        salary_entry: "₹7-14 LPA",
        salary_experienced: "₹18-35 LPA (3-5 years)",
        growth_potential: "High",
        work_life_balance: "Good",
        job_availability: "High — Especially in fintech, e-commerce, healthcare",
      },
      next_steps: [
        "Complete a data science project using real-world datasets (Kaggle)",
        "Learn advanced pandas, NumPy, and visualization libraries",
        "Take a statistics course (Khan Academy or MIT OCW)",
        "Build a portfolio of 3-4 data analysis projects",
        "Practice SQL extensively — it's crucial for interviews",
      ],
    },
    {
      rank: 4,
      career_title: "DevOps Engineer",
      fit_score: 68,
      why_fits: "Your Linux experience and interest in cloud computing show alignment. DevOps combines your analytical problem-solving skills with infrastructure automation — and offers excellent salary growth. However, your profile shows stronger alignment with development roles.",
      role_description: "Automate software delivery pipelines, manage cloud infrastructure, and ensure system reliability. Bridge development and operations teams for faster, safer deployments.",
      skills_you_have: [
        "Linux fundamentals",
        "Basic scripting (Python/Bash)",
        "Git version control",
      ],
      skills_to_develop: [
        "Docker & Kubernetes in depth",
        "CI/CD tools (Jenkins, GitHub Actions)",
        "Infrastructure as Code (Terraform, Ansible)",
        "Cloud platforms (AWS/GCP certifications)",
        "Monitoring tools (Prometheus, Grafana)",
      ],
      career_outlook: {
        salary_entry: "₹6-12 LPA",
        salary_experienced: "₹20-40 LPA (3-5 years)",
        growth_potential: "Very High",
        work_life_balance: "Moderate",
        job_availability: "High — Critical role in every tech company",
      },
      next_steps: [
        "Set up a CI/CD pipeline for one of your projects",
        "Learn Docker thoroughly and containerize an application",
        "Get an AWS Cloud Practitioner certification",
        "Practice with Terraform for infrastructure automation",
        "Join DevOps communities (DevOps subreddit, local meetups)",
      ],
    },
  ],
  summary: {
    top_recommendation: "Machine Learning Engineer",
    confidence_level: "High",
    confidence_explanation:
      "Your profile shows clear alignment with AI/ML careers. You have relevant project experience, strong Python skills, and a genuine passion for the field. Your analytical mindset and preference for deep technical work reinforce this direction. We're confident these recommendations reflect your strengths.",
  },
};
