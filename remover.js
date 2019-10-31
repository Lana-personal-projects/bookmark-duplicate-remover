"use strict";

const {resolve} = require("path");
const {promisify} = require("util");
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);
// The commandline-arguments start from process.argv[2].
// The process.argv[0] is node executable path while [1] is current js file path.
const path = resolve(process.argv.slice(2).join(" "));

(async () => {
    console.log("Processing...");
    if (await isFile(path)) {
        const data = await readFile(path, "utf8");
        const dataChunks = data.split("\r\n");
        const bookmarks = getBookmarks(dataChunks);
        console.log(`Found ${bookmarks.length} bookmarks...`);
        let removedCount = 0;
        for (let i = 0; i < bookmarks.length; i++) {
            const currentBookmark = bookmarks[i];
            for (let j = i + 1; j < bookmarks.length; j++) {
                const bookmark = bookmarks[j];
                if (currentBookmark.href === bookmark.href) {
                    dataChunks[currentBookmark.index] = "";
                    removedCount++;
                    console.log(`Removed duplicate ${currentBookmark.index}:${bookmark.index} ${currentBookmark.href}`);
                    break;
                }
            }
        }
        const final = dataChunks.filter(val => val).join("\r\n");
        console.log("Writing changes to file...");
        await writeFile(path, final);
        console.log(`Removed ${removedCount} duplicate. ${bookmarks.length - removedCount} bookmarks left.`);
    } else {
        console.log("Invalid file!");
    }
})();

async function isFile(path) {
    return fs.existsSync(path) && (await stat(path)).isFile();
}

function getBookmarks(array) {
    return array
        .map((str, index) => {
            return {href: getHref(str), index}
        })
        .filter(bookmark => bookmark.href);
}

function getHref(str) {
    if (str.includes("HREF=")) {
        return str.match(/(?<=HREF=").*?(?=")/)[0];
    }
    return "";
}
