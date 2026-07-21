import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const SOURCE_URL = "https://raw.githubusercontent.com/othmanus/algeria-cities/master/json/algeria_cities.json";
const SOURCE_SHA256 = "bfac0ec846c5b7074c380470196ff7ba30c8199a91cd0a94a019762f8f45b437";
const EXPECTED_COMMUNE_COUNT = 1541;
const EXPECTED_WILAYA_COUNT = 58;
const BATCH_SIZE = 250;

function parseDotEnv(source) {
  return Object.fromEntries(
    source.split(/\r?\n/u).flatMap((line) => {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/u);
      if (!match || line.trimStart().startsWith("#")) return [];
      const value = match[2].replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/u, "$1$2");
      return [[match[1], value]];
    }),
  );
}

async function loadEnvironment() {
  try {
    return { ...parseDotEnv(await readFile(".env.local", "utf8")), ...process.env };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return process.env;
    throw error;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${options.method ?? "GET"} ${url.pathname} failed (${response.status}): ${body}`);
  }
  return response;
}

async function getAllRows(url, headers) {
  const rows = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const response = await request(url, {
      headers: { ...headers, Range: `${offset}-${offset + pageSize - 1}` },
    });
    const page = await response.json();
    assert(Array.isArray(page), `Could not read ${url.pathname}.`);
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
}

async function main() {
  const environment = await loadEnvironment();
  const supabaseUrl = environment.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = environment.SUPABASE_SERVICE_ROLE_KEY;
  assert(supabaseUrl && serviceRoleKey, "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before importing locations.");

  const sourceResponse = await fetch(SOURCE_URL, { cache: "no-store" });
  assert(sourceResponse.ok, `Unable to download the official location source (${sourceResponse.status}).`);
  const sourceText = await sourceResponse.text();
  const checksum = createHash("sha256").update(sourceText).digest("hex");
  assert(checksum === SOURCE_SHA256, "Official location source changed. Review the new source and checksum before importing it.");

  const cities = JSON.parse(sourceText);
  assert(Array.isArray(cities), "Official location source is not an array.");
  const wilayaCodes = new Set(cities.map((city) => Number(city.wilaya_code)));
  const ids = new Set(cities.map((city) => Number(city.id)));
  assert(cities.length === EXPECTED_COMMUNE_COUNT, `Expected ${EXPECTED_COMMUNE_COUNT} communes, found ${cities.length}.`);
  assert(wilayaCodes.size === EXPECTED_WILAYA_COUNT && Math.min(...wilayaCodes) === 1 && Math.max(...wilayaCodes) === 58, "Official source does not contain exactly wilayas 1 through 58.");
  assert(ids.size === cities.length, "Official source has duplicate commune IDs.");
  assert(cities.every((city) => city.commune_name && city.commune_name_ascii && Number.isInteger(Number(city.wilaya_code))), "Official source contains an invalid commune record.");

  const api = new URL("/rest/v1/", supabaseUrl);
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
  const existing = await getAllRows(new URL("algeria_cities?select=id&order=id.asc", api), headers);

  const rows = cities.map((city) => ({
    id: Number(city.id),
    commune_name: city.commune_name,
    commune_name_ascii: city.commune_name_ascii,
    daira_name: city.daira_name,
    daira_name_ascii: city.daira_name_ascii,
    wilaya_code: Number(city.wilaya_code),
    wilaya_name: city.wilaya_name,
    wilaya_name_ascii: city.wilaya_name_ascii,
  }));
  for (let start = 0; start < rows.length; start += BATCH_SIZE) {
    const endpoint = new URL("algeria_cities?on_conflict=id", api);
    await request(endpoint, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(rows.slice(start, start + BATCH_SIZE)),
    });
  }

  const officialIds = new Set(rows.map((row) => row.id));
  const staleIds = existing.map((row) => Number(row.id)).filter((id) => !officialIds.has(id));
  for (const id of staleIds) {
    await request(new URL(`algeria_cities?id=eq.${id}`, api), { method: "DELETE", headers: { ...headers, Prefer: "return=minimal" } });
  }

  const persisted = await getAllRows(new URL("algeria_cities?select=id&order=id.asc", api), headers);
  assert(persisted.length === EXPECTED_COMMUNE_COUNT, `Expected ${EXPECTED_COMMUNE_COUNT} persisted communes, found ${persisted.length}.`);
  assert(persisted.every((row) => officialIds.has(Number(row.id))), "The location table still contains a non-official commune row.");

  const prices = await getAllRows(new URL("shipping_prices?select=wilaya_code,state&order=wilaya_code.asc", api), headers);
  const configuredWilayas = new Set(prices.map((price) => Number(price.wilaya_code)));
  const missingPrices = [...wilayaCodes].filter((code) => !configuredWilayas.has(code));
  console.log(`Imported ${rows.length} official communes for ${wilayaCodes.size} wilayas; removed ${staleIds.length} obsolete rows.`);
  if (missingPrices.length > 0) {
    const message = `Shipping pricing is missing for wilaya codes: ${missingPrices.join(", ")}. Import the courier tariff table before enabling checkout.`;
    if (process.argv.includes("--strict-pricing")) throw new Error(message);
    console.warn(`WARNING: ${message}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
