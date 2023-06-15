import fs from "node:fs";
import path from "node:path";

import { getDestinyPath, createWorker } from "./utils.mjs";

const THREAD_COUNT = 4;

const directoryPaths = [
  path.join("C:/Users/Marcos/OneDrive/Escritorio"),
  path.join("C:/Users/Marcos/Downloads"),
];
const destinyPath = await getDestinyPath();

const musicFilesPath = directoryPaths
  .map((directoryPath) => {
    return fs
      .readdirSync(directoryPath)
      .filter((file) => {
        return file.endsWith(".mp3") || file.endsWith(".mp4");
      })
      .map((file) => {
        return path.join(directoryPath, file);
      });
  })
  .flat();

const musicDir = `${destinyPath}/Music`;

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
