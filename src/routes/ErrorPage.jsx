import { useRouteError } from "react-router-dom";
import { Link } from "../components/ui/Links";

export const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold lg:text-4xl">Oops!</h1>
      <p>Sorry, an unexpected error has occured.</p>
      <p>
        <i className="text-gray-400">{error.statusText || error.message}</i>
      </p>
      <p>
        Go to{" "}
        <Link to="/" replace={true}>
          Home Page
        </Link>
      </p>
    </div>
  );
};
