import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import { NavBar } from "./NavBar";

export function Layout() {
  const { newUser } = useAuthContext();

  return newUser ? (
    <Navigate to="/set-password" state={{ newUser }} />
  ) : (
    <div className="relative flex h-screen flex-col text-sm lg:flex-row lg:text-base">
      <NavBar />
      <main className="mt-16 grow bg-gray-800 lg:ml-48 lg:mt-0">
        <div className="py-8 px-4 md:px-6">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-gray-700 bg-gray-800 p-2 text-center text-xs text-gray-500 lg:hidden">
        <p>Created by Garrett Nelson &copy; 2022</p>
      </footer>
    </div>
  );
}
