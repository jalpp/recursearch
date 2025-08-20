import { tavily } from "@tavily/core";
import {
  ContentPickerAgent,
  QuestionAgent,
  QuestionPickerAgent,
  CustomQuestionAgent,
  StatsAgent,
  ImageQueryAgent,
} from ".";

import { createReport } from "./report";
import Exa from "exa-js";
import { MAX_DEPTH } from "../config/config";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const exa = new Exa(process.env.EXA_API_KEY);



// Report and Citation Variables
let reportBuilder = "";
let reportWithCitationBuilder = "";
let citations = "";
let statsReport = "";
let relatedImages = "";
let imageCount = 0;

// Question Tracking
const pickedQuestionSet: string[] = [];
const statsQuestionSet: string[] = [];
const pickedQuestionSetCitations: string[] = [];

interface SimpleSearch {
  answer: string;
  citations: string[];
}

let logger = "";

export async function simepleSearch(query: string): Promise<SimpleSearch> {
  let answerReport = "";
  let incitations = "";
  const citations: string[] = [];

  const res = await exa.answer(query);

  const topicAnswer = res.answer || "Unknown answer";
  answerReport += `${topicAnswer}\n`;

  for (const citation of res.citations) {
    if (citation.url) {
      incitations += `${citation.url}\n`;
      citations.push(citation.url);
    }
  }

  answerReport += `## CITATIONS: \n ${incitations}`;

  console.log(answerReport);
  console.log(citations);

  const answer: SimpleSearch = {
    answer: answerReport.trim(),
    citations: citations,
  };

  return answer;
}

export async function imageSearch(query: string): Promise<string[]> {
  let images: string[] = [];

  const diagramres = await tvly.search(query, {
    searchDepth: "basic",
    includeImages: true,
    includeImageDescriptions: true,
  });

  const diagram = diagramres.images[0];
  if (diagram.description) {
    images.push(`![${diagram.description}](${diagram.url})\n`);
  }

  console.log(images);

  return images;
}

export async function searchWeb(
  searchQuery: string,
  depth: number,
  withCitations: boolean
): Promise<string> {
  if (depth >= MAX_DEPTH) {
    const questionSet = withCitations
      ? pickedQuestionSetCitations
      : pickedQuestionSet;
    const finalReport = withCitations
      ? `**Report: ** \n ${reportWithCitationBuilder}\n **Statistics: ** \n ${statsReport}\n **Images:** \n ${relatedImages} \n**Citations:** \n ${citations}`
      : `**Report: ** \n ${reportBuilder}\n **Statistics: ** \n${statsReport} \n **Images: ** \n${relatedImages}`;

    logData("FINAL REPORT:", finalReport);

    logData("Question Set:", questionSet.join(", "));
    logData("Set Question Set:", statsQuestionSet.join(", "));

    const reportPath = await createReport(
      "local-report",
      finalReport,
      "markdown"
    );
    const logpath = await createReport("local-log", logger, "text");

    console.log("Local report Generated at: ", reportPath);
    console.log("Logger report Generated at: ", logpath);

    return finalReport;
  }

  const res = await tvly.search(searchQuery, {
    maxTokens: 1000,
    searchDepth: "basic",
    includeRawContent: "text",
    includeAnswer: true,
    includeImages: true,
    includeImageDescriptions: true,
  });

  const topicAnswer = res.answer || "No answer found";
  reportBuilder += `${topicAnswer}\n`;

  const searchDiagram = await ImageQueryAgent.generate(
    `Generate a search query for following: ${topicAnswer}`
  );

  logData("Image Diagram Query", searchDiagram.text);

  const diagramres = await tvly.search(searchDiagram.text, {
    searchDepth: "basic",
    includeImages: true,
    includeImageDescriptions: true,
  });

  if (imageCount < MAX_DEPTH) {
    // limit the image search to not get rate limited and get the most top root images
    const diagram = diagramres.images[0];
    if (diagram.description) {
      logData(
        "Candidate Diagram: ",
        `![${diagram.description}](${diagram.url})\n`
      );
      relatedImages += `![${diagram.description}](${diagram.url})\n`;
    }
  }
  imageCount++;

  if (withCitations && res.results.length >= 2) {
    return handleCitations(res, topicAnswer, depth);
  }

  return handleQuestions(topicAnswer, depth, withCitations);
}

