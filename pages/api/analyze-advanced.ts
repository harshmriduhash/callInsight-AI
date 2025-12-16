import { NextApiRequest, NextApiResponse } from "next";
import { performAdvancedAnalysis } from "../../services/advancedAnalysis";
import { apiLimiter } from "../../lib/rateLimit";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await new Promise<void>((resolve, reject) => {
    apiLimiter(req as any, res as any, (result: any) => {
      if (result instanceof Error) return reject(result);
      resolve();
    });
  });

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY não configurada" });
  }

  try {
    const { transcription, duration, segments } = req.body;

    if (!transcription || typeof transcription !== "string") {
      return res.status(400).json({ error: "Transcrição é obrigatória" });
    }

    const analysis = await performAdvancedAnalysis(
      transcription,
      duration || 0,
      segments
    );

    return res.status(200).json(analysis);
  } catch (error: any) {
    console.error("Erro na análise avançada:", error);
    return res.status(500).json({
      error: "Erro ao realizar análise avançada",
      details: error.message,
    });
  }
}
