let correctWords = [];

async function fetchText() {
    let textInput = document.getElementById('text-input').value;
    // Determine if input is chapter-level or verse-level
    const isChapterLevel = !textInput.includes(":");
    // Replace whitespace with underscores and colons with periods
    textInput = textInput.replace(/\s+/g, '_').replace(/:/g, '.');
    // If chapter-level, append '.1' to the textInput to fetch the first verse
    textInput = isChapterLevel ? `${textInput}.1` : textInput;
    const response = await fetch(`https://www.sefaria.org/api/texts/${textInput}`);
    const data = await response.json();
    console.log(data);

    // Check if the 'he' field is an array (chapter/range) or a string (specific verse)
    if (Array.isArray(data.he)) {
        return data.he.join(' ');  // Join array of strings into a single string
    } else {
        return data.he;  // Return the string as is
    }
}

function stripHebrew(text) {
    return text.replace(/[\u0591-\u05C7]/g, '');  // Stripping vowels and cantillation
}

function startGame() {
    fetchText().then(text => {
        const strippedText = stripHebrew(text);
        const words = strippedText.split(' ');
        let gameContent = '';
        correctWords = [];
        words.forEach((word, index) => {
            if ((index + 1) % 5 === 0) {
                gameContent += `<input type="text" class="blank" data-index="${index}" /> `;
                correctWords.push(word);
            } else {
                gameContent += word + ' ';
            }
        });
        document.getElementById('game-container').innerHTML = gameContent;
    }).catch(error => {
        console.error('Error fetching text:', error);
    });
}

function checkAnswers() {
    const blanks = document.querySelectorAll('.blank');
    let score = 0;
    blanks.forEach(blank => {
        const index = blank.getAttribute('data-index');
        if (blank.value === correctWords[index / 5]) {
            score++;
        }
    });
    document.getElementById('score').innerText = 'Score: ' + score;
}
