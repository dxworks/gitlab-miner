# Kurama - Mining and Analyzing GitLab Projects

![Kurama Logo](./logo.png)

## Overview

**Kurama** is a powerful tool part of the DxWorks organization, designed to extract and analyze data from projects hosted on GitLab repositories. With seamless integration and easy setup, Kurama helps you mine valuable data and view elaborate metrics with minimal effort.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [Features](#features)
- [Results](#results)
- [Contact](#contact)

## Description

This application is designed in order to help data scientist, researchers and managers to analyze data coming from projects hosted on GitLab repositories and export different results. Data is extracted efficiently using the GitLab GraphQL API and various statistics regarding general project information, merge requests, issues, members and team collaboration are available.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/download/package-manager) 
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/your-username/gitlab-miner.git
    cd gitlab-miner
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

### Configuration

Before starting the application it is necessary to complete data inside the configuration file named "config.yml".

Introduce the path to the repository where your project is hosted, at least one token with permissions to access the project and 2 values for the parameters that filter the collaboration graph. In case you do not coose this feature, add 0 values.

A full example can be seen below: 

```yaml
gitlabApiUrl: 'https://gitlab.com/api/graphql'

projectFullPath: 'mygitlabteam3/MyProject'

tokens:
  - 'YOUR_GITLAB_ACCESS_TOKEN_1'
  - 'YOUR_GITLAB_ACCESS_TOKEN_1'

minLinkValue : 100
minMemberLinks : 6
```

### Running the Application

To start the application, simply run:

```sh
npm start
```

## Features

- TypeScript Support: Written in TypeScript for better code quality and maintenance.
- Easy Configuration: Minimal setup required to get started using Node.js and npm.
- Data Extraction: Efficiently extract comprehensive data from your GitLab repositories.
- Structured Data: GraphQL queries in order to structure and customize data extraction.
- Powerful analysis: Various and complex metrics regarding the projects, the members and the team collaboration and interactions. 
- Modular Architecture: Easy to extend and maintain.

## Results

Inside the main folder of the application the allData.json file can be found and insides the "results" directory all the resulted metrics are available. This directory also hosts another directory containing the metrics about the members, named "members".

- allData.json file containing absolutely all the data extracted
- ProjectInfo.json containing general metrics regarding the project
- MembersModel.json containg metrics related to each and every member
- TeamGraph.json containing the team collaboration and interactions graph
- visualizations in numeorus JSON files for all of the above  

## Method C — Build-Your-Own Agent

Method C is a developer-orchestrated analysis agent. Unlike a fully model-driven or
agent-driven approach, the execution pipeline is explicitly controlled by the application:
data loading, prompt construction, model invocation, and result processing run in a defined
sequence, while the model retains control over the reasoning and over when the analysis ends.
The model never reads the raw data directly — it requests computations by emitting TypeScript
queries, which the application executes against a structured project context and feeds back.

### Technologies

- **Node.js** + **TypeScript**

### Prerequisites

Export an API key for the chosen provider before running. The key is read from the
`PROVIDER_API_KEY` environment variable:

```bash
export PROVIDER_API_KEY="your-api-key-here"
```

### Running

Start the agent with the npm script, specifying the provider and model:

```bash
npm run method-c -- --provider <provider> --model <model>
```

**Example:**

```bash
export PROVIDER_API_KEY="sk-..."
npm run method-c -- --provider openai --model gpt-5.5-pro
```

Supported providers: `openai`, `anthropic`. The provider is abstracted behind a common
`LLMProvider` interface, so the same execution logic works regardless of the underlying model.


### Input

The agent operates on a preprocessed project context (`ProjectContext` / `ctx`), built upstream
by the analyzer/linker from the raw GitHub export — not on the raw files directly.

### Output

Each run produces, under `results/Method_C/`:

- **`MethodC_Report.md`** — the final analysis report.
- **`MethodC_RunMeta.json`** — execution metadata: tool calls, intermediate steps, and any
  failures, for visibility and debugging.

### Notes

- The iteration loop is controlled at the application level, but the decision to continue or
  stop remains with the model.
- The pipeline incorporates scalable data-handling strategies (avoiding full JSON serialization,
  reducing graph density by excluding zero-weight links, controlled memory usage) for robustness
  on large repositories.


## Contact

Author: Adrian Pop

Email: 04.pop.adrian@gmail.com / adrian.pop2@student.upt.ro

GitHub / GitLab: adrianpop3
