# 🌐 RecurSearch

**RecurSearch** is an AI-driven recursive web research tool that performs comprehensive, multi-layered research similar to OpenAI's Deep Research. It uses specialized AI agents to generate detailed research reports with citations, statistics, and relevant images.

⚠️ This project is no longer maintained due to newer version of it worked on called OpenRecurSearch [here](https://github.com/jalpp/OpenRecurSearch) This project is in public archive as of 2026-09-26, 

do use and explore newer version which is faster, better! 

## ✨ Key Features

- **🔄 Recursive Web Search** - Multi-layered searches that dive deeper with intelligent follow-up questions
- **🤖 AI-Powered Agent System** - Specialized agents for research generation, validation, and content curation
- **📊 Statistical Support** - Reports backed by relevant data and statistics
- **🖼️ Intelligent Image Selection** - Research-focused image searches and integration
- **📄 Multi-Page Reports** - Generate comprehensive reports up to 2 pages
- **📝 Citation Support** - Optional citation generation with credible sources
- **🔧 Customizable Research Depth** - Control how deep the research goes
- **📋 Comprehensive Logging** - Local logs and reports for transparency and debugging
- **🔍 Quality Evaluation** - Automated evaluation for toxicity, bias, and answer relevancy
- **🌐 AgentNetwork Integration** - Support for Mastra's AgentNetwork framework

## 🚀 Quick Start

### Prerequisites
- **Node.js v20+** installed on your system

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd recursearch
   npm install
   ```

2. **Set up environment variables in `.env.development`:**
   ```env
   OPENAI_API_KEY=your-openai-api-key
   TAVILY_API_KEY=your-tavily-api-key
   EXA_API_KEY=your-exa-api-key
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Generate reports:**
   - Go to the **Search Agent** tab in the Mastra playground running at `localhost:4411` and request report generation
   - The search agent has memory enabled for follow-up questions
   - For AgentNetwork features, use the **Networks** tab in the playground

## ⚙️ Model Configuration

RecurSearch supports multiple AI models. Configure your preferred AI provider and model in `config/config.ts` by changing the `settingRunTimeContext` variable.

### Supported Providers
out of box, Recursearch has support for 

- OpenAI
- Claude
- Gemini

more providers and models can easily be added

## 🤖 Agent Architecture

### Core RecurSearch Agents

| Agent | Purpose |
|-------|---------|
| **Search Agent** | Orchestrates the research process and formats final reports |
| **Question Agent** | Generates insightful follow-up research questions |
| **Custom Question Agent** | Validates question uniqueness to avoid redundancy |
| **Question Picker Agent** | Selects the most research-focused questions |
| **Stats Agent** | Generates statistical queries to support findings with data |
| **Image Agent** | Creates targeted image search queries for visual content |
| **Content Picker Agent** | Evaluates and selects the most credible web sources |

### AgentNetwork Versions

#### 🎯 Standard Version
Comprehensive research with web tools and data integration:
- **simpleSearchAgent** - Initial data gathering
- **imageSearchAgent** - Research-relevant image discovery
- **reportFormattingAgent** - User-defined formatting compliance
- **QuestionAgent, QuestionPickerAgent, CustomQuestionAgent** - Question management
- **ImageQueryAgent** - Precise image search queries
- **StatsAgent** - Statistical integration
- **citationAgent** - Credible source identification

#### 🔄 Reflection Version
Enhanced with planning and evaluation agents:
- **PlannerAgent** - Structures the research process
- **PlannerEvalAgent** - Evaluates research plan effectiveness
- **ReportEvalAgent** - Assesses report quality and completeness

#### 🗣️ Debate Version
Simulates debate-like processes for controversial topics:
- **ResearchPresenterAgent** - Presents arguments and findings
- **ResearchCriticAgent** - Generates counterarguments
- **ReportJudgeAgent** - Evaluates arguments for balanced conclusions

> **Note:** Debate version intentionally excludes web tools to focus on reasoning-based arguments.

## 📁 Example Reports

All example reports are **completely AI-generated** without manual editing.

### 🌳 RecurSearch Reports (`reports/tree`)
**Highest quality reports** with full recursive research:
- The Influence of Chronic Stress on Immune System Function
- Impact of AI-Generated Content on Journalism and Media Credibility  
- Impact of Music Therapy on Individuals with Depression
- How LLMs Work
- Mental Health Research

*Each report includes preview screenshots as authenticity proof.*

### 🌐 AgentNetwork Reports (`reports/network/normal`)
**Template-style reports** with good structure but variable fact quality:
- Recommendation Algorithms and User Behavior on Social Media
- Music Therapy and Depression Impact
- Chronic Stress and Immune Function

### 🔄 Reflection Reports (`reports/network/planaftereval`)
**Plan-evaluate-improve** methodology reports:
- How LLMs Work (Reflection Version)

### 🗣️ Debate Reports (`reports/network/debate`)
**Argument-based reports** using pure reasoning (no web data):
- Benefits of Debate on Research Reports
- Music Therapy's Influence on Depression
- Phone Usage vs. Mental Health

## 📊 System Overview

RecurSearch uses a **decision tree approach** where agents collaborate to:

1. **Generate** multiple research questions
2. **Validate** question uniqueness and relevance  
3. **Select** the most promising research paths
4. **Search** recursively through multiple layers
5. **Evaluate** content credibility and relevance
6. **Synthesize** findings into comprehensive reports
7. **Assess** final output quality and bias

## ⚖️ Ethics & Usage

This tool was created for research into multi-agent report generation. 

**Important:** 
- Must not be used unethically
- Authors take no responsibility for misuse
- Always verify AI-generated content
- Use responsibly for legitimate research purposes

## 📚 Research Foundation

RecurSearch is inspired by:
- [Multi-Agent Collaboration Mechanisms: A Survey of LLMs](https://arxiv.org/pdf/2501.06322)

## 📄 License

GPL - Please see license requirements for full terms.

## 👥 Authors

- [@jalpp](https://github.com/jalpp)

---

*For detailed architecture diagrams and advanced configuration, see the `/docs` directory.*