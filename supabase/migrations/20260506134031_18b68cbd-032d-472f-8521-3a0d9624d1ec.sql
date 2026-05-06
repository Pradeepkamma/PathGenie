-- Harden SECURITY DEFINER functions by restricting EXECUTE to only the roles that need them.

-- get_shared_result_by_id: callable by anon (public share links) and authenticated users only.
-- Revoke from PUBLIC (broad) and grant explicitly to anon + authenticated.
REVOKE ALL ON FUNCTION public.get_shared_result_by_id(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_shared_result_by_id(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.get_shared_result_by_id(uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.get_shared_result_by_id(uuid) TO anon, authenticated;

COMMENT ON FUNCTION public.get_shared_result_by_id(uuid) IS
  'INTENTIONALLY PUBLIC share-link entry point. SECURITY DEFINER is required to bypass the locked-down RLS on shared_results (no broad SELECT policy exists, preventing table enumeration). Callers must supply the exact UUID of a shared result. EXECUTE granted to anon + authenticated only.';

-- handle_new_user: auth trigger. Should NOT be callable from the API by anyone.
-- It only needs to be executed by the trigger context (table owner / postgres).
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM authenticated;

COMMENT ON FUNCTION public.handle_new_user() IS
  'Auth trigger only. SECURITY DEFINER required to insert into public.profiles when a new auth user is created. EXECUTE revoked from anon and authenticated so it cannot be invoked via PostgREST.';