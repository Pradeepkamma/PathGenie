import { motion } from "framer-motion";
import {
  Sparkles, Clock, Shield, ArrowRight, LogIn, Brain, Target,
  Rocket, ChevronRight, Star, Users, Zap, BookOpen,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import OnboardingTutorial from "./OnboardingTutorial";
import Navbar from "./Navbar";
import Aurora from "./ui/aurora";
import GlassCard from "./ui/glass-card";

interface LandingScreenProps {
  onStart: (email: string) => void;
}

const features = [
  { icon: Brain, title: "AI-driven analysis", desc: "Gemini-powered engine maps your skills, interests & goals to the right tech career." },
  { icon: Target, title: "Personalized roadmap", desc: "Step-by-step plan with skills, tools, projects and milestones to track." },
  { icon: BookOpen, title: "Curated resources", desc: "Hand-picked courses, books, and communities for every recommended path." },
  { icon: Zap, title: "Live AI chatbot", desc: "Ask follow-up questions and get instant guidance based on your results." },
  { icon: Users, title: "Peer benchmarking", desc: "See how your scores compare with the wider PathGenie community." },
  { icon: Shield, title: "Private by design", desc: "Your data is encrypted, RLS-protected, and never shared with third parties." },
];

const steps = [
  { n: "01", title: "Answer 20 quick questions", desc: "Skills, interests, learning style — takes ~15 minutes." },
  { n: "02", title: "AI analyzes your profile", desc: "We score your fit against 50+ tech careers in real-time." },
  { n: "03", title: "Get your personalized roadmap", desc: "Top matches, salary insights, next steps & resources." },
];

const stats = [
  { num: "50+", label: "Tech careers" },
  { num: "20", label: "Smart questions" },
  { num: "₹3-50L", label: "Salary insights" },
  { num: "AI", label: "Powered by Gemini" },
];

const LandingScreen = ({ onStart }: LandingScreenProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) { onStart(user.email || ""); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    onStart(email);
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <OnboardingTutorial />
      <Aurora />

      <Navbar />

      {/* HERO */}
      <section className="relative z-10 px-4 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs sm:text-sm text-foreground/80 mb-6 sm:mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">AI-powered career guidance for Indian students</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold font-display leading-[1.05] mb-6 text-balance"
          >
            Find the tech career
            <br />
            <span className="text-gradient-primary">built for you.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
          >
            PathGenie analyzes your skills, interests and goals to recommend the perfect tech career path — with a personalized roadmap, salary insights, and AI mentor included.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-md mx-auto mb-10"
          >
            {user ? (
              <button
                type="button"
                onClick={() => onStart(user.email || "")}
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-primary rounded-2xl text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 shadow-elevated hover:shadow-glow transition-all hover:scale-[1.02] mx-auto"
              >
                Start your analysis
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 p-1.5 glass rounded-2xl shadow-elevated">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@example.com"
                    className="flex-1 px-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="group px-6 py-3 bg-gradient-primary rounded-xl text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-soft hover:shadow-glow transition-all whitespace-nowrap"
                  >
                    Get started
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
                {error && <p className="text-destructive text-sm mt-2 text-left px-2">{error}</p>}
                <button
                  onClick={() => navigate("/auth")}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Already have an account? Sign in
                </button>
              </>
            )}
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> 15-20 min quiz</span>
            <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-accent" /> Instant AI analysis</span>
            <span className="inline-flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-success" /> Private & secure</span>
            <span className="inline-flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-highlight" /> Free to start</span>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {stats.map((s) => (
            <GlassCard key={s.label} className="px-4 py-5 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gradient-primary font-display">{s.num}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </GlassCard>
          ))}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 px-4 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest text-primary uppercase">How it works</span>
            <h2 className="text-3xl sm:text-5xl font-bold font-display mt-3 text-balance">
              From quiz to clarity in <span className="text-gradient-primary">three steps</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6 h-full hover:scale-[1.02] hover:-translate-y-1">
                  <div className="text-5xl font-bold text-gradient-primary font-display mb-3">{s.n}</div>
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 px-4 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest text-accent uppercase">Why PathGenie</span>
            <h2 className="text-3xl sm:text-5xl font-bold font-display mt-3 text-balance">
              Everything you need to <span className="text-gradient-primary">choose with confidence</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="p-6 h-full group">
                  <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft mb-4 group-hover:shadow-glow transition-shadow">
                    <f.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-base font-semibold mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <GlassCard className="p-8 sm:p-12 text-center">
            <div className="flex justify-center gap-1 mb-5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-highlight text-highlight" />
              ))}
            </div>
            <p className="text-lg sm:text-2xl font-display text-foreground leading-relaxed mb-6 text-balance">
              "Felt like a senior mentor walked me through my options. The roadmap and salary numbers gave me real clarity."
            </p>
            <div className="text-sm text-muted-foreground">
              CS undergrad, Bengaluru
            </div>
          </GlassCard>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 px-4 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-10 sm:p-16 bg-gradient-primary shadow-elevated"
          >
            <div className="absolute inset-0 noise opacity-20 mix-blend-overlay" />
            <Rocket className="w-12 h-12 mx-auto mb-5 text-primary-foreground" />
            <h2 className="text-3xl sm:text-5xl font-bold font-display text-primary-foreground mb-4 text-balance">
              Your future career is one quiz away.
            </h2>
            <p className="text-base sm:text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
              Join hundreds of students mapping their tech path with PathGenie.
            </p>
            <button
              onClick={() => user ? onStart(user.email || "") : navigate("/auth")}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-background text-foreground font-semibold text-base shadow-elevated hover:scale-[1.03] transition-transform"
            >
              {user ? "Start your analysis" : "Create your free account"}
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 px-4 py-10 border-t border-border/50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} PathGenie · A genie for your tech career.</div>
          <div className="flex gap-5">
            <a href="mailto:feedback@pathgenie.com" className="hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingScreen;
