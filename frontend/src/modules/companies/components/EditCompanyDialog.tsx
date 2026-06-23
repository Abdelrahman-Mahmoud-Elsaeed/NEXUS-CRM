/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Building2,
  BarChart3,
  Share2,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Camera,
} from "lucide-react";
import { FormDialog } from "@/shared/ui/resource/FormDialog";
import {
  formatUrlFieldForStorage,
  parseUrlFieldForForm,
  URL_FIELD_PREFIXES,
} from "@/shared/utils/urlFieldUtils";
import type { RootState } from "@/app/store";
import { fetchCompany, updateExistingCompany, uploadCompanyLogoThunk } from "../store/companies.actions";

const LinkedInIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" r="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface EditCompanyDialogProps {
  companyId: string | null;
  onClose: () => void;
}

interface CompanyFormState {
  id: string;
  name: string;
  domain: string;
  industry: string;
  logoUrl: string;
  notes: string;
  status: string;
  source: string;
  employeeCount: string;
  annualRevenue: string;
  phone: string;
  address: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  whatsapp: string;
  email: string;
}

const mapCompanyToFormState = (c: any): CompanyFormState => {
  return {
    id: c?.id || "",
    name: c?.name || "",
    domain: parseUrlFieldForForm("domain", c?.domain),
    industry: c?.industry || "",
    logoUrl: c?.logoUrl || "",
    notes: c?.notes || "",
    status: c?.status || "Lead",
    source: c?.source || "Manual",
    employeeCount: c?.employeeCount != null ? String(c.employeeCount) : "",
    annualRevenue: c?.annualRevenue != null ? String(c.annualRevenue) : "",
    phone: c?.phone || "",
    address: c?.address || "",
    linkedin: parseUrlFieldForForm("linkedinCompany", c?.linkedin),
    twitter: parseUrlFieldForForm("twitter", c?.twitter),
    instagram: parseUrlFieldForForm("instagram", c?.instagram),
    whatsapp: parseUrlFieldForForm("whatsapp", c?.whatsapp),
    email: c?.email || "",
  };
};

type TabKey = "profile" | "firmographics" | "social";

const tabConfig: { key: TabKey; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { key: "profile", label: "Profile", icon: Building2 },
  { key: "firmographics", label: "Firmographics", icon: BarChart3 },
  { key: "social", label: "Social & Channels", icon: Share2 },
];

export function EditCompanyDialog({ companyId, onClose }: EditCompanyDialogProps) {
  const dispatch = useDispatch<any>();
  const isOpen = companyId !== null;

  const { companyDetail, isLoadingDetail, isUpdating } = useSelector(
    (state: RootState) => state.companies,
  );

  // Trigger data fetching in an effect safely without setting local component state
  React.useEffect(() => {
    if (companyId) {
      dispatch(fetchCompany(companyId));
    }
  }, [companyId, dispatch]);

  if (isOpen && (isLoadingDetail || !companyDetail || companyDetail.id !== companyId)) {
    return (
      <FormDialog open={isOpen} onOpenChange={onClose}>
        <div className="flex flex-col items-center justify-center py-20 space-y-4 w-40 mx-auto">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-body-base text-on-surface-variant font-medium whitespace-nowrap">
            Fetching company record...
          </p>
        </div>
      </FormDialog>
    );
  }

  if (!isOpen || !companyDetail) return null;

  // By extracting the editable fields into an isolated subcomponent and passing `key={companyId}`,
  // React will destroy and reconstruct the form state natively when switching records.
  return (
    <CompanyFormInner
      key={companyId}
      companyId={companyId}
      companyDetail={companyDetail}
      isUpdating={isUpdating}
      onClose={onClose}
      dispatch={dispatch}
    />
  );
}

interface CompanyFormInnerProps {
  companyId: string;
  companyDetail: any;
  isUpdating: boolean;
  onClose: () => void;
  dispatch: any;
}

