/**
 * Regression tests for shared_results access control.
 *
 * Security model:
 *  - The shared_results table has NO broad SELECT policy (prevents enumeration).
 *  - Public read access is mediated ONLY through the SECURITY DEFINER RPC
 *    `get_shared_result_by_id(result_id uuid)`, which requires the exact UUID.
 *  - Direct SELECT on the table must fail for both anon and authenticated users.
 *  - The RPC must succeed for anon (public share links) when given a valid UUID,
 *    and return zero rows for unknown UUIDs (no leakage).
 *
 * These tests hit the live Lovable Cloud project using the publishable anon key,
 * exactly as an unauthenticated visitor of a share link would.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;

const hasEnv = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const d = hasEnv ? describe : describe.skip;

d("shared_results access control (anonymous client)", () => {
  let anon: ReturnType<typeof createClient>;

  beforeAll(() => {
    anon = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  });

  it("blocks anonymous direct SELECT on shared_results (no enumeration)", async () => {
    const { data, error } = await anon.from("shared_results").select("id").limit(1);
    // Either RLS denies the request (error) or returns an empty set — but it
    // must NEVER return rows belonging to other users.
    if (error) {
      expect(error).toBeTruthy();
    } else {
      expect(Array.isArray(data)).toBe(true);
      expect(data!.length).toBe(0);
    }
  });

  it("blocks anonymous INSERT into shared_results", async () => {
    const { error } = await anon
      .from("shared_results")
      .insert({ results: { test: true } } as never);
    expect(error).toBeTruthy();
  });

  it("returns zero rows for an unknown share UUID via the public RPC (no leakage)", async () => {
    const fakeId = "00000000-0000-0000-0000-000000000000";
    const { data, error } = await (anon.rpc as any)("get_shared_result_by_id", {
      result_id: fakeId,
    });
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect((data as unknown[]).length).toBe(0);
  });

  it("public share-link RPC is callable by anon (does not require auth)", async () => {
    // The call itself must succeed (no permission error) even with no session.
    const { error } = await (anon.rpc as any)("get_shared_result_by_id", {
      result_id: "11111111-1111-1111-1111-111111111111",
    });
    expect(error).toBeNull();
  });
});
