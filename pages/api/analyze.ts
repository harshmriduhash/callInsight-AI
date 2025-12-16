import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY não configurada" });
  }

  try {
    const { transcription, duration } = req.body;

    if (!transcription || typeof transcription !== "string") {
      return res.status(400).json({ error: "Transcrição é obrigatória" });
    }

    // Prompt para análise de chamada de vendas
    const analysisPrompt = `Você é um especialista em análise de chamadas de vendas. Analise a seguinte transcrição de uma ligação de vendas e forneça uma análise detalhada em formato JSON.

Transcrição:
"${transcription}"

Duração aproximada: ${duration || "desconhecida"} segundos

Forneça uma análise completa com os seguintes campos (responda APENAS em JSON válido, sem markdown ou texto adicional):

{
  "sentiment": número de 0 a 1 (0 = muito negativo, 1 = muito positivo),
  "engagement": número de 0 a 1 (0 = baixo engajamento, 1 = alto engajamento),
  "keywords": array de strings com as 5-8 palavras-chave mais importantes mencionadas,
  "summary": string com resumo da ligação em 2-3 frases,
  "positivePoints": array de strings com pontos positivos da ligação,
  "improvementAreas": array de strings com áreas que precisam melhorar,
  "sentimentAnalysis": {
    "overall": "positive" | "neutral" | "negative",
    "customerSentiment": número de 0 a 1,
    "salespersonSentiment": número de 0 a 1
  },
  "engagementMetrics": {
    "conversationFlow": número de 0 a 1,
    "questionQuality": número de 0 a 1,
    "listeningSkills": número de 0 a 1
  },
  "salesIndicators": {
    "objections": array de strings com objeções mencionadas,
    "buyingSignals": array de strings com sinais de compra,
    "nextSteps": string com próximos passos sugeridos
  },
  "recommendations": array de 3-5 strings com recomendações específicas para melhorar
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-audio-mini-2025-10-06", // Snapshot específico do modelo econômico
      messages: [
        {
          role: "system",
          content:
            "Você é um analista especializado em chamadas de vendas. Sempre responda APENAS com JSON válido, sem texto adicional, markdown ou explicações.",
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const analysisText = completion.choices[0]?.message?.content;

    if (!analysisText) {
      return res.status(500).json({ error: "Resposta vazia da API" });
    }

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      // Tentar extrair JSON se vier com markdown
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Não foi possível parsear a resposta");
      }
    }

    // Gerar dados em tempo real simulados baseados na análise real
    const realTimeData = [];
    const segments = Math.min(Math.floor((duration || 60) / 10), 20);

    // Usar os scores reais como base e adicionar variação
    const baseSentiment = analysis.sentiment || 0.5;
    const baseEngagement = analysis.engagement || 0.5;

    for (let i = 0; i < segments; i++) {
      const progress = i / segments;
      // Variação suave ao longo do tempo
      const variation = Math.sin(progress * Math.PI * 2) * 0.1;
      realTimeData.push({
        time: formatTime(i * 10),
        sentiment: Math.max(0.1, Math.min(0.9, baseSentiment + variation)),
        engagement: Math.max(0.1, Math.min(0.9, baseEngagement + variation)),
      });
    }

    return res.status(200).json({
      ...analysis,
      realTimeData,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Erro na análise:", error);
    return res.status(500).json({
      error: "Erro ao analisar transcrição",
      details: error.message,
    });
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
