/**
 * Blog post data.
 * Add new posts here — they auto-appear on /blog and get their own /blog/[slug] page.
 */

export const blogPosts = [
  {
    slug: "building-income-prediction-system-with-ml",
    title: "Building an Income Prediction System with Machine Learning",
    excerpt:
      "How I engineered a machine learning pipeline that achieves 85% accuracy on 32K+ census records — from data preprocessing to FastAPI deployment.",
    date: "2026-03-25",
    readTime: "8 min read",
    tags: ["Machine Learning", "Python", "FastAPI"],
    published: true,
    content: `
## The Challenge

Predicting income brackets from census data is a classic ML classification problem, but applying it to real-world data with 32,000+ records introduces challenges that textbook examples gloss over: class imbalance, mixed feature types, and the need for an interpretable model that stakeholders can trust.

## Data Preprocessing Pipeline

The Adult Income dataset from the UCI Machine Learning Repository contains 14 features — a mix of continuous variables (age, hours-per-week, capital-gain) and categorical ones (education, occupation, marital-status). My preprocessing pipeline handled:

- **Missing value imputation** using mode for categorical and median for numerical features
- **One-hot encoding** for nominal categories, ordinal encoding for education levels
- **Feature scaling** with StandardScaler on numerical columns
- **Class weight balancing** to address the 75/25 income split

## Model Comparison

I evaluated four architectures on stratified 5-fold cross-validation:

| Model | Accuracy | F1 Score | AUC-ROC |
|-------|----------|----------|---------|
| Logistic Regression | 79.2% | 0.61 | 0.83 |
| Random Forest | 84.1% | 0.71 | 0.90 |
| Gradient Boosting | **85.3%** | **0.73** | **0.91** |
| K-Nearest Neighbors | 81.7% | 0.65 | 0.86 |

Gradient Boosting won on all three metrics. The key insight was that tree-based models naturally handle the mixed feature types and non-linear relationships in census data.

## Deployment with FastAPI

The final model is served via a FastAPI backend with a React frontend for the analytics dashboard. The API accepts JSON payloads with the 14 features and returns a probability distribution across income brackets, not just a binary prediction — giving users confidence scores alongside the classification.

## Key Takeaways

1. **Feature engineering matters more than model choice** — creating interaction features between education and occupation improved accuracy by 2.1 percentage points.
2. **Class imbalance handling is essential** — without SMOTE or class weights, the model achieves 76% accuracy but an F1 of only 0.45 on the minority class.
3. **Interpretability wins trust** — SHAP value visualizations in the dashboard help users understand why the model made each prediction.

The complete source code is available on [GitHub](https://github.com/abdulrahmanazam/income-predictor).
    `.trim(),
  },
  {
    slug: "minimax-alpha-beta-pruning-game-ai",
    title: "Implementing Minimax with Alpha-Beta Pruning for Game AI",
    excerpt:
      "A deep dive into adversarial search algorithms — how I built an unbeatable Tic-Tac-Toe AI and scaled it to Super Tic-Tac-Toe's 9-board complexity.",
    date: "2026-03-18",
    readTime: "10 min read",
    tags: ["Algorithms", "Game AI", "JavaScript"],
    published: true,
    content: `
## Why Game AI?

Game AI sits at the intersection of algorithms, strategy, and real-time decision-making. It's one of the purest tests of algorithmic thinking — your agent must evaluate millions of potential futures and choose optimally, all within milliseconds.

## The Minimax Foundation

Minimax is a recursive algorithm that assumes both players play optimally. The maximizing player picks the move that leads to the highest score; the minimizing player picks the lowest. For standard 3×3 Tic-Tac-Toe, the game tree has roughly 255,168 possible games — small enough for exhaustive search.

\`\`\`
function minimax(board, depth, isMaximizing):
    if terminal(board): return evaluate(board)
    
    if isMaximizing:
        bestScore = -Infinity
        for each move in availableMoves(board):
            score = minimax(applyMove(board, move), depth + 1, false)
            bestScore = max(bestScore, score)
        return bestScore
    else:
        bestScore = +Infinity
        for each move in availableMoves(board):
            score = minimax(applyMove(board, move), depth + 1, true)
            bestScore = min(bestScore, score)
        return bestScore
\`\`\`

The result: a provably unbeatable AI. Against optimal play, the best outcome for a human is a draw.

## Scaling to Super Tic-Tac-Toe

Super Tic-Tac-Toe amplifies the complexity dramatically. The board consists of 9 sub-boards arranged in a 3×3 grid. Each move on a sub-board determines which sub-board your opponent must play in next. The branching factor jumps from ~5 (standard) to ~20-40 per move.

Pure Minimax can't handle this — the search tree explodes. Alpha-Beta Pruning cuts it down by eliminating branches that can't possibly influence the final decision:

- **Alpha**: the best score the maximizer can guarantee
- **Beta**: the best score the minimizer can guarantee
- When alpha >= beta, prune the remaining branches

In practice, Alpha-Beta Pruning reduces the effective branching factor from b to approximately √b, making Super Tic-Tac-Toe tractable with a depth limit of 6-8 plies.

## Multi-Board Evaluation Heuristic

Since we can't search to terminal states in Super Tic-Tac-Toe, I designed a weighted evaluation function:

- **Won sub-boards**: +100 points (strategic center board: +150)
- **Two-in-a-row on main grid**: +50 points
- **Sub-board control** (two-in-a-row within a sub-board): +10 points
- **Forced moves** (sending opponent to a won/drawn board): +30 points

The heuristic captures both local tactics (winning sub-boards) and global strategy (controlling the main grid).

## Performance Results

| Metric | Standard TicTacToe | Super TicTacToe |
|--------|-------------------|-----------------|
| Search depth | Exhaustive | 6-8 plies |
| Nodes evaluated/move | ~9,000 | ~50,000 |
| Response time | <1ms | ~200ms |
| Win rate vs random | 100% | 97.3% |

## What I Learned

The biggest lesson: **evaluation functions are where the real intelligence lives**. The search algorithm is mechanical — it explores and prunes. But the heuristic that scores non-terminal positions is where domain knowledge, creativity, and engineering judgment converge.

Source code: [GitHub - Super Tic-Tac-Toe](https://github.com/abdulrahmanazam/super-tictactoe) | [GitHub - AI Tic-Tac-Toe](https://github.com/abdulrahmanazam/ai-tictactoe)
    `.trim(),
  },
  {
    slug: "my-journey-into-full-stack-ai-engineering",
    title: "My Journey into Full Stack AI Engineering",
    excerpt:
      "From writing my first C program to building AI-powered web applications — reflections on 4 years of learning, competing, and building at FAST NUCES.",
    date: "2026-03-10",
    readTime: "6 min read",
    tags: ["Career", "AI/ML", "Reflection"],
    published: true,
    content: `
## Where It Started

I wrote my first line of code in 2019 — a simple C program that printed "Hello, World!" to the console. I was 16, sitting in a computer science class at Happy Palace School in Karachi, and I had no idea that this moment would define the next chapter of my life.

By the time I finished matric with a 98.12% score, I knew two things: I loved problem-solving, and I wanted to understand how machines could think.

## Choosing AI at FAST NUCES

When I enrolled in the BS Artificial Intelligence program at FAST NUCES Karachi in 2021, AI was already transforming industries — but the curriculum was rigorous in a way that went far beyond the hype. Data structures, algorithms, linear algebra, probability theory, and statistics came first. The AI-specific courses — machine learning, deep learning, computer vision, NLP — built on top of that mathematical foundation.

My CGPA of 3.33 doesn't tell the full story. The real education happened in the projects: staying up until 3 AM debugging a neural network that wouldn't converge, discovering that your carefully crafted model fails on edge cases you never considered, learning that 85% accuracy means 15% of your predictions are wrong.

## Competing and Growing

Competitions became my accelerator. Securing 2nd Place in the FAST Web Hunt Competition pushed me to learn React and Node.js under pressure — building a full-stack application in 48 hours teaches you more about development workflow than months of tutorials. The 3rd Place finish in the ACM Coders Cup sharpened my algorithmic thinking in ways that LeetCode problems (290+ solved, 6 badges) reinforced daily.

## The Full Stack + AI Intersection

The most exciting space in tech right now isn't pure AI research or pure web development — it's the intersection. Building an ML model is one challenge. Deploying it behind a FastAPI endpoint, connecting it to a React frontend with real-time predictions, and making the whole system reliable, fast, and user-friendly — that's full stack AI engineering.

My Income Prediction System crystallized this philosophy. The ML model (85% accuracy on 32K records) was only half the project. The other half was the interactive analytics dashboard, the API design, the error handling, and the user experience that makes predictions interpretable.

## What's Next

I'm currently open to AI/ML opportunities where I can combine my full-stack development skills with machine learning expertise. Whether it's building intelligent web applications, deploying ML pipelines, or creating AI-powered tools, I'm looking for roles where I can ship products that think.

If you're working on something interesting, [let's talk](https://calendly.com/azamabdulrahman930/30min).
    `.trim(),
  },
];

export function getBlogPost(slug) {
  return blogPosts.find((p) => p.slug === slug && p.published) ?? null;
}

export function getAllPublishedPosts() {
  return blogPosts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}
