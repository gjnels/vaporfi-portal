import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";

export const Layout = () => (
  <div className="text-sm text-gray-900 dark:text-gray-100 lg:text-base">
    <NavBar />
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Outlet />
    </main>
  </div>
);
