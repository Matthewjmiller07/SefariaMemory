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

    if (Array.isArray(data.he)) {
        if (isVerseLevel) {
            const verseData = data.he.flat();  // Flatten the array
            return verseData.join(' ');  // Join array of strings into a single string for verse-level query
        } else {
            return data.he.flat().join(' ');  // Flatten the array and join into a single string for chapter-level query
        }
    } else {
        return data.he;  // Return the string as is
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
        default:
            return 5;
    }
}

function startGame() {
    blankNumber = 0;  // Reset the blank number at the start of each game
    fetchText().then(text => {
        const strippedText = stripHebrew(text);
        const words = strippedText.split(' ');
        let gameContent = '';
        correctWords = [];
        const blankInterval = getBlankInterval();  // Get the blank interval based on difficulty
        words.forEach((word, index) => {
            if ((index + 1) % blankInterval === 0) {
                blankNumber++;  // Increment the blank number
                gameContent += `<input type="text" class="blank" data-index="${index}" /> `;
                correctWords.push(word);
            } else {
                gameContent += word + ' ';
            }
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
