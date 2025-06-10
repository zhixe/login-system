const fs = require("fs");

// 1. Parse latest version from CHANGELOG.md
const changelog = fs.readFileSync("CHANGELOG.md", "utf8");
const match = changelog.match(/^##\s*\[?([0-9]+\.[0-9]+\.[0-9]+)\]?/m);
if (!match) {
    console.error("Could not find version in CHANGELOG.md");
    process.exit(1);
}
const changelogVersion = match[1];

// 2. Update version in package.json if needed
const pkgPath = "package.json";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
if (pkg.version !== changelogVersion) {
    pkg.version = changelogVersion;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    console.log(`Updated package.json to version ${changelogVersion}`);
} else {
    console.log(`package.json already at version ${changelogVersion}`);
}

// 3. Update version in README.md
const readmePath = "README.md";
let readme = fs.readFileSync(readmePath, "utf8");

// Look for a line like: Current Version: x.x.x   (add/edit in your README)
const versionLineRegex = /^Current Version: .*/m;
if (versionLineRegex.test(readme)) {
    readme = readme.replace(versionLineRegex, `Current Version: ${changelogVersion}`);
    fs.writeFileSync(readmePath, readme);
    console.log(`Updated README.md to version ${changelogVersion}`);
} else {
    // If no line exists, you can insert it at the top (optional)
    readme = `Current Version: ${changelogVersion}\n${readme}`;
    fs.writeFileSync(readmePath, readme);
    console.log(`Inserted version line into README.md`);
}

// 4. Match version from src/frontend/sync-version.js to backend/version.go
const path = require("path");

const versionGoPath = path.join(__dirname, "..", "backend", "version.go");
const goVersionContents = `package main

var Version = "${changelogVersion}"
`;

fs.writeFileSync(versionGoPath, goVersionContents);
console.log(`Wrote backend/version.go with version ${changelogVersion}`);

// 5. Update version in backend/README.md
const backendReadmePath = path.join(__dirname, "..", "backend", "README.md");

if (fs.existsSync(backendReadmePath)) {
    let backendReadme = fs.readFileSync(backendReadmePath, "utf8");
    const versionLineRegex = /^Current Version: .*/m;
    if (versionLineRegex.test(backendReadme)) {
        backendReadme = backendReadme.replace(versionLineRegex, `Current Version: ${changelogVersion}`);
        fs.writeFileSync(backendReadmePath, backendReadme);
        console.log(`Updated backend/README.md to version ${changelogVersion}`);
    } else {
        backendReadme = `Current Version: ${changelogVersion}\n${backendReadme}`;
        fs.writeFileSync(backendReadmePath, backendReadme);
        console.log(`Inserted version line into backend/README.md`);
    }
} else {
    // Optionally, create a README.md with version line
    const contents = `# Backend\n\nCurrent Version: ${changelogVersion}\n`;
    fs.writeFileSync(backendReadmePath, contents);
    console.log(`Created backend/README.md with version ${changelogVersion}`);
}