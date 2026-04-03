#!/usr/bin/env node
/**
 * Fetches daily digests from the Aurora API and saves them to src/content/digests/.
 * Runs on the self-hosted CI runner which has VPN access to the internal API.
 *
 * Required env vars:
 *   DIGEST_API_URL    - Base URL of the Aurora API (e.g. http://aurora-api.internal)
 *   DIGEST_PUBLIC_TOKEN - Public token from DigestConfig.generate-public-token
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, "../data/digests");

const { DIGEST_API_URL, DIGEST_PUBLIC_TOKEN } = process.env;

if (!DIGEST_API_URL || !DIGEST_PUBLIC_TOKEN) {
  console.error("Missing required env vars: DIGEST_API_URL, DIGEST_PUBLIC_TOKEN");
  process.exit(1);
}

mkdirSync(CONTENT_DIR, { recursive: true });

const url = `${DIGEST_API_URL}/api/public/digests/?token=${DIGEST_PUBLIC_TOKEN}`;
console.log(`Fetching digests from ${DIGEST_API_URL}/api/public/digests/`);

let digests;
try {
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`API returned ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  digests = await res.json();
} catch (err) {
  console.error(`Failed to fetch digests: ${err.message}`);
  process.exit(1);
}

console.log(`Found ${digests.length} digest(s) total`);

let saved = 0;
for (const digest of digests) {
  const filePath = join(CONTENT_DIR, `${digest.id}.json`);
  if (!existsSync(filePath)) {
    writeFileSync(filePath, JSON.stringify(digest, null, 2));
    console.log(`  Saved digest #${digest.id}: ${digest.title || digest.created_at}`);
    saved++;
  }
}

console.log(`Done. ${saved} new digest(s) saved.`);
