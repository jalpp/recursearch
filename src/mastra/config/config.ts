import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import {
  AnswerRelevancyMetric,
  BiasMetric,
  ToxicityMetric,
} from "@mastra/evals/llm";
import { ToneConsistencyMetric } from "@mastra/evals/nlp";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { perplexity } from "@ai-sdk/perplexity";
import { LanguageModel } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { RuntimeContext } from "@mastra/core/runtime-context";
import { OpenAIChatModelId } from "@ai-sdk/openai/internal";
import { AnthropicMessagesModelId } from "@ai-sdk/anthropic/internal";

type GoogleModel = 
    | 'gemini-1.5-pro' 
    | 'gemini-1.5-flash'
    | 'gemini-2.0-flash'        
    | 'gemini-2.0-flash-lite'     
    | 'gemini-2.5-flash'     
    | 'gemini-2.5-pro'                         

type Provider = "openai" | "anthropic" | "google" | "perplexity";

// change if needed
const settingRunTimeContext = new RuntimeContext();
settingRunTimeContext.set("provider", "openai");
settingRunTimeContext.set("model", "gpt-4o")

// change if needed
export const MAX_DEPTH = 5;

export function getCurrentModel(runtimeContext: RuntimeContext): LanguageModel {
  const provider = runtimeContext.get('provider') as Provider;
  const model = runtimeContext.get('model');

  if(provider && model){
    switch (provider) {
    case "openai":
      return openai(model as OpenAIChatModelId);
    case "google":
      return google(model as GoogleModel);
    case "anthropic":
      return anthropic(model as AnthropicMessagesModelId);
    case "perplexity":
      return perplexity("sonar-pro");
  }
  }else{
    return getCurrentModel(settingRunTimeContext);
  }
  
}


export const MEMORY = new Memory({
  storage: new LibSQLStore({ url: "file:../mastra.db" }),
});

export const EVALS = {
  answerRelevancy: new AnswerRelevancyMetric(settingRunTimeContext.get('model')),
  bias: new BiasMetric(settingRunTimeContext.get('model')),
  toxic: new ToxicityMetric(settingRunTimeContext.get('model')),
  tone: new ToneConsistencyMetric(),
};
