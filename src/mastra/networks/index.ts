import { AgentNetwork } from "@mastra/core/network";
import { openai } from "@ai-sdk/openai";
import { citationAgent, imageSearchAgent, reportFormattingAgent, simpleSearchAgent } from "../agents";
import { CustomQuestionAgent, ImageQueryAgent, QuestionAgent, QuestionPickerAgent, StatsAgent } from "../tools";

const recurFlow = `
 Given this agents generate the report in a decision tree fashion, pick the logical path by validating questions, for each level make sure you search an image, and stats for that validated question.
## RECURSEARCH TREE FLOW:
    Generate 2 questions
    validate 2 questions
    Pick a validated question
    Search the answer
    Generate a image diagram question
    Search the image diagram
    Generate a stat question
    Search the stat question
    Repeat at each level`

export const recursearchNetwork = new AgentNetwork({
    name: 'Research Network',
    instructions: `
    Coordinate specialized agents to write a comprehensive research report that contains stats, images, and citations.
    Finally format the report and generate a local copy
    Your coordination must maximize best research report  
    `,
    model: openai('gpt-4o'),
    agents: [simpleSearchAgent, imageSearchAgent, reportFormattingAgent, QuestionAgent, QuestionPickerAgent, CustomQuestionAgent, ImageQueryAgent, StatsAgent, citationAgent],
  });