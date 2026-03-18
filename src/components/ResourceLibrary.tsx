import { motion } from "framer-motion";
import { BookOpen, ExternalLink, Play, Award, GraduationCap } from "lucide-react";
import type { CareerRecommendation } from "@/lib/quizData";

interface Resource {
  title: string;
  type: "course" | "certification" | "video" | "book";
  platform: string;
  url: string;
}

const RESOURCE_MAP: Record<string, Resource[]> = {
  // Generic fallback resources by keyword
};

const ICON_MAP = {
  course: GraduationCap,
  certification: Award,
  video: Play,
  book: BookOpen,
};

const TYPE_COLORS = {
  course: "bg-primary/10 text-primary",
  certification: "bg-success/10 text-success",
  video: "bg-highlight/10 text-highlight",
  book: "bg-accent/10 text-accent",
};

function getResourcesForCareer(title: string): Resource[] {
  const lower = title.toLowerCase();

  const resources: Resource[] = [];

  // ML / AI careers
  if (lower.includes("machine learning") || lower.includes("ml") || lower.includes("ai") || lower.includes("artificial intelligence")) {
    resources.push(
      { title: "Machine Learning Specialization", type: "course", platform: "Coursera (Andrew Ng)", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
      { title: "Deep Learning Specialization", type: "course", platform: "Coursera (deeplearning.ai)", url: "https://www.coursera.org/specializations/deep-learning" },
      { title: "TensorFlow Developer Certificate", type: "certification", platform: "Google", url: "https://www.tensorflow.org/certificate" },
      { title: "AWS Machine Learning Specialty", type: "certification", platform: "AWS", url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/" },
      { title: "3Blue1Brown Neural Networks", type: "video", platform: "YouTube", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi" },
      { title: "Hands-On ML with Scikit-Learn & TF", type: "book", platform: "O'Reilly", url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/" },
    );
  }

  // Data Science / Analytics
  if (lower.includes("data sci") || lower.includes("data analy") || lower.includes("analytics")) {
    resources.push(
      { title: "Google Data Analytics Certificate", type: "certification", platform: "Coursera", url: "https://www.coursera.org/professional-certificates/google-data-analytics" },
      { title: "Python for Data Science", type: "course", platform: "edX (IBM)", url: "https://www.edx.org/professional-certificate/ibm-data-science" },
      { title: "Statistics with R", type: "course", platform: "Coursera (Duke)", url: "https://www.coursera.org/specializations/statistics" },
      { title: "Kaggle Learn", type: "course", platform: "Kaggle", url: "https://www.kaggle.com/learn" },
      { title: "StatQuest with Josh Starmer", type: "video", platform: "YouTube", url: "https://www.youtube.com/@statquest" },
    );
  }

  // Software / Full-Stack / Web Dev
  if (lower.includes("software") || lower.includes("full-stack") || lower.includes("fullstack") || lower.includes("web dev") || lower.includes("frontend") || lower.includes("backend")) {
    resources.push(
      { title: "The Odin Project", type: "course", platform: "Free", url: "https://www.theodinproject.com/" },
      { title: "CS50: Intro to Computer Science", type: "course", platform: "Harvard / edX", url: "https://cs50.harvard.edu/" },
      { title: "AWS Cloud Practitioner", type: "certification", platform: "AWS", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/" },
      { title: "Fireship", type: "video", platform: "YouTube", url: "https://www.youtube.com/@Fireship" },
      { title: "Clean Code by Robert C. Martin", type: "book", platform: "Book", url: "https://www.oreilly.com/library/view/clean-code-a/9780136083238/" },
    );
  }

  // Cybersecurity
  if (lower.includes("security") || lower.includes("cyber") || lower.includes("penetration") || lower.includes("infosec")) {
    resources.push(
      { title: "CompTIA Security+", type: "certification", platform: "CompTIA", url: "https://www.comptia.org/certifications/security" },
      { title: "Google Cybersecurity Certificate", type: "certification", platform: "Coursera", url: "https://www.coursera.org/professional-certificates/google-cybersecurity" },
      { title: "TryHackMe", type: "course", platform: "TryHackMe", url: "https://tryhackme.com/" },
      { title: "NetworkChuck", type: "video", platform: "YouTube", url: "https://www.youtube.com/@NetworkChuck" },
    );
  }

  // Cloud / DevOps
  if (lower.includes("cloud") || lower.includes("devops") || lower.includes("sre") || lower.includes("infrastructure")) {
    resources.push(
      { title: "AWS Solutions Architect Associate", type: "certification", platform: "AWS", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
      { title: "Kubernetes for Beginners", type: "course", platform: "KodeKloud", url: "https://kodekloud.com/" },
      { title: "Google Cloud Digital Leader", type: "certification", platform: "Google Cloud", url: "https://cloud.google.com/certification/cloud-digital-leader" },
      { title: "TechWorld with Nana", type: "video", platform: "YouTube", url: "https://www.youtube.com/@TechWorldwithNana" },
    );
  }

  // Product / UX
  if (lower.includes("product") || lower.includes("ux") || lower.includes("design") || lower.includes("ui")) {
    resources.push(
      { title: "Google UX Design Certificate", type: "certification", platform: "Coursera", url: "https://www.coursera.org/professional-certificates/google-ux-design" },
      { title: "Interaction Design Foundation", type: "course", platform: "IxDF", url: "https://www.interaction-design.org/" },
      { title: "The Design of Everyday Things", type: "book", platform: "Book", url: "https://www.oreilly.com/library/view/the-design-of/9780465050659/" },
      { title: "NN/g UX Certification", type: "certification", platform: "Nielsen Norman", url: "https://www.nngroup.com/ux-certification/" },
    );
  }

  // Fallback for any career
  if (resources.length === 0) {
    resources.push(
      { title: "LinkedIn Learning", type: "course", platform: "LinkedIn", url: "https://www.linkedin.com/learning/" },
      { title: "Coursera Career Certificates", type: "certification", platform: "Coursera", url: "https://www.coursera.org/professional-certificates" },
      { title: "freeCodeCamp", type: "course", platform: "Free", url: "https://www.freecodecamp.org/" },
      { title: "Google Career Certificates", type: "certification", platform: "Google", url: "https://grow.google/certificates/" },
    );
  }

  return resources;
}

const ResourceLibrary = ({ recommendations }: { recommendations: CareerRecommendation[] }) => {
  const topCareer = recommendations[0];
  const resources = getResourcesForCareer(topCareer.career_title);

  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-bold text-foreground font-display mb-1 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        Resources for {topCareer.career_title}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Curated courses, certifications, and videos to kickstart your journey.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {resources.map((res, i) => {
          const Icon = ICON_MAP[res.type];
          const colorClass = TYPE_COLORS[res.type];

          return (
            <motion.a
              key={i}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-soft transition-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            >
              <span className={`flex-shrink-0 p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {res.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {res.platform} · <span className="capitalize">{res.type}</span>
                </p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex-shrink-0" />
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ResourceLibrary;
