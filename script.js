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
    let comparisonContent = '';
    blanks.forEach((blank, index) => {
        const blankNumber = index + 1;
        blank.setAttribute('placeholder', `Blank #${blankNumber}`);  // Set the placeholder to show the blank number
        blank.disabled = true;  // Optionally disable the input to prevent further changes
        if (blank.value === correctWords[index]) {
            score++;
            comparisonContent += `<p style="color: green;">Blank #${blankNumber} - Correct: Your Answer: ${blank.value}, Correct Answer: ${correctWords[index]}</p>`;
        } else {
            comparisonContent += `<p style="color: red;">Blank #${blankNumber} - Incorrect: Your Answer: ${blank.value}, Correct Answer: ${correctWords[index]}</p>`;
        }
    });
    document.getElementById('score').innerText = `Score: ${score} out of ${blanks.length}`;
    document.getElementById('comparison-container').innerHTML = comparisonContent;
    document.getElementById('full-verse-container').innerText = fullVerse;
}