let correctWords = [];

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
