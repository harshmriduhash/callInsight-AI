import { NextApiRequest, NextApiResponse } from "next";
import { generateNextSteps } from "../../services/nextStepsGenerator";
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
    const { transcription, analysis, customerInfo } = req.body;

    if (!transcription || typeof transcription !== "string") {
      return res.status(400).json({ error: "Transcrição é obrigatória" });
    }

    const nextSteps = await generateNextSteps(
      transcription,
      analysis || {},
      customerInfo
    );

    return res.status(200).json(nextSteps);
  } catch (error: any) {
    console.error("Erro ao gerar próximos passos:", error);
    return res.status(500).json({
      error: "Erro ao gerar próximos passos",
      details: error.message,
    });
  }
}
