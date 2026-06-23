/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, BarChart2, Share2, FileText, Camera } from "lucide-react";
import { FormDialog } from "@/shared/ui/resource/FormDialog";
import { cn } from "@/shared/utils/utils";
import {
  formatUrlFieldForStorage,
  parseUrlFieldForForm,
  URL_FIELD_PREFIXES,
} from "@/shared/utils/urlFieldUtils";
import type { RootState } from "@/app/store";
import type { ContactChannelDto, ChannelType } from "../types/contact.types";

import { fetchContact, updateExistingContact, uploadContactAvatarThunk } from "../store/contacts.actions";

export interface TagDto {
  id: string;
  name: string;
  color?: string;
}

export interface ContactFormState {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  jobTitle: string | null;
  company: string | null;
  companyId: string | null;
  status: string;
  priority?: string;
  source: string;
  createdAt: string;
  tags: TagDto[];
  notes?: string | null;
  activeChannels: ChannelType[];
  alternativeEmailValue: string;
  whatsappValue: string;
  linkedinValue: string;
  instagramValue: string;
  twitterValue: string;
  avatarUrl?: string | null;
  website?: string | null;
  deals?: {
    id: string;
    name: string;
    value: string | null;
    status: string;
    expectedCloseDate: string | null;
    stage: string | null;
  }[];
  tasks?: {
    id: string;
    title: string;
    status: string;
    priority: string;
    createdAt: string;
  }[];
}

interface EditContactDialogProps {
  contactId: string | null;
  onClose: () => void;
}

const mapContactToFormState = (c: any): ContactFormState => {
  const channelMap = (c?.channels || []).reduce((acc: Record<string, string>, current: ContactChannelDto) => {
    acc[current.type] = current.value;
    return acc;
  }, {} as Record<string, string>);

  const activeChannels: ChannelType[] = (c?.channels || []).map((ch: ContactChannelDto) => ch.type);

  return {
    id: c?.id || "",
    name: c?.name || "",
    email: c?.email || "",
    phone: c?.phone || null,
    jobTitle: c?.jobTitle || null,
    company: c?.company || null,
    companyId: c?.companyId || null,
    status: c?.status || "Prospect",
    priority: c?.priority || "Medium",
    source: c?.source || "Manual",
    notes: c?.notes || "",
    website: parseUrlFieldForForm("website", c?.website),
    avatarUrl: c?.avatarUrl || null,
    tags: Array.isArray(c?.tags) ? c.tags : [],
    deals: Array.isArray(c?.deals) ? c.deals : [],
    tasks: Array.isArray(c?.tasks) ? c.tasks : [],
    createdAt: c?.createdAt || "",
    activeChannels,
    alternativeEmailValue: channelMap["AlternativeEmail"] || "",
    whatsappValue: parseUrlFieldForForm("whatsapp", channelMap["WhatsApp"]),
    linkedinValue: parseUrlFieldForForm("linkedinProfile", channelMap["LinkedIn"]),
    instagramValue: parseUrlFieldForForm("instagram", channelMap["Instagram"]),
    twitterValue: parseUrlFieldForForm("twitter", channelMap["Twitter"]),
  };
};

export function EditContactDialog({ contactId, onClose }: EditContactDialogProps) {
  const dispatch = useDispatch<any>();
  const isOpen = contactId !== null;

  const { contactDetail, isLoadingDetail, isUpdating } = useSelector(
    (state: RootState) => state.contacts,
  );

  // Safe side effect: Data pre-fetching only
  React.useEffect(() => {
    if (contactId) {
      dispatch(fetchContact(contactId));
    }
  }, [contactId, dispatch]);

  if (isOpen && (isLoadingDetail || !contactDetail || contactDetail.id !== contactId)) {
    return (
      <FormDialog open={isOpen} onOpenChange={onClose}>
        <div className="flex flex-col items-center justify-center py-20 space-y-4 w-40 mx-auto">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-body-base text-on-surface-variant font-medium whitespace-nowrap">
            Fetching record states...
          </p>
        </div>
      </FormDialog>
    );
  }

  if (!isOpen || !contactDetail) return null;

  // React re-mounts this entire node cleanly if the user shifts to an alternate contactId
  return (
    <ContactFormInner
      key={contactId}
      contactId={contactId}
      contactDetail={contactDetail}
      isUpdating={isUpdating}
      onClose={onClose}
      dispatch={dispatch}
    />
  );
}

