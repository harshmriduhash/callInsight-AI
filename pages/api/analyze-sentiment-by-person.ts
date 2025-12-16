import { NextApiRequest, NextApiResponse } from "next";
import { analyzeSentimentByPerson } from "../../services/sentimentByPerson";
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

  try {
    const { transcription } = req.body;

    if (!transcription || typeof transcription !== "string") {
      return res.status(400).json({ error: "Transcription is required" });
    }

    const analysis = await analyzeSentimentByPerson(transcription);

    return res.status(200).json(analysis);
  } catch (error: any) {
    console.error("Error in sentiment by person analysis:", error);
    return res.status(500).json({
      error: "Error analyzing sentiment by person",
      details: error.message,
    });
  }
}
