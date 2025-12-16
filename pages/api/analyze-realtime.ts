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
    const { transcription, currentTime } = req.body;

    if (
      !transcription ||
      typeof transcription !== "string" ||
      transcription.trim().length < 20
    ) {
      return res.status(400).json({
        error: "Transcrição é obrigatória e deve ter pelo menos 20 caracteres",
        receivedLength: transcription?.length || 0,
      });
    }

    // Análise rápida em tempo real (usando modelo mais rápido)
    const quickAnalysisPrompt = `Analise rapidamente este trecho de uma ligação de vendas em andamento. Responda APENAS em JSON válido, sem markdown ou texto adicional:

Transcrição: "${transcription}"

Retorne um objeto JSON com exatamente estes campos:
{
  "sentiment": 0.5,
  "engagement": 0.5,
  "keywords": ["palavra1", "palavra2"],
  "suggestion": "sugestão curta"
}

Onde:
- sentiment: número de 0 a 1 (0 = negativo, 1 = positivo)
- engagement: número de 0 a 1 (0 = baixo, 1 = alto)
- keywords: array de 2-4 strings com palavras-chave importantes
- suggestion: string com sugestão rápida (máximo 50 caracteres)`;

    console.log(
      "📤 Enviando requisição para GPT-Audio-Mini com",
      transcription.length,
      "caracteres"
    );

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-audio-mini-2025-10-06", // Snapshot específico do modelo rápido e econômico
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente de vendas em tempo real. Responda APENAS com JSON válido.",
          },
          {
            role: "user",
            content: quickAnalysisPrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
        response_format: { type: "json_object" },
      });
      console.log("✅ Resposta recebida da API OpenAI");
    } catch (apiError: any) {
      console.error("❌ Erro na chamada da API OpenAI:", {
        message: apiError.message,
        type: apiError.type,
        code: apiError.code,
        status: apiError.status,
        response: apiError.response?.data,
      });
      throw apiError;
    }

    const analysisText = completion.choices[0]?.message?.content;

    if (!analysisText) {
      return res.status(500).json({ error: "Resposta vazia da API" });
    }

    let analysis;
    try {
      // Tentar parsear diretamente
      analysis = JSON.parse(analysisText);
      console.log("✅ JSON parseado com sucesso:", analysis);
    } catch (parseError: any) {
      console.warn(
        "⚠️ Erro ao parsear JSON diretamente, tentando extrair:",
        parseError.message
      );
      console.log("📄 Resposta recebida:", analysisText);

      // Tentar extrair JSON se vier com markdown ou texto adicional
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysis = JSON.parse(jsonMatch[0]);
          console.log("✅ JSON extraído e parseado:", analysis);
        } catch (extractError: any) {
          console.error("❌ Erro ao parsear JSON extraído:", extractError);
          throw new Error(
            `Erro ao parsear resposta JSON: ${
              extractError.message
            }. Resposta recebida: ${analysisText.substring(0, 200)}`
          );
        }
      } else {
        console.error("❌ Nenhum JSON encontrado na resposta");
        throw new Error(
          `Não foi possível encontrar JSON na resposta. Resposta recebida: ${analysisText.substring(
            0,
            200
          )}`
        );
      }
    }

    // Validar campos obrigatórios
    if (
      typeof analysis.sentiment !== "number" ||
      typeof analysis.engagement !== "number"
    ) {
      console.error("❌ Resposta inválida - campos faltando:", analysis);
      throw new Error(
        "Resposta da API não contém campos sentiment ou engagement válidos"
      );
    }

    return res.status(200).json({
      sentiment: analysis.sentiment || 0.5,
      engagement: analysis.engagement || 0.5,
      keywords: analysis.keywords || [],
      suggestion: analysis.suggestion || "Continue a conversa",
      time: currentTime || 0,
    });
  } catch (error: any) {
    console.error("❌ Erro completo na análise em tempo real:", {
      message: error.message,
      type: error.type,
      code: error.code,
      status: error.status,
      response: error.response?.data,
      stack: error.stack,
    });

    // Verificar se é erro da API OpenAI
    if (error.response) {
      console.error("Erro da API OpenAI:", error.response.data);
      return res.status(500).json({
        error: "Erro na API OpenAI",
        details: error.response.data?.error?.message || error.message,
        type: error.response.data?.error?.type || "unknown",
      });
    }

    return res.status(500).json({
      error: "Erro ao analisar em tempo real",
      details: error.message || "Erro desconhecido",
      type: error.name || "Error",
    });
  }
}
