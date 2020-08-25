export function addSpanAroundSubstring(string: string, substringStartInclusive: number, substringEndInclusive: number, level: number, offSetArray: number[], sourceString: string): [string, number[]] {
    const startSpan = `<span class="ul-${level}">`;
    const endSpan = `</span>`
    const startOffset = offSetArray[substringStartInclusive];
    const endOffset = offSetArray[substringEndInclusive];
    const sectionA = string.slice(0, substringStartInclusive + startOffset)
    const sectionB = startSpan + string.slice(substringStartInclusive + startOffset, substringEndInclusive + endOffset + 1) + endSpan;
    const sectionC = string.slice(substringEndInclusive + endOffset + 1);
    string =  sectionA + sectionB + sectionC;
    // Update the offset map
    for (let i = substringStartInclusive; i < sourceString.length; i++) {
        offSetArray[i] += startSpan.length;
    }
    for (let i = substringEndInclusive + 1; i < sourceString.length; i++) {
        offSetArray[i] += endSpan.length;
    }
    return [string, offSetArray]
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}


function testAddSpanAroundSubstring1() {
    console.log("Test 1");
    const expectedModifiedString = `<span class="ul-1">one two three</span> four`;
    const expectedOffsetArray = [19, 19, 19, 19, 19,
    19, 19, 19, 19, 19,
    19, 19, 19, 26, 26,
    26, 26, 26];
    const [returnedModifiedString, returnedOffsetArray] = addSpanAroundSubstring("one two three four", 0, 12, 1, [0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0], "one two three four");
    if (expectedModifiedString !== returnedModifiedString) {
        console.log("Expected");
        console.log(expectedModifiedString);
        console.log("Got");
        console.log(returnedModifiedString);
    }
    if (!arrayEquals(expectedOffsetArray, returnedOffsetArray)) {
        console.log("Expected");
        console.log(expectedOffsetArray);
        console.log("Got");
        console.log(returnedOffsetArray);
    }
}


function testAddSpanAroundSubstring2() {
    console.log("Test 2");
    const expectedModifiedString = `<span class="ul-1">one two <span class="ul-2">three</span></span> four`;
    const expectedOffsetArray = [19, 19, 19, 19, 19,
    19, 19, 19, 38, 38,
    38, 38, 38, 52, 52,
    52, 52, 52];
    const [returnedModifiedString, returnedOffsetArray] = addSpanAroundSubstring(`<span class="ul-1">one two three</span> four`, 8, 12, 2, [19, 19, 19, 19, 19,
        19, 19, 19, 19, 19,
        19, 19, 19, 26, 26,
        26, 26, 26], "one two three four");
    if (expectedModifiedString !== returnedModifiedString) {
        console.log("Expected");
        console.log(expectedModifiedString);
        console.log("Got");
        console.log(returnedModifiedString);
    }
    if (!arrayEquals(expectedOffsetArray, returnedOffsetArray)) {
        console.log("Expected");
        console.log(expectedOffsetArray);
        console.log("Got");
        console.log(returnedOffsetArray);
    }
}


function testAddSpanAroundSubstring3() {
    console.log("Test 3");
    const expectedModifiedString = `<span class="ul-1">one two <span class="ul-2">three</span></span><span class="ul-2"> four</span>`;
    const expectedOffsetArray = [19, 19, 19, 19, 19,
    19, 19, 19, 38, 38,
    38, 38, 38, 71, 71,
    71, 71, 71];
    const [returnedModifiedString, returnedOffsetArray] = addSpanAroundSubstring(`<span class="ul-1">one two <span class="ul-2">three</span></span> four`, 13, 17, 2, [19, 19, 19, 19, 19,
        19, 19, 19, 38, 38,
        38, 38, 38, 52, 52,
        52, 52, 52], "one two three four");
    if (expectedModifiedString !== returnedModifiedString) {
        console.log("Expected");
        console.log(expectedModifiedString);
        console.log("Got");
        console.log(returnedModifiedString);
    }
    if (!arrayEquals(expectedOffsetArray, returnedOffsetArray)) {
        console.log("Expected");
        console.log(expectedOffsetArray);
        console.log("Got");
        console.log(returnedOffsetArray);
    }
}

export interface Marker {
    start: number;
    end: number;
}

export function getOffsetSplits(offSetArray, substringStartInclusive, substringEndInclusive): Marker[] {
    const ret: Marker[] = [];
    let i = substringStartInclusive;
    let currentStart = i;
    let currentOffset = offSetArray[i];
    while (i < substringEndInclusive) {
        if (currentOffset !== offSetArray[i]) {
            ret.push({ start: currentStart, end: i - 1 });
            currentStart = i;
            currentOffset = offSetArray[i];
        }
        i++;
    }
    ret.push({ start: currentStart, end: i}); // TODO: might be off by one here
    return ret;
}

function testGetOffsetSplits1() {
    console.log("Splits Test 1");
    const offsetArray = [0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0];
    const expectedMarkers = [{
        start: 0,
        end: 12
    }]
    const returnedMarkers = getOffsetSplits(offsetArray, 0, 12);
    let equals = true;
    if (expectedMarkers.length !== returnedMarkers.length) {
        equals = false;
    } else {
        let i = 0;
        while (i < expectedMarkers.length) {
            if (expectedMarkers[i].start !== returnedMarkers[i].start || expectedMarkers[i].end !== returnedMarkers[i].end) {
                equals = false;
                break;
            }
            i += 1;
        }
    }
    if (!equals) {
        console.log("Expected");
        console.log(expectedMarkers);
        console.log("Got");
        console.log(returnedMarkers);
    }
}

function testGetOffsetSplits2() {
    console.log("Splits Test 2");
    const offsetArray = [19, 19, 19, 19, 19,
        19, 19, 19, 19, 19,
        19, 19, 19, 26, 26,
        26, 26, 26];
    const expectedMarkers = [{
        start: 8,
        end: 12
    }, {
        start: 13,
        end: 17
    }]
    const returnedMarkers = getOffsetSplits(offsetArray, 8, 17);
    let equals = true;
    if (expectedMarkers.length !== returnedMarkers.length) {
        equals = false;
    } else {
        let i = 0;
        while (i < expectedMarkers.length) {
            if (expectedMarkers[i].start !== returnedMarkers[i].start || expectedMarkers[i].end !== returnedMarkers[i].end) {
                equals = false;
                break;
            }
            i += 1;
        }
    }
    if (!equals) {
        console.log("Expected");
        console.log(expectedMarkers);
        console.log("Got");
        console.log(returnedMarkers);
    }
}

// testGetOffsetSplits1();
// testGetOffsetSplits2();

// testAddSpanAroundSubstring1();
// testAddSpanAroundSubstring2();
// testAddSpanAroundSubstring3();
