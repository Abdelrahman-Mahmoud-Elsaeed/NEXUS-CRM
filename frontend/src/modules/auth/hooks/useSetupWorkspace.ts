/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuth, configureWorkspace } from "@/modules/auth/store/authSlice";

export function useSetupWorkspace() {
  const [orgName, setOrgName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { currentOrganizationId, organizations } = useSelector(selectAuth);

  useEffect(() => {
    if (currentOrganizationId && organizations.length > 0) {
      const activeOrg = organizations.find((org) => org.id === currentOrganizationId);
      if (activeOrg) {
        setOrgName(activeOrg.name);
      }
    }
  }, [currentOrganizationId, organizations]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !currentOrganizationId) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        configureWorkspace({
          orgId: currentOrganizationId,
          name: orgName.trim(),
          avatarFile,
        })
      ).unwrap();

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Failed to configure workspace view states:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    orgName,
    setOrgName,
    avatarPreview,
    isSubmitting,
    fileInputRef,
    handleAvatarChange,
    handleSubmit,
  };
}