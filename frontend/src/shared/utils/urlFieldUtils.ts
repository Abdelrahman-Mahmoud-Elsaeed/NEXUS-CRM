import { z } from "zod";

export type UrlFieldKind =
  | "website"
  | "domain"
  | "linkedinProfile"
  | "linkedinCompany"
  | "twitter"
  | "instagram"
  | "whatsapp";

/** Visible prefix shown beside the input; user enters only the suffix. */
export const URL_FIELD_PREFIXES: Record<UrlFieldKind, string> = {
  website: "https://",
  domain: "https://",
  linkedinProfile: "linkedin.com/in/",
  linkedinCompany: "linkedin.com/company/",
  twitter: "twitter.com/",
  instagram: "instagram.com/",
  whatsapp: "wa.me/",
};

function trim(value: string | null | undefined): string {
  return (value ?? "").trim();
}

function stripProtocol(value: string): string {
  return value.replace(/^https?:\/\//i, "");
}

function stripLeadingAt(value: string): string {
  return value.replace(/^@+/, "");
}

function stripTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

/** Convert a stored API value into the suffix shown in prefixed inputs. */
export function parseUrlFieldForForm(
  kind: UrlFieldKind,
  stored: string | null | undefined,
): string {
  const value = trim(stored);
  if (!value) return "";

  switch (kind) {
    case "website":
    case "domain":
      return stripTrailingSlashes(stripProtocol(value));

    case "linkedinProfile": {
      let handle = stripProtocol(value);
      handle = handle.replace(/^(www\.)?linkedin\.com\/in\/?/i, "");
      handle = handle.replace(/^in\/?/i, "");
      return stripTrailingSlashes(stripLeadingAt(handle));
    }

    case "linkedinCompany": {
      let slug = stripProtocol(value);
      slug = slug.replace(/^(www\.)?linkedin\.com\/company\/?/i, "");
      slug = slug.replace(/^(www\.)?linkedin\.com\/?/i, "");
      return stripTrailingSlashes(stripLeadingAt(slug));
    }

    case "twitter": {
      let handle = stripProtocol(value);
      handle = handle.replace(/^(www\.)?(twitter|x)\.com\/?/i, "");
      return stripTrailingSlashes(stripLeadingAt(handle));
    }

    case "instagram": {
      let handle = stripProtocol(value);
      handle = handle.replace(/^(www\.)?instagram\.com\/?/i, "");
      return stripTrailingSlashes(stripLeadingAt(handle));
    }

    case "whatsapp": {
      let phone = stripProtocol(value);
      phone = phone.replace(/^(www\.)?wa\.me\/?/i, "");
      return phone.replace(/[^\d+]/g, "");
    }

    default:
      return value;
  }
}

/** Convert prefixed-input suffix into the value persisted by the API. */
export function formatUrlFieldForStorage(
  kind: UrlFieldKind,
  input: string | null | undefined,
): string | null {
  const value = trim(input);
  if (!value) return null;

  switch (kind) {
    case "website": {
      const host = stripTrailingSlashes(stripProtocol(value));
      return host ? `https://${host}` : null;
    }

    case "domain": {
      const host = stripTrailingSlashes(stripProtocol(value));
      return host || null;
    }

    case "linkedinProfile": {
      const handle = stripTrailingSlashes(
        stripLeadingAt(value.replace(/^in\/?/i, "")),
      );
      return handle ? `https://linkedin.com/in/${handle}` : null;
    }

    case "linkedinCompany": {
      const slug = stripTrailingSlashes(stripLeadingAt(value));
      return slug ? `https://linkedin.com/company/${slug}` : null;
    }

    case "twitter": {
      const handle = stripTrailingSlashes(stripLeadingAt(value));
      return handle ? `https://twitter.com/${handle}` : null;
    }

    case "instagram": {
      const handle = stripTrailingSlashes(stripLeadingAt(value));
      return handle ? `https://instagram.com/${handle}` : null;
    }

    case "whatsapp": {
      let phone = stripProtocol(value).replace(/^(www\.)?wa\.me\/?/i, "");
      phone = phone.replace(/[^\d+]/g, "");
      return phone || null;
    }

    default:
      return value;
  }
}

export function isValidWebsiteInput(input: string): boolean {
  const formatted = formatUrlFieldForStorage("website", input);
  if (!formatted) return true;

  try {
    const url = new URL(formatted);
    return Boolean(url.hostname.includes("."));
  } catch {
    return false;
  }
}

export function isValidDomainInput(input: string): boolean {
  const formatted = formatUrlFieldForStorage("domain", input);
  if (!formatted) return true;

  return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(\.[a-zA-Z]{2,})(\/[^\s]*)?$/.test(
    formatted,
  );
}

export function isValidSocialHandle(input: string): boolean {
  const value = trim(input);
  if (!value) return true;
  return /^[a-zA-Z0-9._-]+$/.test(value);
}

export function isValidWhatsAppInput(input: string): boolean {
  const formatted = formatUrlFieldForStorage("whatsapp", input);
  if (!formatted) return true;
  return /^\+?\d{7,15}$/.test(formatted);
}

export function isValidEmailInput(input: string): boolean {
  const value = trim(input);
  if (!value) return true;
  return z.string().email().safeParse(value).success;
}
