/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "@/app/store";
import { Loader2 } from "lucide-react";
import { initializeAuth } from "../store/auth.actions";

export default function VerifyGuard() {
  const dispatch = useDispatch<any>();
  const { isAuthenticated, isVerified, status } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (status === "idle") {
      dispatch(initializeAuth());
    }
  }, [status, dispatch]);

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isVerified) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}