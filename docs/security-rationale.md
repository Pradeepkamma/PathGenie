# Security Rationale: Ignored Findings

This document explains why specific security-scanner findings are intentionally
ignored. Future scans should not re-flag these as accidental issues.

## SECURITY DEFINER functions in `public`

Two `SECURITY DEFINER` functions live in the `public` schema and are surfaced
by Supabase linters `0028` (anon) and `0029` (authenticated):

### 1. `public.get_shared_result_by_id(result_id uuid)`

- **Purpose:** Backs the public "share link" feature. Given an exact share
  UUID, returns a single shared result row.
- **Why SECURITY DEFINER:** The `shared_results` table has no broad `SELECT`
  RLS policy on purpose — that prevents anyone from listing/enumerating share
  rows. The RPC is the only path through which a share link is resolved.
- **Why callable by `anon` and `authenticated`:** Share links must work for
  signed-out visitors. Knowledge of the random UUID is the access token.
- **Hardening applied:** `EXECUTE` is `REVOKE`d from `PUBLIC` and granted
  explicitly to only `anon` and `authenticated`. The function is `STABLE` and
  has `search_path = public`.
- **Residual risk:** UUID guessing — negligible (122 bits of entropy).

### 2. `public.handle_new_user()`

- **Purpose:** Auth trigger that creates a `profiles` row when a new user
  signs up.
- **Why SECURITY DEFINER:** Needs to write to `public.profiles` from the auth
  hook context.
- **Hardening applied:** `EXECUTE` is `REVOKE`d from `PUBLIC`, `anon`, and
  `authenticated`. It is invoked exclusively by the auth trigger.
- **Residual risk:** None via the public API — it is not callable through
  PostgREST.

## Regression coverage

`src/test/sharedResults.test.ts` verifies that:

1. Anonymous direct `SELECT` on `shared_results` returns no rows.
2. Anonymous `INSERT` is rejected.
3. The public RPC returns an empty set for unknown UUIDs (no leakage).
4. The public RPC is callable without authentication (the share-link flow).
