# Step 3: Production Shell And Fixture Separation

## Work

- Make production launch enter an honest empty/new/open/recent project state using the existing desktop registry.
- Move the 1k/5k fixture and developer instrumentation behind an explicit dev/test route or flag.
- Provide a clear first action without implementing the EQ1 renderer.

## Acceptance Criteria

- Production launch contains no dummy `Node 0` layers, benchmark count, or developer-only actions.
- Empty/new/open/recent states have visible next actions and honest missing-project errors.
- Explicit benchmark mode still loads the existing fixtures and preserves performance evidence.

## Guardrails

- Do not redesign the whole editor shell or add speculative onboarding.
- Do not silently fall back to demo data when a trusted project is unavailable.
- Keep benchmark data available for tests but impossible to confuse with user content.
