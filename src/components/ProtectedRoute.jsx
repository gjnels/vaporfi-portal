import { Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import { ErrorPage } from "../routes/ErrorPage";
import { Spinner } from "../components/ui/Spinner";
import { Link } from "./ui/Links";

export function ProtectedRoute({ access, children }) {
  const { session, loading, canAccess } = useAuthContext();
  const location = useLocation();

  if (loading) return <Spinner />;

  if (session === null) {
    return (
      <ErrorPage
        manualError={{
          message: `You must be logged in to view this page.`,
        }}
        customLink={
          <Link to="/login" state={{ prevLocation: location.pathname }}>
            Login
          </Link>
        }
        unauthorized={true}
      />
    );
  }

  // Only check after checking session is not null
  // Waiting on profile and roles to load

  if (canAccess(access) === false) {
    return (
      <ErrorPage
        manualError={{
          message: `You do not have access to this page.`,
        }}
        unauthorized={true}
      />
    );
  }

  return children ?? <Outlet />;
}