async function handleCitations(
  res: any,
  topicAnswer: string,
  depth: number
): Promise<string> {
  logData("CURRENT DEPTH:", (depth + 1).toString());

  const [firstResult, lastResult] = res.results;

  const pickedContent = await ContentPickerAgent.generate(
    `Pick content: ${firstResult.content} or ${lastResult.content}`
  );

  logData("CONTENT CHOICE:", pickedContent.text);

  const selectedResult = pickedContent.text === "1" ? firstResult : lastResult;
  reportWithCitationBuilder += `${selectedResult.content}\n${topicAnswer}\n`;
  citations += `${selectedResult.url}\n`;

  const followUpQuestion = await QuestionAgent.generate(
    `Generate a different follow-up research question about: ${topicAnswer} in the context of ${selectedResult.content}`
  );

  logData("Initial Question:", followUpQuestion.text);

  const validatedQuestion = await CustomQuestionAgent.generate(
    `Set: [${pickedQuestionSetCitations.join(", ")}] TARGET: ${followUpQuestion.text}`
  );

  logData("Validated Question:", validatedQuestion.text);

  const statQuery = await StatsAgent.generate(
    `Create a stat search query for: ${validatedQuestion.text}`
  );

  logData("Stat generated Query: ", statQuery.text);

  const statans = await exa.answer(statQuery.text);

  const answer = statans.answer || "No answer found";
  statsReport += `${answer}\n`;

  pickedQuestionSetCitations.push(validatedQuestion.text);
  if (statans.citations) {
    for (const citation of statans.citations) {
      if (citation.url) {
        citations += `${citation.url}\n`;
      }
    }
  }
  statsQuestionSet.push(statQuery.text);

  return searchWeb(validatedQuestion.text, depth + 1, true);
}

async function handleQuestions(
  topicAnswer: string,
  depth: number,
  withCitations: boolean
): Promise<string> {
  logData("CURRENT DEPTH:", (depth + 1).toString());

  const question1 = await QuestionAgent.generate(
    `Generate a different follow-up research question for: ${topicAnswer}`
  );
  const validatedQuestion1 = await CustomQuestionAgent.generate(
    `Set: [${pickedQuestionSet.join(", ")}] TARGET: ${question1.text}`
  );

  const question2 = await QuestionAgent.generate(
    `Generate a different question from: ${validatedQuestion1.text}`
  );
  const validatedQuestion2 = await CustomQuestionAgent.generate(
    `Set: [${pickedQuestionSet.join(", ")}] TARGET: ${question2.text}`
  );

  const finalQuestion = await QuestionPickerAgent.generate(
    `Pick a question: ${validatedQuestion1.text} or ${validatedQuestion2.text}`
  );

  const statQuery = await StatsAgent.generate(
    `Create a stat search query for: ${finalQuestion.text}`
  );

  const res = await exa.answer(statQuery.text);

  const answer = res.answer || "No answer found";
  statsReport += `${answer}\n`;

  pickedQuestionSet.push(finalQuestion.text);
  statsQuestionSet.push(statQuery.text);

  logData("Initial Generated Question 1:", question1.text);
  logData("Initial Generated Question 2:", question2.text);
  logData("Generated Question 1:", validatedQuestion1.text);
  logData("Generated Question 2:", validatedQuestion2.text);
  logData("Selected Question:", finalQuestion.text);
  logData("Generated Stat Search Query:", statQuery.text);

  return searchWeb(finalQuestion.text, depth + 1, withCitations);
}

function logData(label: string, data: string) {
  console.log(label, data);
  logger += `${label} ${data}\n`;
}
