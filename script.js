let correctWords = [];
let fullVerse = '';  // Global variable to hold the full verse
let blankNumber = 0;  // Global variable to keep track of the blank number

async function fetchText() {
    let textInput = document.getElementById('text-input').value;
    const isVerseLevel = textInput.includes(":");
    textInput = textInput.replace(/\s+/g, '_').replace(/:/g, '.');
    const url = isVerseLevel ? 
        `https://www.sefaria.org/api/texts/${textInput}?context=0` : 
        `https://www.sefaria.org/api/texts/${textInput}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);  // Continue logging the data to the console for debugging

    let verseReferences = [];
    if (Array.isArray(data.he)) {
        const verseData = data.he.flat();
        if (isVerseLevel) {
            const startingVerseNumber = parseInt(textInput.split('.')[1]);
            verseReferences = verseData.map((_, index) => startingVerseNumber + index);
        }
        return { text: verseData.join(' '), verseReferences };
    } else {
        return { text: data.he, verseReferences: [parseInt(textInput.split('.')[1] || 1)] };
    }
}

function stripHtml(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
}

async function fetchFullVerse() {
    let textInput = document.getElementById('text-input').value;
    textInput = textInput.replace(/\s+/g, '_').replace(/:/g, '.');
    const response = await fetch(`https://www.sefaria.org/api/texts/${textInput}?context=0`);
    const data = await response.json();
    if (Array.isArray(data.he)) {
        if (Array.isArray(data.he[0])) {
            // If data.he is an array of arrays, flatten it first
            fullVerse = data.he.flat().join(' ');
        } else {
            // If data.he is a flat array, join it directly
            fullVerse = data.he.join(' ');
        }
    } else {
        // If data.he is not an array, use it directly
        fullVerse = data.he;
    }
    fullVerse = stripHtml(fullVerse);  // Strip HTML tags from full verse
    console.log('Full verse fetched:', fullVerse);  // Debugging line
}

function stripHebrew(text) {
    // Regular expression to match Hebrew vowels, cantillation marks, and other diacritics
    const regex = /[\u0591-\u05BD\u05BF-\u05C5\u05C7]/g;

    // Replace these characters with an empty string
    const strippedText = text.replace(regex, '');

    // Replace any instance of multiple spaces with a single space
    const normalizedText = strippedText.replace(/\s+/g, ' ');

    return normalizedText;
}

function getBlankInterval() {
    const difficulty = document.getElementById('difficulty').value;
    switch (difficulty) {
        case 'easy':
            return 7;
        case 'medium':
            return 5;
        case 'hard':
            return 3;
        case 'memorize':
            return 1;  // Every word will be a blank in memorize mode
        default:
            return 5;
    }
}

function splitVerses(text) {
    const verses = [];
    // Create a regex pattern to identify the end of a verse
    const verseEndPattern = /׃(?: {ס}| {פ}|)/g;
    let match;
    let lastIndex = 0;
    while (match = verseEndPattern.exec(text)) {
        // Extract the verse based on the indices of the match
        const verse = text.slice(lastIndex, match.index).trim();
        if (verse) {
            verses.push(verse);
        }
        // Update lastIndex to start from the character after the matched pattern
        lastIndex = verseEndPattern.lastIndex;
    }
    return verses;
}






function startGame() {
    blankNumber = 0;  // Reset the blank number at the start of each game
    fetchText().then(data => {
        let gameContent = '';
        correctWords = [];

        // Split the text into verses based on the verse-ending sequences
        let verses = splitVerses(data.text);
        let verseReferences = data.verseReferences;  // Ensure this data is correctly populated

        verses.forEach((verse, verseIndex) => {
            // Use the actual biblical verse number
            const biblicalVerseNumber = verseReferences[verseIndex];

            // Display the biblical verse number at the beginning of each verse
            gameContent += `<div><strong>${biblicalVerseNumber}</strong> `;

            // Remove {ס} and {פ} symbols from the verse for the quiz display
            const quizVerse = verse.replace(/\s*{[ספ]}\s*/g, '');

            const strippedVerse = stripHebrew(quizVerse);
            const words = strippedVerse.split(' ');

            const blankInterval = getBlankInterval();  // Get the blank interval based on difficulty

            if (blankInterval === 1) {
                // In 'memorize' mode, blank out every word
                words.forEach(word => {
                    blankNumber++;
                    gameContent += `<input type="text" class="blank" data-index="${blankNumber}" /> `;
                    correctWords.push(word);
                });
            } else {
                // In other modes, apply the existing logic to decide whether to blank out a word
                const totalBlanks = Math.min(words.length, Math.floor(words.length / blankInterval));
                const isBlanked = Array(words.length).fill(false);
                for (let i = 0; i < totalBlanks; i++) {
                    let index;
                    do {
                        index = Math.floor(Math.random() * words.length);
                    } while (isBlanked[index] && words.length > totalBlanks);
                    isBlanked[index] = true;
                }
                words.forEach((word, index) => {
                    if (isBlanked[index]) {
                        blankNumber++;
                        gameContent += `<input type="text" class="blank" data-index="${blankNumber}" /> `;
                        correctWords.push(word);
                    } else {
                        gameContent += word + ' ';
                    }
                });
            }

            gameContent += '</div>';  // Close the div for this verse
        });

        document.getElementById('game-container').innerHTML = gameContent;
        fetchFullVerse();  // Fetch the full verse when starting the game
    }).catch(error => {
        console.error('Error fetching text:', error);
    });
}








function checkAnswers() {
    const blanks = document.querySelectorAll('.blank');
    let score = 0;
    let blankIndex = 0;
    let comparisonContent = '';
    blanks.forEach(blank => {
        const blankNumber = blankIndex + 1;
        if (blank.value === correctWords[blankIndex]) {
            score++;
            comparisonContent += `<p style="color: green">Blank #${blankNumber} - Correct: Your Answer: ${blank.value}, Correct Answer: ${correctWords[blankIndex]}</p>`;
        } else {
            comparisonContent += `<p style="color: red">Blank #${blankNumber} - Incorrect: Your Answer: ${blank.value}, Correct Answer: ${correctWords[blankIndex]}</p>`;
        }
        blank.value = `Blank #${blankNumber}`;  // Set the value to show the blank number
        blank.disabled = true;  // Optionally disable the input to prevent further changes
        blankIndex++;
    });
    document.getElementById('score').innerText = `Score: ${score} out of ${blanks.length}`;
    document.getElementById('comparison-container').innerHTML = comparisonContent;
    document.getElementById('full-verse-container').innerText = fullVerse;
}
