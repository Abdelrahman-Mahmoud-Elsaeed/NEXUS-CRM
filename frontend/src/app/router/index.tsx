import { createBrowserRouter } from "react-router-dom";

// Layouts
import AuthLayout from "@layouts/AuthLayout";
// import DashboardLayout from "@layouts/DashboardLayout";

import LoginPage from "@/modules/auth/pages/Login/LoginPage";
import SignupPage from "@/modules/auth/pages/SignUp/SignUp";
import VerifyEmail from "@/modules/auth/pages/VerifyEmail/VerifyEmail";
import ForgotPassword from "@/modules/auth/pages/ForgotPassword/ForgotPassword";
import CheckEmail from "@/modules/auth/pages/CheckEmail/CheckEmail";
import ResetPassword from "@/modules/auth/pages/ResetPassword/ResetPassword";
import LinkExpired from "@/modules/auth/pages/LinkExpired/LinkExpired";

import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "@/modules/dashboard/pages/Dashboard"
import GuestGuard from "@/modules/auth/guard/GuestGuard";
import VerifyGuard from "@/modules/auth/guard/VerifyGuard";
import AuthGuard from "@/modules/auth/guard/AuthGuard";

// // Dashboard Pages (Placeholders)
// import DashboardPage from "@/pages/Dashboard";
// import LeadsListPage from "@/pages/LeadsList";
// import LeadDetailsPage from "@/pages/LeadDetails";
// import LeadFormPage from "@/pages/LeadForm";
// import PipelineBoardPage from "@/pages/PipelineBoard";
// import TasksPage from "@/pages/Tasks";
// import TeamMembersPage from "@/pages/TeamMembers";
// import SettingsPage from "@/pages/Settings";
// import NotFoundPage from "@/pages/NotFound";

export const router = createBrowserRouter([

  {
    element: <GuestGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/signup",
            element: <SignupPage />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "/check-email",
            element: <CheckEmail />,
          },
          {
            path: "/reset-password/:token",
            element: <ResetPassword />,
          },
          {
            path: "/link-expired",
            element: <LinkExpired />,
          },
        ],
      },
    ],
  },

  {
    element: <VerifyGuard />,
    children: [
      {
        element: <AuthLayout />, 
        children: [
          {
            path: "/verify-email",
            element: <VerifyEmail />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
]);