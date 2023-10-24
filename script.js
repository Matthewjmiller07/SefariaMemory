let correctWords = [];
let fullVerse = '';  // Global variable to hold the full verse

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
            // Adjusted to handle verse ranges
            const verseData = data.he.flat();  // Flatten the array
            return verseData.join(' ');  // Join array of strings into a single string for verse-level query
        } else {
            return data.he.flat().join(' ');  // Flatten the array and join into a single string for chapter-level query
        }
    } else {
        return data.he;  // Return the string as is
    }
}

async function fetchFullVerse() {
    let textInput = document.getElementById('text-input').value;
    textInput = textInput.replace(/\s+/g, '_').replace(/:/g, '.');
    const response = await fetch(`https://www.sefaria.org/api/texts/${textInput}?context=0`);
    const data = await response.json();
    fullVerse = data.he.join(' ');  // Store the full verse for later use
}

function stripHebrew(text) {
    return text.replace(/[\u0591-\u05C7]/g, '');  // Stripping vowels and cantillation
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
    fetchText().then(text => {
        const strippedText = stripHebrew(text);
        const words = strippedText.split(' ');
        let gameContent = '';
        correctWords = [];
        const blankInterval = getBlankInterval();  // Get the blank interval based on difficulty
        words.forEach((word, index) => {
            if ((index + 1) % blankInterval === 0) {
                gameContent += `<input type="text" class="blank" data-index="${index}" placeholder="${index + 1}" /> `;
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
            comparisonContent += `<p>Blank #${blankNumber} - Correct: Your Answer: ${blank.value}, Correct Answer: ${correctWords[blankIndex]}</p>`;
        } else {
            comparisonContent += `<p>Blank #${blankNumber} - Incorrect: Your Answer: ${blank.value}, Correct Answer: ${correctWords[blankIndex]}</p>`;
        }
        blank.setAttribute('placeholder', `Blank #${blankNumber}`);  // Set the placeholder to show the blank number
        blank.disabled = true;  // Optionally disable the input to prevent further changes
        blankIndex++;
    });
    document.getElementById('score').innerText = `Score: ${score} out of ${blanks.length}`;
    document.getElementById('comparison-container').innerHTML = comparisonContent;
    document.getElementById('full-verse-container').innerText = fullVerse;
}

