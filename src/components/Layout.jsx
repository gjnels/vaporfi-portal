import { Outlet, useNavigation } from "react-router-dom";
import { NavBar } from "./NavBar";

export const Layout = () => {
  const navigation = useNavigation();

  return (
    <div className="flex h-screen flex-col bg-gray-200 text-sm text-gray-900 dark:bg-gray-900 dark:text-gray-100 lg:flex-row lg:text-base">
      <NavBar />
      <main className="grow bg-gray-100 dark:bg-gray-800 lg:overflow-y-scroll">
        <div className="container mx-auto py-8 px-6 lg:py-8">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-gray-300 bg-gray-100 p-2 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800 lg:hidden">
        <p>Created by Garrett Nelson &copy; 2022</p>
      </footer>
    </div>
  );
};
