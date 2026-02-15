# GitHub Agentic Workflows for Training

This directory contains AI-powered workflows that provide comprehensive training for developers at all levels.

## Training Programs

### 🎓 Junior Developer Training (Existing)

**Purpose:** Develop foundational skills through daily practice

**Workflows:**
- `daily-quiz.md` - Daily personalized quizzes
- `daily-repo-status.md` - Repository activity summaries
- `quarterly-skills-review.md` - Quarterly skills assessments
- `training.md` - General skills assessment

### 🚀 AI-First Senior Engineer Training (New)

**Purpose:** Transform senior engineers into AI-first leaders who guide teams through the AI revolution

**Main Workflow:**
- `ai-first-senior-training.md` - Core training program with 8 modules, gamification, daily challenges

**Specialized Sub-Workflows:**
- `ai-tools-deepdive.md` - Weekly AI tools workshops (8-week rotation)
- `leadership-scenarios.md` - Leadership simulations (twice weekly)
- `stakeholder-communication.md` - Communication exercises (weekly)
- `boss-battles.md` - Epic monthly challenges (multi-day)

## AI-First Senior Engineer Training Overview

A comprehensive, gamified training system designed for senior engineers who:
- Lead teams of junior developers
- Act as quality gates for PRs
- Liaise with stakeholders (POs, EMs, execs)
- Make tech debt and prioritization decisions
- Champion AI adoption across the organization
- Mentor and teach junior developers

### Training Components

#### 1. Core Training Program
**Schedule:** Daily
**Format:** 8 core modules + 4 advanced modules

**Modules:**
1. AI Tools Mastery (50 XP)
2. Leading with AI (60 XP)
3. Code Review Excellence (55 XP)
4. Teaching & Mentoring (50 XP)
5. Stakeholder Management (55 XP)
6. Story Refinement (45 XP)
7. Tech Debt & Prioritization (60 XP)
8. Codebase Health (55 XP)

#### 2. AI Tools Deep-Dive
**Schedule:** Weekly (8-week rotation)
**XP Rewards:** 35-55 XP per session

**Topics:**
- Prompt Engineering Masterclass
- GitHub Copilot Advanced
- ChatGPT/Claude for Architecture
- AI-Powered Testing
- Code Review with AI
- Documentation with AI
- Tool Comparison & Selection
- Real-World Integration

#### 3. Leadership Scenarios
**Schedule:** Tuesday and Thursday
**XP Rewards:** 35-60 XP per scenario

**Types:**
- Mentoring Moments
- Difficult Conversations
- Team Building Scenarios
- Decision Dilemmas

#### 4. Stakeholder Communication
**Schedule:** Wednesday
**XP Rewards:** 40-70 XP per simulation

**Categories:**
- PM/PO Interactions
- Engineering Manager Discussions
- Executive Communication
- Cross-Functional Collaboration

#### 5. Boss Battles
**Schedule:** Monthly (first of month)
**XP Rewards:** 150-190 XP + bonuses

**Epic Challenges:**
1. The AI Adoption Crisis
2. The Refactoring Gauntlet
3. The Mentorship Marathon
4. The Perfect Storm
5. The Strategic Pivot
6. The Culture Builder

### Gamification System

**Experience Points (XP):**
- Daily challenges: 15-30 XP
- Module completion: 40-60 XP
- Weekly exercises: 35-70 XP
- Boss battles: 150-190 XP

**Levels:**
- Level 1-5: AI Apprentice (0-500 XP)
- Level 6-10: AI Journeyman (500-1500 XP)
- Level 11-15: AI Expert (1500-3000 XP)
- Level 16-20: AI Master (3000-5000 XP)
- Level 21+: AI Grandmaster (5000+ XP)

**Badges:** 45+ achievement badges across 5 categories:
- 🤖 AI Mastery (5 badges)
- ⭐ Code Quality (5 badges)
- 👥 Leadership (5 badges)
- 💬 Communication (5 badges)
- 🎯 Strategic (5 badges)

**Streaks:**
- 3-day streak: +5 XP
- 7-day streak: +15 XP
- 14-day streak: +30 XP
- 30-day streak: +75 XP + "Marathon Master" badge

### Getting Started

1. **Read the guides:**
   - [Quick Start Guide](../docs/QUICKSTART.md) - Get started in 5 minutes
   - [Complete Training Guide](../docs/ai-first-training-guide.md) - Full documentation

2. **Set up your profile:**
   - Copy `../.github/context/senior-engineer-profile.json`
   - Customize with your information
   - Save as `[your-name]-profile.json`

3. **Trigger first workflow:**
   ```bash
   gh workflow run ai-first-senior-training.md
   ```

4. **Complete your first challenge:**
   - Check Issues for your first training challenge
   - Complete the exercise
   - Post response as comment
   - Close issue when done
   - Get automated feedback!

### Training Schedule

**Daily:**
- New challenge issue (15-30 min)
- Progress tracking

