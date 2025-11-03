import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let envPath = path.resolve(__dirname, "../../.env");

if (!fs.existsSync(envPath)) {
  envPath = path.resolve(__dirname, "../../../.env");
}

config({ path: envPath });
