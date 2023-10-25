let correctWords = [];
let fullVerse = '';  // Global variable to hold the full verse
let blankNumber = 0;  // Global variable to keep track of the blank number

async function fetchText() {
    const parshaSelect = document.getElementById('parsha-select');
    const selectedParsha = parshaSelect.options[parshaSelect.selectedIndex].text;
    const aliyahSelect = document.getElementById('aliyah-select');
    const selectedAliyah = aliyahSelect.selectedIndex;  // Get the index of the selected Aliyah
    const url = `https://www.hebcal.com/leyning?cfg=json&start=2023-10-21&end=2023-10-28`;
    const response = await fetch(url);
    const data = await response.json();
    const parshaData = data.items.find(item => item.name.en === selectedParsha);
    
    if (!parshaData || !parshaData.fullkriyah) {
        throw new Error(`Parsha ${selectedParsha} not found or no full kriyah data available.`);
    }
    
    const aliyahData = parshaData.fullkriyah[selectedAliyah] || parshaData.fullkriyah;
    const textReference = `${aliyahData.k} ${aliyahData.b}-${aliyahData.e}`;
    return fetchVerseText(textReference);
}

async function fetchVerseText(textReference) {
    const formattedReference = textReference.replace(/\s+/g, '_').replace(/:/g, '.');
    const url = `https://www.sefaria.org/api/texts/${formattedReference}?context=0`;
    const response = await fetch(url);
    const data = await response.json();

    if (Array.isArray(data.he)) {
        return data.he.flat().join(' ');  // Flatten the array and join into a single string
    } else {
        return data.he;  // Return the string as is
    }
}

async function fetchFullVerse() {
    const text = await fetchText();
    fullVerse = stripHtml(text);  // Strip HTML tags from full verse
    console.log('Full verse fetched:', fullVerse);  // Debugging line
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
