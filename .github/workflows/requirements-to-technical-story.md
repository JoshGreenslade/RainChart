---
description: |
  This workflow converts requirement issues into technical stories with
  detailed implementation plans, architecture considerations, and acceptance criteria.

on:
  workflow_dispatch:
    inputs:
      issue_number:
        description: Issue number to convert to technical story
        required: true
        type: number

permissions:
  contents: read
  issues: read

network: defaults

tools:
  github:
    toolsets: [issues]

safe-outputs:
  add-comment:
    max: 5
---

# Requirements to Technical Story Converter

Convert a requirement issue into a detailed technical story with implementation guidance.

## Your Task

You are given an issue number via the `issue_number` input. Your task is to:

1. **Read the Issue**
   - Fetch the issue details using the issue number provided
   - Understand the requirement described in the issue

2. **Analyze Requirements**
   - Break down the requirement into technical components
   - Identify dependencies and technical constraints
   - Consider architecture implications

3. **Create Technical Story**
   - Write a detailed technical implementation plan
   - Include:
     - Technical approach and architecture decisions
     - Implementation steps and file changes needed
     - Testing strategy
     - Acceptance criteria
     - Estimated complexity/effort
     - Dependencies and prerequisites

4. **Add Comment to Issue**
   - Post your technical story as a comment on the original issue
   - Use clear formatting with sections and code blocks where appropriate
   - Tag with "Technical Story" or similar heading

## Output Format

Your comment should be well-structured and include:
- 📋 **Summary**: Brief overview of the technical approach
- 🏗️ **Architecture**: Key architectural decisions and patterns
- 📝 **Implementation Plan**: Step-by-step implementation guide
- ✅ **Acceptance Criteria**: Clear definition of done
- 🧪 **Testing Strategy**: How to validate the implementation
- 📦 **Dependencies**: Required libraries, tools, or prerequisites
