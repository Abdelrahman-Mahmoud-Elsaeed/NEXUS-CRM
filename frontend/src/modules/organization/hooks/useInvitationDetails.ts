/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvitationDetailsByToken } from "../store/invitations.actions";
import { selectInvitations } from "../store/invitations.slice";

let globalDispatchedToken: string | null = null;

export const useInvitationDetails = () => {
  const dispatch = useDispatch<any>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { 
    activeInvitation, 
    isFetchingInvitation, 
    invitationFetchError 
  } = useSelector(selectInvitations);

  useEffect(() => {
    if (token && globalDispatchedToken !== token) {
      globalDispatchedToken = token;
      dispatch(fetchInvitationDetailsByToken(token));
    }
  }, [token, dispatch]);

  return {
    invitation: activeInvitation,
    isLoading: !token ? false : isFetchingInvitation,
    error: !token ? "No invitation token provided" : invitationFetchError,
    token,
  };
};