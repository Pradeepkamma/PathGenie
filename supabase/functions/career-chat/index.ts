import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are PathGenie, a friendly and knowledgeable AI career advisor for engineering students and recent graduates. You have already analyzed the student's profile and provided career recommendations.

You are now in a follow-up conversation. The student may ask you:
- Deeper questions about any of their recommended careers
- How to get started with a specific path
- Salary negotiation tips
- Interview preparation advice
- Course/certification recommendations
- How to transition between fields
- Comparisons between different career paths
- General career guidance

Guidelines:
- Be conversational, warm, and encouraging
- Give specific, actionable advice (not generic)
- Reference their actual profile data when relevant
- Keep responses concise (2-4 paragraphs max)
- Use Indian market context for salary/job info when relevant
- If asked something completely unrelated to careers/tech, gently redirect`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, results } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build context from results
    const resultsContext = `
The student's career analysis results:
- Top recommendation: ${results.summary.top_recommendation} (Confidence: ${results.summary.confidence_level})
- ${results.summary.confidence_explanation}

Career recommendations:
${results.recommendations.map((r: any) => `#${r.rank} ${r.career_title} (${r.fit_score}% fit) - ${r.why_fits.slice(0, 150)}`).join("\n")}
`;

    const systemMessage = `${SYSTEM_PROMPT}\n\nContext about the student:\n${resultsContext}`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            { role: "system", content: systemMessage },
            ...messages,
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) throw new Error("No response from AI");

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("career-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
