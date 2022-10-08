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
import { AdminDashboard } from "./routes/admin/AdminDashboard";
import { Transfers } from "./routes/admin/Transfers";
import { Square } from "./routes/admin/Square";
import { EditPromos } from "./routes/admin/EditPromos";
import { Profile } from "./routes/Profile";
import { Orders } from "./routes/orders/Orders";
import { Order } from "./routes/orders/[id]";
import { ProtectedRoute } from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: (
      <div className="h-screen">
        <ErrorPage />
      </div>
    ),
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Promos />,
          },
          // {
          //   path: "login",
          //   element: <Login />,
          // },
          {
            path: "custom-blends",
            element: <FlavorPicker />,
          },
          // {
          //   path: "named-blends",
          //   element: <NamedBlends />,
          // },
          {
            path: "nicotine-calculator",
            element: <NicotineCalculator />,
          },
          // {
          //   path: "profile",
          //   element: (
          //     <ProtectedRoute>
          //       <Profile />
          //     </ProtectedRoute>
          //   ),
          // },
          // {
          //   path: "orders",
          //   children: [
          //     {
          //       index: true,
          //       element: <Orders />,
          //     },
          //     {
          //       path: ":id",
          //       element: <Order />,
          //     },
          //   ],
          // },
          // {
          //   path: "admin",
          //   element: <ProtectedRoute access={3} />,
          //   children: [
          //     {
          //       index: true,
          //       element: <AdminDashboard />,
          //     },
          //     {
          //       path: "transfers",
          //       element: <Transfers />,
          //     },
          //     {
          //       path: "square",
          //       element: <Square />,
          //     },
          //     {
          //       path: "promos",
          //       element: <EditPromos />,
          //     },
          //   ],
          // },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SessionProvider>
      <SupabaseProvider>
        <RouterProvider router={router} />
        <Toaster />
      </SupabaseProvider>
    </SessionProvider>
  </React.StrictMode>
);
