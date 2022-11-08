import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { SessionProvider } from "./contexts/sessionContext";
import { SupabaseProvider } from "./contexts/supabaseContext";
import { Toaster } from "react-hot-toast";
import { Layout } from "./components/Layout";
import { ErrorPage } from "./routes/ErrorPage";
import { Login } from "./routes/auth/Login";
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
import { Paperwork } from "./routes/paperwork/Paperwork";
import { SetPassword } from "./routes/auth/SetPassword";
import { ResetPassword } from "./routes/auth/ResetPassword";
import { ChangeEmail } from "./routes/auth/ChangeEmail";

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
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "reset-password",
            element: <ResetPassword />,
          },
          {
            path: "change-email",
            element: <ChangeEmail />,
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
          {
            path: "profile",
            element: (
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            ),
          },
          // {
          //   path: "orders",
          //   element: <ProtectedRoute />,
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
          //   path: "paperwork",
          //   element: (
          //     <ProtectedRoute>
          //       <Paperwork />
          //     </ProtectedRoute>
          //   ),
          // },
          {
            path: "admin",
            element: <ProtectedRoute access={3} />,
            children: [
              // {
              //   index: true,
              //   element: <AdminDashboard />,
              // },
              // {
              //   path: "transfers",
              //   element: <Transfers />,
              // },
              // {
              //   path: "square",
              //   element: <Square />,
              // },
              {
                path: "promos",
                element: <EditPromos />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "set-password",
    element: (
      <div className="grid h-screen content-center bg-gray-800 p-6">
        <SetPassword />
      </div>
    ),
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
