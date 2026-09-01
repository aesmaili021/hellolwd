import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadPostgresMedia, savePostgresMedia } from "@/lib/data/postgres";

const MAX_BYTES = 4 * 1024 * 1024;
const DIR = path.join(process.cwd(), "data", "media");

const TYPES: { mime: string; test: (bytes: Uint8Array) => boolean }[] = [
  { mime: "image/jpeg", test: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  { mime: "image/png", test: (bytes) => bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 },
  { mime: "image/gif", test: (bytes) => bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 },
  {
    mime: "image/webp",
    test: (bytes) =>
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50,
  },
];

function databaseUrl() {
  return (
    process.env.DATABASE_URL?.trim() ||
    process.env.DATABASE_PRIVATE_URL?.trim() ||
    ""
  );
}

function sniff(bytes: Uint8Array) {
  return TYPES.find((type) => type.test(bytes))?.mime ?? "";
}

function mediaId(value: string) {
  return /^[0-9a-f-]{36}$/i.test(value) ? value : "";
}

export async function saveUploadedImage(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size < 24 || value.size > MAX_BYTES) return null;
  const bytes = new Uint8Array(await value.arrayBuffer());
  const mime = sniff(bytes);
  if (!mime) return null;
  const id = crypto.randomUUID();
  if (databaseUrl()) await savePostgresMedia(id, mime, bytes);
  else {
    await mkdir(DIR, { recursive: true });
    await writeFile(path.join(DIR, `${id}.bin`), bytes);
    await writeFile(path.join(DIR, `${id}.mime`), mime, "utf8");
  }
  return `/api/media/${id}`;
}

export async function loadUploadedImage(id: string) {
  const safe = mediaId(id);
  if (!safe) return null;
  if (databaseUrl()) return loadPostgresMedia(safe);
  try {
    const [bytes, mime] = await Promise.all([
      readFile(path.join(DIR, `${safe}.bin`)),
      readFile(path.join(DIR, `${safe}.mime`), "utf8"),
    ]);
    return { mime: mime.trim(), bytes };
  } catch {
    return null;
  }
}

export async function resolveImageUrl(
  form: FormData,
  current?: string | null,
) {
  return (
    (await saveUploadedImage(form.get("image"))) ||
    String(form.get("image_link") ?? "").trim() ||
    String(form.get("image_url") ?? "").trim() ||
    current ||
    null
  );
}
