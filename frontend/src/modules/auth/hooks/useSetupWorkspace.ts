/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureWorkspace } from "@/modules/team/store/org.actions";
import { selectOrg } from "@/modules/team/store/org.slice";
import { useState, useRef, useCallback, type ChangeEvent, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function useSetupWorkspace() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { currentOrganizationId, organizations, isConfiguringWorkspace, workspaceConfigError } = useSelector(selectOrg);

  const [orgName, setOrgName] = useState(() => {
    if (!currentOrganizationId || !organizations) return "";
    const activeOrg = organizations.find((org) => org.id === currentOrganizationId);
    return activeOrg?.name || "";
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !currentOrganizationId) return;

    const result = await dispatch(
      configureWorkspace({
        orgId: currentOrganizationId,
        name: orgName.trim(),
        avatarFile,
      })
    );

    if (configureWorkspace.fulfilled.match(result)) {
      navigate("/", { replace: true });
    }
  }, [orgName, currentOrganizationId, avatarFile, dispatch, navigate]);

  return {
    orgName,
    setOrgName,
    avatarPreview,
    isSubmitting: isConfiguringWorkspace,
    error: workspaceConfigError,
    fileInputRef,
    handleAvatarChange,
    handleSubmit,
  };
}