import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client } from "@/lib/r2/client";
import { R2_BUCKET_NAME } from "@/lib/r2/env";
import type {
  SchoolDetail,
  SchoolNewsPayload,
  SchoolsSummary,
} from "@/lib/r2/types";

async function bodyToString(body: unknown): Promise<string> {
  if (!body) throw new Error("Empty R2 object body");

  // AWS SDK v3 SdkStreamMixin
  if (
    typeof body === "object" &&
    body !== null &&
    "transformToString" in body &&
    typeof (body as { transformToString: unknown }).transformToString ===
      "function"
  ) {
    return (body as { transformToString: () => Promise<string> }).transformToString();
  }

  const chunks: Buffer[] = [];
  for await (const chunk of body as AsyncIterable<Uint8Array>) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function getR2JsonObject<T>(key: string): Promise<T> {
  const client = getR2Client();
  const res = await client.send(
    new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    }),
  );
  const text = await bodyToString(res.Body as never);
  return JSON.parse(text) as T;
}

export function getSchoolsSummary() {
  return getR2JsonObject<SchoolsSummary>("schools_summary.json");
}

export function getSchoolById(id: string | number) {
  const n = String(id).replace(/[^\d]/g, "");
  if (!n) throw new Error("Invalid school id");
  return getR2JsonObject<SchoolDetail>(`schools/school_${n}.json`);
}

export function getSchoolNews() {
  return getR2JsonObject<SchoolNewsPayload>("news.json");
}
