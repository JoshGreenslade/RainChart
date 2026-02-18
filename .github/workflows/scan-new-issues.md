---
description: |
  This workflow scans for open issues labeled "new", dispatches the
  requirements-to-technical-story workflow for each one, and updates
  labels by removing "new" and adding "design".

on:
  schedule: daily on weekdays
  workflow_dispatch:

permissions:
  contents: read
  issues: read
  actions: read

network: defaults

tools:
  github:
    toolsets: [issues, actions]

safe-outputs:
  remove-labels:
    max: 20
  add-labels:
    max: 20
  dispatch-workflow:
    workflows:
      - requirements-to-technical-story
    max: 20
---

# Scan New Issues and Dispatch Technical Story Workflow

Your task is to process issues labeled "new" by dispatching them to the requirements-to-technical-story workflow and updating their labels.

## Process

1. **Find Issues with "new" Label**
   - Search for open issues with the label "new"
   - Get the list of all matching issues

2. **For Each Issue Found**
   - Dispatch the "requirements-to-technical-story" workflow
   - Pass the issue number as input to the workflow dispatch
   - Remove the "new" label from the issue
   - Add the "design" label to the issue

3. **Handle Edge Cases**
   - If no issues with "new" label are found, log that information
   - If workflow dispatch fails, continue with other issues but log the failure
   - Ensure labels are updated only after successful workflow dispatch

## Workflow Dispatch Details

When dispatching the "requirements-to-technical-story" workflow:
- Workflow name: `requirements-to-technical-story`
- Input parameter: `issue_number` (the number of the issue being processed)
- Use the workflow dispatch safe output to trigger the workflow

## Output Format

Provide a brief summary at the end including:
- Number of issues found with "new" label
- Number of workflows successfully dispatched
- Any errors or issues encountered
