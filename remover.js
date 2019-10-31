"use strict";

const {JSDOM} = require("jsdom");
const {resolve} = require("path");
const {writeFile} = require("fs");

// The commandline-arguments start from process.argv[2].
// The process.argv[0] is node executable path while [1] is current js file path.
const path = resolve(process.argv.slice(2).join(" "));

console.log("Processing...");
JSDOM
    .fromFile(path)
    .then(bookmarksFile => {
        const document = bookmarksFile.window.document;
        const links = [...document.querySelectorAll("a")];
        console.log(`Found ${links.length} bookmarks...`);
        let removedCount = 0;
        for (let i = 0; i < links.length; i++) {
            const currentElement = links[i];
            for (let j = i + 1; j < links.length; j++) {
                const element = links[j];
                if (currentElement.href === element.href) {
                    currentElement.parentElement.remove();
                    removedCount++;
                    console.log(`Removed duplicate ${i}:${j} ${currentElement}`);
                    break;
                }
            }
        }
        if (removedCount > 0) {
            console.log("Writing changes to file...");
            writeFile(path, bookmarksFile.serialize(), () => {
                console.log(`Removed ${removedCount} duplicate. ${links.length - removedCount} bookmarks left.`);
            });
        } else {
            console.log("No duplicate found.")
        }
    })
    .catch((err) => console.log(err));

