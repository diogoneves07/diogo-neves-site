# Engineering Pipeline

## Required Flow

Specifier  
→ Architect  
→ Coder  
→ Cleaner  
→ Reviewer  
→ Hardener  
→ QA  
→ Metrics

## Blocking Rules

- Stages are sequential.
- Stages are mandatory.
- Stages cannot be skipped.
- No code before `## Specification` and `## Architecture`.
- No completion before `## Cleaner Report`, `## Review Report`,
  `## Security Report`, `## QA Report`, and `## Metrics Report`.
- If Reviewer, Hardener, or QA fails, return to Coder and repeat the
  remediation loop.
- The task is complete only when QA Status is `APPROVED` and the Metrics
  Report has been produced.
- The Metrics Report is informational only — it cannot block approval.
