import { useRouteError } from "react-router-dom";
import { Link } from "../components/ui/Links";

export function ErrorPage({ manualError, customLink, unauthorized = false }) {
  const error = useRouteError();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold lg:text-4xl">
        {unauthorized ? "Access Denied" : "Oops!"}
      </h1>
      {manualError == null && error.status !== 404 && (
        <p>Sorry, an unexpected error has occured.</p>
      )}
      <p className="text-center italic text-gray-400">
        {manualError
          ? manualError.message || manualError.error_description
          : error.status === 404
          ? "Page not found"
          : error.statusText || error.message}
      </p>
      {customLink}
      <p>
        Go to{" "}
        <Link to="/" replace={true}>
          Dashboard
        </Link>
      </p>
    </div>
  );
}
