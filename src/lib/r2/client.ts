import { S3Client } from "@aws-sdk/client-s3";
import { getR2Credentials, resolveR2Endpoint } from "@/lib/r2/env";

let cached: S3Client | null = null;

/**
 * S3-compatible client pointed at Cloudflare R2's jurisdiction-specific endpoint.
 * Do not use the generic AWS endpoint — R2 requires the account subdomain URL.
 */
export function getR2Client(): S3Client {
  if (cached) return cached;

  const { accessKeyId, secretAccessKey } = getR2Credentials();
  const endpoint = resolveR2Endpoint();

  cached = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });

  return cached;
}
