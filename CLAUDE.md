# CLAUDE.md

This file provides guidance to Claude when working in this repository.

## Agent Rules

This project uses shared agent rules defined in [AGENTS.md](./AGENTS.md). Claude must read and follow all rules specified there before writing any code.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
