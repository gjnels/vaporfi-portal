import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSessionContext } from "../contexts/sessionContext";
import { useSupabaseContext } from "../contexts/supabaseContext";
import { ErrorPage } from "../routes/ErrorPage";
import { Spinner } from "../components/ui/Spinner";

export const ProtectedRoute = ({ access, children }) => {
  const { session } = useSessionContext();
  const { profile } = useSupabaseContext();
  const location = useLocation();

  if (session && !profile) {
    return <Spinner />;
  }

  if (session) {
    if (access != null && profile.role.access_level < access) {
      return (
        <ErrorPage
          manualError={{
            message: `You do not have access to this page.`,
          }}
        />
      );
    }
    return children ?? <Outlet />;
  }
  return (
    <Navigate
      to="/login"
      replace={true}
      state={{ prevLocation: location.pathname }}
    />
  );
};
