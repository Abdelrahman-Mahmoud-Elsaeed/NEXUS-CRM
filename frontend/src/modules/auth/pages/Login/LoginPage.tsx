import { Mail, Lock, Shield, LayoutGrid } from "lucide-react";

import { Button } from "@ui/button";

import { Input } from "@ui/input";

import { Label } from "@ui/label";

import { Checkbox } from "@ui/checkbox";

import { Card, CardContent } from "@ui/card";

import loginBackgournd from "@assets/login-background.png";

import { Link } from "react-router-dom";

import { useLogin } from "@modules/auth/hooks/useLogin";

export default function LoginPage() {
  const { form, loading, error, onSubmit } = useLogin();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex min-h-screen w-full bg-background font-sans text-foreground">
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-primary flex gap-2 mb-6 items-center">
              <LayoutGrid className="h-7 w-7 text-primary fill-primary" />
              <span className="text-3xl font-black text-primary tracking-tight">Nexus CRM</span>
            </h1>

            <p className="text-sm text-outline">
              Welcome back. Please enter your details to sign in.
            </p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>

            {error && (
              <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20 animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground">
                Email address
              </Label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-outline">
                  <Mail className="h-4 w-4" />
                </div>

                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  className={`pl-10 bg-surface text-foreground placeholder:text-outline focus-visible:ring-primary ${
                    errors.email
                      ? "border-destructive"
                      : "border-outline-variant"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="text-xs font-medium text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>


            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-outline">
                  <Lock className="h-4 w-4" />
                </div>

                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`pl-10 border border-outline-variant  bg-surface text-on-surface placeholder-outline focus:outline-none focus:ring-1 focus:ring-primary sm:text-body-base transition-colors duration-200 ${
                    errors.password
                      ? "border-destructive"
                      : "border-outline-variant"
                  }`}
                />
              </div>

              {errors.password && (
                <p className="text-xs font-medium text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                onCheckedChange={(checked) =>
                  form.setValue("remember", !!checked)
                }
                className="border-outline-variant data-[state=checked]:bg-primary data-[state=checked]:text-on-primary"
              />

              <Label
                htmlFor="remember"
                className="font-medium text-foreground cursor-pointer"
              >
                Keep me signed in
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex  justify-center py-2.5 px-4 border border-transparent  shadow-sm font-label-md text-label-md text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-outline-variant" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-outline">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              type="button"
              className="w-full space-x-2 bg-surface border-outline-variant text-foreground hover:bg-surface-container rounded-md"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />

                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />

                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />

                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>

              <span>Google</span>
            </Button>

            <Button
              variant="outline"
              type="button"
              className="w-full space-x-2 bg-surface border-outline-variant text-foreground hover:bg-surface-container rounded-md"
            >
              <svg className="h-4 w-4" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#00a4ef" />

                <rect x="11" y="1" width="9" height="9" fill="#00a4ef" />

                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />

                <rect x="11" y="11" width="9" height="9" fill="#00a4ef" />
              </svg>

              <span>Microsoft</span>
            </Button>
          </div>

          <p className="text-center text-sm text-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden w-1/2 flex-col items-center justify-center p-12 lg:flex">
        <div className="absolute inset-0 z-0">
          <img
            src={loginBackgournd}
            alt="Nexus CRM Background"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-surface-container/40 mix-blend-multiply" />
        </div>

        <Card className="z-10 mt-auto mb-16 w-full max-w-105 rounded-xl border-outline-variant bg-surface/90 backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-right-8 duration-700">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
                <Shield className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Enterprise-Grade Security
                </h3>

                <p className="text-sm leading-relaxed text-outline">
                  Your data is protected by industry-leading encryption and
                  compliance standards. Nexus CRM ensures operational integrity
                  across all touchpoints.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
