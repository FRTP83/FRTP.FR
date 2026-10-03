import "server-only";
import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import path from "node:path";

type Row = Record<string, unknown>;
export type LocalTables = Record<string, Row[]>;
const filename = path.join(process.cwd(), ".local-preview/data.json");
let pending: Promise<unknown> = Promise.resolve();

export function localRequestAllowed(request: Request) {
  if (process.env.NODE_ENV === "production" || process.env.FRTP_LOCAL_PREVIEW !== "true") return false;
  const url = new URL(request.url);
  const local = (hostname: string) => ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
  if (!local(url.hostname)) return false;
  const origin = request.headers.get("origin");
  return !origin || origin === url.origin;
}

export async function readLocalTables(): Promise<LocalTables> {
  return JSON.parse(await readFile(filename, "utf8"));
}

export function mutateLocalTables<T>(mutate: (tables: LocalTables) => T): Promise<T> {
  const operation = pending.then(async () => {
    const tables = await readLocalTables();
    const result = mutate(tables);
    const temporary = `${filename}.tmp`;
    await writeFile(temporary, JSON.stringify(tables, null, 2));
    await rename(temporary, filename);
    return result;
  });
  pending = operation.catch(() => undefined);
  return operation;
}

export function localAssetPath(parts: string[]) {
  if (parts.some(part => !part || part === "." || part === ".." || /[\\:\0]/.test(part))) throw new Error("Chemin invalide");
  return path.join(process.cwd(), ".local-preview/assets", ...parts);
}

export async function writeLocalAsset(parts: string[], bytes: ArrayBuffer) {
  const target = localAssetPath(parts);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(bytes));
}
