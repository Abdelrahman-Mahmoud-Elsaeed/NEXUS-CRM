/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { AuthCard } from "@modules/auth/components/AuthCard/AuthCard";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "@services/auth.service";
import { forgotPasswordSchema, type ForgotPasswordValues } from "../../validations/auth";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setLoading(true);
    try {
      await AuthService.forgotPassword(values.email);
      // Pass the email to the next page so we can show "We sent a link to user@email.com"
      navigate("/check-email", { state: { email: values.email } });
    } catch (error) {
      // Error handling logic (interceptor handles the logs)
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Forgot Password"
      description="Enter your email address and we'll send you a reset link."
      icon={<KeyRound className="h-6 w-6" />}
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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