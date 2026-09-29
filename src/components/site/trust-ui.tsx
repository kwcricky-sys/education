import Link from "next/link";
import { ArrowRight, BadgeCheck, HardDrive, LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";

const TRUST_CHIPS = [
  { icon: BadgeCheck, label: "免費" },
  { icon: LockKeyhole, label: "免登入" },
  { icon: HardDrive, label: "本機進度" },
] as const;

export function TrustChips({ className }: { className?: string }) {
  return (
    <ul
      aria-label="使用承諾"
      className={cn("flex flex-wrap gap-2", className)}
    >
      {TRUST_CHIPS.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/80 px-3 py-1.5 text-xs font-semibold text-ink"
        >
          <Icon className="size-3.5 text-navy" aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[11px] font-extrabold tracking-[0.28em] text-gold-ink sm:text-xs",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  action,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2
          id={id}
          className="mt-1.5 font-[family-name:var(--font-serif-zh)] text-2xl font-bold tracking-tight text-navy sm:text-[1.75rem]"
        >
          {title}
        </h2>
      </div>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-navy underline-offset-4 hover:underline"
        >
          {action.label}
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      ) : null}
    </div>
  );
}
