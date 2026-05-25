<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **Issueflow-Blog** (630 symbols, 625 relationships, 0 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/Issueflow-Blog/context` | Codebase overview, check index freshness |
| `gitnexus://repo/Issueflow-Blog/clusters` | All functional areas |
| `gitnexus://repo/Issueflow-Blog/processes` | All execution flows |
| `gitnexus://repo/Issueflow-Blog/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->

---

# Ralph — Autonomous Loop

This project uses **Ralph** for autonomous task execution. Ralph is configured in `.ralph/` directory.

## Ralph Configuration

- **PROMPT.md**: Task instructions and automation rules
- **AGENT.md**: Agent behavior configuration
- **.ralphrc**: Ralph runtime settings

## How Ralph Works

Ralph runs in a loop, executing Claude Code commands autonomously based on the prompts in `.ralph/PROMPT.md`.

### Start Ralph

```bash
cd /home/qiyu/下载/Issueflow-Blog
/home/qiyu/.ralph/ralph_loop.sh --monitor
```

### Ralph Automation Rules

| Task Type | Behavior |
|-----------|----------|
| ✅ 修复构建错误 | Auto-execute |
| ✅ 更新依赖版本 | Auto-execute |
| ✅ 添加文档/脚本 | Auto-execute |
| ✅ 修改样式 | Auto-execute |
| ❌ 修改核心架构 | Ask user |
| ❌ 删除已有文件 | Ask user |
| ❌ 修改部署配置 | Ask user |

## Claude Code + Ralph Integration

When running Claude Code in this project:

1. **For one-off tasks**: Use Claude Code directly
2. **For ongoing/iterative tasks**: Start Ralph loop for autonomous execution
3. **Ralph respects CLAUDE.md** — GitNexus impact analysis rules still apply

## Important

- Ralph **does not replace** Claude Code — it automates the loop
- Ralph **reads CLAUDE.md** for project-specific rules
- Ralph **asks for confirmation** on important decisions (as defined in PROMPT.md)

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current
