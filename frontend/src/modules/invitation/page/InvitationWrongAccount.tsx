import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/modules/auth/store/auth.slice"; // Adjust path if needed
import {
  Network,
  AlertTriangle,
  LogOut,
  ShieldCheck,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

interface InvitationWrongAccountProps {
  workspaceName: string;
  inviterName: string;
  inviterRole: string;
  invitationEmail: string;
  currentUserEmail: string;
  onLogout?: () => Promise<void> | void;
}

export const InvitationWrongAccount: React.FC<
  InvitationWrongAccountProps
> = ({
  workspaceName,
  inviterName,
  inviterRole,
  invitationEmail,
  currentUserEmail,
  onLogout,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSwitchAccount = async () => {
    if (onLogout) {
      await onLogout();
    } 
    
    dispatch(logout());

    localStorage.setItem("accept_invitation", "true");

    navigate("/login");
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

      <Card className="w-full max-w-120 bg-white border-slate-200 shadow-sm z-10 p-2">
        <CardHeader className="text-center pt-6 pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-amber-100 flex items-center justify-center rounded-full">
              <AlertTriangle className="text-amber-600 h-7 w-7" />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Wrong Account
          </CardTitle>

          <CardDescription className="text-sm text-muted-foreground mt-2">
            This invitation is intended for a different account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-slate-50/80 rounded-lg p-4 flex items-center gap-4 border border-slate-100">
            <Avatar className="w-11 h-11 border border-slate-200">
              <AvatarImage
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQdQ8M4DwS79BhT433cTeuwP0yGYm4CWhYqhL-MceMGg2gx6ayEV_J5Ujk_jYm_mggtJKWah96Ny61x2EZ0b3SrqevCcqw0Izl53pDo73udShouRECwAGiTSdqoCXdkpLCSlpX5YJgPSq6F4W-4qDQ-OuVpU6nRel5JMh1JSvcqqBr4ruLyxUs4kpFVgyqy1hAHiykkIbdqJAp51OXtcGo5C9eR0bt0nl1qHcRQbwijz0UMiwJaTwKIlM0VBwMjRNQIulfLoJ3KzKm"
                alt={inviterName}
                className="object-cover"
              />
              <AvatarFallback>
                {inviterName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-sm text-slate-700">
                <span className="font-bold text-slate-900">
                  {inviterName}
                </span>{" "}
                invited you to join
                <span className="font-semibold text-slate-900">
                  {" "}
                  {workspaceName}
                </span>
              </p>

              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                {inviterRole}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
            <p className="text-sm text-slate-700">
              You're currently signed in with:
            </p>

            <div className="font-medium text-slate-900 break-all">
              {currentUserEmail}
            </div>

            <div className="h-px bg-amber-200" />

            <p className="text-sm text-slate-700">
              This invitation was sent to:
            </p>

            <div className="font-semibold text-slate-900 break-all">
              {invitationEmail}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-700">
              To accept this invitation, sign in with the email address that
              received the invitation.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2 pb-6">
          <Button
            onClick={handleSwitchAccount}
            className="w-full h-11 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Switch Account
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