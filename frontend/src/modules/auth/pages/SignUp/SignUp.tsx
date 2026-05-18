import { LayoutGrid, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

import { useSignup } from "@modules/auth/hooks/useSignup";

export default function SignUpPage() {
  const { form, onSubmit } = useSignup();
  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <Card className="w-full max-w-[420px] border-outline-variant bg-surface shadow-sm animate-in fade-in zoom-in-95 duration-500 rounded-xl">
        <CardHeader className="space-y-6 pb-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-primary">
              Nexus CRM
            </span>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
              Create an account
            </CardTitle>
            <CardDescription className="text-sm text-outline">
              Enter your details below to set up your workspace
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pb-6 space-y-8">
          <form className="space-y-5" onSubmit={onSubmit}>
            
            {/* Safe handling of generic global/root form errors */}
            {errors.root && (
              <div className="text-sm text-error font-medium text-center bg-error/10 p-2 rounded-md border border-error/20">
                {errors.root.message}
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className={errors.name ? "text-error" : "text-foreground"}
              >
                Name
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Jane Doe"
                className={`bg-surface border-outline-variant focus-visible:ring-primary ${
                  errors.name ? "border-error focus-visible:ring-error" : ""
                }`}
              />
              {errors.name && (
                <p className="text-xs text-error font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className={errors.email ? "text-error" : "text-foreground"}
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="name@example.com"
                className={`bg-surface border-outline-variant focus-visible:ring-primary ${
                  errors.email ? "border-error focus-visible:ring-error" : ""
                }`}
              />
              {errors.email && (
                <p className="text-xs text-error font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className={errors.password ? "text-error" : "text-foreground"}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className={`bg-surface border-outline-variant focus-visible:ring-primary ${
                  errors.password ? "border-error focus-visible:ring-error" : ""
                }`}
              />
              {errors.password && (
                <p className="text-xs text-error font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-on-primary hover:bg-primary/90 mt-2 rounded-[var(--radius-md)]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Divider */}
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
              className="w-full space-x-2 bg-surface border-outline-variant text-foreground hover:bg-surface-container"
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
              className="w-full space-x-2 bg-surface border-outline-variant text-foreground hover:bg-surface-container"
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

          <div className="mt-6 px-4 text-center text-xs leading-relaxed text-outline">
            By clicking continue, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Privacy Policy
            </a>
            .
          </div>
        </CardContent>

        <div className="px-6">
          <div className="h-px w-full bg-outline-variant" />
        </div>

        <CardFooter className="pt-6 pb-6 flex justify-center">
          <div className="text-sm text-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}