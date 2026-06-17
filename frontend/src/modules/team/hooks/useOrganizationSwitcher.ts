/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectOrg, setOrganization } from "../store/org.slice";
import { fetchUserOrganizations } from "../store/org.actions";

export function useOrganizationSwitcher() {
  const dispatch = useDispatch<any>();
  const [isOpen, setIsOpen] = useState(false);

  const { organizations, currentOrganizationId, status } = useSelector(selectOrg);
  const isLoading = status === "loading";

  const currentOrg = useMemo(() => {
    return organizations?.find((org) => org.id === currentOrganizationId) || null;
  }, [organizations, currentOrganizationId]);

  const handleSelectOrganization = useCallback((orgId: string) => {
    dispatch(setOrganization(orgId));
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle" && (!organizations || organizations.length === 0)) {
      dispatch(fetchUserOrganizations());
    }
  }, [status, organizations, dispatch]);

  return {
    isOpen,
    setIsOpen,
    currentOrg,
    organizations: organizations || [],
    isLoading,
    handleSelectOrganization,
  };
}