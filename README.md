# 🌐 RecurSearch

**RecurSearch** is a AI-driven recursive web research tool designed to mimic OpenAI's DeepSearch. It can search the web recursively to generate comprehensive research reports with or without citations.

## Features

- **Recursive Web Search**: Perform multi-layered web searches, diving deeper into follow-up questions.
- **AI-Powered Agents**: Specialized agents for generating, validating, and picking research questions and web content.
- **Stats support**: the reports are backed by stats 
- **Citations Support**: Option to generate research reports with citations.
- **Customizable Depth**: Control the search depth of research.

## Installation

Ensure you have **Node.js v18+** installed, then add the dependencies:

```bash

cd /recursearch
npm i
```

Set up env variables:

```
OPENAI_API_KEY=your-openai-api-key
TAVILY_API_KEY=your-tavily-api-key
EXA_API_KEY=your-exa-api-key

```

Run Mastra Dev server to create reports

```
npm run dev

```

## Agents
RecurSearch leverages multiple AI agents with distinct roles:

- **Search Agent**
Understands users query to call the searchAgentTool which kicks of the agents works
Take the generated report and finalize to meet user report requirements.

- **Question Agent:**
Generates thought-provoking follow-up research questions based on content.

- **Custom Question Agent:**
Validates whether a newly generated question is thematically unique or overlaps with existing ones.

- **Question Picker Agent:**
Compares pairs of research questions and selects the most research-focused one.

- **Stats Agent**
Responsible for generating stats question for given running question to support research content by data

- **Content Picker Agent:**
Evaluates and picks the most relevant and credible web source from two given options. [When Citations are required]

This Agents collabrate in a team to recursively search the web, and in a decision tree manner pick the best path in the tree to come up with the report.

## Highlevel Overview
can view digrams to understand the flow.

## Use/Terms

this tool was created to research how agents can generate research reports, the tool must not be used unethically, the authors of recursearch take no responsibility in doing so.

## License

MIT

## Authors:

- @jalpp











