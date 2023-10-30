let bibleStructure = {
    "Genesis":{"1":31,"2":25,"3":24,"4":26,"5":32,"6":22,"7":24,"8":22,"9":29,"10":32,"11":32,"12":20,"13":18,"14":24,"15":21,"16":16,"17":27,"18":33,"19":38,"20":18,"21":34,"22":24,"23":20,"24":67,"25":34,"26":35,"27":46,"28":22,"29":35,"30":43,"31":54,"32":33,"33":20,"34":31,"35":29,"36":43,"37":36,"38":30,"39":23,"40":23,"41":57,"42":38,"43":34,"44":34,"45":28,"46":34,"47":31,"48":22,"49":33,"50":26},"Exodus":{"1":22,"2":25,"3":22,"4":31,"5":23,"6":30,"7":29,"8":28,"9":35,"10":29,"11":10,"12":51,"13":22,"14":31,"15":27,"16":36,"17":16,"18":27,"19":25,"20":23,"21":37,"22":30,"23":33,"24":18,"25":40,"26":37,"27":21,"28":43,"29":46,"30":38,"31":18,"32":35,"33":23,"34":35,"35":35,"36":38,"37":29,"38":31,"39":43,"40":38},"Leviticus":{"1":17,"2":16,"3":17,"4":35,"5":26,"6":23,"7":38,"8":36,"9":24,"10":20,"11":47,"12":8,"13":59,"14":57,"15":33,"16":34,"17":16,"18":30,"19":37,"20":27,"21":24,"22":33,"23":44,"24":23,"25":55,"26":46,"27":34},"Numbers":{"1":54,"2":34,"3":51,"4":49,"5":31,"6":27,"7":89,"8":26,"9":23,"10":36,"11":35,"12":16,"13":33,"14":45,"15":41,"16":35,"17":28,"18":32,"19":22,"20":29,"21":35,"22":41,"23":30,"24":25,"25":19,"26":65,"27":23,"28":31,"29":39,"30":17,"31":54,"32":42,"33":56,"34":29,"35":34,"36":13},"Deuteronomy":{"1":46,"2":37,"3":29,"4":49,"5":30,"6":25,"7":26,"8":20,"9":29,"10":22,"11":32,"12":31,"13":19,"14":29,"15":23,"16":22,"17":20,"18":22,"19":21,"20":20,"21":23,"22":29,"23":26,"24":22,"25":19,"26":19,"27":26,"28":69,"29":28,"30":20,"31":30,"32":52,"33":29,"34":12},"Joshua":{"1":18,"2":24,"3":17,"4":24,"5":15,"6":27,"7":26,"8":35,"9":27,"10":43,"11":23,"12":24,"13":33,"14":15,"15":63,"16":10,"17":18,"18":28,"19":51,"20":9,"21":45,"22":34,"23":16,"24":33},"Judges":{"1":36,"2":23,"3":31,"4":24,"5":31,"6":40,"7":25,"8":35,"9":57,"10":18,"11":40,"12":15,"13":25,"14":20,"15":20,"16":31,"17":13,"18":31,"19":30,"20":48,"21":25},"I Samuel":{"1":28,"2":36,"3":21,"4":22,"5":12,"6":21,"7":17,"8":22,"9":27,"10":27,"11":15,"12":25,"13":23,"14":52,"15":35,"16":23,"17":58,"18":30,"19":24,"20":42,"21":16,"22":23,"23":28,"24":23,"25":44,"26":25,"27":12,"28":25,"29":11,"30":31,"31":13},"II Samuel":{"1":27,"2":32,"3":39,"4":12,"5":25,"6":23,"7":29,"8":18,"9":13,"10":19,"11":27,"12":31,"13":39,"14":33,"15":37,"16":23,"17":29,"18":32,"19":44,"20":26,"21":22,"22":51,"23":39,"24":25},"I Kings":{"1":53,"2":46,"3":28,"4":20,"5":32,"6":38,"7":51,"8":66,"9":28,"10":29,"11":43,"12":33,"13":34,"14":31,"15":34,"16":34,"17":24,"18":46,"19":21,"20":43,"21":29,"22":54},"II Kings":{"1":18,"2":25,"3":27,"4":44,"5":27,"6":33,"7":20,"8":29,"9":37,"10":36,"11":20,"12":22,"13":25,"14":29,"15":38,"16":20,"17":41,"18":37,"19":37,"20":21,"21":26,"22":20,"23":37,"24":20,"25":30},"Isaiah":{"1":31,"2":22,"3":26,"4":6,"5":30,"6":13,"7":25,"8":23,"9":20,"10":34,"11":16,"12":6,"13":22,"14":32,"15":9,"16":14,"17":14,"18":7,"19":25,"20":6,"21":17,"22":25,"23":18,"24":23,"25":12,"26":21,"27":13,"28":29,"29":24,"30":33,"31":9,"32":20,"33":24,"34":17,"35":10,"36":22,"37":38,"38":22,"39":8,"40":31,"41":29,"42":25,"43":28,"44":28,"45":25,"46":13,"47":15,"48":22,"49":26,"50":11,"51":23,"52":15,"53":12,"54":17,"55":13,"56":12,"57":21,"58":14,"59":21,"60":22,"61":11,"62":12,"63":19,"64":11,"65":25,"66":24},"Jeremiah":{"1":19,"2":37,"3":25,"4":31,"5":31,"6":30,"7":34,"8":23,"9":25,"10":25,"11":23,"12":17,"13":27,"14":22,"15":21,"16":21,"17":27,"18":23,"19":15,"20":18,"21":14,"22":30,"23":40,"24":10,"25":38,"26":24,"27":22,"28":17,"29":32,"30":24,"31":40,"32":44,"33":26,"34":22,"35":19,"36":32,"37":21,"38":28,"39":18,"40":16,"41":18,"42":22,"43":13,"44":30,"45":5,"46":28,"47":7,"48":47,"49":39,"50":46,"51":64,"52":34},"Ezekiel":{"1":28,"2":10,"3":27,"4":17,"5":17,"6":14,"7":27,"8":18,"9":11,"10":22,"11":25,"12":28,"13":23,"14":23,"15":8,"16":63,"17":24,"18":32,"19":14,"20":44,"21":37,"22":31,"23":49,"24":27,"25":17,"26":21,"27":36,"28":26,"29":21,"30":26,"31":18,"32":32,"33":33,"34":31,"35":15,"36":38,"37":28,"38":23,"39":29,"40":49,"41":26,"42":20,"43":27,"44":31,"45":25,"46":24,"47":23,"48":35},"Hosea":{"1":9,"2":25,"3":5,"4":19,"5":15,"6":11,"7":16,"8":14,"9":17,"10":15,"11":11,"12":15,"13":15,"14":10},"Joel":{"1":20,"2":27,"3":5,"4":21},"Amos":{"1":15,"2":16,"3":15,"4":13,"5":27,"6":14,"7":17,"8":14,"9":15},"Obadiah":{"1":21},"Jonah":{"1":16,"2":11,"3":10,"4":11},"Micah":{"1":16,"2":13,"3":12,"4":14,"5":14,"6":16,"7":20},"Nahum":{"1":14,"2":14,"3":19},"Habakkuk":{"1":17,"2":20,"3":19},"Zephaniah":{"1":18,"2":15,"3":20},"Haggai":{"1":15,"2":23},"Zechariah":{"1":17,"2":17,"3":10,"4":14,"5":11,"6":15,"7":14,"8":23,"9":17,"10":12,"11":17,"12":14,"13":9,"14":21},"Malachi":{"1":14,"2":17,"3":24},"Psalms":{"1":6,"2":12,"3":9,"4":9,"5":13,"6":11,"7":18,"8":10,"9":21,"10":18,"11":7,"12":9,"13":6,"14":7,"15":5,"16":11,"17":15,"18":51,"19":15,"20":10,"21":14,"22":32,"23":6,"24":10,"25":22,"26":12,"27":14,"28":9,"29":11,"30":13,"31":25,"32":11,"33":22,"34":23,"35":28,"36":13,"37":40,"38":23,"39":14,"40":18,"41":14,"42":12,"43":5,"44":27,"45":18,"46":12,"47":10,"48":15,"49":21,"50":23,"51":21,"52":11,"53":7,"54":9,"55":24,"56":14,"57":12,"58":12,"59":18,"60":14,"61":9,"62":13,"63":12,"64":11,"65":14,"66":20,"67":8,"68":36,"69":37,"70":6,"71":24,"72":20,"73":28,"74":23,"75":11,"76":13,"77":21,"78":72,"79":13,"80":20,"81":17,"82":8,"83":19,"84":13,"85":14,"86":17,"87":7,"88":19,"89":53,"90":17,"91":16,"92":16,"93":5,"94":23,"95":11,"96":13,"97":12,"98":9,"99":9,"100":5,"101":8,"102":29,"103":22,"104":35,"105":45,"106":48,"107":43,"108":14,"109":31,"110":7,"111":10,"112":10,"113":9,"114":8,"115":18,"116":19,"117":2,"118":29,"119":176,"120":7,"121":8,"122":9,"123":4,"124":8,"125":5,"126":6,"127":5,"128":6,"129":8,"130":8,"131":3,"132":18,"133":3,"134":3,"135":21,"136":26,"137":9,"138":8,"139":24,"140":14,"141":10,"142":8,"143":12,"144":15,"145":21,"146":10,"147":20,"148":14,"149":9,"150":6},"Proverbs":{"1":33,"2":22,"3":35,"4":27,"5":23,"6":35,"7":27,"8":36,"9":18,"10":32,"11":31,"12":28,"13":25,"14":35,"15":33,"16":33,"17":28,"18":24,"19":29,"20":30,"21":31,"22":29,"23":35,"24":34,"25":28,"26":28,"27":27,"28":28,"29":27,"30":33,"31":31},"Job":{"1":22,"2":13,"3":26,"4":21,"5":27,"6":30,"7":21,"8":22,"9":35,"10":22,"11":20,"12":25,"13":28,"14":22,"15":35,"16":22,"17":16,"18":21,"19":29,"20":29,"21":34,"22":30,"23":17,"24":25,"25":6,"26":14,"27":23,"28":28,"29":25,"30":31,"31":40,"32":22,"33":33,"34":37,"35":16,"36":33,"37":24,"38":41,"39":30,"40":32,"41":26,"42":17},"Song of Songs":{"1":17,"2":17,"3":11,"4":16,"5":16,"6":12,"7":14,"8":14},"Ruth":{"1":22,"2":23,"3":18,"4":22},"Lamentations":{"1":22,"2":22,"3":66,"4":22,"5":22},"Ecclesiastes":{"1":18,"2":26,"3":22,"4":17,"5":19,"6":12,"7":29,"8":17,"9":18,"10":20,"11":10,"12":14},"Esther":{"1":22,"2":23,"3":15,"4":17,"5":14,"6":14,"7":10,"8":17,"9":32,"10":3},"Daniel":{"1":21,"2":49,"3":33,"4":34,"5":30,"6":29,"7":28,"8":27,"9":27,"10":21,"11":45,"12":13},"Ezra":{"1":11,"2":70,"3":13,"4":24,"5":17,"6":22,"7":28,"8":36,"9":15,"10":44},"Nehemiah":{"1":11,"2":20,"3":38,"4":17,"5":19,"6":19,"7":72,"8":18,"9":37,"10":40,"11":36,"12":47,"13":31},"I Chronicles":{"1":54,"2":55,"3":24,"4":43,"5":41,"6":66,"7":40,"8":40,"9":44,"10":14,"11":47,"12":41,"13":14,"14":17,"15":29,"16":43,"17":27,"18":17,"19":19,"20":8,"21":30,"22":19,"23":32,"24":31,"25":31,"26":32,"27":34,"28":21,"29":30},"II Chronicles":{"1":18,"2":17,"3":17,"4":22,"5":14,"6":42,"7":22,"8":18,"9":31,"10":19,"11":23,"12":16,"13":23,"14":14,"15":19,"16":14,"17":19,"18":34,"19":11,"20":37,"21":20,"22":12,"23":21,"24":27,"25":28,"26":23,"27":9,"28":27,"29":36,"30":27,"31":21,"32":33,"33":25,"34":33,"35":27,"36":23}
  };
  
