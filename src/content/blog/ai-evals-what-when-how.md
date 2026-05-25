---
title: "What Do We Mean When We Say Evals?"
description: "A practical framing of AI evals — what to evaluate across model, agent, and application layers, when to run them, and how to turn vibe coding into engineering."
pubDate: 2026-05-25
---

Teams are shipping AI and agents but are unsure how to test them correctly. AI evals are the discipline that turns vibe coding into engineering. In this post I'll lay out my current understanding and opinions about how to go about it. After some brief definitions, my primary goal is to answer high-level questions: what to evaluate, when to evaluate, and how to evaluate.

## What are AI evals?

By "AI evals" I mean the methods, techniques, and processes by which we specify, measure, and improve the function, behavior, and performance of an AI system over a task.

A robust evals layer gives engineers the capability to answer questions about a model's, agent's, or application's performance. Such questions might be:

- "Can we ship this agent with confidence?"
- "If things go wrong, can we measure how they went wrong?"

AI evals are somewhat analogous to test suites. They are considered both a best practice and an engineering discipline. A well-crafted evals suite should help an engineering team reason about, change, and iterate on AI-based software with speed and accuracy.

## What to evaluate?

Evals are applicable at different layers. In each layer the goal is to ensure that the system behaves as expected. Observability at each layer is fundamental — for LLM-based systems that means being able to observe model responses, user interactions, and sessions.

The observation signal might be quantitative or qualitative. A quantitative measure might be a scoring value on some scale. A qualitative signal might be a user leaving mid-conversation, or repeating a question.

A distinction that helps me clarify the layers involved in evals:

### a) The model layer

This consists of a base model (e.g. `gpt-4o-mini`) and a system prompt (or collection of prompts). At minimum we need some way of answering: "Did the model answer the user's prompt correctly?" Ideally, we should be able to answer that question for every user query that goes through our system.

Additionally, we should be able to compare different prompts: "Given a task T, is prompt A or prompt B better for solving it, and why?" We might also want to compare how the same prompt behaves across models: "Given a task T and a prompt P, is model A's answer better than model B's, and why?"

Relevant questions at this layer:

1. Does the model answer the user's prompt correctly?
2. Does the model's answer include irrelevant elements?
3. Does the model answer the user's prompt concisely?
4. What is the difference in quality if we use model A instead of model B?
5. Given five prompt variations, which one is the best?

Once we establish a framework to test this layer, we can systematically apply it to iterate on the software we're building.

### b) The agent layer

This consists of the model layer running within a loop, in an environment with tools (a filesystem, a browser, etc.). The main difference from the layer above is that an agent contains multiple interactions — question-answer pairs. Where the model case evaluates a single input/output pair, here we evaluate a set of pairs, which corresponds to a session.

The fundamental question at this layer: "Does the agent take the expected actions to solve the user's problem, and does it do so consistently?"

Some high-level questions we want to answer:

1. Does the agent take the expected actions?
2. Does the agent retrieve the right context for this user?
3. Does the agent use the appropriate tone for this user?
4. How well does the agent perform against a set of predefined criteria?
5. Does the agent reveal information it should not have revealed?

Once we have observability and evals set up for an individual agent, we can move on to evaluating the whole system or application.

### c) The application layer

This consists of multiple cooperating agents solving a problem, plus other system components like APIs and databases. The combination implements the application's business logic. Evaluating at this layer means ensuring business rules are adhered to and that users receive a high quality of service.

At a high level, we want to know how well the application works across users, regions, and languages. We also want a profile for token usage and costs, and we care about how deployments impact behavior, performance, and cost.

Relevant questions:

1. How does v1.1.0 compare to v1.2.0?
2. How does the application perform across languages?
3. How does the application perform across users and regions?
4. How are different agents in our system performing, and if there are differences, why?

For RAG and tool execution specifically:

1. Are tool calls executed *when* they should?
2. Does the model choose the correct tool and arguments? (Pre-tool call hooks can help with both.)
3. Is the tool output formatted properly? (Libraries like Pydantic can help here.)
4. Does the RAG database retrieve the expected chunks?

## When to evaluate?

Evals are applicable during development, CI/CD, and post-deployment — similar to traditional testing.

Engineers test code while iterating, push to a VCS like GitHub where CI/CD runs, then release to production where QA or automated E2E tests may run. Users discover bugs, which triggers another development iteration.

AI evals fit the same rhythm. As LLM/AI components are developed, engineers should run a local evaluation suite before pushing to VCS. On VCS, CI/CD triggers evals against the CI environment. After merge and deploy, additional evals/tests should run E2E in production.

If a user reports a bug, an eval test case should be created for it, and a development iteration should follow — same as traditional software.

One difference worth noting for AI vs traditional software: we can be proactive by monitoring and scoring user interactions with the agent in real time. A high score indicates good service; a low score indicates degraded quality.

