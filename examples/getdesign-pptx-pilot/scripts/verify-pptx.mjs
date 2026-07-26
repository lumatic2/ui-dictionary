import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const file = path.resolve("output/askewly-design-intro.pptx");
if (!fs.existsSync(file)) throw new Error(`PPTX not found: ${file}`);

const archive = execFileSync("unzip", ["-Z1", file], { encoding: "utf8" });
const slides = archive.split("\n").filter((entry) => /^ppt\/slides\/slide\d+\.xml$/.test(entry));
if (slides.length !== 6) throw new Error(`Expected six native slides, found ${slides.length}`);

const firstSlide = execFileSync("unzip", ["-p", file, "ppt/slides/slide1.xml"], { encoding: "utf8" });
if (!firstSlide.includes("<a:t>")) throw new Error("Slide 1 has no editable text runs");
if (!firstSlide.includes("<p:sp>")) throw new Error("Slide 1 has no editable shape objects");
const mediaFiles = archive.split("\n").filter((entry) => /^ppt\/media\/[^/]+$/.test(entry));
if (mediaFiles.length > 0) throw new Error("Pilot PPTX must not use flattened slide images");

console.log(JSON.stringify({ file, slides: slides.length, nativeText: true, nativeShapes: true, flattenedImages: false }, null, 2));
