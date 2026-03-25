import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, TrendingUp, Award, Percent } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { CareerRecommendation } from "@/lib/quizData";

interface PeerComparisonProps {
  recommendations: CareerRecommendation[];
}

interface PeerStats {
  careerTitle: string;
  count: number;
  avgFitScore: number;
  userFitScore: number;
}

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--highlight))",
  "hsl(var(--success))",
  "hsl(var(--secondary))",
];

const PeerComparison = ({ recommendations }: PeerComparisonProps) => {
  const [peerStats, setPeerStats] = useState<PeerStats[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPeerData();
  }, []);

  const fetchPeerData = async () => {
    try {
      const { data, error } = await supabase
        .from("shared_results")
        .select("results");

      if (error) throw error;

      const careerCounts: Record<string, { count: number; totalScore: number }> = {};

      (data || []).forEach((row) => {
        const res = row.results as any;
        if (res?.recommendations) {
          res.recommendations.forEach((rec: any) => {
            const title = rec.career_title;
            if (!careerCounts[title]) {
              careerCounts[title] = { count: 0, totalScore: 0 };
            }
            careerCounts[title].count += 1;
            careerCounts[title].totalScore += rec.fit_score || 0;
          });
        }
      });

      setTotalUsers(data?.length || 0);

      const userCareers = recommendations.map((rec) => rec.career_title);
      const stats: PeerStats[] = userCareers.map((title) => {
        const peer = careerCounts[title];
        const userRec = recommendations.find((r) => r.career_title === title);
        return {
          careerTitle: title.length > 20 ? title.slice(0, 18) + "…" : title,
          count: peer?.count || 0,
          avgFitScore: peer ? Math.round(peer.totalScore / peer.count) : 0,
          userFitScore: userRec?.fit_score || 0,
        };
      });

      setPeerStats(stats);
    } catch (err) {
      console.error("Peer comparison fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const topCareersSorted = Object.entries(
    peerStats.reduce<Record<string, number>>((acc, s) => {
      acc[s.careerTitle] = s.count;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Loading peer insights…
      </div>
    );
  }

  const userTopScore = recommendations[0]?.fit_score || 0;
  const avgTopScore = peerStats[0]?.avgFitScore || 0;
  const scoreDiff = userTopScore - avgTopScore;

  return (
    <motion.div
      className="mb-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground font-display">
            Peer Comparison
          </h2>
          <p className="text-xs text-muted-foreground">
            See how your results compare to {totalUsers} other users
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl border border-border p-4 shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">Total Users</span>
          </div>
          <p className="text-2xl font-bold text-foreground font-display">{totalUsers}</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-highlight" />
            <span className="text-xs text-muted-foreground font-medium">Your Top Score</span>
          </div>
          <p className="text-2xl font-bold text-foreground font-display">{userTopScore}%</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground font-medium">vs. Average</span>
          </div>
          <p className={`text-2xl font-bold font-display ${scoreDiff >= 0 ? "text-success" : "text-destructive"}`}>
            {scoreDiff >= 0 ? "+" : ""}{scoreDiff}%
          </p>
        </div>
      </div>

      {/* Fit Score Comparison Chart */}
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Percent className="w-4 h-4 text-primary" /> Your Fit Score vs. Peer Average
        </h3>
        <div className="h-48 sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={peerStats}
              margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
            >
              <XAxis
                dataKey="careerTitle"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={45}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="userFitScore" name="Your Score" radius={[6, 6, 0, 0]}>
                {peerStats.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
              <Bar
                dataKey="avgFitScore"
                name="Peer Average"
                radius={[6, 6, 0, 0]}
                fill="hsl(var(--muted-foreground))"
                opacity={0.4}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default PeerComparison;
