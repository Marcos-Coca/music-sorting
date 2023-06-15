import path from "node:path";
import fs from "node:fs";

import { createInterface } from "node:readline";
import { Worker } from "node:worker_threads";

export function createWorker(musicDir, musicFilesPath) {
  return new Promise(function (resolve, reject) {
    const worker = new Worker("./worker.mjs", {
      workerData: { musicFilesPath, musicDir },
    });

    worker.on("message", () => {
      resolve();
    });

    worker.on("error", (error) => {
      reject(error);
    });
  });
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function getDestinyPath() {
  return new Promise((resolve, reject) => {
    rl.question("Ruta a donde se copiaran los archivos: ", (answer) => {
      const answerPath = path.join(answer);
      checkIfExist(answerPath);
      resolve(answerPath);
      rl.close();
    });
  });
}

function checkIfExist(path) {
  if (!fs.existsSync(path)) {
    console.log("Ruta no encontrada");
    process.exit(1);
  }
}
