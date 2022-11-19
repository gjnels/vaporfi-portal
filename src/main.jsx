import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import { Toaster } from "react-hot-toast";
import { Layout } from "./components/Layout";
import { ErrorPage } from "./routes/ErrorPage";
import { Login } from "./routes/auth/Login";
import { SetPassword } from "./routes/auth/SetPassword";
import { PasswordRecovery } from "./routes/auth/PasswordRecovery";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./routes/Dashboard";
import { FlavorPicker } from "./routes/FlavorPicker";
import { NicotineCalculator } from "./routes/Nicotine";
import {
  NamedBlends,
  CreateNamedBlend,
  EditNamedBlend,
} from "./routes/NamedBlends";
import { AdminDashboard } from "./routes/admin/AdminDashboard";
import { Transfers } from "./routes/admin/Transfers";
import { Square } from "./routes/admin/Square";
import { Profile } from "./routes/Profile";
import { Orders } from "./routes/orders/Orders";
import { Order } from "./routes/orders/[id]";
import { Paperwork } from "./routes/paperwork/Paperwork";
import { CenteredContainer } from "./components/ui/CenteredContainer";
import { Promotions, CreatePromo, EditPromo } from "./routes/admin/Promotions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: (
      <CenteredContainer>
        <ErrorPage />
      </CenteredContainer>
    ),
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "custom-blends",
            element: <FlavorPicker />,
          },
          {
            path: "named-blends",
            children: [
              {
                index: true,
                element: <NamedBlends />,
              },
              {
                path: "new",
                element: <CreateNamedBlend />,
              },
              {
                path: ":id",
                element: <EditNamedBlend />,
              },
            ],
          },
          {
            path: "nicotine-calculator",
            element: <NicotineCalculator />,
          },
          {
            path: "profile",
            element: <ProtectedRoute />,
            children: [
              {
                index: true,
                element: <Profile />,
              },
            ],
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
                path: "promotions",
                children: [
                  {
                    index: true,
                    element: <Promotions />,
                  },
                  {
                    path: "new",
                    element: <CreatePromo />,
                  },
                  {
                    path: ":id",
                    element: <EditPromo />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/set-password",
    element: (
      <CenteredContainer>
        <SetPassword />
      </CenteredContainer>
    ),
    errorElement: (
      <CenteredContainer>
        <ErrorPage />
      </CenteredContainer>
    ),
  },
  {
    path: "/login",
    element: (
      <CenteredContainer>
        <Login />
      </CenteredContainer>
    ),
    errorElement: (
      <CenteredContainer>
        <ErrorPage />
      </CenteredContainer>
    ),
  },
  {
    path: "/password-recovery",
    element: (
      <CenteredContainer>
        <PasswordRecovery />
      </CenteredContainer>
    ),
    errorElement: (
      <CenteredContainer>
        <ErrorPage />
      </CenteredContainer>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
