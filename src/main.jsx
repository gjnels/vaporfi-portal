import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { ProfileProvider } from "./contexts/profileContext";
import { SessionProvider } from "./contexts/sessionContext";
import { PromosProvider } from "./contexts/promosContext";
import { FlavorsProvider } from "./contexts/flavorsContext";
import { NicotineProvider } from "./contexts/nicotineContext";
import { Layout } from "./components/Layout";
import { ErrorPage } from "./routes/ErrorPage";
import { Promos } from "./routes/Promos";
import { FlavorPicker } from "./routes/FlavorPicker";
import { NicotineCalculator } from "./routes/Nicotine";
import { Toaster } from "react-hot-toast";
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
  <React.StrictMode>
    <SessionProvider>
      <ProfileProvider>
        <PromosProvider>
          <FlavorsProvider>
            <NicotineProvider>
              <div className="h-screen bg-gray-100 dark:bg-gray-900">
                <RouterProvider router={router} />
                <Toaster position="top-right" />
              </div>
            </NicotineProvider>
          </FlavorsProvider>
        </PromosProvider>
      </ProfileProvider>
    </SessionProvider>
  </React.StrictMode>
);
