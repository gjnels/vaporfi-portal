import { Navigate, useLocation } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import { ErrorPage } from "../routes/ErrorPage";

const getError = (hash) => {
  if (!hash) return false;

  const hashErrors = hash
    .slice(1)
    .split("&")
    .reduce((err, value) => {
      const error = value.split("=");
      return { ...err, [error[0]]: error[1].replace(/\+/g, " ") };
    }, {});
  return hashErrors;
};

export const AuthRedirect = ({
  errorLink,
  hashString,
  redirectTo,
  checkForUser = false,
  noUserLink,
  children,
}) => {
  const location = useLocation();
  const error = getError(location.hash);

  return location?.hash?.includes(hashString) ? (
    <Navigate to={redirectTo} replace={true} />
  ) : checkForUser && !supabase.auth.user() ? (
    <div className="flex w-full flex-col items-center gap-4">
      <ErrorPage
        manualError={{ message: "No user found" }}
        customLink={noUserLink}
      />
    </div>
  ) : error?.error ? (
    <div className="flex w-full flex-col items-center gap-4">
      <ErrorPage manualError={error} customLink={errorLink} />
    </div>
  ) : (
    children
  );
};
