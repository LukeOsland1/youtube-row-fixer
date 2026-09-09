const { readFile, mkdir } = require("fs/promises");
const { directory } = require("./modules/config");
const fsExists = require("fs.promises.exists");
const AdmZip = require("adm-zip");

const run = async () => {
  const isZipExists = await fsExists("zip");

  if (!isZipExists) {
    await mkdir("zip");
    console.log("Create zip folder");
  }

  for (const browser of ["Chrome", "Firefox"]) {
    const manifest = await readFile(
      `extension/manifest-${browser.toLowerCase()}.json`
    );
    const { version } = JSON.parse(manifest);
    const zip = new AdmZip();
    zip.addLocalFolder(directory);
    // Replace the manifest only inside this archive, preserving the local build.
    zip.addFile("manifest.json", manifest);
    zip.writeZip(`zip/${browser} v${version}.zip`);
    console.log(`🚀 ${browser} extension was built`);
  }
};

run();
