# 🌐 RecurSearch

**RecurSearch** is a AI-driven recursive web research tool designed to mimic OpenAI's DeepSearch. It can search the web recursively to generate comprehensive research reports with or without citations.

## Features

- **Recursive Web Search**: Perform multi-layered web searches, diving deeper into follow-up questions.
- **AI-Powered Agents**: Specialized agents for generating, validating, and picking research questions and web content.
- **Stats support**: the reports are backed by stats 
- **Images:** the reports contain related research focused searched images
- **Pages:** the report can be generated up to 2 pages
- **Logging** with reports, the local generated copy by all the agents plus log data is kept in local-log and local-report files to explore agents answers
- **Citations Support**: Option to generate research reports with citations.
- **Customizable Depth**: Control the search depth of research.

## Installation

Ensure you have **Node.js v18+** installed, then add the dependencies:

```bash

cd recursearch
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

Go to search agent and ask it to generate reports.

## Agents
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

## Highlevel Overview
can view digrams to understand the flow.

![Recursearch non citations](https://github.com/jalpp/recursearch/blob/main/recursearchimg1.png)
![Recursearch citations](https://github.com/jalpp/recursearch/blob/main/recursearchqimgv2.png)

## Examples
the `reports` contain recursearch's reports that were solely generated by the agents and I didn't touch/modify them. There are preview screenshots for proofs. 

The examples include reports on
- The Influence of Chronic Stress on Immune System Function
- Impact of AI-Generated Content on Journalism and Media Credibility
- Impact of Music Therapy on Individuals with Depression

Preview:

![Preview](https://github.com/jalpp/recursearch/blob/main/preview/proofimage2.png)

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











