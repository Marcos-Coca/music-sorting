import fs from "node:fs";
import path from "node:path";

import { getDestinyPath, getDirectoryPath, createWorker } from "./utils.mjs";

const THREAD_COUNT = 4;

const directoryPath = await getDirectoryPath();
const destinyPath = await getDestinyPath();

const musicFiles = fs
  .readdirSync(directoryPath)
  .filter((file) => file.endsWith(".mp3") || file.endsWith(".mp4"));

const musicDir = `${destinyPath}/Music`;
const musicFilesPath = musicFiles.map((file) => path.join(directoryPath, file));

if (!fs.existsSync(musicDir)) {
  fs.mkdirSync(musicDir);
}

const workers = Array.from({ length: THREAD_COUNT }).map((_, index) => {
  console.log(`Creating worker ${index + 1}`);
  const start = index * (musicFilesPath.length / THREAD_COUNT);
  const end = (index + 1) * (musicFilesPath.length / THREAD_COUNT);
  const workerFiles = musicFilesPath.slice(start, end);
  return createWorker(musicDir, workerFiles);
});

await Promise.all(workers);

console.log("All workers finished");
