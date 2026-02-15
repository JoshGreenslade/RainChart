# Quick Start Guide: AI-First Senior Engineer Training

Get started with your AI-first leadership transformation in 5 minutes! 🚀

## What You're About to Start

A comprehensive, gamified training program that will transform you into an AI-first senior engineering leader through:
- 📚 8 core modules + 4 advanced modules
- 🎮 Daily challenges and weekly exercises
- 🏆 45+ achievement badges and XP system
- 👥 Leadership simulations and mentoring scenarios
- 💬 Stakeholder communication practice
- 🐉 Epic monthly boss battle challenges

## Step 1: Set Up Your Profile (2 minutes)

Your profile helps the AI coach personalize your training.

**Option A: Use the template**
```bash
# Copy the example profile
cp .github/context/senior-engineer-profile.json .github/context/[your-name]-profile.json

# Edit with your information
# Update: name, team size, goals, challenges, etc.
```

**Option B: Create from scratch**
Create `.github/context/[your-name]-profile.json` with:
```json
{
  "name": "Your Name",
  "experience_level": "senior",
  "experience_years": 6,
  "role": "senior-engineer-lead",
  "goals": [
    "Transform team to AI-first approach",
    "Become principal engineer",
    "Master AI tools"
  ],
  "team_context": {
    "team_size": 5,
    "team_composition": {
      "juniors": 3,
      "mid_level": 2
    }
  },
  "focus_areas": [
    "ai-mastery",
    "team-leadership",
    "stakeholder-communication"
  ]
}
```

**Key fields:**
- `name`: Your name (used in issues/grading)
- `team_size`: How many people you lead
- `goals`: What you want to achieve
- `focus_areas`: Areas you want to improve

## Step 2: Trigger Your First Training Session (1 minute)

**Option A: Via GitHub UI**
1. Go to Actions tab in GitHub
2. Click "AI-First Senior Engineer Training"
3. Click "Run workflow" dropdown
4. Click green "Run workflow" button

**Option B: Via GitHub CLI**
```bash
gh workflow run ai-first-senior-training.md
```

**What happens:**
- Initializes your progress tracking
- Creates your first daily challenge
- Sets up XP and badge tracking
- Generates personalized welcome

## Step 3: Complete Your First Challenge (30 minutes)

Within minutes, you'll get a GitHub issue like:

**Title:** `[AI-First Training] Welcome Challenge: AI Self-Assessment`

**Content:** Personalized challenge based on your profile, e.g.:
- Assess your current AI tool usage
- Identify your biggest AI adoption challenge
- Draft a plan for your team's AI transformation
- Set your 30-day training goals

**To complete:**
1. Read the challenge carefully
2. Write your response as a comment on the issue
3. Close the issue when done
4. AI coach will grade and provide feedback within minutes
5. You'll earn your first XP and possibly your first badge! 🎉

## Step 4: Explore the Training System (1 minute)

**Daily (automated):**
- New challenge issue created each day
- Progress tracking updates
- Streak monitoring

**Weekly (automated):**
- Tuesday: Leadership scenario simulation
- Wednesday: Stakeholder communication exercise
- Thursday: Leadership scenario simulation
- Rotating: AI tools deep-dive workshop

**Monthly (automated):**
- First of month: Epic boss battle challenge (Level 5+ required)
- Weekly summary of your progress

**Your Progress Dashboard:**
Issues will show your progress like:
```
🎯 Level 3: AI Apprentice
━━━━━━━━░░░░░░░░░░░░ 175/300 XP (58%)

📚 Modules: [✓] Module 1 [▶] Module 2 (40%) [ ] Module 3...
🔥 Streak: 5 days
🏆 Badges: 3 earned (First Steps, Tool Explorer, Mentor's Heart)
```

## Step 5: Make It a Habit (Ongoing)

**Daily Routine (15-30 min):**
- Morning: Check for new challenge
- Throughout day: Work on challenge
- Evening: Submit response and close issue
- Maintain your streak! 🔥

**Weekly Routine (1-2 hours):**
- Complete leadership/stakeholder scenarios
- Participate in AI tools deep-dive
- Review feedback and improve
- Apply learnings to your real team

**Monthly Routine (5-8 hours):**
- Take on boss battle challenge (once you reach Level 5)
- Reflect on progress
- Adjust focus areas
- Set new goals

## What to Expect

### Week 1: Orientation
- Get comfortable with the system
- Complete first few challenges
- Earn first badges
- Understand your current level

### Weeks 2-4: Building Momentum
- Start Module 1 (AI Tools Mastery)
- Try first leadership scenarios
- Practice stakeholder communication
- Build your daily streak

### Months 2-3: Accelerating Growth
- Complete core modules
- Level up to AI Journeyman
- Take on weekly challenges
- Apply learnings to real team

### Months 4-6: Mastery
- Advanced modules and boss battles
- Reach AI Expert level (Level 15+)
- Lead your team's AI transformation
- Prepare for principal engineer role

## Tips for Success

✅ **DO:**
- Set aside 15-30 min daily for training
- Apply learnings immediately with your real team
- Report back on real-world results (bonus XP!)
- Ask for custom scenarios when you need them
- Celebrate every win, no matter how small

❌ **DON'T:**
- Rush through exercises just for XP
- Skip reflection and learning
- Ignore feedback from AI coach
- Compare yourself to others (everyone's journey is unique)
- Let perfect be the enemy of good

## Troubleshooting

**"I don't see any issues created"**
- Workflows run on schedule (may take up to 24 hours)
- Use `workflow_dispatch` to trigger immediately
- Check Actions tab for workflow runs
- Ensure workflows are enabled in settings

**"The challenge is too hard/easy"**
- Difficulty scales to your level automatically
- Request specific difficulty in issue comments
- AI coach will adjust future challenges

**"I missed a day"**
- No problem! Just continue when you can
- Streak resets but XP and progress remain
- Challenges accumulate (catch up when ready)

**"I want to focus on specific area"**
- Update your profile's `focus_areas`
- Request custom scenarios with labels
- Skip optional content and focus on priority

## Getting Help

**For training questions:**
- Comment on any training issue
- AI coach will respond with guidance

**For technical issues:**
- Open issue with `training-support` label
- Describe the problem
- Include relevant details

**For feature requests:**
- Open issue with `training-enhancement` label
- Suggest improvements
- Share ideas for new content

## Quick Reference

**Key Workflows:**
- `ai-first-senior-training.md` - Main daily training
- `ai-tools-deepdive.md` - Weekly AI workshops
- `leadership-scenarios.md` - Leadership simulations
- `stakeholder-communication.md` - Communication practice
- `boss-battles.md` - Monthly epic challenges

**Your Progress Files:**
- Branch: `assets/training-data`
- File: `training-progress.json`
- View: `git show assets/training-data:training-progress.json`

**Important Labels:**
- `training` - All training-related issues
- `leadership-request` - Request custom leadership scenario
- `stakeholder-request` - Request custom communication exercise
- `boss-retry` - Retry failed boss battle
- `training-support` - Get help

## Next Steps

1. ✅ Set up your profile
2. ✅ Trigger first workflow
3. ✅ Complete welcome challenge
4. 📚 Read the [full training guide](./ai-first-training-guide.md)
5. 🎯 Set your 30-day goals
6. 🚀 Start your transformation!

---

**Ready to become an AI-first senior engineering leader?**

**Your journey starts now!** 🚀

Questions? Open an issue with `training-support` label.

Good luck, and remember: **consistency beats intensity!** 💪
