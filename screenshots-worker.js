import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import screenshot from "screenshot-desktop";

import { parentPort } from "node:worker_threads";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const interval = setInterval(() => {
  screenshot({ format: "png" }).then((img) => {
    const now = Date.now();
    const picturePath = path.join(
      __dirname,
      "screenshots",
      `screenshot-${now}.png`
    );
    fs.writeFileSync(picturePath, img);
    console.log("Screenshot saved to", picturePath);
  });
}, 500);

parentPort.on("message", (message) => {
  if (message === "exit") {
    clearInterval(interval);
    parentPort.close();
  }
});
