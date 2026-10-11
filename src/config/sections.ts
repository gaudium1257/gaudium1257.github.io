import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Section registry — the single list that drives navigation (desktop nav,
 * mobile menu, scroll-spy) and section order on the home page.
 * Adding a section = add it here + a dictionary label + its component
 * (see the `add-section` skill).
 */
export const sections = [
  { id: "about", label: "about" },
  { id: "skills", label: "skills" },
  { id: "projects", label: "projects" },
  { id: "activities", label: "activities" },
  { id: "awards", label: "awards" },
  { id: "society", label: "society" },
  { id: "education", label: "education" },
  { id: "connect", label: "connect" },
] as const satisfies readonly { id: string; label: keyof Dictionary["nav"] }[];

export type SectionId = (typeof sections)[number]["id"];
