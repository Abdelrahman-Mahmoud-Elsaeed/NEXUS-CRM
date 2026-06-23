import { createBrowserRouter } from "react-router-dom";

// Layouts
import AuthLayout from "@layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Guards
import GuestGuard from "@/modules/auth/guard/GuestGuard";
import VerifyGuard from "@/modules/auth/guard/VerifyGuard";
import AuthGuard from "@/modules/auth/guard/AuthGuard";

// Auth Modules
import LoginPage from "@/modules/auth/pages/Login/LoginPage";
import SignupPage from "@/modules/auth/pages/SignUp/SignUp";
import VerifyEmail from "@/modules/auth/pages/VerifyEmail/VerifyEmail";
import ForgotPassword from "@/modules/auth/pages/ForgotPassword/ForgotPassword";
import CheckEmail from "@/modules/auth/pages/CheckEmail/CheckEmail";
import ResetPassword from "@/modules/auth/pages/ResetPassword/ResetPassword";
import LinkExpired from "@/modules/auth/pages/LinkExpired/LinkExpired";
import SetupWorkspace from "@/modules/auth/pages/SetupWorkspace/SetupWorkspace";

// Core App Module
import Dashboard from "@/modules/dashboard/pages/Dashboard";
import { InvitationAcceptGateway } from "@/modules/invitation/guard/InvitationAcceptGateway";
import TeamManagement from "@/modules/team/page/TeamManagement";
import { Contacts } from "@/modules/contacts/page/Contacts";
import { ContactDetails } from "@/modules/contacts/page/ContactDetails";
import { Companies } from "@/modules/companies/page/Companies";
import { CompanyDetails } from "@/modules/companies/page/CompanyDetails";
import { CompanyDeals } from "@/modules/companies/page/CompanyDeals";
import { Deals } from "@/modules/deals/page/Deals";
import { DealDetails } from "@/modules/deals/page/DealDetails";


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
    element: <AuthLayout />,
    children: [
      {
        path: "/invitation/accept",
        element: <InvitationAcceptGateway />,
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
        element: <AuthLayout />,
        children: [
          {
            path: "/setup-workspace",
            element: <SetupWorkspace />,
          },
        ],
      },

      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/inbox",
            element: (
              <div className="p-6">Inbox Workspace View Placeholder</div>
            ),
          },
          {
            path: "/integrations",
            element: <div className="p-6">Social Integration Channel Hub</div>,
          },
          {
            path: "/contacts",
            element: <Contacts />,
          },
          {
            path: "/contacts/:id",
            element: <ContactDetails />,
          },
          {
            path: "/companies",
            element: <Companies/>,
          },
          {
            path: "/companies/:id",
            element: <CompanyDetails />,
          },
          {
            path: "/companies/:companyId/deals",
            element: <CompanyDeals />,
          },
          {
            path: "/deals",
            element: <Deals />,
          },
          {
            path: "/deals/:id",
            element: <DealDetails />,
          },
          {
            path: "/tasks",
            element: <div className="p-6">Tasks Checklist Grid Workflow</div>,
          },
          {
            path: "/calendar",
            element: (
              <div className="p-6">Chronological Workspace Event Calendar</div>
            ),
          },
          {
            path: "/analytics",
            element: (
              <div className="p-6">Data Analytics Dashboard Matrix View</div>
            ),
          },
          {
            path: "/reports",
            element: (
              <div className="p-6">Performance Reports System Ledger</div>
            ),
          },
          {
            path: "/files",
            element: <div className="p-6">Workspace Cloud File Manager</div>,
          },
          {
            path: "/organization",
            children: [{ path: "team", element: <TeamManagement /> }],
          },
          {
            path: "/settings",
            element: (
              <div className="p-6">Global Platform Configurations Portal</div>
            ),
          },
        ],
      },
    ],
  },
]);
