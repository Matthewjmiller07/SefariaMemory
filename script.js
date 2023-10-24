let correctWords = [];

async function fetchText() {
    const textInput = document.getElementById('text-input').value.replace(/\s+/g, '.');
    const response = await fetch(`https://www.sefaria.org/api/texts/${textInput}?context=0`);
    const data = await response.json();
    console.log(data);  // Continue logging the data to the console for debugging
    return data.he;  // Removed the .join(' ') method call
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