let correctWords = [];
let fullVerse = '';  
let blankNumber = 0; 
let memorizedTexts = JSON.parse(localStorage.getItem('memorizedTexts') || '[]');
let answersChecked = false;  // Add this flag outside your function to keep track of whether answers have been checked
let originalAnswers = [];
let shouldStoreOriginals = true; // global flag to control whether to store original answers
let gameStarted = false;
let toggleModeActive = false;

// Populate the book dropdown
const bookSelect = document.getElementById('book-select');
for (const book in bibleStructure) {
    const option = document.createElement('option');
    option.value = book;
    option.text = book;
    bookSelect.appendChild(option);
}

// Update text input when a book is selected
function updateBookSelection() {
    const selectedBook = document.getElementById('book-select').value;
    if (selectedBook) {
        const firstChapter = "1";
        const lastChapter = Object.keys(bibleStructure[selectedBook]).pop();
        const firstVerse = "1";
        const lastVerse = bibleStructure[selectedBook][lastChapter];
        const textReference = `${selectedBook} ${firstChapter}:${firstVerse}-${lastChapter}:${lastVerse}`;
        document.getElementById('text-input').value = textReference;
    }
}
  async function fetchText() {
    let textInput = document.getElementById('text-input').value;
    const isVerseLevel = textInput.includes(":");
    let [book, chapter, verseRange] = textInput.split(/[ :]/);  
    let verseStart, verseEnd;
    if (verseRange && verseRange.includes('-')) {
        [verseStart, verseEnd] = verseRange.split('-').map(Number);
    } else {
        verseStart = verseEnd = Number(verseRange);
    }

    if (!bibleStructure[book] || !bibleStructure[book][chapter]) {
        alert('Invalid reference. Please check and try again.');
        return;
    }

    textInput = textInput.replace(/\s+/g, '_').replace(/:/g, '.');
    const url = isVerseLevel ? 
        `https://www.sefaria.org/api/texts/${textInput}?context=0` : 
        `https://www.sefaria.org/api/texts/${textInput}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    let verseReferences = [];
    if (Array.isArray(data.he)) {
        const verseData = data.he.flat();
        if (isVerseLevel) {
            verseReferences = Array.from(
                {length: verseEnd - verseStart + 1}, 
                (_, index) => verseStart + index
            );
        }
        return { text: verseData.join(' '), verseReferences };
    } else {
        let chapterEndMark = ' --End of Chapter-- ';
        let chapterText = data.he + chapterEndMark;
        return { text: chapterText, verseReferences: [parseInt(textInput.split('.')[1] || 1)] };
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
    toggleFullVerse();  // Call toggle function to update the UI after fetching
}

// Function to toggle the visibility of 'full-verse-container'
function toggleFullVerse() {
    const fullVerseContainer = document.getElementById('full-verse-container');
    const checkbox = document.getElementById('toggle-verse');
    if (checkbox.checked) {
        if (fullVerse) {
            fullVerseContainer.style.display = 'block';
            fullVerseContainer.innerText = fullVerse;
        } else {
            fetchFullVerse();
        }
    } else {
        fullVerseContainer.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize memorizedTexts from localStorage

    // Display memorized texts
    displayMemorizedTexts();

    // Your checkbox logic here
    const checkbox = document.getElementById('toggle-verse');
    if (checkbox) {
        checkbox.addEventListener('change', toggleFullVerse);
    }
});

function displayMemorizedTexts() {
    const memorizedList = document.getElementById('memorized-list');
    memorizedList.innerHTML = '';
    memorizedTexts.forEach(text => {
        const listItem = document.createElement('li');
        listItem.textContent = text;
        memorizedList.appendChild(listItem);
    });
}


function stripHebrew(text) {
    const removeVowels = document.getElementById('toggle-vowels').checked;
    if (!removeVowels) {
        return text;  // Return the text as is if the checkbox is not checked
    }

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

// New function to update the total number of blanks
        function updateTotalBlanks() {
            const blankElements = document.querySelectorAll('.blank');  // Updated to use .blank
            const totalBlanks = blankElements.length;
            document.getElementById('blank-count').innerText = totalBlanks;
}




        // Function to start the game
        function startGame() {
            // Set the game states
            gameStarted = true;
            answersChecked = false;
        
            // Reset the blank counter
            blankNumber = 0;
        
            // Fetch the text
            fetchText().then(data => {
                let gameContent = '';
                correctWords = [];
                let verses = splitVerses(data.text);
                let [book, chapter, verseRange] = document.getElementById('text-input').value.split(/[ :]/);
                let verseStart, verseEnd;
        
                if (verseRange) {
                    if (verseRange.includes('-') || verseRange.includes('–')) {
                        [verseStart, verseEnd] = verseRange.split(/[-–]/).map(Number);
                    } else {
                        verseStart = verseEnd = Number(verseRange);
                    }
                } else {
                    verseStart = 1;
                    verseEnd = bibleStructure[book][Number(chapter)];
                }
        
                let currentChapter = Number(chapter);
                let currentVerse = verseStart;
        
                verses.forEach((verse, verseIndex) => {
                    if (currentVerse > bibleStructure[book][currentChapter]) {
                        currentChapter += 1;
                        currentVerse = 1;
                    }
        
                    gameContent += `<div><strong>${currentChapter}:${currentVerse}</strong> `;
                    const quizVerse = verse.replace(/\s*{[ספ]}\s*/g, '');
                    const strippedVerse = stripHebrew(quizVerse);
                    const words = strippedVerse.split(' ');
                    const blankInterval = getBlankInterval();
        
                    if (blankInterval === 1) {
                        words.forEach(word => {
                            blankNumber++;
                            gameContent += `<input type="text" class="blank" data-index="${blankNumber}" /> `;
                            correctWords.push(word);
                        });
                    } else {
                        const totalBlanks = Math.min(words.length, Math.floor(words.length / blankInterval));
                        const isBlanked = Array(words.length).fill(false);
                        for (let i = 0; i < totalBlanks; i++) {
                            let index;
                            do {
                                index = Math.floor(Math.random() * words.length);
                            } while (isBlanked[index]);
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
                    gameContent += '</div><br>';
                    currentVerse += 1;
                });
        
                // Update the game container
                document.getElementById('game-container').innerHTML = gameContent;
        
                // Clear the blanks
                const blanks = document.querySelectorAll('.blank');
                blanks.forEach(blank => {
                    blank.value = '';
                    blank.disabled = false;
                    blank.style.backgroundColor = '';
                    blank.style.color = '';
                });
        
                // Clear previous comparison content and score
                document.getElementById('comparison-container').innerHTML = '';
                document.getElementById('score').innerText = '';
        
                // Reset the answersChecked flag
                answersChecked = false;
        
                // Update total blanks and fetch full verse
                updateTotalBlanks();
                fetchFullVerse();
        
            }).catch(error => {
                console.error('Error fetching text:', error);
            });
        
            // Enable the "Check Answers" button when the game starts
            document.getElementById('check-answers').disabled = false;
        }
        
        







function stripVowels(str) {
    return str.replace(/[\u0591-\u05C7]/g, '');
}

function isAcceptableAnswer(userAnswer, correctAnswer) {
    const substitutions = {
        'אלהים': ['אלקים', 'א', 'א–להים'],
        'יהוה': ['ה׳', 'יה', 'ה']
    };

    const cleanedCorrectAnswer = stripHtmlTags(correctAnswer);
    const strippedCorrectAnswer = stripVowels(cleanedCorrectAnswer);

    return userAnswer === strippedCorrectAnswer || 
           (substitutions[strippedCorrectAnswer] && substitutions[strippedCorrectAnswer].includes(userAnswer));
}


function logUnicode(str) {
    let unicodeString = '';
    for (let i = 0; i < str.length; i++) {
        unicodeString += str.charCodeAt(i) + ' ';
    }
    return unicodeString.trim();
}

// Function to remove HTML tags from a string
function stripHtmlTags(input) {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
}

// Function to check if the user's answer is an acceptable substitute for the correct answer
let displayInBlanks = true;

// Main function to check answers
// Utility function to remove HTML tags from a string
function stripHtml(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
}

function checkAnswers() {

    if ((gameStarted && !answersChecked) || toggleModeActive) {
        answersChecked = true;
    
    const blanks = document.querySelectorAll('.blank');
    let score = 0;
    let blankIndex = 0;
    let comparisonContent = '';

    // Clear previous comparison content
    document.getElementById('comparison-container').innerHTML = '';

    if (!correctWords || correctWords.length === 0) {
        console.error('correctWords array is empty');
        alert('An error occurred. Please reload the game.');
        return;
    }

    if (shouldStoreOriginals) {
        originalAnswers = []; // Reset only if the flag is true
    }

    blanks.forEach(blank => {
        const userAnswer = stripVowels(blank.value.trim());

        if (shouldStoreOriginals) {
            originalAnswers.push(blank.value);  // Store the original answer only if the flag is true
        }
        blank.setAttribute('dir', 'ltr');  // Set text direction to LTR
        const blankNumber = blankIndex + 1;
        const correctAnswer = correctWords[blankIndex];
        const sanitizedCorrectAnswer = stripHtml(correctAnswer);

        let resultText = `Blank #${blankNumber} - ${isAcceptableAnswer(userAnswer, correctAnswer) ? 'Correct' : 'Incorrect'}: Your Answer: ${blank.value}, Correct Answer: ${sanitizedCorrectAnswer}`;

        if (displayInBlanks) {
            blank.value = resultText;
            blank.style.backgroundColor = isAcceptableAnswer(userAnswer, correctAnswer) ? 'green' : 'red';
            blank.style.color = 'white';
            score += isAcceptableAnswer(userAnswer, correctAnswer) ? 1 : 0;
        } else {
            const color = isAcceptableAnswer(userAnswer, correctAnswer) ? 'green' : 'red';
            comparisonContent += `<p style="color: ${color}">${resultText}</p>`;
            blank.value = `Blank #${blankNumber}`;
            score += isAcceptableAnswer(userAnswer, correctAnswer) ? 1 : 0;
        }

        blank.disabled = true;
        blankIndex++;
    });

    document.getElementById('score').innerText = `Score: ${score} out of ${blanks.length}`;

    if (!displayInBlanks) {
        document.getElementById('comparison-container').innerHTML = comparisonContent;
    }

    toggleFullVerse();

    if (score === blanks.length) {
        const textInput = document.getElementById('text-input').value;
        if (!memorizedTexts.includes(textInput)) {
            memorizedTexts.push(textInput);
            localStorage.setItem('memorizedTexts', JSON.stringify(memorizedTexts));
            displayMemorizedTexts();
        }
    }

} else if (!gameStarted) {
    alert("Please start the game first.");
} else if (answersChecked) {
    alert("You've already checked the answers.");
}
}

