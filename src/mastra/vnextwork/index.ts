import { NewAgentNetwork } from '@mastra/core/network/vNext';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import {  simpleSearchAgent } from '../agents';
import { CustomQuestionAgent, QuestionAgent, QuestionPickerAgent, StatsAgent, ImageQueryAgent } from '../tools';
import { MEMORY } from '../config/config';
import { reportFormattingAgent } from '../agents';


// WORK IN PROGRESS 

// Step 1: Generate 2 questions
const generateQuestionsStep = createStep({
  id: 'generate-questions',
  description: 'Generate 2 research questions for the current level',
  inputSchema: z.object({
    topic: z.string().describe('The research topic or context'),
    level: z.number().describe('Current research level'),
    previousContext: z.string().optional().describe('Context from previous levels'),
    previousQuestions: z.array(z.string()).optional().describe('Previous questions from earlier levels'),
  }),
  outputSchema: z.object({
    questions: z.array(z.string()).describe('Array of 2 generated questions'),
  }),
  execute: async ({ inputData }) => {
    const prompt = `Topic: ${inputData.topic}
    Level: ${inputData.level}
    ${inputData.previousContext ? `Previous Context: ${inputData.previousContext}` : ''}
    
    Generate exactly 2 specific, researchable questions for this level.`;

    const resp = await QuestionAgent.generate(prompt, {
      output: z.object({
        questions: z.array(z.string()),
      }),
    });

    return { questions: resp.object.questions };
  },
});

// Step 2: Validate 2 questions
const validateQuestionsStep = createStep({
  id: 'validate-questions',
  description: 'Validate the generated questions for uniqueness and quality',
  inputSchema: z.object({
    topic: z.string().describe('The research topic or context'),
    level: z.number().describe('Current research level'),
    previousContext: z.string().optional().describe('Context from previous levels'),
    previousQuestions: z.array(z.string()).optional().describe('Previous questions from earlier levels'),
    questions: z.array(z.string()).describe('Questions to validate'),
  }),
  outputSchema: z.object({
    validatedQuestions: z.array(z.object({
      question: z.string(),
      isValid: z.boolean(),
      score: z.number(),
      reasoning: z.string(),
    })),
  }),
  execute: async ({ inputData }) => {
    const prompt = `Questions to validate: ${JSON.stringify(inputData.questions)}
    Previous questions: ${JSON.stringify(inputData.previousQuestions || [])}
    
    Validate each question for uniqueness, clarity, and research value.`;

    const resp = await CustomQuestionAgent.generate(prompt, {
      output: z.object({
        validatedQuestions: z.array(z.object({
          question: z.string(),
          isValid: z.boolean(),
          score: z.number(),
          reasoning: z.string(),
        })),
      }),
    });

    return { validatedQuestions: resp.object.validatedQuestions };
  },
});

// Step 3: Pick validated question
const pickQuestionStep = createStep({
  id: 'pick-question',
  description: 'Select the best validated question for research',
  inputSchema: z.object({
    topic: z.string().describe('The research topic or context'),
    level: z.number().describe('Current research level'),
    previousContext: z.string().optional().describe('Context from previous levels'),
    previousQuestions: z.array(z.string()).optional().describe('Previous questions from earlier levels'),
    questions: z.array(z.string()).describe('Questions to validate'),
    validatedQuestions: z.array(z.object({
      question: z.string(),
      isValid: z.boolean(),
      score: z.number(),
      reasoning: z.string(),
    })),
  }),
  outputSchema: z.object({
    selectedQuestion: z.string(),
  }),
  execute: async ({ inputData }) => {
    const prompt = `Validated questions: ${JSON.stringify(inputData.validatedQuestions)}
    
    Select the most promising question for research.`;

    const resp = await QuestionPickerAgent.generate(prompt, {
      output: z.object({
        selectedQuestion: z.string(),
      }),
    });

    return { selectedQuestion: resp.object.selectedQuestion };
  },
});

// Step 4: Search the answer
const searchAnswerStep = createStep({
  id: 'search-answer',
  description: 'Search for comprehensive answer to the selected question',
  inputSchema: z.object({
    topic: z.string().describe('The research topic or context'),
    level: z.number().describe('Current research level'),
    previousContext: z.string().optional().describe('Context from previous levels'),
    previousQuestions: z.array(z.string()).optional().describe('Previous questions from earlier levels'),
    questions: z.array(z.string()).describe('Questions to validate'),
    validatedQuestions: z.array(z.object({
      question: z.string(),
      isValid: z.boolean(),
      score: z.number(),
      reasoning: z.string(),
    })),
    selectedQuestion: z.string().describe('The selected question to research'),
  }),
  outputSchema: z.object({
    answer: z.string(),
    sources: z.array(z.string()).optional(),
  }),
  execute: async ({ inputData }) => {
    const prompt = `Research question: ${inputData.selectedQuestion}
    ${inputData.previousContext ? `Context: ${inputData.previousContext}` : ''}
    
    Find comprehensive, credible information to answer this question.`;

    const resp = await simpleSearchAgent.generate(prompt, {
      output: z.object({
        answer: z.string(),
        sources: z.array(z.string()).optional(),
      }),
    });

    return { 
      answer: resp.object.answer,
      sources: resp.object.sources 
    };
  },
});

