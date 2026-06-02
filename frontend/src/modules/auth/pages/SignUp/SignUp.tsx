import { LayoutGrid, Loader2 } from "lucide-react"; 
import { Link } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useSignup } from "@modules/auth/hooks/useSignup";

export default function SignUpPage() {
  const { form, onSubmit } = useSignup();
  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <div className="bg-surface-container-low min-h-screen flex items-center justify-center p-container-padding font-body-base text-body-base text-on-surface antialiased">
      <div className="w-full max-w-105 bg-surface-container-lowest border border-outline-variant rounded-xl p-8 sm:p-10 shadow-sm">
        
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <LayoutGrid className="h-7 w-7 text-primary fill-primary" />
            <span className="text-3xl font-black text-primary tracking-tight">
              Nexus CRM
            </span>
          </div>
          <h1 className="font-bold text-2xl text-on-surface mb-2">
            Create an account
          </h1>
          <p className="font-body-base text-body-base text-on-surface-variant text-center">
            Enter your details below to set up your workspace
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          
          {errors.root && (
            <div className="text-sm text-error font-medium text-center bg-error/10 p-2 rounded-md border border-error/20">
              {errors.root.message}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label 
              htmlFor="fullName"
              className={`font-label-md text-label-md ${errors.name ? "text-error" : "text-on-surface"}`}
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              {...register("name")}
              placeholder="Jane Doe"
              disabled={isSubmitting}
              className={`w-full h-10 bg-surface-container-lowest border border-outline-variant rounded-lg px-3 font-body-base text-body-base text-on-surface placeholder:text-outline focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 shadow-none ${
                errors.name ? "border-error focus-visible:ring-error/20 focus-visible:border-error" : ""
              }`}
            />
            {errors.name && (
              <p className="text-xs text-error font-medium mt-0.5">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label 
              htmlFor="email"
              className={`font-label-md text-label-md ${errors.email ? "text-error" : "text-on-surface"}`}
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="name@example.com"
              disabled={isSubmitting}
              className={`w-full h-10 bg-surface-container-lowest border border-outline-variant rounded-lg px-3 font-body-base text-body-base text-on-surface placeholder:text-outline focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 shadow-none ${
                errors.email ? "border-error focus-visible:ring-error/20 focus-visible:border-error" : ""
              }`}
            />
            {errors.email && (
              <p className="text-xs text-error font-medium mt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label 
              htmlFor="password"
              className={`font-label-md text-label-md ${errors.password ? "text-error" : "text-on-surface"}`}
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`w-full h-10 bg-surface-container-lowest border border-outline-variant rounded-lg px-3 font-body-base text-body-base text-on-surface placeholder:text-outline focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 shadow-none ${
                errors.password ? "border-error focus-visible:ring-error/20 focus-visible:border-error" : ""
              }`}
            />
            {errors.password && (
              <p className="text-xs text-error font-medium mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-DEFAULT shadow-sm font-label-md text-label-md text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin " />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface-container-lowest text-outline font-label-sm text-label-sm">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              className="w-full inline-flex justify-center items-center py-2 px-4 border border-outline-variant rounded-lg bg-surface-container-lowest font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors duration-200 h-10 shadow-none"
            >
              <svg aria-hidden="true" className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.25033 6.60998L5.32028 9.77C6.27528 6.79 9.00028 4.75 12.0003 4.75Z" fill="#EA4335"></path>
                <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L20.15 21.26C22.53 19.07 23.49 15.96 23.49 12.275Z" fill="#4285F4"></path>
                <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.40991C0.46 8.13991 0 10.0099 0 11.9999C0 13.9899 0.46 15.8599 1.28 17.5899L5.26498 14.2949Z" fill="#FBBC05"></path>
                <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L15.8754 17.935C14.8154 18.645 13.5054 19.095 12.0004 19.095C9.00035 19.095 6.27539 17.055 5.32039 14.075L1.25037 17.235C3.25537 21.155 7.31035 24.0001 12.0004 24.0001Z" fill="#34A853"></path>
              </svg>
              Google
            </Button>
            
            <Button
              variant="outline"
              type="button"
              className="w-full inline-flex justify-center items-center py-2 px-4 border border-outline-variant rounded-lg bg-surface-container-lowest font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors duration-200 h-10 shadow-none"
            >
              <svg aria-hidden="true" className="h-5 w-5 mr-2 text-[#00a4ef]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"></path>
              </svg>
              Microsoft
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center font-body-sm text-body-sm text-on-surface-variant px-4 leading-relaxed">
          By clicking continue, you agree to our{" "}
          <a className="underline hover:text-on-surface transition-colors" href="#">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="underline hover:text-on-surface transition-colors" href="#">
            Privacy Policy
          </a>
          .
        </p>

        <div className="mt-8 pt-6 border-t border-outline-variant text-center">
          <p className="font-body-base text-body-base text-on-surface-variant">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-label-md text-label-md text-primary hover:text-surface-tint hover:underline transition-colors ml-1"
            >
              Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}