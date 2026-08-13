# AGENTS.md

## Purpose

This file gives instructions to AI coding assistants working on the F-Avoiding Orientations website.

The project owner is not a professional software developer. Changes should therefore be conservative, easy to review, and clearly explained.

## Core Editing Rules

1. **Do not change unrelated files or components.**
   If a task concerns one visual component, tool, proof, or case, modify only what is necessary for that task.

2. **Preserve approved behavior and appearance.**
   Do not redesign, restyle, rename, reorganize, or "improve" existing components unless the user explicitly requests it.

3. **Interpret unspecified properties as fixed.**
   If the user asks to change one feature of a component, preserve all other properties as closely as possible.

4. **Prefer small changes over broad refactors.**
   Avoid rewriting large sections of the project when a localized change will accomplish the task.

5. **Do not mix mathematics with presentation unnecessarily.**
   Mathematical case data, proof content, reusable mathematical tools, and visual components should remain separated whenever practical.

6. **Do not silently alter mathematical content.**
   Any change to a theorem statement, forbidden set, proof step, degree condition, equivalence, or mathematical rule should be explicit and reviewable.

7. **Do not add dependencies unless they are genuinely useful.**
   Prefer simple browser-native solutions when practical.

8. **Keep the core project free.**
   Do not introduce paid services, required paid APIs, paid hosting, or infrastructure that creates recurring costs.

9. **Do not add a backend, database, authentication system, or cloud service unless explicitly requested.**

10. **Experimental visual work should be isolated.**
    When experimenting with appearance or interaction, prefer a lab/demo component or a separate branch rather than altering an approved production component directly.

## Change Discipline

When making a requested change:

- Identify the smallest set of files that need modification.
- Preserve all unrelated functionality.
- Avoid opportunistic cleanup.
- Avoid renaming files or moving folders unless necessary.
- Do not change formatting across unrelated files.
- After the change, summarize exactly which files were modified and why.

If a requested change would require modifying many files or altering architecture, explain that before doing so when possible.

## Project Context

Read `PROJECT_CONTEXT.md` before making substantial changes. It records the current vision, design principles, scope, and project status.

When the project's direction changes materially, update `PROJECT_CONTEXT.md` rather than relying only on chat history.

## Visual Components

Visual components are expected to undergo careful iterative refinement.

Once the user approves a visual state:

- treat it as stable;
- do not alter it incidentally;
- preserve its dimensions, spacing, colors, labels, motion, and geometry unless the requested task concerns those properties.

Visual changes should be easy to compare with the previous version.

## Mathematical Content

The website is a mathematical research and exposition project.

Accuracy is more important than clever code.

Do not infer mathematical facts from naming conventions or previous code if the underlying statement is uncertain. Preserve explicit mathematical definitions and ask for clarification when a coding decision depends on unresolved mathematics.

## Current Development Philosophy

Build the smallest useful version first.

The first prototype should focus on one 12-regular forbidden-set case and establish a reusable visual and mathematical language before expanding to the full proof warehouse.