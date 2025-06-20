import { openai } from "@ai-sdk/openai";

import { Memory } from "@mastra/memory";
import { AnswerRelevancyMetric, BiasMetric, ToxicityMetric } from '@mastra/evals/llm';
import { ToneConsistencyMetric } from "@mastra/evals/nlp";
import { google } from "@ai-sdk/google";
import { anthropic } from '@ai-sdk/anthropic';
import { perplexity } from '@ai-sdk/perplexity';
import { LanguageModel } from "@mastra/core";
import { LibSQLVector } from '@mastra/libsql';

enum ModelType { // add other one if needed
    GPT = "gpt",
    GEMINI = "gemini",
    CLAUDE = "claude",
    PERPLEXITY = "perplexity"
}

const CURRENT_MODEL: ModelType = ModelType.GPT; // change model

export function getCurrentModel(currentModel: ModelType): LanguageModel {
    switch (currentModel) {
        case ModelType.GPT:
            return openai("gpt-4o");
        case ModelType.GEMINI:
            return google('gemini-1.5-flash');
        case ModelType.CLAUDE:
            return anthropic('claude-3-sonnet-20240229');
        case ModelType.PERPLEXITY:
            return perplexity('sonar-pro');
    }
}

export const MODEL = getCurrentModel(CURRENT_MODEL);
export const MEMORY = new Memory({
    options: {
        lastMessages: 10,
        semanticRecall: false,
        threads: {
          generateTitle: false
        }
      },
    vector: new LibSQLVector({
      connectionUrl: 'file:../memory.db'
    })
});
export const EVALS = {answerRelevancy: new AnswerRelevancyMetric(MODEL), bias: new BiasMetric(MODEL), toxic: new ToxicityMetric(MODEL), tone: new ToneConsistencyMetric()}


