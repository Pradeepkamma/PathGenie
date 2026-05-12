import { motion } from "framer-motion";
import { Compass, LogIn, LogOut, History, User, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  currentStep?: number;
}

const Navbar = ({ currentStep }: NavbarProps) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.header
      className="sticky top-0 z-50 glass border-b border-border/50"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          className="flex items-center gap-2.5 group"
          onClick={() => navigate("/")}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold font-display tracking-tight">
            Path<span className="text-gradient-primary">Genie</span>
          </span>
        </button>

        <div className="flex items-center gap-1">
          {user && (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => navigate("/history")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </button>
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-primary hover:bg-primary/10 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          )}
          {!user && (
            <button
              onClick={() => navigate("/auth")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-gradient-primary text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-shadow"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in</span>
            </button>
          )}
          <ThemeToggle inline />
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