**Weekly:**
- Monday: Weekly challenge (optional, 2x XP)
- Tuesday: Leadership scenario
- Wednesday: Stakeholder simulation
- Thursday: Leadership scenario
- Rotating: AI tools deep-dive

**Monthly:**
- First of month: Boss battle (3-5 days, Level 5+ required)

### Expected Time Commitment

**Minimum (3 hrs/week):**
- Daily challenges only
- Stay engaged and maintain streak

**Recommended (5-8 hrs/week):**
- Daily challenges + weekly exercises
- Maximum growth trajectory

**Intensive (10-15 hrs/week):**
- All content + optional exercises
- Rapid mastery path

### File Structure

**Workflows:**
```
.github/workflows/
├── ai-first-senior-training.md      # Main training program
├── ai-tools-deepdive.md            # AI tools workshops
├── leadership-scenarios.md         # Leadership simulations
├── stakeholder-communication.md    # Communication practice
├── boss-battles.md                 # Epic challenges
└── *.lock.yml                      # Compiled workflow files
```

**Profiles:**
```
.github/context/
├── junior-profile.json             # Junior dev profile
├── senior-engineer-profile.json    # Example senior profile
└── [your-name]-profile.json       # Your custom profile
```

**Progress Tracking:**
```
assets/training-data/ (orphaned branch)
├── training-progress.json          # XP, level, badges
├── module-completions.json         # Module history
├── challenge-history.json          # All challenges
├── badge-collection.json           # Badge unlocks
├── leadership-scenarios.json       # Leadership stats
├── stakeholder-comm-stats.json     # Communication stats
├── ai-deepdive-stats.json         # Deep-dive tracking
└── boss-battles.json              # Boss progress
```

### Success Metrics

**Quantifiable Goals:**
- Complete all 8 core modules
- Earn 20+ badges
- Reach Level 15+ (AI Expert)
- Complete 3+ boss battles
- Maintain 14+ day streak

**Real-World Impact:**
- Team using AI tools confidently
- Code quality measurably improved
- Stakeholder satisfaction high
- Junior developers growing rapidly
- Tech debt systematically addressed

### Customization

All workflows can be customized by editing the `.md` files:
- Adjust XP rewards
- Change difficulty scaling
- Add new scenarios
- Modify schedules
- Create custom badges

**Note:** Prompt changes (markdown body) don't require recompilation. Only frontmatter changes need `gh aw compile`.

### Support

**Questions or issues?**
- Open issue with `training-support` label
- Comment on any training issue
- Check documentation in `docs/`

### Architecture

All workflows use:
- **GitHub Agentic Workflows (gh-aw)** - Workflow engine
- **Safe Outputs** - Controlled GitHub API interactions
- **Cache Memory** - State persistence across runs
- **Asset Uploads** - Progress tracking storage

### Philosophy

These workflows are based on the principle that:
- **Senior engineers are multipliers** - Their skills impact entire teams
- **AI-first is the future** - Early adopters will lead their organizations
- **Learning is best through doing** - Practice beats theory
- **Gamification drives engagement** - Make it fun and rewarding
- **Consistency beats intensity** - Daily practice builds mastery

### Next Steps

1. 📖 Read [QUICKSTART.md](../docs/QUICKSTART.md)
2. 🎯 Set up your profile
3. 🚀 Trigger your first workflow
4. 💪 Complete your first challenge
5. 🔥 Build your daily streak
6. 🏆 Earn your first badge
7. 📈 Track your progress
8. 🌟 Transform your team

**Welcome to the AI-First Senior Engineer Training Program!** 🚀

---

## Technical Details

### Workflow Compilation

All `.md` workflows must be compiled to `.lock.yml` files:

```bash
# Compile all workflows
gh aw compile

# Compile specific workflow
gh aw compile ai-first-senior-training

# Validate without writing
gh aw compile --validate
```

### Workflow Triggers

**Scheduled:**
- Daily: `on: schedule: daily`
- Weekly: `on: schedule: weekly`
- Custom cron: `on: schedule: - cron: '0 9 * * *'`

**Event-based:**
- Issue closed: `on: issues: types: [closed]`
- Issue labeled: `on: issues: types: [labeled]`

**Manual:**
- Workflow dispatch: `on: workflow_dispatch:`

### Safe Outputs

Workflows use safe outputs for GitHub interactions:
- `create-issue` - Create training challenges
- `add-comment` - Provide feedback
- `upload-asset` - Track progress
- `noop` - Signal completion

### Cache Memory

Persistent state storage:
- Week rotations
- Last activity dates
- Scenario history
- Custom preferences

### Tools

Workflows have access to:
- `github` - Repository data
- `bash` - Command execution
- `cache-memory` - State persistence
- Default edit/view tools

## Contributing

To add new training content:

1. **New Scenario:** Edit relevant workflow `.md` file
2. **New Module:** Add to `ai-first-senior-training.md`
3. **New Workflow:** Create new `.md` file, compile with `gh aw compile`
4. **Test:** Use `workflow_dispatch` to test changes
5. **Document:** Update relevant docs

## License

These workflows are part of the RainChart repository. See main LICENSE file.
