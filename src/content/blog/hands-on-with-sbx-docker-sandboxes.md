---
title: "Local agent sandboxes with docker"
description: "A local Docker Sandboxes (sbx) walkthrough with a broken FastAPI + Postgres app, and why microVMs plus a private Docker Engine fit laptop agent workflows."
pubDate: 2026-11-24
project: dbox
tags: [docker, agents, sandboxes]
---

This walkthrough uses [Docker Sandboxes](https://docs.docker.com/ai/sandboxes/) (`sbx`) to run a coding agent inside a **local** sandbox. The workflow is roughly: (a) install the CLI, (b) define a sandbox and mount a project directory on it, (c) start the sandbox locally with a baked-in Claude agent, (d) use it for a coding task. The agent’s task is to fix a small broken FastAPI + Postgres app. You can find the code for it in the repo: [github.com/mkarots/dbox](https://github.com/mkarots/dbox).

`sbx` is primarily a **developer tool for your laptop** — a way to run coding agents on your development machine without them having access all over it. An agent that is only expected to work on a specific project/directory should not have access to all other project directories or folders within that machine. The conclusions at the end are where I argue why that design (microVM + private Docker Engine + network policy) fits how engineers are starting to work with agents.

<!--more-->

## What Docker Sandboxes are

From the docs:

> Docker Sandboxes run AI coding agents in isolated environments on your machine or on Docker-managed cloud infrastructure. Use the `sbx` CLI to create and manage either kind of sandbox.

This post is about the **local** path. In practice that means a microVM, a private Docker Engine, and a network policy.

**a) microVM.** Each sandbox gets its own lightweight microVM with a **separate Linux kernel**. That is the main difference from a normal container, which shares the host kernel. Processes inside the VM are invisible to the host and to other sandboxes; when you `sbx rm`, the VM and everything in it go away.

