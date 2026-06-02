/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { 
  Network, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Lock, 
  ArrowRight, 
  Loader2, 
  ShieldCheck 
} from "lucide-react";

// Shadcn UI Primitive Component Imports
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";

interface RegisterInvitedRequestDto {
  token: string;
  name: string;
  password: string;
}

import { useAcceptInvitation } from "../hooks/useAcceptInvitation";

export const AcceptInvitationNoneAuth: React.FC = () => {
  const {
    apiError,
    fullName,
    setFullName,
    email,
    workspaceName,
    inviterName,
    inviterRole,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isSubmitting,
    strength,
    handleSubmit,
  } = useAcceptInvitation();

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">NexusCRM</h1>
        </div>
      </header>

      {/* Main Shadcn Card Frame */}
      <Card className="w-full max-w-[480px] bg-white border-slate-200 shadow-sm z-10 p-2">
        <CardHeader className="text-center pt-6 pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            You've been invited
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            to join <span className="font-semibold text-slate-900">{workspaceName}</span> on Nexus CRM
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
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-slate-700">
                <span className="font-bold text-slate-900">{inviterName}</span> has invited you
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                {inviterRole}
              </p>
            </div>
          </div>

          {/* Form Error Banner */}
          {apiError && (
            <Alert variant="destructive" className="bg-destructive/5 text-destructive border-destructive/20 py-3">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle className="text-xs font-semibold uppercase tracking-wider mb-0.5">Verification Error</AlertTitle>
              <AlertDescription className="text-xs font-medium">
                {apiError}
              </AlertDescription>
            </Alert>
          )}

          {/* Acceptance Form Data Pipeline */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Full Name Input Field */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-slate-700 text-xs font-medium">
                Full Name
              </Label>
              <Input 
                id="full_name" 
                type="text" 
                value={fullName}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setFullName(e.target.value)}
                required
                className="bg-slate-50/50 border-slate-200 focus-visible:ring-primary h-10"
              />
            </div>

            {/* Read-Only Disabled Email Layout Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 text-xs font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Input 
                  id="email" 
                  disabled
                  type="email" 
                  value={email}
                  className="bg-slate-100 border-slate-200 text-muted-foreground pr-10 cursor-not-allowed select-none h-10 opacity-80"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              </div>
              <p className="text-[11px] text-muted-foreground/80 leading-none pl-0.5">
                This email address is securely locked for this invitation context.
              </p>
            </div>

            {/* Password Layout Block */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-slate-700 text-xs font-medium">
                  Create Password
                </Label>
                <span className={`text-xs font-bold transition-colors duration-200 ${strength.colorClass}`}>
                  {strength.label}
                </span>
              </div>
              
              <div className="relative">
                <Input 
                  id="password" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
                  required
                  className="bg-slate-50/50 border-slate-200 focus-visible:ring-primary pr-10 h-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer select-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Custom Multi-Segment Segmented Progress Matrix */}
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5 mt-2">
                {[1, 2, 3, 4].map((index) => {
                  const isActive = index <= strength.filledBars;
                  return (
                    <div 
                      key={index} 
                      className={`h-full w-1/4 transition-all duration-300 ${
                        isActive && password.length > 0 ? strength.barClass : "bg-slate-200/60"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Execution Request Trigger Button */}
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 mt-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 group shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing Workspace Integration...
                </>
              ) : (
                <>
                  Accept Invitation & Join Team
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        {/* Global Structural Access Interceptors */}
        <CardFooter className="flex flex-col space-y-4 pt-2 pb-6 border-t border-slate-100 mt-4 text-center">
          <p className="text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <a className="text-primary font-semibold hover:underline" href="/login">
              Log in
            </a>
          </p>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground/70">
            <a className="hover:text-slate-900 transition-colors" href="/terms">Terms of Service</a>
            <span>•</span>
            <a className="hover:text-slate-900 transition-colors" href="/privacy">Privacy Policy</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};