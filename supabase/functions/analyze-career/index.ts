import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a career counselor AI specializing in tech careers for engineering students and recent graduates. You will receive a student's quiz answers covering their education, skills, interests, work preferences, and career goals.

Analyze their profile and return structured career recommendations using the tool provided.

Guidelines:
- Provide exactly 4 career recommendations ranked by fit score (highest first)
- Fit scores should be realistic (60-95 range), not all high
- Tailor salary ranges to Indian market (in LPA format)
- Be specific about WHY each career fits based on their actual answers
- Skills they have should reference what they told you
- Next steps should be actionable and specific (6 items for top pick, 5 for others)
- Confidence level: High if answers are consistent and clear, Medium if mixed signals, Low if very uncertain
- Consider their constraints (family pressure, location, financial) in your recommendations`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers, questions } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build a readable summary of the student's answers
    const answerSummary = questions
      .map((q: any) => {
        const answer = answers[q.id];
        if (!answer) return null;
        const displayAnswer = Array.isArray(answer) ? answer.join(", ") : answer;
        return `${q.question}: ${displayAnswer}`;
      })
      .filter(Boolean)
      .join("\n");

    const userMessage = `Here are the student's quiz responses:\n\n${answerSummary}\n\nPlease analyze their profile and provide career recommendations.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "provide_career_recommendations",
                description:
                  "Return structured career recommendations for the student",
                parameters: {
                  type: "object",
                  properties: {
                    recommendations: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          rank: { type: "number" },
                          career_title: { type: "string" },
                          fit_score: { type: "number" },
                          why_fits: { type: "string" },
                          role_description: { type: "string" },
                          skills_you_have: {
                            type: "array",
                            items: { type: "string" },
                          },
                          skills_to_develop: {
                            type: "array",
                            items: { type: "string" },
                          },
                          career_outlook: {
                            type: "object",
                            properties: {
                              salary_entry: { type: "string" },
                              salary_experienced: { type: "string" },
                              growth_potential: { type: "string" },
                              work_life_balance: { type: "string" },
                              job_availability: { type: "string" },
                            },
                            required: [
                              "salary_entry",
                              "salary_experienced",
                              "growth_potential",
                              "work_life_balance",
                              "job_availability",
                            ],
                            additionalProperties: false,
                          },
                          next_steps: {
                            type: "array",
                            items: { type: "string" },
                          },
                        },
                        required: [
                          "rank",
                          "career_title",
                          "fit_score",
                          "why_fits",
                          "role_description",
                          "skills_you_have",
                          "skills_to_develop",
                          "career_outlook",
                          "next_steps",
                        ],
                        additionalProperties: false,
                      },
                    },
                    summary: {
                      type: "object",
                      properties: {
                        top_recommendation: { type: "string" },
                        confidence_level: {
                          type: "string",
                          enum: ["High", "Medium", "Low"],
                        },
                        confidence_explanation: { type: "string" },
                      },
                      required: [
                        "top_recommendation",
                        "confidence_level",
                        "confidence_explanation",
                      ],
                      additionalProperties: false,
                    },
                  },
                  required: ["recommendations", "summary"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "provide_career_recommendations" },
          },
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
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No structured response from AI");
    }

    const results = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-career error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