For repeatability and determinism, it's useful to translate assertions into integer or floating-point scores. A rubric-based approach, a consensus-based approach, or a combination of the two can work well.

It also makes sense for engineering teams to agree on a framework for evaluating all prompts in use — good organization reduces cognitive load as the system grows.

## How to evaluate

### 1. Assertions and code checks

Evaluations make sense in the form of assertions. Given a model's answer to a user prompt, we should be able to assert some property on the answer — quantitative or qualitative.

Examples of quantitative assertions: checking for specific terms via regex, or ensuring token usage stays within a range.

Examples of qualitative assertions: ensuring the answer displays politeness, professionalism, or factuality.

```python
# Examples of quantitative evaluation assertions
assert response.tokens < MAX_TOKENS
assert response.tokens > MIN_TOKENS
assert "expected text" in response.text
assert response.schema == SchemaResponse

# Examples of qualitative criteria
assert evaluate(response, "clarity") > 0.9
assert evaluate(response, "factuality") > 0.9
assert evaluate(response, "truthfulness") > 0.9
assert evaluate(response, "hallucination") < 0.05

# `evaluate` is assumed to be:
# def evaluate(response: LLMResponse, criteria: str) -> float
# where the return value is in [0, 1]
```

The qualitative case is trickier than the quantitative one. For quantitative checks, we run a function on the model's answer and get a boolean. For qualitative checks, we need a way to measure properties like tone, professionalism, and politeness. The most obvious approach is an LLM-as-judge — which introduces a chicken-and-egg problem, because the judge itself needs to be evaluated and calibrated before it can reliably evaluate another LLM.

### 2. Code organization

It makes sense to collect test cases or scenarios for each prompt in an application, and expose an automated way to run them as an evaluation suite whenever code or prompts change. The suite can grow within the codebase the way tests do for a traditional package.

Since every AI component needs evaluation — and these will keep growing — you'll need to decide where that code lives. You might use an `/evals` subdirectory, or `pytest` markers (or the equivalent in your language) to decorate functions meant for evaluation.

With multiple components to evaluate, a labelling mechanism and UI to inspect and filter agents in a unified interface becomes useful.

### Tooling and infrastructure

Your team will need tooling for evaluation: a small dedicated server or API, CI/CD GitHub workflows or actions, and potentially a CLI usable across all three phases — local development, CI/CD, and post-deployment production.

It pays to invest time selecting tooling and sticking with it for consistency and comparability across runs.

## Conclusion

AI evals turn AI development from vibes into engineering. The main responsibility of an eval harness is to systematically specify, evaluate, and improve your team's AI systems.

The main challenges any team will face:

1. Systematically observing model outputs
2. Defining what "good" means for your agent
3. Building a deterministic evaluator you can rely on
4. Deciding on evals code organization
5. Setting up tooling and workflows for evaluation
6. Reviewing and integrating evaluations back into the system

For each domain, company, or project, the requirements for a robust and scalable evals layer differ a lot.

## Further reading

**Eval and observability platforms**

*Disclosure: I work at [Composo](https://www.composo.ai/).*

- [Composo](https://www.composo.ai/) — deterministic eval API and failure-mode discovery for production AI agents.
- [Braintrust](https://www.braintrust.dev/) — end-to-end evals, prompt playground, and observability.
- [LangSmith](https://www.langchain.com/langsmith) — evals, tracing, and monitoring from the LangChain team.
- [Raindrop](https://www.raindrop.ai/) — production monitoring focused on silent failure modes.
- [Opik](https://github.com/comet-ml/opik) — Comet's open-source eval and tracing platform.

**Frameworks from model labs**

- [OpenAI Evals](https://github.com/openai/evals) — OpenAI's open-source framework for evaluating LLMs and LLM systems.
- [Anthropic Evals](https://docs.claude.com/en/docs/test-and-evaluate/eval-tool) — Anthropic's docs on building evaluations, plus the [cookbook recipes](https://github.com/anthropics/anthropic-cookbook).
- [Mistral Evals](https://docs.mistral.ai/capabilities/evaluation/) — Mistral's evaluation capabilities.

**Optimization-oriented**

- [DSPy](https://dspy.ai/) — Stanford framework for programming LLMs; eval-driven optimization is core to the model.
- [GEPA](https://github.com/gepa-ai/gepa) — reflective prompt-evolution optimizer; pairs naturally with DSPy.

**Practitioner writing**

- [Hamel Husain's blog](https://hamel.dev/) — start with [*Your AI Product Needs Evals*](https://hamel.dev/blog/posts/evals/), then [*LLM-as-a-Judge*](https://hamel.dev/blog/posts/llm-judge/) and the [*Evals FAQ*](https://hamel.dev/blog/posts/evals-faq/).
