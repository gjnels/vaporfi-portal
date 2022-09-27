import { Link } from "../components/ui/Links";

export const PageNotFound = () => (
  <div className="flex flex-col items-center gap-4">
    <p className="text-center text-2xl font-semibold text-rose-600 dark:text-rose-400 lg:text-3xl">
      Error: Page not found
    </p>
    <Link to="/">Home Page</Link>
  </div>
);
