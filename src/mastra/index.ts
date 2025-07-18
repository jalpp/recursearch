
import { Mastra } from '@mastra/core/mastra';
import { ConsoleLogger } from '@mastra/core/logger';

import { searchAgent} from './agents';
import { ContentPickerAgent, CustomQuestionAgent, QuestionAgent, QuestionPickerAgent, StatsAgent, ImageQueryAgent } from './tools';
import { debateSimulationNetwork, recursearchNetwork, recursearchReflectionNetwork } from './networks';

export const mastra = new Mastra({
  agents: { searchAgent, QuestionAgent, QuestionPickerAgent, ContentPickerAgent, CustomQuestionAgent, StatsAgent, ImageQueryAgent },
  networks: {recursearchNetwork, recursearchReflectionNetwork, debateSimulationNetwork },
  logger: new ConsoleLogger()
});
