import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import type { CareerRecommendation } from "@/lib/quizData";

interface ResultsChartsProps {
  recommendations: CareerRecommendation[];
}

const COLORS = [
  "hsl(234, 85%, 60%)",
  "hsl(174, 72%, 45%)",
  "hsl(36, 95%, 55%)",
  "hsl(152, 60%, 45%)",
  "hsl(260, 80%, 60%)",
];

const ResultsCharts = ({ recommendations }: ResultsChartsProps) => {
  const barData = recommendations.map((r) => ({
    name: r.career_title.length > 15 ? r.career_title.slice(0, 14) + "…" : r.career_title,
    score: r.fit_score,
    fullName: r.career_title,
  }));

  // Radar data: compare dimensions across top 3 careers
  const top3 = recommendations.slice(0, 3);
  const dimensions = ["Fit Score", "Skills Match", "Growth", "Work-Life", "Job Availability"];

  const growthMap: Record<string, number> = {
    "Very High": 95,
    High: 80,
    Moderate: 60,
    Low: 40,
  };
  const wlbMap: Record<string, number> = {
    Excellent: 95,
    Good: 80,
    Moderate: 60,
    Poor: 40,
  };
  const jobMap: Record<string, number> = {
    "Very High": 95,
    High: 80,
    Moderate: 60,
    Low: 40,
  };

  const parseFirstWord = (str: string, map: Record<string, number>) => {
    for (const key of Object.keys(map)) {
      if (str.includes(key)) return map[key];
    }
    return 50;
  };

  const radarData = dimensions.map((dim) => {
    const entry: Record<string, any> = { dimension: dim };
    top3.forEach((r, i) => {
      if (dim === "Fit Score") entry[`c${i}`] = r.fit_score;
      else if (dim === "Skills Match")
        entry[`c${i}`] = Math.round(
          (r.skills_you_have.length / (r.skills_you_have.length + r.skills_to_develop.length)) * 100
        );
      else if (dim === "Growth")
        entry[`c${i}`] = parseFirstWord(r.career_outlook.growth_potential, growthMap);
      else if (dim === "Work-Life")
        entry[`c${i}`] = parseFirstWord(r.career_outlook.work_life_balance, wlbMap);
      else if (dim === "Job Availability")
        entry[`c${i}`] = parseFirstWord(r.career_outlook.job_availability, jobMap);
    });
    return entry;
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-card text-sm">
        <p className="font-semibold text-foreground">{d.fullName || d.dimension}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-muted-foreground">
            {p.name === "score" ? "Fit" : top3[parseInt(p.dataKey?.slice(1))]?.career_title}:{" "}
            <span className="font-bold text-foreground">{p.value}%</span>
          </p>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Bar Chart */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <h3 className="text-lg font-bold text-foreground font-display mb-4">Fit Score Comparison</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" radius={[8, 8, 0, 0]} animationDuration={1200}>
              {barData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <h3 className="text-lg font-bold text-foreground font-display mb-4">
          Career Dimensions (Top 3)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(220, 15%, 30%)" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }}
            />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            {top3.map((r, i) => (
              <Radar
                key={r.career_title}
                name={r.career_title}
                dataKey={`c${i}`}
                stroke={COLORS[i]}
                fill={COLORS[i]}
                fillOpacity={0.15}
                animationDuration={1500}
              />
            ))}
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {top3.map((r, i) => (
            <div key={r.career_title} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
              {r.career_title}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsCharts;
