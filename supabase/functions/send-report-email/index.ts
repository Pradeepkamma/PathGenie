import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Escape HTML special chars to prevent injection in email body
function esc(input: unknown): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startedAt = Date.now();
  let loggedUserId: string | null = null;
  let loggedEmail = "";
  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
  );
  const logCall = async (status: string, statusCode: number, errorMessage: string | null) => {
    try {
      await adminClient.from("function_call_logs").insert({
        function_name: "send-report-email", status, status_code: statusCode,
        error_message: errorMessage, duration_ms: Date.now() - startedAt, user_id: loggedUserId,
      });
    } catch (_) {}
  };
  const logEmail = async (status: string, providerId: string | null, errorMessage: string | null) => {
    try {
      await adminClient.from("email_send_logs").insert({
        recipient_email: loggedEmail || "unknown",
        template_name: "career-report",
        status, provider_message_id: providerId, error_message: errorMessage, user_id: loggedUserId,
      });
    } catch (_) {}
  };

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    loggedUserId = (claimsData.claims as any).sub ?? null;

    // SECURITY: Always send to the authenticated user's own email — never trust client input
    const recipientEmail = (claimsData.claims as any).email as string | undefined;
    if (!recipientEmail || typeof recipientEmail !== "string") {
      return new Response(
        JSON.stringify({ error: "Authenticated user has no email on file" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    loggedEmail = recipientEmail;

    const { results } = await req.json();

    if (!results || typeof results !== "object") {
      return new Response(
        JSON.stringify({ error: "Results are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { recommendations, summary } = results;
    if (!Array.isArray(recommendations) || !summary) {
      return new Response(
        JSON.stringify({ error: "Invalid results payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build HTML email — all interpolated values are HTML-escaped
    const careerCards = recommendations
      .map(
        (rec: any) => `
      <div style="background:#f8f9fa;border-radius:12px;padding:20px;margin-bottom:16px;border-left:4px solid ${rec.rank === 1 ? '#4f46e5' : '#e5e7eb'}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <h3 style="margin:0;font-size:18px;color:#1a1a2e">#${esc(rec.rank)} ${esc(rec.career_title)}</h3>
          <span style="font-size:24px;font-weight:bold;color:${Number(rec.fit_score) >= 85 ? '#22c55e' : Number(rec.fit_score) >= 70 ? '#eab308' : '#6b7280'}">${esc(rec.fit_score)}%</span>
        </div>
        <p style="color:#555;font-size:14px;margin:8px 0">${esc(rec.why_fits)}</p>
        <p style="color:#555;font-size:14px;margin:8px 0"><strong>What you'll do:</strong> ${esc(rec.role_description)}</p>
        <div style="display:flex;gap:24px;margin-top:12px">
          <div>
            <p style="font-weight:600;font-size:13px;color:#333;margin-bottom:4px">Skills You Have</p>
            <ul style="padding-left:16px;margin:0;color:#555;font-size:13px">
              ${(Array.isArray(rec.skills_you_have) ? rec.skills_you_have : []).map((s: any) => `<li>${esc(s)}</li>`).join("")}
            </ul>
          </div>
          <div>
            <p style="font-weight:600;font-size:13px;color:#333;margin-bottom:4px">Skills to Develop</p>
            <ul style="padding-left:16px;margin:0;color:#555;font-size:13px">
              ${(Array.isArray(rec.skills_to_develop) ? rec.skills_to_develop : []).map((s: any) => `<li>${esc(s)}</li>`).join("")}
            </ul>
          </div>
        </div>
        <div style="margin-top:12px;background:#fff;border-radius:8px;padding:12px">
          <p style="font-weight:600;font-size:13px;color:#333;margin:0 0 6px">Career Outlook</p>
          <p style="color:#555;font-size:13px;margin:2px 0">Entry: ${esc(rec.career_outlook?.salary_entry)} | Experienced: ${esc(rec.career_outlook?.salary_experienced)}</p>
          <p style="color:#555;font-size:13px;margin:2px 0">Growth: ${esc(rec.career_outlook?.growth_potential)} | Jobs: ${esc(rec.career_outlook?.job_availability)}</p>
        </div>
        <div style="margin-top:12px">
          <p style="font-weight:600;font-size:13px;color:#333;margin-bottom:4px">Next Steps</p>
          <ol style="padding-left:16px;margin:0;color:#555;font-size:13px">
            ${(Array.isArray(rec.next_steps) ? rec.next_steps : []).map((s: any) => `<li style="margin-bottom:4px">${esc(s)}</li>`).join("")}
          </ol>
        </div>
      </div>`
      )
      .join("");

    const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family:'Segoe UI',Arial,sans-serif;background:#f0f2f5;padding:32px 16px;margin:0">
      <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <div style="background:linear-gradient(135deg,#1a1a2e,#2d1b69);padding:32px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:28px">PathGenie</h1>
          <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:16px">Your Career Recommendations Report</p>
        </div>
        <div style="padding:24px">
          <div style="background:linear-gradient(145deg,#f8f9ff,#f0f2ff);border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #e5e7eb">
            <p style="color:#6b7280;font-size:13px;margin:0">Top Recommendation</p>
            <h2 style="color:#1a1a2e;margin:4px 0;font-size:22px">${esc(summary.top_recommendation)}</h2>
            <p style="color:#6b7280;font-size:14px;margin:8px 0 0">Confidence: <strong style="color:${summary.confidence_level === 'High' ? '#22c55e' : '#eab308'}">${esc(summary.confidence_level)}</strong> — ${esc(summary.confidence_explanation)}</p>
          </div>
          ${careerCards}
          <div style="text-align:center;margin-top:24px;padding:16px;background:#f8f9fa;border-radius:12px">
            <p style="color:#6b7280;font-size:13px;margin:0">Generated by PathGenie — AI-Powered Career Guidance</p>
          </div>
        </div>
      </div>
    </body>
    </html>`;

    // Send email via Resend — recipient is always the authenticated user
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "PathGenie <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: `Your PathGenie Career Report — ${esc(summary.top_recommendation)}`,
        html,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend error:", resendData);
      await logEmail("failed", null, resendData?.message || "Resend error");
      throw new Error(resendData?.message || "Failed to send email");
    }

    await logEmail("sent", resendData?.id ?? null, null);
    await logCall("success", 200, null);
    return new Response(
      JSON.stringify({ success: true, message: `Report sent to ${recipientEmail}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("send-report-email error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    await logCall("error", 500, msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
