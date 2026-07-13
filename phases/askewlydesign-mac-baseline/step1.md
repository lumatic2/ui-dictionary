# Step 1: Root Bootstrap And Command Contract

## Work

- Add the smallest root entry that resolves package install/build order and launches the Mac development surface.
- Document supported Node/npm versions, lockfile behavior, commands, and failure recovery.

## Acceptance Criteria

- From a clean dependency state, one documented entry performs the required install/build sequence and opens a nonblank app.
- Local package changes rebuild without asking the user to remember package order.
- The command fails clearly when prerequisites are missing.

## Guardrails

- Do not convert the repository to a new monorepo/package manager unless the existing structure makes the minimal entry impossible.
- Do not broaden arbitrary project code execution or npm package browsing.
- Preserve package-local lockfiles unless a separately approved migration is required.
