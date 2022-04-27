import fs from "fs";

export function readFile(path) {
  const file = fs.readFileSync(path);
  return JSON.parse(file.toString());
}
