#!/usr/bin/env zx

// Builds all the Lambda handlers that are present in src/handlers
// directory using esbuild. Maintains the directory structure relative
// to the src root so the API spec can be used

const srcDir = path.join(__dirname, "../src");
const handlersSrcDir = path.join(srcDir, "handlers");

const handlerFiles = await fs.readdir(handlersSrcDir);

const entryPoints = handlerFiles.map((f) => {
  const inFile = path.join(handlersSrcDir, f);
  const relativePath = path.relative(process.cwd(), inFile);

  return relativePath;
});

const flags = [
  "--bundle",
  "--minify",
  "--platform=node",
  "--target=node18",
  "--entry-names=[name]/[dir]/[name]",
  "--outbase=src",
  "--outdir=dist",
];

if (argv.watch) flags.push("--watch");

$`esbuild ${entryPoints} ${flags}`;
