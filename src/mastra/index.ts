
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { searchAgent} from './agents';
import { ContentPickerAgent, CustomQuestionAgent, QuestionAgent, QuestionPickerAgent } from './tools';

export const mastra = new Mastra({
  agents: { searchAgent, QuestionAgent, QuestionPickerAgent, ContentPickerAgent, CustomQuestionAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
