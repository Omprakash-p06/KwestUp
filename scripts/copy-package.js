const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');

const minimalPackage = {
  name: packageJson.name,
  version: packageJson.version,
  main: "electron.js",
  description: packageJson.description || "",
  author: packageJson.author || "",
  dependencies: packageJson.dependencies
};

if (!fs.existsSync(path.join(__dirname, '../build'))) {
  fs.mkdirSync(path.join(__dirname, '../build'));
}

// Copy electron directory to build directory
const electronSrc = path.join(__dirname, '../electron');
const electronDest = path.join(__dirname, '../build/electron');

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

if (fs.existsSync(electronSrc)) {
  copyDirectory(electronSrc, electronDest);
  console.log('Copied electron directory to build directory');
}

// Create electron.js entry point in build directory
const electronEntryContent = `require('./electron/main.js');`;
fs.writeFileSync(
  path.join(__dirname, '../build/electron.js'),
  electronEntryContent
);
console.log('Created electron.js entry point in build directory');

fs.writeFileSync(
  path.join(__dirname, '../build/package.json'),
  JSON.stringify(minimalPackage, null, 2)
);

console.log('Created minimal package.json in build directory');