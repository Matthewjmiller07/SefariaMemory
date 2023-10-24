let correctWords = [];

async function fetchText() {
    let textInput = document.getElementById('text-input').value;
    const isRange = textInput.includes("-");  // Check if the input is a verse range
    const isChapter = !textInput.includes(":");  // Check if the input is a chapter
    textInput = textInput.replace(/\s+/g, '_').replace(/:/g, '.');
    let url = `https://www.sefaria.org/api/texts/${textInput}`;
    if (isChapter) {
        url += "?pad=0";  // Append query parameter to get the entire chapter
    } else {
        url += "?context=0";  // Append query parameter to get only the specific verse(s)
    }
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);  // Continue logging the data to the console for debugging

    // Adjusted the data processing to handle verse ranges
    if (Array.isArray(data.he)) {
        if (isRange) {
            // Flatten the nested array structure for verse ranges
            const verseData = data.he.flat(Infinity);  // Flatten all levels of nesting
            return verseData.join(' ');  // Join array of strings into a single string for verse-level query
        } else {
            return data.he.join(' ');  // Join array of strings into a single string for chapter-level query
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