function toggleDisplayMode() {
    toggleModeActive = true; // Activate toggle mode flag
    // Flip the display flag
    displayInBlanks = !displayInBlanks;

    // Re-enable all blanks and clear previous results
    const blanks = document.querySelectorAll('.blank');
    blanks.forEach((blank, index) => {
        blank.setAttribute('dir', 'ltr');  // Set text direction to LTR        
        blank.disabled = false;
        blank.style.backgroundColor = '';
        blank.style.color = '';
        blank.value = originalAnswers[index] || '';  // Restore original answers
    });
    
    // Clear comparison container and score
    document.getElementById('comparison-container').innerHTML = '';
    document.getElementById('score').innerText = '';

    checkAnswers();
    
    toggleModeActive = false; // Deactivate toggle mode flag
}


// Attach event listener to toggle display mode
document.getElementById('toggle-display').addEventListener('click', toggleDisplayMode);

// Attach event listener to check answers
document.getElementById('check-answers').addEventListener('click', checkAnswers);

document.addEventListener('DOMContentLoaded', function() {
    displayMemorizedTexts();
});

// Attach event listener to check answers
document.getElementById('check-answers').addEventListener('click', checkAnswers);


document.addEventListener('DOMContentLoaded', function() {
    displayMemorizedTexts();
});

// Event listener for checkbox
document.addEventListener('DOMContentLoaded', (event) => {
    // Function to toggle the visibility of 'full-verse-container'
    function toggleFullVerse() {
        const fullVerseContainer = document.getElementById('full-verse-container');
        const checkbox = document.getElementById('toggle-verse');
        if (checkbox.checked) {
            if (fullVerse) {
                fullVerseContainer.style.display = 'block';
                fullVerseContainer.innerText = fullVerse;
            } else {
                fetchFullVerse().then(() => {
                    fullVerseContainer.style.display = 'block';
                    fullVerseContainer.innerText = fullVerse;
                });
            }
        } else {
            fullVerseContainer.style.display = 'none';
        }
    }

    // Add event listener to the checkbox
    const checkbox = document.getElementById('toggle-verse');
    if (checkbox) {
        checkbox.addEventListener('change', toggleFullVerse);
    }
});





