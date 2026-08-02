/**
 * Download school-info R2 objects into src/data for SSG.
 *
 * Usage: node --env-file=.env.local scripts/sync-schools-from-r2.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";

const endpoint =
  process.env.R2_ENDPOINT ||
  "https://2c2a3e2fab390a799cadaa93e0da262d.r2.cloudflarestorage.com";
const bucket = process.env.R2_BUCKET_NAME || "school-info";
const accessKeyId =
  process.env.School_Access_Key || process.env.R2_ACCESS_KEY_ID;
const secretAccessKey =
  process.env.School_Secret_AccessKey || process.env.R2_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  console.error("Missing School_Access_Key / School_Secret_AccessKey in env");
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,
});

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const schoolsDir = path.join(dataDir, "schools");

async function bodyToString(body) {
  if (!body) throw new Error("empty body");
  if (typeof body.transformToString === "function") {
    return body.transformToString();
  }
  const chunks = [];
  for await (const chunk of body) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function listAllKeys() {
  const keys = [];
  let ContinuationToken;
  do {
    const page = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken,
      }),
    );
    for (const obj of page.Contents ?? []) {
      if (obj.Key) keys.push(obj.Key);
    }
    ContinuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return keys;
}

async function downloadKey(key) {
  const res = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key }),
  );
  return bodyToString(res.Body);
}

function localPathForKey(key) {
  if (key === "schools_summary.json") {
    return path.join(dataDir, "schools_summary.json");
  }
  if (key === "news.json") {
    return path.join(dataDir, "schools_news.json");
  }
  // schools/school_1.json → src/data/schools/1.json
  // schools/1.json → src/data/schools/1.json
  const m = key.match(/^schools\/(?:school_)?(.+\.json)$/i);
  if (m) {
    return path.join(schoolsDir, m[1]);
  }
  return null;
}

async function main() {
  console.log(`Listing s3://${bucket} via ${endpoint}`);
  const keys = await listAllKeys();
  console.log(`Found ${keys.length} objects`);

  await mkdir(schoolsDir, { recursive: true });

  let ok = 0;
  let skipped = 0;
  for (const key of keys) {
    const dest = localPathForKey(key);
    if (!dest) {
      skipped += 1;
      continue;
    }
    const text = await downloadKey(key);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, text, "utf8");
    ok += 1;
    if (ok % 50 === 0) console.log(`  downloaded ${ok}…`);
  }

  console.log(`Done. Wrote ${ok} files, skipped ${skipped}.`);
  console.log(`  summary → src/data/schools_summary.json`);
  console.log(`  details → src/data/schools/`);
  console.log(`  news    → src/data/schools_news.json (if present)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
