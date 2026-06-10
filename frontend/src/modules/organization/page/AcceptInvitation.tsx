/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Network,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";

import { useAcceptInvitation } from "../hooks/useAcceptInvitation";

// ==========================================
// Sub-Components (Purely Presentation)
// ==========================================

const LoadingScreen = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#fcf8ff]">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm font-medium text-slate-600">
        Verifying unique invitation reference...
      </p>
    </div>
  </div>
);

const DecorativeBackground = () => (
  <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
  </div>
);

const BrandHeader = () => (
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
);

const InviterSummary = ({ invitationData }: { invitationData: any }) => {
  if (!invitationData) return null;

  const avatarFallbackInitials = invitationData.inviterName
    ? invitationData.inviterName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "CRM";

  return (
    <div className="bg-slate-50/80 rounded-lg p-4 flex items-center gap-4 border border-slate-100">
      <Avatar className="w-11 h-11 border border-slate-200">
        <AvatarImage
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQdQ8M4DwS79BhT433cTeuwP0yGYm4CWhYqhL-MceMGg2gx6ayEV_J5Ujk_jYm_mggtJKWah96Ny61x2EZ0b3SrqevCcqw0Izl53pDo73udShouRECwAGiTSdqoCXdkpLCSlpX5YJgPSq6F4W-4qDQ-OuVpU6nRel5JMh1JSvcqqBr4ruLyxUs4kpFVgyqy1hAHiykkIbdqJAp51OXtcGo5C9eR0bt0nl1qHcRQbwijz0UMiwJaTwKIlM0VBwMjRNQIulfLoJ3KzKm"
          alt={invitationData.inviterName}
          className="object-cover"
        />
        <AvatarFallback>{avatarFallbackInitials}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm text-slate-700">
          <span className="font-bold text-slate-900">
            {invitationData.inviterName}
          </span>{" "}
          has invited you
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          {invitationData.inviterRole}
        </p>
      </div>
    </div>
  );
};

const ErrorBanner = ({ message }: { message: string | null | undefined }) => {
  if (!message) return null;
  
  return (
    <div 
      data-slot="alert" 
      role="alert" 
      className="group/alert relative grid w-full gap-0.5 rounded-lg border px-4 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg:not([class*='size-'])]:size-4 *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current bg-destructive/5 text-destructive border-destructive/20 py-3"
    >
      <ShieldCheck className="lucide lucide-shield-alert h-4 w-4" aria-hidden="true" />
      <div data-slot="alert-title" className="group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground text-xs font-semibold uppercase tracking-wider mb-0.5">
        Verification Error
      </div>
      <div data-slot="alert-description" className="text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4 text-xs font-medium text-destructive/90">
        {message}
      </div>
    </div>
  );
};

const PasswordInputGroup = ({
  isSubmitting,
  showPassword,
  togglePasswordVisibility,
  strength,
  formError,
  registerFieldProps,
  validationRules,
}: any) => {
  return (
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
          disabled={isSubmitting}
          {...registerFieldProps}
          className="bg-slate-50/50 border-slate-200 focus-visible:ring-primary pr-10 h-10"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer select-none"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {formError && (
        <p className="text-[11px] font-medium text-destructive transition-all pl-0.5 mt-1">
          {formError.message}
        </p>
      )}

      {/* Multi-Segment Password Progress Bar Matrix */}
      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5 mt-2">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`h-full w-1/4 transition-all duration-300 ${
              index <= strength.filledBars ? strength.barClass : "bg-slate-200/60"
            }`}
          />
        ))}
      </div>

      {/* Real-time Requirement Checklist UI Blocks */}
      <div className="pt-1.5 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-slate-100/80 mt-3">
        {validationRules.map((rule: any, idx: number) => (
          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
            {rule.met ? (
              <Check className="h-3 w-3 text-emerald-500 stroke-3" />
            ) : (
              <X className="h-3 w-3 text-slate-300" />
            )}
            <span className={rule.met ? "text-slate-700 font-medium line-through decoration-emerald-500/30" : "text-slate-400"}>
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// Main Component
// ==========================================

export const AcceptInvitationNoneAuth: React.FC = () => {
  const {
    invitationData,
    apiError,
    isLoadingInvitation,
    isSubmitting,
    showPassword,
    togglePasswordVisibility,
    strength,
    validationRules,
    isValid, // 🧠 De-structured isValid here instead of isPasswordValid
    formErrors,
    registerField,
    onSubmit,
  } = useAcceptInvitation();

  if (isLoadingInvitation) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#fcf8ff] relative overflow-x-hidden select-none">
      <DecorativeBackground />
      <BrandHeader />

      <Card className="w-full max-w-120 bg-white border-slate-200 shadow-sm z-10 p-2">
        <CardHeader className="text-center pt-6 pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            You've been invited
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            to join{" "}
            <span className="font-semibold text-slate-900">
              {invitationData?.workspaceName || "Workspace"}
            </span>{" "}
            on Nexus CRM
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <InviterSummary invitationData={invitationData} />
          <ErrorBanner message={apiError} />

          <form className="space-y-5" onSubmit={onSubmit}>
            {/* Full Name Input Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-700 text-xs font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                disabled={isSubmitting}
                {...registerField("fullName")}
                className="bg-slate-50/50 border-slate-200 focus-visible:ring-primary h-10"
              />
              {formErrors.fullName && (
                <p className="text-[11px] font-medium text-destructive transition-all pl-0.5 mt-1">
                  {formErrors.fullName.message}
                </p>
              )}
            </div>

            {/* Read-Only Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 text-xs font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  disabled
                  type="email"
                  value={invitationData?.email || ""}
                  className="bg-slate-100 border-slate-200 text-muted-foreground pr-10 cursor-not-allowed select-none h-10 opacity-80"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              </div>
              <p className="text-[11px] text-muted-foreground/80 leading-none pl-0.5">
                This email address is securely locked for this invitation context.
              </p>
            </div>

            {/* Password Creation & Validation Block */}
            <PasswordInputGroup
              isSubmitting={isSubmitting}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              strength={strength}
              formError={formErrors.password}
              registerFieldProps={registerField("password")}
              validationRules={validationRules}
            />

            {/* Submit Action */}
            <Button
              type="submit"
              disabled={isSubmitting || !isValid} // 🔑 Changed layout validation to block clicks if name or password has errors
              className="w-full h-11 mt-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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