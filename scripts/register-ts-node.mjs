// scripts/register-ts-node.mjs
import { pathToFileURL } from "url";
import { register } from "module";

register("ts-node/esm", pathToFileURL("./"));
