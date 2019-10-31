// copy-paste these line into browser console
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
    console.log(`Removed ${removedCount} duplicate. ${links.length - removedCount} bookmarks left.`);
    console.log("Please save this file.");
} else {
    console.log("No duplicate found.");
}
