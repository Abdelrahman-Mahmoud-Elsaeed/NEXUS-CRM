import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/modules/auth/store/auth.slice"; // Adjust path as needed
import {
  Network,
  UserMinus,
  LogOut,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

interface InvitationRequiresLogoutProps {
  workspaceName: string;
  inviterName: string;
  currentUserEmail: string;
  token: string;
}

export const InvitationRequiresLogout: React.FC<InvitationRequiresLogoutProps> = ({
  workspaceName,
  inviterName,
  currentUserEmail,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogoutAndContinue = () => {
    dispatch(logout());

    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#fcf8ff] relative overflow-x-hidden select-none">
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-lg shadow-md">
            <Network className="text-primary-foreground h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            NexusCRM
          </h1>
        </div>
      </header>

      <Card className="w-full max-w-md bg-white border-slate-200 shadow-sm z-10 p-2">
        <CardHeader className="text-center pt-6 pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-blue-100 flex items-center justify-center rounded-full">
              <UserMinus className="text-blue-600 h-7 w-7" />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Logout Required
          </CardTitle>

          <CardDescription className="text-sm text-muted-foreground mt-2">
            You are currently signed in, but this invitation requires creating a new account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3">
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-slate-900">{inviterName}</span> has invited you to join <span className="font-semibold text-slate-900">{workspaceName}</span> as a new user.
            </p>
            
            <div className="h-px bg-blue-200" />

            <p className="text-sm text-slate-700">
              You are currently signed in as:
            </p>
            <div className="font-medium text-slate-900 break-all">
              {currentUserEmail}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-700">
              To proceed and create your new account, you must log out of your current session first.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2 pb-6">
          <Button
            onClick={handleLogoutAndContinue}
            className="w-full h-11 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Log Out & Continue
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full"
          >
            Return Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};