---
description: |
  This workflow scans for open issues labeled "new" that don't have the "design" label,
  dispatches the requirements-to-technical-story workflow for each one, and adds
  the "design" label to track that they've been processed.

on:
  schedule: daily on weekdays
  workflow_dispatch:
  skip-if-no-match:
    query: "is:issue is:open label:new -label:design"
    min: 1

permissions:
  contents: read
  issues: read
  actions: read

network: defaults

tools:
  github:
    toolsets: [issues, actions]

safe-outputs:
  add-labels:
    max: 20
  dispatch-workflow:
    workflows:
      - requirements-to-technical-story
    max: 20
---

# Scan New Issues and Dispatch Technical Story Workflow

Your task is to process issues labeled "new" (that don't already have "design" label) by dispatching them to the requirements-to-technical-story workflow and adding the "design" label.

## Process

1. **Find Issues with "new" Label (without "design" label)**
   - Search for open issues with the label "new" that don't have "design" label
   - Get the list of all matching issues

2. **For Each Issue Found**
   - Dispatch the "requirements-to-technical-story" workflow
   - Pass the issue number as input to the workflow dispatch using the input name "issue_number"
   - Add the "design" label to the issue (keep the "new" label)

3. **Handle Edge Cases**
   - If no matching issues are found, the workflow will be skipped (via skip-if-no-match)
   - If workflow dispatch fails, continue with other issues but log the failure
   - Continue processing all matching issues even if one fails

## Workflow Dispatch Details

When dispatching the "requirements-to-technical-story" workflow:
- Workflow name: `requirements-to-technical-story`
- Input parameter: `issue_number` (the number of the issue being processed)
- Use the workflow dispatch safe output to trigger the workflow

## Output Format

Provide a brief summary at the end including:
- Number of issues found with "new" label (without "design")
- Number of workflows successfully dispatched
- Number of issues successfully labeled with "design"
- Any errors or issues encountered
