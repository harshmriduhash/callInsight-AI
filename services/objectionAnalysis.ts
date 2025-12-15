import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export interface ObjectionAnalysis {
  objections: Array<{
    type:
      | "price"
      | "timeline"
      | "product"
      | "competitor"
      | "authority"
      | "other";
    text: string;
    severity: "low" | "medium" | "high";
    suggestedResponse: string;
  }>;
  competitorMentions: Array<{
    competitor: string;
    context: string;
    suggestedCounter: string;
  }>;
  overallObjectionLevel: "low" | "medium" | "high";
}

export async function analyzeObjections(
  transcription: string
): Promise<ObjectionAnalysis> {
  try {
    const prompt = `Analyze this sales call transcription and identify objections and competitor mentions. Return ONLY valid JSON:

{
  "objections": [
    {
      "type": "price" | "timeline" | "product" | "competitor" | "authority" | "other",
      "text": "exact quote of the objection",
      "severity": "low" | "medium" | "high",
      "suggestedResponse": "suggested response to handle this objection"
    }
  ],
  "competitorMentions": [
    {
      "competitor": "competitor name",
      "context": "what was said about them",
      "suggestedCounter": "suggested counter-argument"
    }
  ],
  "overallObjectionLevel": "low" | "medium" | "high"
}

Transcription: "${transcription}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-audio-mini-2025-10-06",
      messages: [
        {
          role: "system",
          content:
            "You are an expert sales objection handler. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return result as ObjectionAnalysis;
  } catch (error: any) {
    console.error("Error analyzing objections:", error);
    throw error;
  }
}
