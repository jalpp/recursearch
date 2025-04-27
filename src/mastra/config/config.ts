import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { AnswerRelevancyMetric, BiasMetric, ToxicityMetric } from '@mastra/evals/llm';
import { ToneConsistencyMetric } from "@mastra/evals/nlp";


export const MODEL = openai("gpt-4o")
export const MEMORY = new Memory();
export const EVALS = {answerRelevancy: new AnswerRelevancyMetric(MODEL), bias: new BiasMetric(MODEL), toxic: new ToxicityMetric(MODEL), tone: new ToneConsistencyMetric()}


