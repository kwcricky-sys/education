import { NextResponse } from "next/server";
import { getSchoolsSummary } from "@/lib/r2/schools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSchoolsSummary();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load schools summary";
    const status = message.includes("Missing R2") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
