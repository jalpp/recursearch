import { tavily } from '@tavily/core';
import { ContentPickerAgent, QuestionAgent, QuestionPickerAgent, CustomQuestionAgent } from '.';
import { createReport} from './report';

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const MAX_DEPTH = 5;

// Report and Citation Variables
let reportBuilder = '';
let reportWithCitationBuilder = '';
let citations = '';

// Question Tracking
const pickedQuestionSet: string[] = [];
const pickedQuestionSetCitations: string[] = [];

let logger = '';

export async function searchWeb(searchQuery: string, depth: number, withCitations: boolean): Promise<string> {
    if (depth >= MAX_DEPTH) {
        const finalReport = withCitations
            ? `${reportWithCitationBuilder}\n${citations}`
            : `${reportBuilder}\n`;

        logData('FINAL REPORT:', finalReport);

        const questionSet = withCitations ? pickedQuestionSetCitations : pickedQuestionSet;
        logData('Question Set:', questionSet.join(', '));

        const reportPath = await createReport('local-report', finalReport, "markdown");
        const logpath = await createReport('local-log', logger, "text");

        console.log('Local report Generated at: ', reportPath);
        console.log('Logger report Generated at: ',logpath);

        return finalReport;
    }

    const res = await tvly.search(searchQuery, {
        searchDepth: 'basic',
        includeRawContent: true,
        includeAnswer: true,
        includeImages: false,
    });

    const topicAnswer = res.answer || 'No answer found';
    reportBuilder += `${topicAnswer}\n`;

    if (withCitations && res.results.length >= 2) {
        return handleCitations(res, topicAnswer, depth);
    }

    return handleQuestions(topicAnswer, depth, withCitations);
}

async function handleCitations(res: any, topicAnswer: string, depth: number): Promise<string> {
    logData('CURRENT DEPTH:', (depth + 1).toString());

    const [firstResult, lastResult] = res.results;

    const pickedContent = await ContentPickerAgent.generate(
        `Pick content: ${firstResult.content} or ${lastResult.content}`
    );

    logData('CONTENT CHOICE:', pickedContent.text);

    const selectedResult = pickedContent.text === '1' ? firstResult : lastResult;
    reportWithCitationBuilder += `${selectedResult.content}\n${topicAnswer}\n`;
    citations += `${selectedResult.url}\n`;

    const followUpQuestion = await QuestionAgent.generate(
        `Generate a different follow-up research question about: ${topicAnswer} in the context of ${selectedResult.content}`
    );

    logData('Initial Question:', followUpQuestion.text);

    const validatedQuestion = await CustomQuestionAgent.generate(
        `Set: [${pickedQuestionSetCitations.join(', ')}] TARGET: ${followUpQuestion.text}`
    );

    logData('Validated Question:', validatedQuestion.text);

    pickedQuestionSetCitations.push(validatedQuestion.text);

    return searchWeb(validatedQuestion.text, depth + 1, true);
}

async function handleQuestions(topicAnswer: string, depth: number, withCitations: boolean): Promise<string> {
    logData('CURRENT DEPTH:', (depth + 1).toString());

    const question1 = await QuestionAgent.generate(`Generate a different follow-up research question for: ${topicAnswer}`);
    const validatedQuestion1 = await CustomQuestionAgent.generate(
        `Set: [${pickedQuestionSet.join(', ')}] TARGET: ${question1.text}`
    );

    const question2 = await QuestionAgent.generate(`Generate a different question from: ${validatedQuestion1.text}`);
    const validatedQuestion2 = await CustomQuestionAgent.generate(
        `Set: [${pickedQuestionSet.join(', ')}] TARGET: ${question2.text}`
    );

    const finalQuestion = await QuestionPickerAgent.generate(
        `Pick a question: ${validatedQuestion1.text} or ${validatedQuestion2.text}`
    );

    pickedQuestionSet.push(finalQuestion.text);

    logData('Initial Generated Question 1:', question1.text);
    logData('Initial Generated Question 2:', question2.text);
    logData('Generated Question 1:', validatedQuestion1.text);
    logData('Generated Question 2:', validatedQuestion2.text);
    logData('Selected Question:', finalQuestion.text);

    return searchWeb(finalQuestion.text, depth + 1, withCitations);
}

function logData(label: string, data: string) {
    console.log(label, data);
    logger += `${label} ${data}\n`;
}
