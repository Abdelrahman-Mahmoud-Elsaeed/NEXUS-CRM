/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Mail } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { AuthCard } from "@modules/auth/components/AuthCard/AuthCard";
import { useVerifyEmail } from "../../hooks/useVerifyEmail";

export default function VerifyEmail() {
  const {
    otp,
    timer,
    loading,
    resending,
    inputRefs,
    error,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleVerify,
    handleResend,
  } = useVerifyEmail();

  return (
    <AuthCard
      title="Verify Email"
      description="We sent a 6-digit code to your email."
      icon={<Mail className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <Input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={i === 0 ? handlePaste : undefined}
                className={`h-12 w-12 text-center text-lg font-bold bg-surface focus-visible:ring-primary transition-colors ${
                  error
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-outline-variant"
                }`}
                maxLength={1}
              />
            ))}
          </div>

          {error && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="rounded-md bg-destructive/10 p-2.5 text-center text-xs font-medium text-destructive border border-destructive/20 text-red-600">
                {error}
              </p>
            </div>
          )}
        </div>

        <Button
          onClick={handleVerify}
          disabled={loading || otp.some((v) => v === "")}
          className="w-full bg-primary text-on-primary hover:bg-primary/90"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </Button>

        <p className="text-center text-xs text-outline">
          Didn't receive code?{" "}
          <button
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className={`font-medium ${timer > 0 ? "text-outline cursor-not-allowed" : "text-primary hover:underline"}`}
          >
            {resending
              ? "Sending..."
              : timer > 0
                ? `Resend in ${timer}s`
                : "Resend Now"}
          </button>
        </p>
      </div>
    </AuthCard>
  );
}
