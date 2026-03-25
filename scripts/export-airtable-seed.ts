import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_PROMPT_LIBRARY_BASE_ID =
  process.env.AIRTABLE_PROMPT_LIBRARY_BASE_ID ?? "appW7uCFBZf2lGRld";

if (!AIRTABLE_TOKEN) {
  throw new Error("Missing AIRTABLE_TOKEN");
}

type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
};

async function fetchTable(tableName: string) {
  let offset = "";
  const records: AirtableRecord[] = [];

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${AIRTABLE_PROMPT_LIBRARY_BASE_ID}/${encodeURIComponent(tableName)}`,
    );
    url.searchParams.set("pageSize", "100");
    if (offset) {
      url.searchParams.set("offset", offset);
    }

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${tableName}: ${response.status} ${await response.text()}`);
    }

    const data = (await response.json()) as { records: AirtableRecord[]; offset?: string };
    records.push(...data.records);
    offset = data.offset ?? "";
  } while (offset);

  return records;
}

async function main() {
  const promptRecords = await fetchTable("N8N Prompts");
  const contentTypeRecords = await fetchTable("Content Types");

  const promptTemplates = promptRecords.map((record) => ({
    name: String(record.fields.Name ?? ""),
    usedIn: Array.isArray(record.fields["Used In"])
      ? record.fields["Used In"].map((value) => String(value))
      : [],
    systemPrompt: String(record.fields["System Prompt"] ?? ""),
    formatLabel: record.fields["Format Label"] ? String(record.fields["Format Label"]) : null,
    version: 1,
  }));

  const contentTypes = contentTypeRecords.map((record) => ({
    contentType: String(record.fields["Content Type"] ?? ""),
    variants: record.fields.Variants ? String(record.fields.Variants) : null,
    status: String(record.fields.Status ?? "Backlog"),
    category: record.fields.Category ? String(record.fields.Category) : null,
    journeyStage: record.fields["Journey Stage"] ? String(record.fields["Journey Stage"]) : null,
    outlineStructure: record.fields["Outline Structure"]
      ? String(record.fields["Outline Structure"])
      : null,
  }));

  const seedDir = path.join(process.cwd(), "packages", "prompt-library", "seeds");
  await mkdir(seedDir, { recursive: true });
  await writeFile(
    path.join(seedDir, "default-prompt-templates.json"),
    `${JSON.stringify(promptTemplates, null, 2)}\n`,
    "utf8",
  );
  await writeFile(
    path.join(seedDir, "default-content-types.json"),
    `${JSON.stringify(contentTypes, null, 2)}\n`,
    "utf8",
  );

  console.log(`Exported ${promptTemplates.length} prompt templates and ${contentTypes.length} content types.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
