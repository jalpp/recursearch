
import { Mastra } from '@mastra/core/mastra';

import { PinoLogger } from '@mastra/loggers';
import { searchAgent} from './agents';
import { ContentPickerAgent, CustomQuestionAgent, QuestionAgent, QuestionPickerAgent, StatsAgent, ImageQueryAgent } from './tools';
import { debateSimulationNetwork, recursearchNetwork, recursearchReflectionNetwork } from './networks';
import { recurSearchVNetwork, researchLevelWorkflow } from './vnextwork';
export const mastra = new Mastra({
  agents: { searchAgent, QuestionAgent, QuestionPickerAgent, ContentPickerAgent, CustomQuestionAgent, StatsAgent, ImageQueryAgent },
  networks: {recursearchNetwork, recursearchReflectionNetwork, debateSimulationNetwork },
  vnext_networks: {recurSearchVNetwork},
  workflows: {researchLevelWorkflow},
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
