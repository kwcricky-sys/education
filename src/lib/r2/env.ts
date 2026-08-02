/**
 * Cloudflare R2 credentials for the `school-info` bucket.
 *
 * Vercel Project → Environment Variables (Production & Preview):
 * - School_Access_Key        → R2 Access Key ID
 * - School_Secret_AccessKey  → R2 Secret Access Key
 * - School_Token             → R2 Account ID (optional if endpoint is set)
 *
 * Also accepts the Hermes / script aliases (R2_*) for local runs.
 */

export const R2_BUCKET_NAME =
  process.env.R2_BUCKET_NAME?.trim() || "school-info";

/** Jurisdiction-specific S3 API endpoint (not the generic AWS endpoint). */
export const R2_ENDPOINT =
  process.env.R2_ENDPOINT?.trim() ||
  "https://2c2a3e2fab390a799cadaa93e0da262d.r2.cloudflarestorage.com";

export function getR2Credentials() {
  const accessKeyId =
    process.env.School_Access_Key?.trim() ||
    process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey =
    process.env.School_Secret_AccessKey?.trim() ||
    process.env.R2_SECRET_ACCESS_KEY?.trim();
  // School_Token may be a Cloudflare API token (cfat_…); account id is separate.
  const token = process.env.School_Token?.trim();
  const accountId =
    process.env.R2_ACCOUNT_ID?.trim() ||
    (token && !token.startsWith("cfat_") ? token : undefined);

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing R2 credentials. Set School_Access_Key and School_Secret_AccessKey (or R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY).",
    );
  }

  return { accessKeyId, secretAccessKey, accountId, apiToken: token };
}

/** Build endpoint from account id when R2_ENDPOINT is not set via override. */
export function resolveR2Endpoint(): string {
  if (process.env.R2_ENDPOINT?.trim()) {
    return process.env.R2_ENDPOINT.trim();
  }
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  if (accountId) {
    return `https://${accountId}.r2.cloudflarestorage.com`;
  }
  return R2_ENDPOINT;
}
