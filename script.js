let correctWords = [];

async function fetchText() {
    let textInput = document.getElementById('text-input').value;
    const isRange = textInput.includes("-");
    textInput = textInput.replace(/\s+/g, '_').replace(/:/g, '.');
    const response = await fetch(`https://www.sefaria.org/api/texts/${textInput}`);
    const data = await response.json();
    console.log(data);

    if (Array.isArray(data.he)) {
        if (isRange) {
            // Flatten nested arrays for verse ranges
            const verseRangeText = data.he.map(verse => verse.join(' ')).join(' ');
            return verseRangeText;
        } else {
            // Join array of strings into a single string for chapter-level query
            return data.he.join(' '); 
        }
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
