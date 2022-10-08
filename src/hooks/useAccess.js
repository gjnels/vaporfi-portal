import { useMemo } from "react";
import { useSupabaseContext } from "../contexts/supabaseContext";

export const useAccess = () => {
  const { profile } = useSupabaseContext();
  const accessName = useMemo(
    () => (profile ? profile.role.name : false),
    [profile]
  );
  const accessLevel = useMemo(
    () => (profile ? profile.role.access_level : false),
    [profile]
  );

  const accessByName = (required) => accessName === required;
  const accessByLevel = (required) => accessLevel >= required;

  return { accessByName, accessByLevel };
};
