import { redirect } from "next/navigation";

/** Legacy path — K3 選小學已遷至 /schools */
export default function K3RedirectPage() {
  redirect("/schools");
}
