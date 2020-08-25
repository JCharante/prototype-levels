import { addSpanAroundSubstring, Marker, getOffsetSplits } from "./util";

const sourceString = `one two three four`;
const heightMap = [];
for (let i = 0; i < sourceString.length; i++) {
    heightMap.push(0);
}
const keys = ["one", "two", "three", "four", "five", "six", "one two three", "two three", "three four"];



const markers: Marker[] = [];

for (let key of keys.sort((a, b) => a.length > b.length ? -1 : (a.length < b.length ? 1 : 0))) {
    let i = 0;
    while (i < sourceString.length) {
        const index = sourceString.toLowerCase().indexOf(key, i);
        if (index != -1) {
            const startIndex = index;
            const endIndex = index + key.length - 1; // this is the last codepoint included in the match
            let validStart = false;
            let validEnd = false;
            // valid start
            if (startIndex === 0 // substring is at start of document
                || sourceString[startIndex - 1] === " " // substring has whitespace before it
                || sourceString[startIndex - 1] === "\n"
                || sourceString[startIndex - 1] === "\t"
            ) {
                validStart = true;
            }
            // valid end
            if (endIndex === (sourceString.length - 1) // next character is end of file
                || [",", ".", ";", ":", "!", "?", "]", "[", "|", "%", "$", "@", "&", ")", "(", "/", " "].includes(sourceString[endIndex + 1]) // next character is punctionation or whitespace
            ) {
                validEnd = true;
            }
            if (validStart && validEnd) {
                markers.push({
                    start: startIndex,
                    end: endIndex,
                });
            }
            i = endIndex + 1;
        } else {
            break;
        }
    }
}

const markersSortedByLengthDescending = markers;
const markersSortedByStartingPoint = markers.sort((a, b) => {
    if (a.start > b.start) {
        return 1;
    } else if (b.start > a.start) {
        return -1;
    } else {
        if ((a.end - a.start) > (b.end - b.start)) {
            return -1;
        } else if ((b.end - b.start) > (a.end - a.start)) {
            return 1;
        } else {
            return 0;
        }
    }
});

// for (let marker of markersSortedByLengthDescending) {
//     for (let i = marker.start; i < marker.end + 1; i++) {
//         heightMap[i] += 1;
//     }
//}

let modifiedString = sourceString.slice();

let offsetArray: Array<number> = [];
for (let i = 0; i < sourceString.length; i++) {
    offsetArray.push(0);
}

for (let marker of markersSortedByStartingPoint) {
    // const underlineLevel = heightMap[marker.start] + 1;
    const underlineLevel = Math.max(...heightMap.slice(marker.start, marker.end + 1)) + 1;
    /**
    const startOffset = offsetArray[marker.start];
    const endOffset = offsetArray[marker.end + 1];
    modifiedString = modifiedString.slice(0, marker.start + startOffset) +
        startSpan + modifiedString.slice(marker.start + startOffset, marker.end + 1 + endOffset) + endSpan
        + modifiedString.slice(marker.end + 1 + endOffset);

     */

    const splits: Marker[] = getOffsetSplits(offsetArray, marker.start, marker.end);
    for (let subMarker of splits) {
        [modifiedString, offsetArray] = addSpanAroundSubstring(modifiedString, subMarker.start, subMarker.end, underlineLevel, offsetArray, sourceString);
    }

    // Updates height map
    for (let i = marker.start; i < marker.end + 1; i++) {
         heightMap[i] += 1;
    }
    continue;
}
