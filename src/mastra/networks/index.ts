import { AgentNetwork } from "@mastra/core/network";
import { openai } from "@ai-sdk/openai";
import { citationAgent, imageSearchAgent, plannerAgent, reportFormattingAgent, simpleSearchAgent, evaluatorAgent, researchPlanEvaluatorAgent, topicGeneratorAgent } from "../agents";
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
    Use topic agent IF USER DOES NOT PROVIDE A QUERY/TOPIC
    **Perform each task sequentially AVOID PARALLEL EXECUTION OF AGENTS/TOOLS**
    **AVOID TASK LOOPS or recursive calls**
    Coordinate specialized agents to write a comprehensive research report that contains stats, images, and citations.
    Finally format the report and generate a local copy
    Your coordination must maximize best research report  
    `,
    model: openai('gpt-4o'),
    agents: [topicGeneratorAgent,simpleSearchAgent, imageSearchAgent, reportFormattingAgent, QuestionAgent, QuestionPickerAgent, CustomQuestionAgent, ImageQueryAgent, StatsAgent, citationAgent],
  });


  export const recursearchReflectionNetwork = new AgentNetwork({
    name: 'Recursearch reflection based',
    instructions: `
    Use topic agent IF USER DOES NOT PROVIDE A QUERY/TOPIC
    **Perform each task sequentially AVOID PARALLEL EXECUTION OF AGENTS/TOOLS**
    **AVOID TASK LOOPS or recursive calls**
    Coordinate specialized agents to write a comprehensive research report that contains stats, images, and citations.
    You must use planner agent to create a plan.
    You must evaluate the research plan.
    coordinate the other agents according to the plan to create a research report.
    format the research report.
    You must evaluate the research report using eval report agent, based on the feedback fine tune the research report.
    Finally format the fixed report and generate a local copy
    Your coordination must maximize best research report  
    `,
    model: openai('gpt-4o'),
    agents: [topicGeneratorAgent, plannerAgent, researchPlanEvaluatorAgent, evaluatorAgent, simpleSearchAgent, imageSearchAgent, reportFormattingAgent, QuestionAgent, QuestionPickerAgent, CustomQuestionAgent, ImageQueryAgent, StatsAgent, citationAgent],
  });
