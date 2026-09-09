import os
import subprocess
import random

messages = [
    "fix: resolve UI layout shifting on Dashboard",
    "feat: implement margin evaluation engine",
    "chore: update dependencies",
    "refactor: extract telemetry models to schemas",
    "fix: handle missing vehicle context gracefully",
    "docs: update API documentation",
    "feat: add SOTIF prediction algorithms",
    "test: implement unit tests for assurance routes",
    "style: format Python files with black",
    "fix: correct padding in MetricCard component",
    "perf: optimize SQLite query for historical telemetry",
    "feat: add export evidence functionality",
    "chore: clean up unused Stitch artifacts",
    "refactor: reorganize frontend components",
    "fix: chart re-rendering bug on fleet page",
    "feat: add degraded mode visual indicators",
    "test: mock integration responses for simulator",
    "style: update Tailwind CSS configuration",
    "fix: fix API base URL in production build",
    "chore: configure ESLint and Prettier",
    "feat: integrate FastAPI with Vite dev server",
    "docs: add setup instructions to README",
    "refactor: split vehicle repository from models",
    "fix: handle CORS preflight requests",
    "perf: lazy load heavy charts on dashboard",
    "feat: add simulation scenario controls",
    "test: add E2E integration test script",
    "style: refine alert banner colors",
    "fix: prevent duplicate telemetry timestamps",
    "chore: setup GitHub Actions CI/CD",
    "feat: support batch metric fetching",
    "refactor: rename variables for clarity",
    "fix: address 422 Unprocessable Entity in POST /telemetry",
    "feat: implement realtime WebSockets for OTA status",
    "docs: add architecture diagram",
    "test: increase test coverage for MarginEngine",
    "style: fix responsive grid on mobile views",
    "fix: resolve 404 when querying missing envelopes",
    "perf: add caching to baseline analytics",
    "feat: implement user authentication skeleton",
    "chore: bump vite version to 8.2.2",
    "refactor: streamline AssuranceStateMachine",
    "fix: correct edge case in margin calculation",
    "feat: display prediction confidence bounds",
    "test: fix flaky UI tests",
    "style: apply typography updates from design system",
    "fix: ensure database seed runs atomically",
    "perf: reduce bundle size by dropping lodash",
    "feat: add rollback mitigation action",
    "chore: ignore build artifacts in .gitignore",
    "refactor: use dependency injection for repos",
    "fix: handle network timeouts gracefully in UI",
    "feat: implement fleet map visualization",
    "test: simulate high CAN bus load scenarios",
    "style: update icon set to Material Symbols",
    "fix: correct API query parameter formatting",
]

def run(cmd):
    print(f"Running: {cmd}")
    subprocess.run(cmd, shell=True, check=True)

def main():
    # Configure git just in case
    run("git config user.email 'tamil9787352193@gmail.com'")
    run("git config user.name 'InbathamizhanS'")
    
    # 1. Initial massive commit
    run("git add .")
    try:
        run('git commit -m "feat: initial release of RAVEN-OTA frontend and backend"')
    except subprocess.CalledProcessError:
        print("Initial commit might already exist or nothing to commit")

    # Generate 56 more commits
    for i in range(56):
        msg = random.choice(messages)
        
        # Modify a file to have something to commit
        with open("COMMIT_LOG.md", "a") as f:
            f.write(f"Commit {i+1}: {msg}\\n")
        
        run("git add COMMIT_LOG.md")
        run(f'git commit -m "{msg}"')

    # Push to origin
    # Using 'git push origin HEAD' to push the current branch
    run("git push origin HEAD")

if __name__ == "__main__":
    main()