// Step 5: Generate image query
const generateImageQueryStep = createStep({
  id: 'generate-image-query',
  description: 'Generate targeted image search query',
  inputSchema: z.object({
    topic: z.string().describe('The research topic or context'),
    level: z.number().describe('Current research level'),
    previousContext: z.string().optional().describe('Context from previous levels'),
    previousQuestions: z.array(z.string()).optional().describe('Previous questions from earlier levels'),
    questions: z.array(z.string()).describe('Questions to validate'),
    validatedQuestions: z.array(z.object({
      question: z.string(),
      isValid: z.boolean(),
      score: z.number(),
      reasoning: z.string(),
    })),
    selectedQuestion: z.string().describe('The selected question to research'),
    answer: z.string().describe('The answer context for image search'),
    sources: z.array(z.string()).optional().describe('Sources from answer search'),
  }),
  outputSchema: z.object({
    imageQuery: z.string(),
  }),
  execute: async ({ inputData }) => {
    const prompt = `Question: ${inputData.selectedQuestion}
    Answer context: ${inputData.answer}
    
    Generate a specific image search query for relevant diagrams, charts, or infographics.`;

    const resp = await ImageQueryAgent.generate(prompt, {
      output: z.object({
        imageQuery: z.string(),
      }),
    });

    return { imageQuery: resp.object.imageQuery };
  },
});

// Step 6: Search images
const searchImagesStep = createStep({
  id: 'search-images',
  description: 'Search for relevant images and diagrams',
  inputSchema: z.object({
    topic: z.string().describe('The research topic or context'),
    level: z.number().describe('Current research level'),
    previousContext: z.string().optional().describe('Context from previous levels'),
    previousQuestions: z.array(z.string()).optional().describe('Previous questions from earlier levels'),
    questions: z.array(z.string()).describe('Questions to validate'),
    validatedQuestions: z.array(z.object({
      question: z.string(),
      isValid: z.boolean(),
      score: z.number(),
      reasoning: z.string(),
    })),
    selectedQuestion: z.string().describe('The selected question to research'),
    answer: z.string().describe('The answer context for image search'),
    sources: z.array(z.string()).optional().describe('Sources from answer search'),
    imageQuery: z.string().describe('The image query to search'),
  }),
  outputSchema: z.object({
    images: z.array(z.object({
      url: z.string(),
      description: z.string(),
      relevance: z.string(),
    })),
  }),
  execute: async ({ inputData }) => {
    const resp = await simpleSearchAgent.generate(inputData.imageQuery, {
      output: z.object({
        images: z.array(z.object({
          url: z.string(),
          description: z.string(),
          relevance: z.string(),
        })),
      }),
    });

    return { images: resp.object.images };
  },
});

// Step 7: Generate stats query
const generateStatsQueryStep = createStep({
  id: 'generate-stats-query',
  description: 'Generate query for statistical data',
  inputSchema: z.object({
    topic: z.string().describe('The research topic or context'),
    level: z.number().describe('Current research level'),
    previousContext: z.string().optional().describe('Context from previous levels'),
    previousQuestions: z.array(z.string()).optional().describe('Previous questions from earlier levels'),
    questions: z.array(z.string()).describe('Questions to validate'),
    validatedQuestions: z.array(z.object({
      question: z.string(),
      isValid: z.boolean(),
      score: z.number(),
      reasoning: z.string(),
    })),
    selectedQuestion: z.string().describe('The selected question to research'),
    answer: z.string().describe('The answer context for stats search'),
    sources: z.array(z.string()).optional().describe('Sources from answer search'),
    imageQuery: z.string().describe('The image query from previous step'),
    images: z.array(z.object({
      url: z.string(),
      description: z.string(),
      relevance: z.string(),
    })).describe('Images from previous step'),
  }),
  outputSchema: z.object({
    statsQuery: z.string(),
  }),
  execute: async ({ inputData }) => {
    const prompt = `Question: ${inputData.selectedQuestion}
    Answer context: ${inputData.answer}
    
    Generate a query to find relevant statistics and quantitative data.`;

    const resp = await StatsAgent.generate(prompt, {
      output: z.object({
        statsQuery: z.string(),
      }),
    });

    return { statsQuery: resp.object.statsQuery };
  },
});

