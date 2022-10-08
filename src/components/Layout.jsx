import { Outlet, useNavigation } from "react-router-dom";
import { NavBar } from "./NavBar";

export const Layout = () => {
  const navigation = useNavigation();

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-sm text-gray-100 lg:flex-row lg:text-base">
      <NavBar />
<<<<<<< HEAD
      <main className="grow bg-gray-100 py-8 px-6 dark:bg-gray-800 lg:overflow-y-auto lg:px-8">
        <div className="container mx-auto">
=======
      <main className="grow bg-gray-800 lg:overflow-y-scroll">
        <div className="container mx-auto py-8 px-6 lg:py-8">
>>>>>>> dev
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-gray-700 bg-gray-800 p-2 text-center text-xs text-gray-500 lg:hidden">
        <p>Created by Garrett Nelson &copy; 2022</p>
      </footer>
    </div>
  );
};
