const path = require("path");
const fs = require("fs");
const os = require("os");
const EventEmitter = require("events");
const zlib = require("zlib");
const { pipeline } = require("stream");

// 1. Log the current file path and directory
function showCurrentPath() {
  console.log({ File: __filename, Dir: __dirname });
}

showCurrentPath();

// 2. Return the file name from a path
function getFileName(filePath) {
  return path.basename(filePath);
}

console.log(getFileName("/user/files/report.pdf"));

// 3. Build a path from an object
function buildPath(pathObject) {
  return path.format(pathObject);
}

console.log(buildPath({ dir: "/folder", name: "app", ext: ".js" }));

// 4. Return the file extension
function getExtension(filePath) {
  return path.extname(filePath);
}

console.log(getExtension("/docs/readme.md"));

// 5. Parse a path and return its name and extension
function getNameAndExtension(filePath) {
  const { name, ext } = path.parse(filePath);
  return { Name: name, Ext: ext };
}

console.log(getNameAndExtension("/home/app/main.js"));

// 6. Check whether a path is absolute
function isAbsolutePath(filePath) {
  return path.isAbsolute(filePath);
}

console.log(isAbsolutePath("/home/user/file.txt"));

// 7. Join multiple path segments
function joinSegments(...segments) {
  return path.join(...segments);
}

console.log(joinSegments("src", "components", "App.js"));

// 8. Resolve a relative path to an absolute path
function resolvePath(relativePath) {
  return path.resolve(relativePath);
}

console.log(resolvePath("./index.js"));

// 9. Join two paths
function joinTwoPaths(firstPath, secondPath) {
  return path.join(firstPath, secondPath);
}

console.log(joinTwoPaths("/folder1", "folder2/file.txt"));

// 10. Delete a file asynchronously
function deleteFile(filePath) {
  fs.unlink(filePath, (error) => {
    if (error) {
      console.error("Error deleting file:", error.message);
      return;
    }

    console.log(`The ${path.basename(filePath)} is deleted.`);
  });
}

// 11. Create a folder synchronously
function createFolder(folderPath) {
  fs.mkdirSync(folderPath, { recursive: true });
  return "Success";
}

// 12. Listen for a "start" event
const startEmitter = new EventEmitter();

startEmitter.on("start", () => {
  console.log("Welcome event triggered!");
});

startEmitter.emit("start");

// 13. Emit a "login" event with a username
const loginEmitter = new EventEmitter();

loginEmitter.on("login", (username) => {
  console.log(`User logged in: ${username}`);
});

loginEmitter.emit("login", "Ahmed");

// 14. Read a file synchronously
function readFileSync(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  console.log(content);
}

readFileSync(path.join(__dirname, "notes.txt"));

// 15. Write to a file asynchronously
function writeFileAsync(filePath, content) {
  fs.writeFile(filePath, content, (error) => {
    if (error) {
      console.error("Error writing file:", error.message);
      return;
    }

    console.log("File saved successfully");
  });
}

writeFileAsync(path.join(__dirname, "async.txt"), "Async save");

// 16. Check whether a directory exists
function directoryExists(directoryPath) {
  return (
    fs.existsSync(directoryPath) && fs.statSync(directoryPath).isDirectory()
  );
}

console.log(directoryExists(__dirname));

// 17. Return the OS platform and CPU architecture
function getSystemInfo() {
  return { Platform: os.platform(), Arch: os.arch() };
}

console.log(getSystemInfo());

// 18. Read a file using a readable stream
function readFileWithStream(filePath) {
  const readStream = fs.createReadStream(filePath, { encoding: "utf8" });

  readStream.on("data", (chunk) => console.log(chunk));
  readStream.on("error", (error) => {
    console.error("Error reading file:", error.message);
  });
}

readFileWithStream(path.join(__dirname, "big.txt"));

// 19. Copy a file using readable and writable streams
function copyFileWithStreams(source, destination) {
  const readStream = fs.createReadStream(source);
  const writeStream = fs.createWriteStream(destination);

  readStream.on("error", (error) => {
    console.error("Error reading source file:", error.message);
  });

  writeStream.on("error", (error) => {
    console.error("Error writing destination file:", error.message);
  });

  writeStream.on("finish", () => {
    console.log("File copied using streams");
  });

  readStream.pipe(writeStream);
}

copyFileWithStreams(
  path.join(__dirname, "source.txt"),
  path.join(__dirname, "dest.txt")
);

// 20. Read, compress, and write a file using pipeline
function compressFile(source, destination) {
  pipeline(
    fs.createReadStream(source),
    zlib.createGzip(),
    fs.createWriteStream(destination),
    (error) => {
      if (error) {
        console.error("Compression failed:", error.message);
        return;
      }

      console.log("File compressed successfully");
    }
  );
}

compressFile(
  path.join(__dirname, "data.txt"),
  path.join(__dirname, "data.txt.gz")
);