// Step 8: Search stats
const searchStatsStep = createStep({
  id: 'search-stats',
  description: 'Search for statistical data and quantitative information',
  inputSchema: z.object({
    topic: z.string().describe('The research topic or context'),
    level: z.number().describe('Current research level'),
    previousContext: z.string().optional().describe('Context from previous levels'),
    previousQuestions: z.array(z.string()).optional().describe('Previous questions from earlier levels'),
    questions: z.array(z.string()).describe('Questions to validate'),
    validatedQuestions: z.array(z.object({
      question: z.string(),
      isValid: z.boolean(),
      score: z.number(),
      reasoning: z.string(),
    })),
    selectedQuestion: z.string().describe('The selected question to research'),
    answer: z.string().describe('The answer context for stats search'),
    sources: z.array(z.string()).optional().describe('Sources from answer search'),
    imageQuery: z.string().describe('The image query from previous step'),
    images: z.array(z.object({
      url: z.string(),
      description: z.string(),
      relevance: z.string(),
    })).describe('Images from previous step'),
    statsQuery: z.string().describe('The stats query to search'),
  }),
  outputSchema: z.object({
    statistics: z.array(z.object({
      statistic: z.string(),
      source: z.string(),
      context: z.string(),
    })),
  }),
  execute: async ({ inputData }) => {
    const resp = await simpleSearchAgent.generate(`Find statistics for: ${inputData.statsQuery}`, {
      output: z.object({
        statistics: z.array(z.object({
          statistic: z.string(),
          source: z.string(),
          context: z.string(),
        })),
      }),
    });

    return { statistics: resp.object.statistics };
  },
});

// Step 9: Generate and save report
const generateReportStep = createStep({
  id: 'generate-report',
  description: 'Generate comprehensive research report and save locally',
  inputSchema: z.object({
    topic: z.string().describe('The research topic or context'),
    level: z.number().describe('Current research level'),
    previousContext: z.string().optional().describe('Context from previous levels'),
    previousQuestions: z.array(z.string()).optional().describe('Previous questions from earlier levels'),
    questions: z.array(z.string()).describe('Questions to validate'),
    validatedQuestions: z.array(z.object({
      question: z.string(),
      isValid: z.boolean(),
      score: z.number(),
      reasoning: z.string(),
    })),
    selectedQuestion: z.string().describe('The selected question to research'),
    answer: z.string().describe('The answer context for stats search'),
    sources: z.array(z.string()).optional().describe('Sources from answer search'),
    imageQuery: z.string().describe('The image query from previous step'),
    images: z.array(z.object({
      url: z.string(),
      description: z.string(),
      relevance: z.string(),
    })).describe('Images from previous step'),
    statsQuery: z.string().describe('The stats query to search'),
    statistics: z.array(z.object({
      statistic: z.string(),
      source: z.string(),
      context: z.string(),
    })).describe('Statistics from previous step'),
  }),
  outputSchema: z.object({
    report: z.string().describe('The generated markdown report'),
  }),
  execute: async ({ inputData }) => {
    // Generate comprehensive report using the formatting agent
    const reportPrompt = `Generate a comprehensive research report for the following:

**Research Topic:** ${inputData.topic}
**Research Level:** ${inputData.level}

**Research Question:** ${inputData.selectedQuestion}

**Key Findings:**
${inputData.answer}

${inputData.previousContext ? `\n**Previous Research Context:**\n${inputData.previousContext}` : ''}

Please format this as a professional markdown research report with:
1. Executive Summary
2. Research Question & Methodology
3. Key Findings
4. Supporting Data & Statistics
5. Visual Evidence
6. Conclusions
7. Sources & References

Make it comprehensive, well-structured, and suitable for academic or professional use.`;

    const resp = await reportFormattingAgent.generate(reportPrompt, {
    });

   

    return {
      report: resp.text,
    };
  },
});

// Workflow for single research level
export const researchLevelWorkflow = createWorkflow({
  id: 'research-level',
  description: 'Complete research cycle for one level',
  steps: [],
  inputSchema: z.object({
    topic: z.string(),
    level: z.number(),
    previousContext: z.string().optional(),
    previousQuestions: z.array(z.string()).optional(),
    
  }),
  outputSchema: z.object({
    question: z.string(),
    answer: z.string(),
    images: z.array(z.object({
      url: z.string(),
      description: z.string(),
      relevance: z.string(),
    })),
    statistics: z.array(z.object({
      statistic: z.string(),
      source: z.string(),
      context: z.string(),
    })),
    sources: z.array(z.string()).optional(),
  }),
})
  .then(generateQuestionsStep)
  .then(validateQuestionsStep)
  .then(pickQuestionStep)
  .then(searchAnswerStep)
  .then(generateImageQueryStep)
  .then(searchImagesStep)
  .then(generateStatsQueryStep)
  .then(searchStatsStep)
  .then(generateReportStep)
  .commit();


// Create the RecurSearch Network
export const recurSearchVNetwork = new NewAgentNetwork({
  id: 'recursearch-network',
  name: 'RecurSearch Decision Tree Network',
  instructions: `You are a recursive research system that follows a decision tree approach. 
  
  For each research topic, you:
  1. Generate and validate research questions
  2. Pick the best question path
  3. Search for comprehensive answers
  4. Find relevant images and statistics
  5. Repeat across multiple levels
  6. Synthesize into a final report
  7. Generate a local copy for the report
  
  Use the recursive-research workflow for comprehensive multi-level research, or research-level for single-level investigations.`,
  model: openai('gpt-4o'),
  agents: {
    QuestionAgent,
    CustomQuestionAgent,
    QuestionPickerAgent,
    simpleSearchAgent,
    ImageQueryAgent,
    StatsAgent,
    reportFormattingAgent,
  },
  workflows: {
    researchLevelWorkflow,
  },
  memory: MEMORY,
});