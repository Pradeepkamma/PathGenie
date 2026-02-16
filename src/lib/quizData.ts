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
}

export const questions: Question[] = [
  {
    id: "major",
    category: "Education",
    question: "What's your major or field of study?",
    type: "select",
    options: [
      { value: "cs", label: "Computer Science" },
      { value: "it", label: "Information Technology" },
      { value: "ece", label: "Electronics & Communication" },
      { value: "ee", label: "Electrical Engineering" },
      { value: "me", label: "Mechanical Engineering" },
      { value: "other", label: "Other Engineering" },
    ],
    required: true,
  },
  {
    id: "year",
    category: "Education",
    question: "What year are you currently in?",
    type: "select",
    options: [
      { value: "2nd", label: "2nd Year" },
      { value: "3rd", label: "3rd Year" },
      { value: "final", label: "Final Year" },
      { value: "graduated", label: "Recently Graduated" },
    ],
    required: true,
  },
  {
    id: "favorite_subjects",
    category: "Education",
    question: "Which subjects have you enjoyed the most?",
    type: "multi-select",
    options: [
      { value: "dsa", label: "Data Structures & Algorithms" },
      { value: "ml", label: "Machine Learning / AI" },
      { value: "dbms", label: "Databases (DBMS)" },
      { value: "os", label: "Operating Systems" },
      { value: "networks", label: "Computer Networks" },
      { value: "web", label: "Web Development" },
      { value: "security", label: "Cybersecurity" },
      { value: "math", label: "Mathematics / Statistics" },
      { value: "embedded", label: "Embedded Systems" },
      { value: "cloud", label: "Cloud Computing" },
    ],
    required: true,
    helperText: "Select all that apply",
  },
  {
    id: "languages",
    category: "Technical Skills",
    question: "Which programming languages are you proficient in?",
    type: "multi-select",
    options: [
      { value: "python", label: "Python" },
      { value: "javascript", label: "JavaScript / TypeScript" },
      { value: "java", label: "Java" },
      { value: "cpp", label: "C / C++" },
      { value: "go", label: "Go" },
      { value: "rust", label: "Rust" },
      { value: "sql", label: "SQL" },
      { value: "r", label: "R" },
    ],
    required: true,
    helperText: "Select all that apply",
  },
  {
    id: "proficiency",
    category: "Technical Skills",
    question: "How would you rate your overall coding proficiency?",
    type: "select",
    options: [
      { value: "beginner", label: "Beginner — I can write simple programs" },
      { value: "intermediate", label: "Intermediate — I've built projects independently" },
      { value: "advanced", label: "Advanced — I'm comfortable with complex architectures" },
    ],
    required: true,
  },
  {
    id: "tools",
    category: "Technical Skills",
    question: "What tools & frameworks do you use?",
    type: "multi-select",
    options: [
      { value: "react", label: "React / Next.js" },
      { value: "node", label: "Node.js / Express" },
      { value: "django", label: "Django / Flask" },
      { value: "tensorflow", label: "TensorFlow / PyTorch" },
      { value: "docker", label: "Docker / Kubernetes" },
      { value: "aws", label: "AWS / GCP / Azure" },
      { value: "git", label: "Git / GitHub" },
      { value: "figma", label: "Figma / Design Tools" },
      { value: "linux", label: "Linux" },
    ],
    helperText: "Select all that apply",
  },
  {
    id: "projects",
    category: "Experience",
    question: "Describe your most significant project(s). What did you build and what tech did you use?",
    type: "textarea",
    placeholder: "e.g., Built a recommendation system using Python and collaborative filtering for a college project...",
    required: true,
  },
  {
    id: "hackathons",
    category: "Experience",
    question: "Have you participated in hackathons, competitions, or open-source contributions?",
    type: "textarea",
    placeholder: "e.g., Won 2nd place at college hackathon building a healthcare chatbot, contributed to scikit-learn...",
  },
  {
    id: "interests",
    category: "Interests",
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
    ],
    required: true,
    helperText: "Select 2-4 that excite you most",
  },
  {
    id: "work_style",
    category: "Work Preferences",
    question: "How would you describe your preferred work style?",
    type: "select",
    options: [
      { value: "analytical", label: "Analytical — I love solving complex logical problems" },
      { value: "creative", label: "Creative — I enjoy building beautiful, user-facing products" },
      { value: "mixed", label: "Mixed — I like a balance of both" },
    ],
    required: true,
  },
  {
    id: "work_pace",
    category: "Work Preferences",
    question: "What pace of work do you prefer?",
    type: "select",
    options: [
      { value: "fast", label: "Fast-paced — Startup vibes, rapid iteration" },
      { value: "moderate", label: "Moderate — Balanced pace with clear goals" },
      { value: "structured", label: "Structured — Methodical, well-planned work" },
    ],
    required: true,
  },
  {
    id: "collaboration",
    category: "Work Preferences",
    question: "Do you prefer working in teams or solo?",
    type: "select",
    options: [
      { value: "team", label: "Team — I thrive in collaborative environments" },
      { value: "solo", label: "Solo — I do my best work independently" },
      { value: "mixed", label: "Mixed — I enjoy both depending on the task" },
    ],
    required: true,
  },
  {
    id: "salary_importance",
    category: "Career Goals",
    question: "How important is salary/compensation to you?",
    type: "select",
    options: [
      { value: "high", label: "Very important — Top priority" },
      { value: "moderate", label: "Important — But not the only factor" },
      { value: "low", label: "Less important — I prioritize learning & passion" },
    ],
    required: true,
  },
  {
    id: "growth_priority",
    category: "Career Goals",
    question: "What's your growth priority?",
    type: "select",
    options: [
      { value: "technical", label: "Deep technical expertise" },
      { value: "leadership", label: "Leadership & management" },
      { value: "entrepreneurial", label: "Starting my own venture" },
      { value: "balanced", label: "Balanced growth across areas" },
    ],
    required: true,
  },
  {
    id: "work_life_balance",
    category: "Career Goals",
    question: "How important is work-life balance to you?",
    type: "select",
    options: [
      { value: "high", label: "Very important — I value personal time" },
      { value: "moderate", label: "Moderate — I can hustle when needed" },
      { value: "low", label: "Less important — I'm willing to grind for growth" },
    ],
    required: true,
  },
  {
    id: "constraints",
    category: "Constraints",
    question: "Are there any constraints or pressures influencing your career choice?",
    type: "textarea",
    placeholder: "e.g., Family wants me to get a stable corporate job, prefer to stay in my home city, financial constraints...",
    helperText: "Be honest — this helps us tailor recommendations",
  },
  {
    id: "pre_confidence",
    category: "Current State",
    question: "How confident are you about your career direction right now?",
    type: "rating",
    required: true,
    helperText: "1 = Very confused, 10 = Very clear",
  },
  {
    id: "confusion_areas",
    category: "Current State",
    question: "What are you most confused or uncertain about?",
    type: "textarea",
    placeholder: "e.g., I don't know if I should go for ML or web dev, unsure about job market for my skills...",
    required: true,
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
