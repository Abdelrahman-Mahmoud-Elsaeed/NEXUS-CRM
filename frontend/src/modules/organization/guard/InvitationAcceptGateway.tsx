/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { AcceptInvitationNoneAuth } from "../page/AcceptInvitation";
import { AcceptInvitationAuth } from "../page/AcceptInvitationAuth";
import type { RootState } from "@/app/store";
import { useEffect } from "react";
import { initializeAuth } from "@/modules/auth/store/authSlice";

export function InvitationAcceptGateway() {
  const dispatch = useDispatch<any>();
  const { isAuthenticated , status} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (status === "idle") {
      dispatch(initializeAuth());
    }
  }, [status, dispatch]);

  return isAuthenticated ? <AcceptInvitationAuth /> : <AcceptInvitationNoneAuth />;
}