import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { SessionProvider } from "./contexts/sessionContext";
import { SupabaseProvider } from "./contexts/supabaseContext";
import { Toaster } from "react-hot-toast";
import { Layout } from "./components/Layout";
import { ErrorPage } from "./routes/ErrorPage";
import { Login } from "./routes/Login";
import { Promos } from "./routes/Promos";
import { FlavorPicker } from "./routes/FlavorPicker";
import { NicotineCalculator } from "./routes/Nicotine";
import { NamedBlends } from "./routes/NamedBlends";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Promos />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "custom-blends",
            element: <FlavorPicker />,
          },
          {
            path: "named-blends",
            element: <NamedBlends />,
          },
          {
            path: "nicotine-calculator",
            element: <NicotineCalculator />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <SessionProvider>
    <SupabaseProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </SupabaseProvider>
  </SessionProvider>
  // </React.StrictMode>
);
