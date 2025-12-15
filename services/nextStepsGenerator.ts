import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export interface NextSteps {
  immediate: Array<{
    action: string;
    priority: "high" | "medium" | "low";
    deadline: string; // "within 24h", "this week", etc.
    description: string;
  }>;
  shortTerm: Array<{
    action: string;
    timeline: string;
    description: string;
  }>;
  longTerm: Array<{
    action: string;
    timeline: string;
    description: string;
  }>;
  followUpEmail: {
    subject: string;
    body: string;
    tone: "professional" | "friendly" | "urgent" | "casual";
  };
  proposalOutline: {
    title: string;
    sections: Array<{
      heading: string;
      content: string;
      order: number;
    }>;
    keyPoints: string[];
    pricingRecommendation: string;
  };
}

export async function generateNextSteps(
  transcription: string,
  analysis: any,
  customerInfo?: {
    name?: string;
    company?: string;
    painPoints?: string[];
  }
): Promise<NextSteps> {
  try {
    const prompt = `Com base na seguinte transcrição de chamada de vendas e análise, gere próximos passos estratégicos, email de follow-up e proposta.

Transcrição:
"${transcription}"

Análise resumida:
- Sentimento: ${analysis.sentiment || "N/A"}
- Engajamento: ${analysis.engagement || "N/A"}
- Objeções: ${analysis.salesIndicators?.objections?.join(", ") || "Nenhuma"}
- Sinais de compra: ${
      analysis.salesIndicators?.buyingSignals?.join(", ") || "Nenhum"
    }

${customerInfo ? `Informações do cliente: ${JSON.stringify(customerInfo)}` : ""}

Gere os próximos passos em formato JSON:

{
  "immediate": [
    {
      "action": "string",
      "priority": "high" | "medium" | "low",
      "deadline": "string (ex: 'within 24h', 'this week')",
      "description": "string"
    }
  ],
  "shortTerm": [
    {
      "action": "string",
      "timeline": "string (ex: '1-2 weeks')",
      "description": "string"
    }
  ],
  "longTerm": [
    {
      "action": "string",
      "timeline": "string (ex: '1-3 months')",
      "description": "string"
    }
  ],
  "followUpEmail": {
    "subject": "string",
    "body": "string (email completo)",
    "tone": "professional" | "friendly" | "urgent" | "casual"
  },
  "proposalOutline": {
    "title": "string",
    "sections": [
      {
        "heading": "string",
        "content": "string",
        "order": number
      }
    ],
    "keyPoints": ["string"],
    "pricingRecommendation": "string"
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-audio-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em vendas e geração de propostas. Sempre responda APENAS com JSON válido.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      response_format: { type: "json_object" },
    });

    const resultText = completion.choices[0]?.message?.content;

    if (!resultText) {
      throw new Error("Resposta vazia da API");
    }

    let result;
    try {
      result = JSON.parse(resultText);
    } catch (parseError) {
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Não foi possível parsear a resposta");
      }
    }

    return result as NextSteps;
  } catch (error: any) {
    console.error("Erro ao gerar próximos passos:", error);
    throw error;
  }
}
