/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, setOrganization, fetchUserOrganizations } from "@/modules/auth/store/authSlice";

export function useOrganizationSwitcher() {
  const dispatch = useDispatch<any>(); // Cast to any to safely allow async thunk dispatches
  const [isOpen, setIsOpen] = useState(false);

  const { organizations, currentOrganizationId, status } = useSelector(selectAuth);
  const isLoading = status === "loading";

  const currentOrg = organizations.find((org) => org.id === currentOrganizationId) || null;

  const handleSelectOrganization = (orgId: string) => {
    dispatch(setOrganization(orgId));
  };

  useEffect(() => {
    if (organizations.length === 0) {
      dispatch(fetchUserOrganizations());
    }
  }, [organizations.length, dispatch]);

  return {
    isOpen,
    setIsOpen,
    currentOrg,
    organizations,
    isLoading,
    handleSelectOrganization,
  };
}