interface ContactFormInnerProps {
  contactId: string;
  contactDetail: any;
  isUpdating: boolean;
  onClose: () => void;
  dispatch: any;
}

function ContactFormInner({
  contactId,
  contactDetail,
  isUpdating,
  onClose,
  dispatch,
}: ContactFormInnerProps) {
  // Pure, clean synchronous state initialization during the render phase
  const [formData, setFormData] = React.useState<ContactFormState>(() =>
    mapContactToFormState(contactDetail)
  );
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return;

    setSelectedFile(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleChannelToggle = (channelType: ChannelType) => {
    setFormData((prev) => {
      const currentActive = [...(prev.activeChannels || [])];
      const index = currentActive.indexOf(channelType);
      if (index > -1) {
        currentActive.splice(index, 1);
      } else {
        currentActive.push(channelType);
      }
      return { ...prev, activeChannels: currentActive };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let uploadedAvatarUrl: string | undefined = undefined;

    if (selectedFile) {
      const uploadResult = await dispatch(uploadContactAvatarThunk(selectedFile)).unwrap();
      uploadedAvatarUrl = uploadResult?.data.file?.url;
    }

    const formattedWebsite = formatUrlFieldForStorage("website", formData.website);

    const toPascalCase = (str: string) => {
      if (!str) return undefined;
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const payloadChannels = (formData.activeChannels || [])
      .map((type: ChannelType) => {
        let val: string | null = null;
        if (type === "AlternativeEmail") {
          val = formData.alternativeEmailValue.trim() || null;
        }
        if (type === "WhatsApp") {
          val = formatUrlFieldForStorage("whatsapp", formData.whatsappValue);
        }
        if (type === "LinkedIn") {
          val = formatUrlFieldForStorage("linkedinProfile", formData.linkedinValue);
        }
        if (type === "Instagram") {
          val = formatUrlFieldForStorage("instagram", formData.instagramValue);
        }
        if (type === "Twitter") {
          val = formatUrlFieldForStorage("twitter", formData.twitterValue);
        }
        return { type, value: val ?? "" };
      })
      .filter((ch: any) => ch.value.length > 0);

    const sanitizedBody = {
      name: formData.name.trim() || undefined,
      email: formData.email.trim() || undefined,
      phone: formData.phone?.trim() || null,
      jobTitle: formData.jobTitle?.trim() || null,
      website: formattedWebsite,
      avatarUrl: uploadedAvatarUrl ?? formData.avatarUrl ?? null,
      companyId: formData.companyId || null,
      status: toPascalCase(formData.status),
      priority: toPascalCase(formData.priority!),
      source: formData.source || undefined,
      notes: formData.notes?.trim() || null,
      channels: payloadChannels.length > 0 ? payloadChannels : undefined,
    };

    const cleanBody = Object.fromEntries(
      Object.entries(sanitizedBody).filter(([, v]) => v !== undefined),
    );

    const resultAction = await dispatch(
      updateExistingContact({
        id: contactId,
        data: cleanBody,
      }),
    );

    if (updateExistingContact.fulfilled.match(resultAction)) {
      onClose();
    }
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return "??";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  const initials = getInitials(formData.name);
  const isStatusActive =
    formData.status.toLowerCase() === "active" ||
    formData.status.toLowerCase() === "prospect";

  const hasChannelChecked = (type: ChannelType) =>
    (formData.activeChannels || []).includes(type);

  return (
    <FormDialog
      open={true}
      title="Edit Contact"
      description="Modify contact information, addresses, and CRM status links."
      onOpenChange={onClose}
      onSubmit={handleSubmit}
      className="w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl sm:m-4"
      headerContent={
        <>
          <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg ring-4 ring-primary-container/10 select-none overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt="" className="w-full h-full object-cover" />
            ) : formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div>
            <h3 className="font-h3 text-h3 text-on-surface text-lg font-semibold">
              Edit Contact - {formData.name || "Unnamed"}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={cn(
                  "inline-block w-2 h-2 rounded-full",
                  isStatusActive ? "bg-green-500" : "bg-outline-variant",
                )}
              />
              <span className="text-[12px] font-medium text-on-surface-variant uppercase tracking-wider">
                {formData.status} Account
              </span>
            </div>
          </div>
        </>
      }
      footerContent={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all active:scale-95 shadow-sm flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isUpdating && (
              <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
            )}
            {isUpdating ? "Updating..." : "Update Contact"}
          </button>
        </>
      }
    >
      <div className="space-y-6 sm:space-y-8 max-h-[65vh] overflow-y-auto px-1">
        <section className="text-left">
          <div className="flex items-center gap-2 mb-4">
            <User className="text-primary w-5 h-5" />
            <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-widest text-[11px]">
              Basic Information
            </h4>
          </div>
          <div className="flex gap-6 mb-6 items-center">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-xl bg-gray-50 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-primary">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover animate-in fade-in duration-200"
                  />
                ) : formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt="Current Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <Camera size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase group-hover:text-primary text-center px-2">Upload Avatar</p>
                  </>
                )}
              </div>
              <input
                aria-label="Upload contact avatar"
                className="absolute inset-0 opacity-0 cursor-pointer"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-body-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                type="text"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Email Address
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-body-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                type="email"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Phone Number
              </label>
              <input
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-body-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                type="text"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Job Title
              </label>
              <input
                name="jobTitle"
                value={formData.jobTitle || ""}
                onChange={handleInputChange}
                className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-body-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                type="text"
              />
            </div>

            {formData.companyId && (
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Company Name
                </label>
                <input
                  name="company"
                  value={formData.company || ""}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-body-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  type="text"
                />
              </div>
            )}

            <div className={cn("space-y-1.5", !formData.companyId && "sm:col-span-2")}>
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                {formData.companyId ? "Company Website" : "Contact Website"}
              </label>
              <div className="flex">
                <span className="bg-surface-container-high border border-r-0 border-outline-variant rounded-l-lg px-3 py-2 text-body-sm text-on-surface-variant flex items-center">
                  {URL_FIELD_PREFIXES.website}
                </span>
                <input
                  name="website"
                  value={formData.website || ""}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-outline-variant rounded-r-lg px-3 py-2 text-body-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  type="text"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="text-left">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="text-primary w-5 h-5" />
            <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-widest text-[11px]">
              Contact Metadata
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-body-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none capitalize cursor-pointer"
              >
                <option value="Active">ACTIVE</option>
                <option value="Inactive">INACTIVE</option>
                <option value="Prospect">PROSPECT</option>
                <option value="Churned">CHURNED</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority || "Medium"}
                onChange={handleInputChange}
                className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-body-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none capitalize cursor-pointer"
              >
                <option value="High">HIGH</option>
                <option value="Medium">MEDIUM</option>
                <option value="Low">LOW</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Source
              </label>
              <div className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-base text-on-surface-variant cursor-not-allowed select-none">
                {formData.source}
              </div>
            </div>
          </div>
        </section>

        <section className="text-left">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="text-primary w-5 h-5" />
            <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-widest text-[11px]">
              Communication Channels
            </h4>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 mb-4">
            {[
              { label: "Alternative Email", type: "AlternativeEmail" as ChannelType },
              { label: "LinkedIn", type: "LinkedIn" as ChannelType },
              { label: "WhatsApp", type: "WhatsApp" as ChannelType },
              { label: "Instagram", type: "Instagram" as ChannelType },
              { label: "Twitter / X", type: "Twitter" as ChannelType },
            ].map((ch) => {
              const isChecked = hasChannelChecked(ch.type);
              return (
                <label
                  key={ch.type}
                  className="flex items-center gap-3 cursor-pointer group select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleChannelToggle(ch.type)}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/30 transition-all cursor-pointer accent-primary"
                  />
                  <span className="font-body-base text-body-base text-on-surface group-hover:text-primary transition-colors">
                    {ch.label}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="space-y-4 empty:hidden border-t border-outline-variant/50 pt-4 transition-all duration-300">
            {hasChannelChecked("AlternativeEmail") && (
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-on-surface-variant">
                  Alternative Email Address
                </label>
                <div className="flex rounded-lg border bg-white overflow-hidden border-outline-variant focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <input
                    name="alternativeEmailValue"
                    value={formData.alternativeEmailValue}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]"
                    type="email"
                    placeholder="alternative@domain.com"
                  />
                </div>
              </div>
            )}
            {hasChannelChecked("WhatsApp") && (
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-on-surface-variant">
                  WhatsApp Handle
                </label>
                <div className="flex rounded-lg border bg-white overflow-hidden border-outline-variant focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <span className="bg-surface-container-high px-3 py-2 text-[14px] text-on-surface-variant border-r border-outline-variant select-none">
                    {URL_FIELD_PREFIXES.whatsapp}
                  </span>
                  <input
                    name="whatsappValue"
                    value={formData.whatsappValue}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]"
                    type="text"
                    placeholder="15550000000"
                  />
                </div>
              </div>
            )}
            {hasChannelChecked("LinkedIn") && (
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-on-surface-variant">
                  LinkedIn Profile
                </label>
                <div className="flex rounded-lg border bg-white overflow-hidden border-outline-variant focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <span className="bg-surface-container-high px-3 py-2 text-[14px] text-on-surface-variant border-r border-outline-variant select-none">
                    {URL_FIELD_PREFIXES.linkedinProfile}
                  </span>
                  <input
                    name="linkedinValue"
                    value={formData.linkedinValue}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]"
                    type="text"
                    placeholder="username"
                  />
                </div>
              </div>
            )}
            {hasChannelChecked("Instagram") && (
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-on-surface-variant">
                  Instagram Handle
                </label>
                <div className="flex rounded-lg border bg-white overflow-hidden border-outline-variant focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <span className="bg-surface-container-high px-3 py-2 text-[14px] text-on-surface-variant border-r border-outline-variant select-none">
                    {URL_FIELD_PREFIXES.instagram}
                  </span>
                  <input
                    name="instagramValue"
                    value={formData.instagramValue}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]"
                    type="text"
                    placeholder="username"
                  />
                </div>
              </div>
            )}
            {hasChannelChecked("Twitter") && (
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-on-surface-variant">
                  Twitter / X Handle
                </label>
                <div className="flex rounded-lg border bg-white overflow-hidden border-outline-variant focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <span className="bg-surface-container-high px-3 py-2 text-[14px] text-on-surface-variant border-r border-outline-variant select-none">
                    {URL_FIELD_PREFIXES.twitter}
                  </span>
                  <input
                    name="twitterValue"
                    value={formData.twitterValue}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 bg-transparent text-body-base outline-none text-[14px]"
                    type="text"
                    placeholder="username"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="text-left">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-primary w-5 h-5" />
            <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-widest text-[11px]">
              Internal Notes
            </h4>
          </div>
          <textarea
            name="notes"
            value={formData.notes || ""}
            onChange={handleInputChange}
            className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 text-body-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            placeholder="Add internal strategic notes about the account..."
            rows={4}
          />
        </section>
      </div>
    </FormDialog>
  );
}