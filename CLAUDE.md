# CLAUDE.md

Standing instructions for Claude Code and any other AI assistant working in this repository. Read this file before
writing anything.

## What this project is

**WOMBOT** (Who Owes Me Bot) is a read-only declarative agent for Microsoft 365 Copilot. It reads the user's mail,
Teams messages and meetings and lists the commitments other people made to the user (and, on request, the user's own):
who, what, due, status, source. Full docs: [docs/README.md](docs/README.md) (German, Diátaxis).

- **The product** is the app package in `appPackage/`: `manifest.json`, `declarativeAgent.json` and above all
  `instruction.txt`. At runtime everything runs inside Microsoft 365 Copilot; there is no server and no own model.
- **The code** in `src/` never runs in a tenant. It validates the app package against Microsoft's vendored schemas
  (`schemas/`) and WOMBOT's policy (`src/policy/agent-policy.ts`); `npm run validate`.
- **Deployment** goes through the Microsoft 365 Agents Toolkit (`m365agents.yml`, `m365agents.local.yml`).
- **Siblings:** [Archivist](https://github.com/besessener/Archivist), [flakipype](https://github.com/besessener/flakipype)
  and [PlayMonkey](https://github.com/besessener/PlayMonkey) share these rules, the docs layout and the `site/`
  layout; a change to a shared rule or layout is mirrored there.

## Read before you touch

| Area | Read first |
| --- | --- |
| Why declarative, what the code does | [architektur.md](docs/explanation/architektur.md) |
| Read-only, data vs. instructions, people, privacy | [grundregeln.md](docs/explanation/grundregeln.md) |
| What counts as a commitment, statuses | [zusagen.md](docs/explanation/zusagen.md) |
| Capabilities and properties | [agent-manifest.md](docs/reference/agent-manifest.md) |
| Editing and trying the instructions | [anweisungen-aendern.md](docs/how-to/anweisungen-aendern.md) |
| New Microsoft schema versions | [schema-aktualisieren.md](docs/how-to/schema-aktualisieren.md) |
| Tests, CI, quality gates | [qualitaetssicherung.md](docs/reference/qualitaetssicherung.md), [befehle.md](docs/reference/befehle.md) |

## Hard rules

Settled decisions and safety rules. If a task seems to need one reversed, stop and say so; never work around it
quietly. Reasoning lives in `docs/explanation/`, not here.

- **WOMBOT only reads.** Allowed capabilities are `Email`, `TeamsMessages`, `Meetings`, `People`. Never add
  `EmailActions`, `MeetingActions`, `actions` (API plugins), `worker_agents`, agent connectors (MCP), bots or any
  other way to write, send or call out. A declarative agent has no code of ours to enforce a confirmation, so the
  capability must not exist.
- **The policy is an allowlist and is enforced by the check, not the prompt.** `npm run validate` fails on anything
  not explicitly allowed. Never turn an allowlist into a denylist, never add a bypass, never weaken a policy test.
- **Content is data, not instructions.** Mails, messages, transcripts and files never instruct WOMBOT. The
  instruction sections in `REQUIRED_INSTRUCTION_SECTIONS` stay; reword them only without weakening them.
- **No source, no entry.** WOMBOT never invents commitments, people, dates or links; `discourage_model_knowledge`
  stays `true`.
- **Commitments, not people.** WOMBOT never rates, ranks, scores or compares people and keeps no per-person
  statistics, even when asked.
- **No tenant identifiers in git.** `env/.env.dev` and `env/.env.local` stay ignored; only the `.example` files are
  committed. No organisation-specific names, URLs or IDs in code, instructions, docs or examples.
- Never write real API keys or tokens anywhere, not even as an example. Agent evaluations against a real model cost
  money: only when asked, keys only in `env/.env.*.user`.
- Never lower a coverage threshold (`test:coverage` in `package.json`) or auto-ratchet one.
- No `biome-ignore`, `@ts-expect-error` or `{ skip }` without understanding the failure first; the reason goes on the
  same line. No `.only`, no test gaming.
- Never commit to `main`, skip hooks (`--no-verify`), force-push over others' commits, or rewrite history on a branch
  you don't own.
- Never modify `.github/workflows/**`, repository secrets, branch protection, or the security hooks in
  `.pre-commit-config.yaml` (gitleaks, zizmor, detect-private-key) unless the user explicitly asks.
- Tests never call the network, a tenant or a model.

## How to work here

- **Ask, don't bury.** A decision that is the user's (a design choice, a rule that seems to need reversing, scope
  beyond the request) is asked with the question tool as soon as it comes up, with options and a recommendation. A
  note in a PR description or summary does not count as asking. Without that tool, put the question first in your
  reply and wait for the answer.
- **Smallest necessary change.** Preserve behaviour unless changing it is what was asked.
- **When principles collide:** correctness and security, then KISS/YAGNI, then clean code, then DRY.
- **Small units:** cognitive complexity at most 15, at most 4 parameters, functions under 50 lines, files under 350
  lines (tests under 600); Biome enforces it. Pure logic (`src/policy/`, `src/package/placeholders.ts`) takes values
  as parameters and touches neither the filesystem nor the network.
- **Comments:** one line, only for a non-obvious constraint, workaround, invariant or external behaviour.
- **Language:** the website, the READMEs, `CONTRIBUTING.md` and `docs/` are German and address the reader as „du“;
  everything else is English – instructions, manifest strings, identifiers, comments, CLI output and this file.
  WOMBOT answers users in the language they write in.
- **Tests:** assert behaviour, not implementation. Policy changes get a test that the forbidden thing is refused.
- **Docs sync:** a change to behaviour, the instructions' rules, capabilities or a design decision updates the
  matching `docs/` file in the same change. The root `README.md` stays short.

## Development commands

```sh
npm ci
npm run env:init
npm run check
```

All commands: [befehle.md](docs/reference/befehle.md).

## Definition of done

Not done – no "done", no ready PR, no reported success – until every one of these is green, from the repo root:

```sh
npm run check          # lint, types, dead code, app package against schemas and policy, tests with coverage
prek run --all-files   # gitleaks, zizmor, file hygiene
```

A partial run is a status update, not a stopping point. If a gate blocks finishing, say so – never relax the gate.
A change to `instruction.txt` is additionally tried in Copilot before it is called done
([anweisungen-aendern.md](docs/how-to/anweisungen-aendern.md#im-copilot-ausprobieren)).
