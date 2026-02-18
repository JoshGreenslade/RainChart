---
description: |
  This workflow scans for open issues labeled "new" that don't have the "design" label,
  and adds the "design" label to track that they've been processed.

on:
  schedule: daily on weekdays
  workflow_dispatch:
  skip-if-no-match:
    query: "is:issue is:open label:new -label:design"
    min: 1

permissions:
  contents: read
  issues: read

network: defaults

tools:
  github:
    toolsets: [issues]

safe-outputs:
  add-labels:
    max: 20
---

# Scan New Issues and Add Design Label

Your task is to process issues labeled "new" (that don't already have "design" label) and add the "design" label to them.

## Process

1. **Find Issues with "new" Label (without "design" label)**
   - Search for open issues with the label "new" that don't have "design" label
   - Get the list of all matching issues

2. **For Each Issue Found**
   - Add the "design" label to the issue (keep the "new" label)

3. **Handle Edge Cases**
   - If no matching issues are found, the workflow will be skipped (via skip-if-no-match)
   - Continue processing all matching issues even if one fails

## Output Format

Provide a brief summary at the end including:
- Number of issues found with "new" label (without "design")
- Number of issues successfully labeled with "design"
- Any errors or issues encountered
