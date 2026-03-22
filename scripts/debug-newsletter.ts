console.error(
  '[DEPRECATED] scripts/debug-newsletter.ts is disabled. Newsletter was dismissed in GDPR Workstream 2.',
)
console.error(
  'Use `pnpm exec tsx scripts/decommission-newsletter-subscribers.ts --dry-run --env prod --project <project-id>` for compliance operations.',
)
process.exit(1)
