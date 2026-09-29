import type { ReactNode } from "react";

export default function CatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dse-cat-light relative -mx-4 -my-8 min-h-[calc(100vh-8rem)] px-4 py-8 sm:-mx-6 sm:-my-10 sm:px-6 sm:py-10">
      {children}
    </div>
  );
}
