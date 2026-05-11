import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Activity, Mail, Bot, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

type FnLog = {
  id: string; function_name: string; status: string; status_code: number | null;
  error_message: string | null; duration_ms: number | null; created_at: string;
};
type AiLog = {
  id: string; function_name: string; model: string; total_tokens: number | null;
  latency_ms: number | null; status: string; error_message: string | null; created_at: string;
};
type EmailLog = {
  id: string; recipient_email: string; template_name: string; status: string;
  error_message: string | null; created_at: string;
};

const fmtTime = (s: string) => new Date(s).toLocaleString();

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    success: "bg-green-500/15 text-green-600 border-green-500/30",
    sent: "bg-green-500/15 text-green-600 border-green-500/30",
    error: "bg-red-500/15 text-red-600 border-red-500/30",
    failed: "bg-red-500/15 text-red-600 border-red-500/30",
  };
  return <Badge variant="outline" className={map[status] ?? ""}>{status}</Badge>;
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();

  const [fnLogs, setFnLogs] = useState<FnLog[]>([]);
  const [aiLogs, setAiLogs] = useState<AiLog[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  const load = async () => {
    setRefreshing(true);
    const [fn, ai, em] = await Promise.all([
      supabase.from("function_call_logs").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("ai_usage_logs").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("email_send_logs").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    setFnLogs((fn.data as FnLog[]) ?? []);
    setAiLogs((ai.data as AiLog[]) ?? []);
    setEmailLogs((em.data as EmailLog[]) ?? []);
    setRefreshing(false);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto pt-24 px-4 text-center">
          <AlertTriangle className="w-10 h-10 mx-auto text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold font-display mb-2">Admin access required</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Your account does not have admin privileges. Ask a project owner to grant you the admin role.
          </p>
          <Button onClick={() => navigate("/")}>Back home</Button>
        </div>
      </div>
    );
  }

  const fnErrors = fnLogs.filter(l => l.status === "error").length;
  const totalTokens = aiLogs.reduce((s, l) => s + (l.total_tokens ?? 0), 0);
  const emailsSent = emailLogs.filter(l => l.status === "sent").length;
  const emailsFailed = emailLogs.filter(l => l.status !== "sent").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold font-display tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Monitoring edge functions, AI usage, and email delivery.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={load} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Activity className="w-3.5 h-3.5" /> Function calls (200)
              </div>
              <div className="text-2xl font-bold">{fnLogs.length}</div>
              <div className="text-xs text-red-500 mt-1">{fnErrors} errors</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Bot className="w-3.5 h-3.5" /> AI calls
              </div>
              <div className="text-2xl font-bold">{aiLogs.length}</div>
              <div className="text-xs text-muted-foreground mt-1">{totalTokens.toLocaleString()} tokens</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Mail className="w-3.5 h-3.5" /> Emails sent
              </div>
              <div className="text-2xl font-bold">{emailsSent}</div>
              <div className="text-xs text-red-500 mt-1">{emailsFailed} failed</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Error rate
              </div>
              <div className="text-2xl font-bold">
                {fnLogs.length ? Math.round((fnErrors / fnLogs.length) * 100) : 0}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">across all functions</div>
            </Card>
          </div>

          <Tabs defaultValue="functions">
            <TabsList>
              <TabsTrigger value="functions">Function logs</TabsTrigger>
              <TabsTrigger value="ai">AI usage</TabsTrigger>
              <TabsTrigger value="emails">Emails</TabsTrigger>
            </TabsList>

            <TabsContent value="functions">
              <Card className="p-0 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Function</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Error</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fnLogs.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No logs yet</TableCell></TableRow>
                    )}
                    {fnLogs.map(l => (
                      <TableRow key={l.id}>
                        <TableCell className="font-medium">{l.function_name}</TableCell>
                        <TableCell><StatusBadge status={l.status} /></TableCell>
                        <TableCell className="text-muted-foreground">{l.status_code ?? "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{l.duration_ms ? `${l.duration_ms}ms` : "—"}</TableCell>
                        <TableCell className="max-w-xs truncate text-xs text-red-500">{l.error_message ?? ""}</TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{fmtTime(l.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="ai">
              <Card className="p-0 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Function</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead>Latency</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aiLogs.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No AI calls yet</TableCell></TableRow>
                    )}
                    {aiLogs.map(l => (
                      <TableRow key={l.id}>
                        <TableCell className="font-medium">{l.function_name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{l.model}</TableCell>
                        <TableCell><StatusBadge status={l.status} /></TableCell>
                        <TableCell className="text-muted-foreground">{l.total_tokens ?? "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{l.latency_ms ? `${l.latency_ms}ms` : "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{fmtTime(l.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="emails">
              <Card className="p-0 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Error</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailLogs.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No emails yet</TableCell></TableRow>
                    )}
                    {emailLogs.map(l => (
                      <TableRow key={l.id}>
                        <TableCell className="font-medium">{l.recipient_email}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{l.template_name}</TableCell>
                        <TableCell><StatusBadge status={l.status} /></TableCell>
                        <TableCell className="max-w-xs truncate text-xs text-red-500">{l.error_message ?? ""}</TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{fmtTime(l.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
