# Educator guide

Open `/educator` after `npm run dev`. There is no password. The page lists every enabled game's objectives, Bloom levels, minutes, listed prerequisites, misconception, and the assessment items.

## Suggested uses

Lecture companion: teach one mechanism, then play one or two rounds together and read the feedback aloud.

Lab: assign a game. Ask students to export the progress CSV from `/progress` before they leave.

Independent module: send the link to a tier and the optional pre-assessment.

Capstone: assign one Foundry path. Grade the reflection against the rubric printed in the round. The score in the app is constraint coverage, not a substitute for your judgment.

## Six-week map

| Week | Games |
| --- | --- |
| 1 | Token Forge, Attention Architect |
| 2 | Context Compression, Promptsmith |
| 3 | Gradient Playground, Reasoning Reactor, Alignment Arena |
| 4 | Retrieval Lab, Agent Architect |
| 5 | System Composer, ProdOps Gauntlet |
| 6 | Foundry Arena |

Systems Forge opens after four mastered Cognitive Core games. Foundry opens after three mastered Systems Forge games. Students can turn on Practice ahead, or you can set the unlock counts to 0 in `config/odyssey.config.ts`.

## Demo class

Use `/demo` when you do not want to touch student data. Reset Classroom Demo on the educator page restores the sample demo record.

## What you should tell students

The games are educational simulations or small deterministic calculations. The banner on each game says which. Scores stay in the browser unless a separate research deployment is configured, which the default build is not.
