import { workerData, parentPort } from "node:worker_threads";
import fs from "node:fs";
import { parseFile } from "music-metadata";
import path from "node:path";

const { musicDir, musicFilesPath } = workerData;

const musicFilesMetadata = [];

const promises = musicFilesPath.map(async (file) => {
  const { common } = await parseFile(file);
  common.year = common.year?.toString() || "Unknown";
  common.album = common.album || "Unknown";

  const destinyPath = path.join(musicDir, common.year, common.album);

  if (!fs.existsSync(destinyPath)) {
    fs.mkdirSync(destinyPath, { recursive: true });
  }

  console.log(`Copying ${file} to ${destinyPath}`);
  fs.copyFileSync(file, path.join(destinyPath, path.basename(file)));
});

await Promise.all(promises);

parentPort.postMessage(musicFilesMetadata);
