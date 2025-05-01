# 🌐 RecurSearch

**RecurSearch** is an AI-driven recursive web research tool designed to mimic OpenAI's Deep Research. It can search the web recursively to generate comprehensive research reports with or without citations.

## Features

- **Recursive Web Search**: Perform multi-layered web searches, diving deeper into follow-up questions.
- **AI-Powered Agents**: Specialized agents for generating, validating, and picking research questions and web content.
- **Stats support**: the reports are backed by stats 
- **Images:** the reports contain related research focused searched images
- **Pages:** the report can be generated up to 2 pages
- **Logging** with reports, the local generated copy by all the agents plus log data is kept in local-log and local-report files to explore agents answers
- **Citations Support**: Option to generate research reports with citations.
- **Customizable Depth**: Control the search depth of research.
- **Auto Generated Report**: the reports, logs, and local report are automatically generated locally by agent
- **Evals Report**: There are eval report generated for each research report that measure toxicity, bias, answer relevancy score and the reason for the score.

# AgentNetwork 

- Recursearch also has support for Mastra's AgentNetwork

## Installation

Ensure you have **Node.js v20+** installed, then add the dependencies:

```bash

cd recursearch
npm i
```

Set up env variables in `.env.development`:

```
OPENAI_API_KEY=your-openai-api-key // change according to model you using
TAVILY_API_KEY=your-tavily-api-key
EXA_API_KEY=your-exa-api-key

```

Run Mastra Dev server to create reports

```
npm run dev

```

Go to search agent and ask it to generate reports, the search agent also as memory enabled so you can ask previous questions

For AgentNetwork go to networks tab and ask it to generate reports.

## Model Config

You can change the working base model of recursearch by going to `config/config.ts` and changing the value of `CURRENT_MODEL` variable, the env variable names for the providers can be found [here](https://sdk.vercel.ai/providers/ai-sdk-providers)

Right now the following models come out of box

- GPT (defualt)
- Gemini: gemini-1.5-flash 
- Anthropic: claude-3-sonnet-20240229
- Perplexity: sonar-pro

The `config/README.md` has a small guide on how to use other models, technically all models that are supported by ai-sdk can be imported but I only have added few in the config file.

The `getCurrentModel()` can be directly used in agents property to define a system where different agents are part of various models, though all agents of recursearch use one base model, eventually I will add an example on how to do that.

## RecurSearch Agents
RecurSearch leverages multiple AI agents with distinct roles:

- **Search Agent**
Understands users query to call the searchAgentTool which kicks of MAS, its also responsible understand and format the report to meet user defined requirements.

- **Question Agent:**
Generates thought-provoking follow-up research questions based on content.

- **Custom Question Agent:**
Validates whether a newly generated question is thematically unique or overlaps with existing ones.

- **Question Picker Agent:**
Compares pairs of research questions and selects the most research-focused one.

- **Stats Agent**
Responsible for generating stats question for given running question to support research content by data

- **Image Agent**
Responsible for generating image search query for given running answer, to ensure images are research quality

- **Content Picker Agent:**
Evaluates and picks the most relevant and credible web source from two given options. [When Citations are required]

This Agents collabrate in a team to recursively search the web, and in a decision tree manner pick the best path in the tree to come up with the report.

## RecurSearch AgentNetwork


### Recursearch version
RecurSearch integrates a robust AgentNetwork comprising the following specialized agents:

- **simpleSearchAgent**: Conducts straightforward web searches to gather initial data for research topics.
- **imageSearchAgent**: Searches for high-quality, research-relevant images to enhance the report.
- **reportFormattingAgent**: Ensures the final report adheres to user-defined formatting and presentation requirements.
- **QuestionAgent**: Generates insightful follow-up questions to deepen the research process.
- **QuestionPickerAgent**: Selects the most research-focused question from a set of generated options.
- **CustomQuestionAgent**: Validates the uniqueness of newly generated questions to avoid redundancy.
- **ImageQueryAgent**: Creates precise image search queries to ensure the inclusion of relevant visuals.
- **StatsAgent**: Generates statistical queries and integrates data to support research findings.
- **citationAgent**: Identifies and incorporates credible sources to provide citations for the research report.

### Reflection Version
There is also a reflection version that uses the above agents 
- **PlannerAgent**: Creates a structured plan for the research process, outlining the sequence of tasks and agent interactions.
- **PlannerEvalAgent**: Evaluates the effectiveness and feasibility of the research plan created by the PlannerAgent.
- **ReportEvalAgent**: Assesses the quality, accuracy, and completeness of the final research report, providing feedback for improvements.

### Debate Version

The Debate Version introduces agents designed to simulate a debate-like process to refine research findings and ensure diverse perspectives are considered. These agents include:

- **ResearchPresenterAgent**: Engages in a debate with other agents, presenting arguments for or against specific research findings or questions.
- **ResearchCriticAgent**: Generates counterarguments to challenge the points raised by the Presenter, fostering a balanced discussion.
- **ReportJudgeAgent**: Evaluates the arguments and counterarguments to determine the most credible and well-supported conclusions.


This version is particularly useful for exploring controversial topics or areas with conflicting information, as it encourages a thorough examination of multiple viewpoints. The reports generated by the Debate Version aim to present a balanced and well-rounded perspective on the research topic. Note the reports do not contain stats/facts as this agents don't use tools this was done on purpose to see how they argue without web data.

These agents collaborate in a multi-agent system, working together to refine and enhance the research process, the reports 
generated by AgentNetwork is not as accurate as Recursearch, yet they can generate a good report template.

## Highlevel Overview
can view digrams to understand the flow.

## Examples

### Recursearch Reports (`reports/tree`)
These reports were **entirely generated by the agents** without any manual edits or modifications.  
Each report has accompanying **preview screenshots** as proof of authenticity.

Example topics:
- The Influence of Chronic Stress on Immune System Function
- Impact of AI-Generated Content on Journalism and Media Credibility
- Impact of Music Therapy on Individuals with Depression
- How LLMs work

---

### AgentNetwork Reports

#### Normal Version (`reports/network/normal`)
These are **AgentNetwork-generated reports**.  
They may vary in **fact quality, citations, and image selection**, but overall provide solid **template-style reports**.  
Again, **no manual edits** were made.

Example topics:
- General Report on Recommendation Algorithms and User Behavior on Social Media
- Impact of Music Therapy on Individuals with Depression
- The Influence of Chronic Stress on Immune System Function

#### Reflection Version (`reports/network/planaftereval`)
These are **reflection-based versions** of the normal AgentNetwork reports.  
- it contains how LLMs work report 

---

### Debated Reports (`reports/network/debate`)
These reports were created through **agent debates** and **judged** without using real-world data, statistics, or web research.  
They showcase **how agents argue points** purely based on internal reasoning.

Example topics:
- Benefits of Debate on Research Reports
- Music Therapy’s Influence on Depression
- Phone Usage vs. Mental Health


## Use/Terms

this tool was created to research how agents can generate research reports, the tool must not be used unethically, the authors of recursearch take no responsibility in doing so.

## Papers:

Recursearch was inspired by following paper:

- [Multi-Agent Collaboration Mechanisms: A Survey of LLMs](https://arxiv.org/pdf/2501.06322)


## License

GPL

Please see the license requirements

## Authors:

- @jalpp 











