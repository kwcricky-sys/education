export type NavItem = {
  href: string;
  label: string;
  /** `exact` only highlights on the href itself; `prefix` also covers sub-pages. */
  match: "exact" | "prefix";
};

/** Persistent section nav — shown in the site header on every page. */
export const SITE_NAV: readonly NavItem[] = [
  { href: "/dse", label: "學習專區", match: "exact" },
  { href: "/dse/chinese", label: "中文", match: "prefix" },
  { href: "/dse/english/learn", label: "English", match: "prefix" },
  { href: "/dse/econ/learn", label: "ECON", match: "prefix" },
  { href: "/dse/videos", label: "溫習片", match: "prefix" },
  { href: "/dse/jupas", label: "JUPAS", match: "prefix" },
];

/** Header call-to-action — the fastest way to a first result. */
export const HEADER_CTA = {
  href: "/dse/chinese/cat",
  label: "中文診斷室",
} as const;

/** Sections whose sub-routes live outside the nav href (e.g. /dse/english drills). */
const SECTION_ROOTS: Record<string, string> = {
  "/dse/english/learn": "/dse/english",
  "/dse/econ/learn": "/dse/econ",
};

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.match === "exact") return pathname === item.href;
  const root = SECTION_ROOTS[item.href] ?? item.href;
  return pathname === root || pathname.startsWith(`${root}/`);
}