**b) private Docker Engine.** Agents often need `docker` / `docker compose`. Giving them the **host** Docker socket is effectively root on the host. Sandboxes avoid that path: each microVM runs its **own** Engine, so `build` / `compose` / `run` stay inside the VM and have no path to your host daemon ([Isolation: Docker Engine](https://docs.docker.com/ai/sandboxes/security/isolation/)).

**c) network policy.** Outbound TCP from the sandbox goes through a proxy on the host. You allow or block destinations (package registries, git hosts, model APIs, and so on). More on that when we configure the preset below.

## The playground project

[`dbox`](https://github.com/mkarots/dbox) is a playground shaped for that surface. Layout:

```text
dbox/
├── sbx/
│   └── sbxenv.yaml    # sandbox definition — outside the mount
└── playground/        # what the agent can see and edit
    ├── TASK.md
    ├── app/
    ├── docker-compose.yml
    └── tests/
```

`sbxenv.yaml` can declare lifecycle and secret commands that `sbx` runs on your **Mac**, as your user, after you approve a plan ([docs](https://docs.docker.com/ai/sandboxes/configuration/environment-files/)). `playground/` is mounted read-write into the VM, so the agent can change any file under it. If `sbxenv.yaml` lived inside `playground/`, the agent could edit those host-side commands (or the workspace and port mappings) on disk before the next `sbx env run`. Keep the env file under `sbx/`, outside the mount: the agent can patch the notes API; it cannot rewrite the file that tells `sbx` what to execute on the host.

The mounted workspace is a notes API: FastAPI talking to Postgres, two Compose services (`api` and `postgres`). A user can create a note, fetch it by id, and hit `/health`.

The stack is **intentionally broken** in a few places. Inside `sbx`, an agent should fix it with small patches, then prove:

1. `pytest` passes
2. `docker compose up --build -d` comes up
3. `/health` sees the database
4. create + get a note works over HTTP

The full prompt lives in the repo as [`playground/TASK.md`](https://github.com/mkarots/dbox/blob/main/playground/TASK.md). Point the agent at that file; you do not need to paste it into the chat by hand.

Optional: on the host, run `make install && make test` from the repo root. Schema tests should pass; two API contract tests should fail until the bugs are fixed.

## Install the CLI

On macOS:

```bash
brew trust docker/tap
brew install docker/tap/sbx
sbx login
sbx --version
```

`sbx login` starts the device flow. After that you should see something like:

```text
sbx version v0.54.0 4bec4a5ce093466e54b034146965b143d065dc09
```

## Define and configure environment

By default sandboxes do not get open internet. Docker ships three presets:

| Preset | Behavior |
| --- | --- |
| Open | Broad egress (least locked down) |
| Balanced | Sensible defaults for coding agents |
| Locked Down | Deny by default; you allow hosts as needed |

For this walkthrough, use balanced:

```bash
sbx policy init balanced
```

That allows common developer destinations (package registries, git hosts, model APIs, and similar).

An environment can be defined using a configuration file: [`sbx/sbxenv.yaml`](https://github.com/mkarots/dbox/blob/main/sbx/sbxenv.yaml)

```yaml
schemaVersion: "1"
name: dbox-notes
agent: claude
workspace: ../playground

env:
  APP_NAME: notes-api

ports:
  - sandbox: 8000
    host: 8000
```

What this file is doing:

- `name: dbox-notes` — sandbox name you will see in `sbx ls`
- `agent: claude` — uses the Claude kit (change to another supported agent if you prefer)
- `workspace: ../playground` — host folder the agent can see and edit (`sbxenv.yaml` stays outside this mount so the agent cannot rewrite host-side plan commands)
- port `8000 → 8000` — when the agent brings the API up inside the microVM, you can reach it from the host

## Run the sandbox (interactively)

From `sbx/`:

```bash
cd sbx
sbx env plan
sbx env run
```

`sbx env run` reads the env file, shows a plan, and asks for approval. On a first run you should see it create a sandbox, env vars, and the port mapping — something like:

```text
ENVIRONMENT
  Name:  dbox-notes
  File:  …/dbox/sbx/sbxenv.yaml

SANDBOX
  + dbox-notes
      agent: claude

WORKSPACES
  ! …/dbox/playground — present, not recorded as applied, needs your approval

ENV
  + APP_NAME
      value: notes-api

PORTS
  + 8000/tcp4
      host: 8000

  3 to add · 0 to change · 0 to destroy · 1 needs approval

Approve this plan? (y/N) y
```

After you approve, `sbx` pulls the agent kit image and drops you into an interactive session. You should see the sandbox name, the Claude kit, the mounted workspace, and `port 8000` published on `127.0.0.1:8000`.

## Ask the agent to fix the app

In the session:

```text
Read TASK.md and complete it.
```

### Gotchas I hit

1. **Agent login.** Claude may start logged out. Run `/login` inside the sandbox before it can call the model. (Docker also documents host-side `sbx secret set` so the proxy can inject provider credentials without storing them in the VM — I have not re-run this example that way yet.)
2. **Host `.venv`.** If you created a virtualenv on the Mac under `playground/`, it will not run in the Linux sandbox. Leave it alone; have the agent use a separate env (for example under `/tmp`) with **Python 3.12** to match the Dockerfile. The sandbox’s default Python was 3.14 in my run and could not install `psycopg[binary]==3.2.3`.

### What “done” looked like for me

The agent listed the tree, patched three bugs, ran pytest (8 passed), brought Compose up, and verified health + create/get. Edits showed up on the host immediately because of the direct mount — `git diff` under `playground/` is the review surface.

You do not need the full transcript. The success criteria are the four goals in `TASK.md`.

## Verify from the host

In another terminal on the Mac:

```bash
curl -s http://localhost:8000/health
curl -s -X POST http://localhost:8000/notes \
  -H 'content-type: application/json' \
  -d '{"title":"sandbox","body":"hello from sbx"}'
curl -s http://localhost:8000/notes/1
```

You want health with `"database":"up"`, a POST that returns a note with an `id`, and a GET that returns the same note.

Example from my run:

```text
{"status":"ok","database":"up"}
{"id":2,"title":"sandbox","body":"hello from sbx","created_at":"2026-11-22T00:34:19.027105Z"}
{"id":1,"title":"sandbox","body":"hello from sbx","created_at":"2026-11-21T23:49:38.267252Z"}
```

(Ids may differ depending on how many notes you created.)

## Conclusions

The walkthrough above is a simple use case of a coding task that one agent on a laptop can run, created for the purposes of showing how to use the CLI tool. Further from that, I think that the vision behind Docker Sandboxes is larger than just providing a component. I think it’s about providing trust to developers. Let me explain.

**Local sandboxes are a developer tool.** Cloud sandboxes exist, but the primary job they solve is: an engineer’s machine, several repos they are working on, and multiple coding agents installing packages, downloading images and binaries, editing and running code. That is a laptop problem before it is a fleet-in-the-cloud problem.

**I expect developers to run many agents locally.** It is getting hard to imagine day-to-day engineering without several agents implementing and executing code on the same machine. If those agents are going to run with real autonomy — fewer permission prompts, longer unattended stretches — then “trust the model” is not enough. You need isolation guarantees on the box where the work happens.

**That framing makes the microVM choice make sense.** If each agent sits in its own full traditional VM, a swarm on a laptop gets expensive fast. There is a real incentive to make each boundary as lightweight as you can while still getting a separate kernel. microVMs are that bet: VM-class isolation with less of the traditional VM tax. (I am not claiming a specific MB or cold-start number for `sbx` here — only the design pressure.)

**The private Docker Engine also makes a lot of sense when thinking about trusting containers.** With many agents on one machine, you cannot realistically audit that none of them reaches for the host Docker socket — accidentally or on purpose. Access to that socket is effectively control of the host’s containers and, in practice, a path to the host itself. Putting a separate Engine inside each microVM, with no path to the host socket, draws the boundary in the place that matters for agent work that needs Compose.

**Containers alone are the wrong default for this threat model.** If you could guarantee that agents never run hostile or confused code, a container might be enough sandbox for many workflows. That guarantee is not available. Agents execute untrusted dependencies, generated scripts, and tools you did not review line by line. Shared-kernel isolation is a weaker story for “I will let this run on my laptop while I look away.”

**Even aside from malice, the engineering case is still good.** Separate kernels and separate Engines give you cleanup (`sbx rm` drops the VM’s packages and images), less collision with your real local Docker state, and a clearer place to attach network policy. Isolation is useful as a best practice.

Apart from the engineering perspective, it’s also nice as a developer to see Docker working on agentic primitives as well, given the company’s history on developer tools!

If you made it all the way here, feel free to send me a message on [michaelk (@cepstrum9) on X](https://x.com/cepstrum9) with your thoughts or feedback!

## References

1. [Docker Sandboxes](https://docs.docker.com/ai/sandboxes/)
2. [Get started](https://docs.docker.com/ai/sandboxes/get-started/)
3. [Environment files](https://docs.docker.com/ai/sandboxes/configuration/environment-files/)
4. [Isolation](https://docs.docker.com/ai/sandboxes/security/isolation)
5. [Shell (agent-less sandbox)](https://docs.docker.com/ai/sandboxes/agents/shell/)
6. [Build an agent workload (kits)](https://docs.docker.com/ai/sandboxes/customize/author/build-an-agent/)
7. [mkarots/dbox](https://github.com/mkarots/dbox)
