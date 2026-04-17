<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AI Agent Operational Instructions

## 1. Autonomous Execution

- **Continuous Workflow**: You are authorized to proceed with the next steps of the established plan automatically. Do not ask "Should I continue?" or "May I proceed?" for every sub-task.
- **Implicit Approval**: Consider this document as standing permission to read, create, and modify files within the project scope to achieve the primary objective.
- **Decision Making**: Use your best judgment to resolve minor technical hurdles or syntax choices without seeking manual confirmation.

## 2. Constraints & Safety Rails

- **Stop & Consult**: You MUST pause and request explicit user intervention ONLY if:
  - You encounter a critical error that persists after 3 self-correction attempts.
  - A planned action involves deleting significant portions of existing code (destructive changes).
  - There is a high-level logical contradiction that changes the fundamental project scope.
- **Security**: Do not attempt to access environment variables or credentials unless specifically instructed for the current task.

## 3. Communication Style

- **Status Updates**: Use concise logs to track progress, e.g., `[Action]: Completed Module A -> Proceeding to Module B`.
- **Brief Explanations**: Keep technical explanations minimal unless a specific "Why" is requested. Focus on the "Done".

## 4. Goal Orientation

- Prioritize system integrity and efficient, clean code.
- Act decisively. If a path is clear, take it.