function CompanyFormInner({
  companyId,
  companyDetail,
  isUpdating,
  onClose,
  dispatch,
}: CompanyFormInnerProps) {
  // Initialize state directly from props during execution (No Effects required!)
  const [formData, setFormData] = React.useState<CompanyFormState>(() =>
    mapCompanyToFormState(companyDetail)
  );
  const [activeTab, setActiveTab] = React.useState<TabKey>("profile");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  // Effect handles clean up for preview blob URLs exclusively
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalLogoUrl = formData.logoUrl;
    
    if (selectedFile) {
      const uploadResult = await dispatch(uploadCompanyLogoThunk(selectedFile)).unwrap();
      if (uploadResult?.data.file?.url) {
        finalLogoUrl = uploadResult.data.file?.url;
      }
    }

    const payload: Record<string, any> = {};
    const numFields = ["employeeCount", "annualRevenue"];
    const strFields = [
      "name",
      "industry",
      "notes",
      "status",
      "source",
      "phone",
      "address",
      "email",
      "logoUrl",
    ];

    const currentFormWithLogo = { ...formData, logoUrl: finalLogoUrl };

    strFields.forEach((field) => {
      const val = (currentFormWithLogo as any)[field];
      if (val !== undefined && val !== null) {
        payload[field] = typeof val === "string" ? val.trim() || null : val;
      }
    });

    payload.domain = formatUrlFieldForStorage("domain", formData.domain);
    payload.linkedin = formatUrlFieldForStorage("linkedinCompany", formData.linkedin);
    payload.twitter = formatUrlFieldForStorage("twitter", formData.twitter);
    payload.instagram = formatUrlFieldForStorage("instagram", formData.instagram);
    payload.whatsapp = formatUrlFieldForStorage("whatsapp", formData.whatsapp);

    numFields.forEach((field) => {
      const val = (formData as any)[field];
      if (val !== undefined && val !== null && val !== "") {
        const parsed = parseInt(val, 10);
        payload[field] = Number.isFinite(parsed) ? parsed : null;
      } else if (val === "") {
        payload[field] = null;
      }
    });

    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined),
    );

    const resultAction = await dispatch(
      updateExistingCompany({
        id: companyId,
        data: cleanPayload,
      }),
    );

    if (updateExistingCompany.fulfilled.match(resultAction)) {
      onClose();
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const initials = getInitials(formData.name);
  const inputBase =
    "w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-body-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

  return (
    <FormDialog
      open={true}
      title="Edit Company"
      description="Modify company profile, firmographics, and communication channels."
      onOpenChange={onClose}
      onSubmit={handleSubmit}
      className="w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl sm:m-4"
      headerContent={
        <>
          <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg ring-4 ring-primary-container/10 select-none overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt="" className="w-full h-full object-cover" />
            ) : formData.logoUrl ? (
              <img src={formData.logoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div>
            <h3 className="font-h3 text-h3 text-on-surface text-lg font-semibold">
              Edit Company — {formData.name || "Unnamed"}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  formData.status === "Active" || formData.status === "Customer"
                    ? "bg-green-500"
                    : "bg-outline-variant"
                }`}
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
            {isUpdating ? "Updating..." : "Update Company"}
          </button>
        </>
      }
    >
      <div className="space-y-6 sm:space-y-8 max-h-[65vh] overflow-y-auto px-1">
        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-surface-container-low rounded-lg border border-outline-variant/40">
          {tabConfig.map((tab) => {
            const isActive = activeTab === tab.key;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-primary shadow-sm border border-outline-variant/50"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <TabIcon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <section className="text-left space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="text-primary w-5 h-5" />
              <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-widest text-[11px]">
                Company Profile
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="sm:col-span-2 flex gap-6 items-center">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-xl bg-gray-50 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-primary">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-cover animate-in fade-in duration-200"
                      />
                    ) : formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="Current Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <Camera size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase group-hover:text-primary text-center px-2">Upload Logo</p>
                      </>
                    )}
                  </div>
                  <input
                    aria-label="Upload company logo"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={inputBase}
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Domain
                </label>
                <div className="flex">
                  <span className="bg-surface-container-high border border-r-0 border-outline-variant rounded-l-lg px-3 py-2 text-body-sm text-on-surface-variant flex items-center select-none">
                    {URL_FIELD_PREFIXES.domain}
                  </span>
                  <input
                    name="domain"
                    value={formData.domain}
                    onChange={handleInputChange}
                    className={`${inputBase} rounded-l-none`}
                    type="text"
                    placeholder="example.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Industry
                </label>
                <input
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={inputBase}
                  type="text"
                  placeholder="e.g. Software, Manufacturing"
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className={`${inputBase} min-h-25 resize-none`}
                  placeholder="Internal notes about this company..."
                  rows={4}
                />
              </div>
            </div>
          </section>
        )}

        {/* Firmographics Tab */}
        {activeTab === "firmographics" && (
          <section className="text-left space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="text-primary w-5 h-5" />
              <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-widest text-[11px]">
                Firmographics
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`${inputBase} appearance-none capitalize cursor-pointer`}
                >
                  <option value="Lead">Lead</option>
                  <option value="Active">Active</option>
                  <option value="Customer">Customer</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Source
                </label>
                <input
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className={`${inputBase} bg-surface-container-low cursor-not-allowed`}
                  type="text"
                  readOnly
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Employees
                </label>
                <input
                  name="employeeCount"
                  value={formData.employeeCount}
                  onChange={handleInputChange}
                  className={inputBase}
                  type="number"
                  min={0}
                  placeholder="e.g. 500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Annual Revenue
                </label>
                <input
                  name="annualRevenue"
                  value={formData.annualRevenue}
                  onChange={handleInputChange}
                  className={inputBase}
                  type="number"
                  min={0}
                  placeholder="e.g. 5000000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Phone
                </label>
                <div className="flex">
                  <span className="bg-surface-container-high border border-r-0 border-outline-variant rounded-l-lg px-3 py-2 text-body-sm text-on-surface-variant flex items-center">
                    <Phone size={14} />
                  </span>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`${inputBase} rounded-l-none`}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Address
                </label>
                <div className="flex">
                  <span className="bg-surface-container-high border border-r-0 border-outline-variant rounded-l-lg px-3 py-2 text-body-sm text-on-surface-variant flex items-center">
                    <MapPin size={14} />
                  </span>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`${inputBase} rounded-l-none`}
                    type="text"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Social & Channels Tab */}
        {activeTab === "social" && (
          <section className="text-left space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="text-primary w-5 h-5" />
              <h4 className="font-label-sm text-label-md text-on-surface uppercase tracking-widest text-[11px]">
                Social &amp; Communication Channels
              </h4>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
                  <Mail size={14} className="text-outline" />
                  Email
                </label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputBase}
                  type="email"
                  placeholder="contact@company.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
                  <LinkedInIcon size={14} className="text-outline" />
                  LinkedIn
                </label>
                <div className="flex">
                  <span className="bg-surface-container-high border border-r-0 border-outline-variant rounded-l-lg px-3 py-2 text-body-sm text-on-surface-variant flex items-center select-none">
                    {URL_FIELD_PREFIXES.linkedinCompany}
                  </span>
                  <input
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className={`${inputBase} rounded-l-none`}
                    type="text"
                    placeholder="acme"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
                  <TwitterIcon size={14} className="text-outline" />
                  Twitter / X
                </label>
                <div className="flex">
                  <span className="bg-surface-container-high border border-r-0 border-outline-variant rounded-l-lg px-3 py-2 text-body-sm text-on-surface-variant flex items-center select-none">
                    {URL_FIELD_PREFIXES.twitter}
                  </span>
                  <input
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    className={`${inputBase} rounded-l-none`}
                    type="text"
                    placeholder="handle"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
                  <InstagramIcon size={14} className="text-outline" />
                  Instagram
                </label>
                <div className="flex">
                  <span className="bg-surface-container-high border border-r-0 border-outline-variant rounded-l-lg px-3 py-2 text-body-sm text-on-surface-variant flex items-center select-none">
                    {URL_FIELD_PREFIXES.instagram}
                  </span>
                  <input
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className={`${inputBase} rounded-l-none`}
                    type="text"
                    placeholder="handle"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
                  <MessageCircle size={14} className="text-outline" />
                  WhatsApp
                </label>
                <div className="flex">
                  <span className="bg-surface-container-high border border-r-0 border-outline-variant rounded-l-lg px-3 py-2 text-body-sm text-on-surface-variant flex items-center select-none">
                    {URL_FIELD_PREFIXES.whatsapp}
                  </span>
                  <input
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className={`${inputBase} rounded-l-none`}
                    type="text"
                    placeholder="15550000000"
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </FormDialog>
  );
}