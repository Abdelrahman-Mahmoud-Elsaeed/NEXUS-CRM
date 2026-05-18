import { KeyRound, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { AuthCard } from "@modules/auth/components/AuthCard/AuthCard";
import { Link } from "react-router-dom";
import { useForgotPassword } from "@modules/auth/hooks/useForgotPassword";

export default function ForgotPassword() {
  const { form, loading, error, onSubmit } = useForgotPassword();
  const { register, formState: { errors } } = form;

  return (
    <AuthCard
      title="Forgot Password"
      description="Enter your email address and we'll send you a reset link."
      icon={<KeyRound className="h-6 w-6" />}
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            {...register("email")}
            className={`bg-surface border-outline-variant text-foreground placeholder:text-outline focus-visible:ring-primary ${
              errors.email ? "border-destructive" : ""
            }`}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Display backend errors (like USER_NOT_FOUND) */}
        {error && (
          <div className="text-sm text-destructive font-medium text-center">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary hover:bg-primary/90 rounded-[var(--radius-md)]"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>

        <div className="space-y-2">
          <Link to="/login">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 text-sm font-medium text-outline hover:text-primary transition-colors pt-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Remember your password? Log in
            </button>
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}