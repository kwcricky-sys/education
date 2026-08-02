import { NextResponse } from "next/server";
import { getSchoolById } from "@/lib/r2/schools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await getSchoolById(id);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=600, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load school";
    const name = err instanceof Error ? err.name : "";
    if (message.includes("Invalid school")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const status = message.includes("Missing R2")
      ? 503
      : name === "NoSuchKey" ||
          name === "NotFound" ||
          message.includes("NoSuchKey") ||
          message.includes("NotFound")
        ? 404
        : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
