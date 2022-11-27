#!/usr/bin/env zx

// "Builds" all the API specs that are present in src/apiSpecs
// directory by copying them into the dist/ directory. Maintains
// the directory structure relative to the src root so the API
// specs are in the same relative locations also in the dist/.

const specsDir = "apiSpecs";

const srcDir = path.join(__dirname, "../src");
const apiSpecsSrcDir = path.join(srcDir, specsDir);
const outputBaseDir = path.join(__dirname, "../dist");

const apiSpecFiles = await fs.readdir(apiSpecsSrcDir);

for (const specFile of apiSpecFiles) {
  const { name } = path.parse(specFile);

  console.info(`Building API spec ${name}`);

  const outDir = path.join(outputBaseDir, name, specsDir);
  const outFile = path.join(outDir, specFile);
  const inFile = path.join(apiSpecsSrcDir, specFile);

  await fs.copy(inFile, outFile);
}

if (argv.watch) {
  $`chokidar 'src/apiSpecs/*' -c 'zx ${__filename}'`;
}
