# Step 4: Fresh-Clone Mac Baseline Evidence

## Work

- Run bootstrap, launch, new/open/recent, shutdown, and relaunch from a fresh-clone-equivalent state.
- Capture commands, timing, screenshots, test summary, and explicit EQ1 limitations.
- Confirm the existing Windows package verification does not regress.

## Acceptance Criteria

- Another agent can follow the recorded entry and reach the same Mac development surface.
- Evidence proves production/benchmark separation and reopen continuity.
- Test and package gate results are linked from the phase record; failures and waivers are not relabeled as passes.

## Guardrails

- Development-server screenshots do not prove macOS packaging; packaging remains EQ4.
- Do not commit generated dependencies, temporary screenshots, credentials, or machine-specific paths.
- Record network/cache assumptions that affect fresh-clone timing.
