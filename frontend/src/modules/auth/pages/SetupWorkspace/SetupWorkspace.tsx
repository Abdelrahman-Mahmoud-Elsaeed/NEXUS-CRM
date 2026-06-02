import { Camera, Loader2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useSetupWorkspace } from "@/modules/auth/hooks/useSetupWorkspace"; // 💡 Import your custom workspace setup hook
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export default function SetupWorkspace() {
  const {
    orgName,
    setOrgName,
    avatarPreview,
    isSubmitting,
    fileInputRef,
    handleAvatarChange,
    handleSubmit,
  } = useSetupWorkspace();

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen flex items-center justify-center font-body-base antialiased p-4">
      <div className="w-full max-w-120 p-5 bg-surface rounded-xl border border-outline-variant shadow-md p-container-padding flex flex-col items-center">
        <div className="mb-8 text-center flex flex-col items-center gap-4">
          <span className="text-3xl font-black text-primary tracking-tight">
            Nexus CRM
          </span>
          <div>
            <h1 className="font-md text-2xl text-on-surface mb-2">
              Set up your workspace
            </h1>
            <p className="font-body-base text-body-base text-on-surface-variant max-w-[320px]">
              Personalize your CRM with your organization name and logo.
            </p>
          </div>
        </div>

        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>

          <div className="flex flex-col items-center gap-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-30 h-30 rounded-md bg-surface-variant border border-outline-variant flex items-center justify-center cursor-pointer hover:bg-surface-container transition-colors group overflow-hidden"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Workspace Preview"
                  className="w-full h-full object-cover animate-in fade-in duration-200"
                />
              ) : (
                <div className="relative flex items-center justify-center">
                  <Camera className="h-8 w-8 text-outline group-hover:text-primary transition-colors duration-150" />
                  <div className="absolute top-0 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-surface-variant transition-colors duration-150">
                    <Plus className="h-5 w-5 text-outline group-hover:text-primary transition-colors duration-150" />
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                aria-label="Upload Avatar"
                disabled={isSubmitting}
              />
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant ">
              Upload Avatar
            </span>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <Label
              className="font-label-md text-label-md text-on-surface"
              htmlFor="orgName"
            >
              Organization Name
            </Label>
            <Input
              id="orgName"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Acme Corp"
              required
              disabled={isSubmitting}
              onFocus={(e) => {
                const val = e.target.value;
                e.target.value = "";
                e.target.value = val;
              }}
              className="w-full h-10 px-3 bg-surface border border-outline-variant font-body-base text-body-base text-on-surface placeholder:text-outline focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !orgName.trim()}
            className="w-full h-10 bg-primary text-on-primary font-label-md hover:bg-primary-container disabled:opacity-50 transition-all flex items-center justify-center mt-2 border-none shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-on-primary" />
                Setting up...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors underline decoration-transparent hover:decoration-primary underline-offset-4"
          >
            Skip for now
          </Link>
        </div>
      </div>
    </div>
  );
}
