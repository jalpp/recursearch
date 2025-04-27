import { EVALS } from "../config/config";
import { createReport } from "./report";

export async function generateEvalReport(
  rootQuery: string,
  finalreport: string,
  fileName: string
): Promise<void> {
  const answerRelevancy = await EVALS.answerRelevancy.measure(
    rootQuery,
    finalreport
  );
  const bias = await EVALS.bias.measure(rootQuery, finalreport);
  const toxic = await EVALS.toxic.measure(rootQuery, finalreport);
  const tone = await EVALS.tone.measure(rootQuery, finalreport);

  const report = `EVAL REPORT 
Answer Relevancy Score: ${answerRelevancy.score}
Answer Relevancy Info: ${answerRelevancy.info.reason}
Bias Score: ${bias.score}
Bias Info: ${bias.info.reason}
Toxicity Score: ${toxic.score}
Toxicity Info: ${toxic.info.reason}
Tone Score: ${tone.score}
`;

  const reportpath = await createReport(fileName, report, "text");

  console.log("Eval report created at ", reportpath);
}
