let biblicalPlaces = [];

// Declare map globally
var map;

async function loadCsvData() {
    console.log("Loading CSV data...");
    try {
        const response = await fetch('biblical_places_output.csv'); // Make sure the CSV file path is correct
        const csvText = await response.text();
        Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: function(results) {
                biblicalPlaces = results.data;
                console.log("CSV Data loaded:", biblicalPlaces.length, "records");
            }
        });
    } catch (error) {
        console.error("Error loading CSV data:", error);
    }
}

// Function to parse the text reference or range
function parseReferenceRange(input) {
    const bookChapterVersePattern = /([\w\s]+)\s+(\d+):(\d+)(?:-(\d+):(\d+))?/;
    const bookChapterPattern = /([\w\s]+)\s+(\d+)(?::(\d+))?/;

    let match = input.match(bookChapterVersePattern);
    if (match) {
        return {
            book: match[1].trim(),
            chapterStart: parseInt(match[2], 10),
            verseStart: parseInt(match[3], 10),
            chapterEnd: match[4] ? parseInt(match[4], 10) : parseInt(match[2], 10),
            verseEnd: match[5] ? parseInt(match[5], 10) : parseInt(match[3], 10)
        };
    }

    match = input.match(bookChapterPattern);
    if (match) {
        return {
            book: match[1].trim(),
            chapterStart: parseInt(match[2], 10),
            verseStart: match[3] ? parseInt(match[3], 10) : 1,
            chapterEnd: parseInt(match[2], 10),
            verseEnd: 999 // A large number to cover the entire chapter
        };
    }

    return null;
}

// Function to check if a reference is within the query range
function isReferenceInRange(ref, query) {
    if (!ref || !query) return false;
    if (ref.book !== query.book) return false;

    if (ref.chapterStart > query.chapterEnd || ref.chapterEnd < query.chapterStart) {
        return false;
    }
    if (ref.chapterStart === query.chapterEnd && ref.verseStart > query.verseEnd) {
        return false;
    }
    if (ref.chapterEnd === query.chapterStart && ref.verseEnd < query.verseStart) {
        return false;
    }
    return true;
}

// Updated search function
function searchBiblicalReferences(query) {
    console.log("Query:", query);

    const parsedQuery = parseReferenceRange(query);
    if (!parsedQuery) {
        console.error("Invalid query format:", query);
        return [];
    }

    let searchResults = biblicalPlaces.filter(place => {
        let references = place['Biblical References'];
        console.log("Checking place:", place['Place Name'], "with references:", references);

        if (references) {
            return references.split(',').map(ref => parseReferenceRange(ref.trim())).some(ref => isReferenceInRange(ref, parsedQuery));
        }
        return false;
    });

    console.log("Search results:", searchResults);
    return searchResults;
}

function displayPlacesOnMap(places) {
    console.log("Displaying places on map:", places);

    if (typeof map.eachLayer === 'function') {
        // Clear existing markers and polygons
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker || layer instanceof L.Polygon) {
                map.removeLayer(layer);
            }
        });

        var markersGroup = L.featureGroup();
        var polygonsGroup = L.featureGroup();

        places.forEach(place => {
            if (place.Coordinates) {
                const coordPairs = place.Coordinates.split(' ');
                const latLngPairs = coordPairs.map(coordPair => {
                    const [lat, lng] = coordPair.split(',').map(Number);
                    return [lng, lat]; // Swap latitude and longitude if necessary
                });

                if (latLngPairs.length > 2) {
                    // If more than two coordinate pairs, plot as a polygon
                    console.log("Adding polygon for:", place['Place Name'], "with coordinates:", latLngPairs);
                    var polygon = L.polygon(latLngPairs, {color: 'blue'}).bindPopup(place['Place Name']);
                    polygonsGroup.addLayer(polygon);
                } else {
                    // Otherwise, plot as markers
                    latLngPairs.forEach(([lat, lng]) => {
                        console.log("Adding marker for:", place['Place Name'], "at coordinates:", [lat, lng]);
                        var marker = L.marker([lat, lng]).bindPopup(place['Place Name']);
                        markersGroup.addLayer(marker);
                    });
                }
            } else {
                console.error("No coordinates found for:", place);
            }
        });

        // Add the markers and polygons to the map
        markersGroup.addTo(map);
        polygonsGroup.addTo(map);

        // Fit the map bounds to markers and polygons with padding
        var allLayers = L.featureGroup([...markersGroup.getLayers(), ...polygonsGroup.getLayers()]);
        if (allLayers.getLayers().length > 0) {
            var bounds = allLayers.getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
            } else {
                console.error("Invalid bounds calculated for markers and polygons.");
            }
        } else {
            console.log("No markers or polygons added.");
        }
    } else {
        console.error('Map is not initialized correctly');
    }
}







document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    textInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            console.log("Enter key pressed. Initiating search...");
            let searchResults = searchBiblicalReferences(event.target.value);
            displayPlacesOnMap(searchResults);
        }
    });
});


function initializeMap() {
    // Check if the map has already been initialized
    if (map) {
        console.log("Resetting the map...");

        // Reset the map view to default coordinates and zoom level
        map.setView([34.056, -118.235], 13);

        // Remove all layers (markers, polygons, etc.) from the map
        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });

        // Re-add the tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    } else {
        console.log("Initializing new map...");

        // Initialize the map for the first time
        map = L.map('map').setView([34.056, -118.235], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    }

    console.log("Map ready.");
}


async function prepareCsvData() {
    console.log("Preparing CSV data...");
    await loadCsvData(); // Call the existing loadCsvData function
}










// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgS1ZUsvyMfQtsDSWsMlW46Hl18K8Dat0",
  authDomain: "memory-ef03e.firebaseapp.com",
  projectId: "memory-ef03e",
  storageBucket: "memory-ef03e.appspot.com",
  messagingSenderId: "1058426601446",
  appId: "1:1058426601446:web:2081f925933e7758cd2027",
  measurementId: "G-FSB2B3JM0M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to sign up new users
function signUp(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('User created:', userCredential.user);
    })
    .catch((error) => {
      console.error('Error signing up:', error.code, error.message);
    });
}

// Function to sign in existing users
// Function to sign in users and update the UI
function signIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User signed in
            console.log('User signed in:', userCredential.user);

            // Update the UI after sign in
            document.getElementById('user-email-display').textContent = `Welcome, ${userCredential.user.email}`;

            // Hide the login container and show the logout button
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('logout-button').style.display = 'block';
            
            // Fetch memorized texts and update the memorized texts list and visualization
            getMemorizedTexts(displayMemorizedTexts);
        })
        .catch((error) => {
            // Handle errors here
            console.error('Error signing in:', error.code, error.message);
            // Display error message to user
            document.getElementById('login-error').textContent = `Failed to sign in: ${error.message}`;
        });
}

// Event listener for the login form submission
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signIn(email, password); // Call the signIn function with the provided credentials
});


  

// Function to sign out the current user
// Function to sign out the user
function signOutUser() {
    signOut(auth).then(() => {
      console.log('User signed out');
      
      // Update the UI after sign out
      document.getElementById('user-email-display').textContent = 'You have been logged out.';
      
      // Show the login container and hide the logout button
      document.getElementById('login-container').style.display = 'block';
      document.getElementById('logout-button').style.display = 'none';
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  }
  
  // Event listener for the logout button
  document.getElementById('logout-button').addEventListener('click', signOutUser);


// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in:', user);
  } else {
    console.log('User is signed out');
  }
});


// Function to handle registration
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    signUp(email, password); // This calls your signUp function
});




  

// Example usage:
// signUp('user@example.com', 'password123');
// signIn('user@example.com', 'password123');
// addMemorizedText('This is a text to memorize.');
// getMemorizedTexts();
// signOutUser();


let bibleandMishnahStructure = {
    "Genesis":{"1":31,"2":25,"3":24,"4":26,"5":32,"6":22,"7":24,"8":22,"9":29,"10":32,"11":32,"12":20,"13":18,"14":24,"15":21,"16":16,"17":27,"18":33,"19":38,"20":18,"21":34,"22":24,"23":20,"24":67,"25":34,"26":35,"27":46,"28":22,"29":35,"30":43,"31":54,"32":33,"33":20,"34":31,"35":29,"36":43,"37":36,"38":30,"39":23,"40":23,"41":57,"42":38,"43":34,"44":34,"45":28,"46":34,"47":31,"48":22,"49":33,"50":26},"Exodus":{"1":22,"2":25,"3":22,"4":31,"5":23,"6":30,"7":29,"8":28,"9":35,"10":29,"11":10,"12":51,"13":22,"14":31,"15":27,"16":36,"17":16,"18":27,"19":25,"20":23,"21":37,"22":30,"23":33,"24":18,"25":40,"26":37,"27":21,"28":43,"29":46,"30":38,"31":18,"32":35,"33":23,"34":35,"35":35,"36":38,"37":29,"38":31,"39":43,"40":38},"Leviticus":{"1":17,"2":16,"3":17,"4":35,"5":26,"6":23,"7":38,"8":36,"9":24,"10":20,"11":47,"12":8,"13":59,"14":57,"15":33,"16":34,"17":16,"18":30,"19":37,"20":27,"21":24,"22":33,"23":44,"24":23,"25":55,"26":46,"27":34},"Numbers":{"1":54,"2":34,"3":51,"4":49,"5":31,"6":27,"7":89,"8":26,"9":23,"10":36,"11":35,"12":16,"13":33,"14":45,"15":41,"16":35,"17":28,"18":32,"19":22,"20":29,"21":35,"22":41,"23":30,"24":25,"25":19,"26":65,"27":23,"28":31,"29":39,"30":17,"31":54,"32":42,"33":56,"34":29,"35":34,"36":13},"Deuteronomy":{"1":46,"2":37,"3":29,"4":49,"5":30,"6":25,"7":26,"8":20,"9":29,"10":22,"11":32,"12":31,"13":19,"14":29,"15":23,"16":22,"17":20,"18":22,"19":21,"20":20,"21":23,"22":29,"23":26,"24":22,"25":19,"26":19,"27":26,"28":69,"29":28,"30":20,"31":30,"32":52,"33":29,"34":12},"Joshua":{"1":18,"2":24,"3":17,"4":24,"5":15,"6":27,"7":26,"8":35,"9":27,"10":43,"11":23,"12":24,"13":33,"14":15,"15":63,"16":10,"17":18,"18":28,"19":51,"20":9,"21":45,"22":34,"23":16,"24":33},"Judges":{"1":36,"2":23,"3":31,"4":24,"5":31,"6":40,"7":25,"8":35,"9":57,"10":18,"11":40,"12":15,"13":25,"14":20,"15":20,"16":31,"17":13,"18":31,"19":30,"20":48,"21":25},"I Samuel":{"1":28,"2":36,"3":21,"4":22,"5":12,"6":21,"7":17,"8":22,"9":27,"10":27,"11":15,"12":25,"13":23,"14":52,"15":35,"16":23,"17":58,"18":30,"19":24,"20":42,"21":16,"22":23,"23":28,"24":23,"25":44,"26":25,"27":12,"28":25,"29":11,"30":31,"31":13},"II Samuel":{"1":27,"2":32,"3":39,"4":12,"5":25,"6":23,"7":29,"8":18,"9":13,"10":19,"11":27,"12":31,"13":39,"14":33,"15":37,"16":23,"17":29,"18":32,"19":44,"20":26,"21":22,"22":51,"23":39,"24":25},"I Kings":{"1":53,"2":46,"3":28,"4":20,"5":32,"6":38,"7":51,"8":66,"9":28,"10":29,"11":43,"12":33,"13":34,"14":31,"15":34,"16":34,"17":24,"18":46,"19":21,"20":43,"21":29,"22":54},"II Kings":{"1":18,"2":25,"3":27,"4":44,"5":27,"6":33,"7":20,"8":29,"9":37,"10":36,"11":20,"12":22,"13":25,"14":29,"15":38,"16":20,"17":41,"18":37,"19":37,"20":21,"21":26,"22":20,"23":37,"24":20,"25":30},"Isaiah":{"1":31,"2":22,"3":26,"4":6,"5":30,"6":13,"7":25,"8":23,"9":20,"10":34,"11":16,"12":6,"13":22,"14":32,"15":9,"16":14,"17":14,"18":7,"19":25,"20":6,"21":17,"22":25,"23":18,"24":23,"25":12,"26":21,"27":13,"28":29,"29":24,"30":33,"31":9,"32":20,"33":24,"34":17,"35":10,"36":22,"37":38,"38":22,"39":8,"40":31,"41":29,"42":25,"43":28,"44":28,"45":25,"46":13,"47":15,"48":22,"49":26,"50":11,"51":23,"52":15,"53":12,"54":17,"55":13,"56":12,"57":21,"58":14,"59":21,"60":22,"61":11,"62":12,"63":19,"64":11,"65":25,"66":24},"Jeremiah":{"1":19,"2":37,"3":25,"4":31,"5":31,"6":30,"7":34,"8":23,"9":25,"10":25,"11":23,"12":17,"13":27,"14":22,"15":21,"16":21,"17":27,"18":23,"19":15,"20":18,"21":14,"22":30,"23":40,"24":10,"25":38,"26":24,"27":22,"28":17,"29":32,"30":24,"31":40,"32":44,"33":26,"34":22,"35":19,"36":32,"37":21,"38":28,"39":18,"40":16,"41":18,"42":22,"43":13,"44":30,"45":5,"46":28,"47":7,"48":47,"49":39,"50":46,"51":64,"52":34},"Ezekiel":{"1":28,"2":10,"3":27,"4":17,"5":17,"6":14,"7":27,"8":18,"9":11,"10":22,"11":25,"12":28,"13":23,"14":23,"15":8,"16":63,"17":24,"18":32,"19":14,"20":44,"21":37,"22":31,"23":49,"24":27,"25":17,"26":21,"27":36,"28":26,"29":21,"30":26,"31":18,"32":32,"33":33,"34":31,"35":15,"36":38,"37":28,"38":23,"39":29,"40":49,"41":26,"42":20,"43":27,"44":31,"45":25,"46":24,"47":23,"48":35},"Hosea":{"1":9,"2":25,"3":5,"4":19,"5":15,"6":11,"7":16,"8":14,"9":17,"10":15,"11":11,"12":15,"13":15,"14":10},"Joel":{"1":20,"2":27,"3":5,"4":21},"Amos":{"1":15,"2":16,"3":15,"4":13,"5":27,"6":14,"7":17,"8":14,"9":15},"Obadiah":{"1":21},"Jonah":{"1":16,"2":11,"3":10,"4":11},"Micah":{"1":16,"2":13,"3":12,"4":14,"5":14,"6":16,"7":20},"Nahum":{"1":14,"2":14,"3":19},"Habakkuk":{"1":17,"2":20,"3":19},"Zephaniah":{"1":18,"2":15,"3":20},"Haggai":{"1":15,"2":23},"Zechariah":{"1":17,"2":17,"3":10,"4":14,"5":11,"6":15,"7":14,"8":23,"9":17,"10":12,"11":17,"12":14,"13":9,"14":21},"Malachi":{"1":14,"2":17,"3":24},"Psalms":{"1":6,"2":12,"3":9,"4":9,"5":13,"6":11,"7":18,"8":10,"9":21,"10":18,"11":7,"12":9,"13":6,"14":7,"15":5,"16":11,"17":15,"18":51,"19":15,"20":10,"21":14,"22":32,"23":6,"24":10,"25":22,"26":12,"27":14,"28":9,"29":11,"30":13,"31":25,"32":11,"33":22,"34":23,"35":28,"36":13,"37":40,"38":23,"39":14,"40":18,"41":14,"42":12,"43":5,"44":27,"45":18,"46":12,"47":10,"48":15,"49":21,"50":23,"51":21,"52":11,"53":7,"54":9,"55":24,"56":14,"57":12,"58":12,"59":18,"60":14,"61":9,"62":13,"63":12,"64":11,"65":14,"66":20,"67":8,"68":36,"69":37,"70":6,"71":24,"72":20,"73":28,"74":23,"75":11,"76":13,"77":21,"78":72,"79":13,"80":20,"81":17,"82":8,"83":19,"84":13,"85":14,"86":17,"87":7,"88":19,"89":53,"90":17,"91":16,"92":16,"93":5,"94":23,"95":11,"96":13,"97":12,"98":9,"99":9,"100":5,"101":8,"102":29,"103":22,"104":35,"105":45,"106":48,"107":43,"108":14,"109":31,"110":7,"111":10,"112":10,"113":9,"114":8,"115":18,"116":19,"117":2,"118":29,"119":176,"120":7,"121":8,"122":9,"123":4,"124":8,"125":5,"126":6,"127":5,"128":6,"129":8,"130":8,"131":3,"132":18,"133":3,"134":3,"135":21,"136":26,"137":9,"138":8,"139":24,"140":14,"141":10,"142":8,"143":12,"144":15,"145":21,"146":10,"147":20,"148":14,"149":9,"150":6},"Proverbs":{"1":33,"2":22,"3":35,"4":27,"5":23,"6":35,"7":27,"8":36,"9":18,"10":32,"11":31,"12":28,"13":25,"14":35,"15":33,"16":33,"17":28,"18":24,"19":29,"20":30,"21":31,"22":29,"23":35,"24":34,"25":28,"26":28,"27":27,"28":28,"29":27,"30":33,"31":31},"Job":{"1":22,"2":13,"3":26,"4":21,"5":27,"6":30,"7":21,"8":22,"9":35,"10":22,"11":20,"12":25,"13":28,"14":22,"15":35,"16":22,"17":16,"18":21,"19":29,"20":29,"21":34,"22":30,"23":17,"24":25,"25":6,"26":14,"27":23,"28":28,"29":25,"30":31,"31":40,"32":22,"33":33,"34":37,"35":16,"36":33,"37":24,"38":41,"39":30,"40":32,"41":26,"42":17},"Song of Songs":{"1":17,"2":17,"3":11,"4":16,"5":16,"6":12,"7":14,"8":14},"Ruth":{"1":22,"2":23,"3":18,"4":22},"Lamentations":{"1":22,"2":22,"3":66,"4":22,"5":22},"Ecclesiastes":{"1":18,"2":26,"3":22,"4":17,"5":19,"6":12,"7":29,"8":17,"9":18,"10":20,"11":10,"12":14},"Esther":{"1":22,"2":23,"3":15,"4":17,"5":14,"6":14,"7":10,"8":17,"9":32,"10":3},"Daniel":{"1":21,"2":49,"3":33,"4":34,"5":30,"6":29,"7":28,"8":27,"9":27,"10":21,"11":45,"12":13},"Ezra":{"1":11,"2":70,"3":13,"4":24,"5":17,"6":22,"7":28,"8":36,"9":15,"10":44},"Nehemiah":{"1":11,"2":20,"3":38,"4":17,"5":19,"6":19,"7":72,"8":18,"9":37,"10":40,"11":36,"12":47,"13":31},"I Chronicles":{"1":54,"2":55,"3":24,"4":43,"5":41,"6":66,"7":40,"8":40,"9":44,"10":14,"11":47,"12":41,"13":14,"14":17,"15":29,"16":43,"17":27,"18":17,"19":19,"20":8,"21":30,"22":19,"23":32,"24":31,"25":31,"26":32,"27":34,"28":21,"29":30},"II Chronicles":{"1":18,"2":17,"3":17,"4":22,"5":14,"6":42,"7":22,"8":18,"9":31,"10":19,"11":23,"12":16,"13":23,"14":14,"15":19,"16":14,"17":19,"18":34,"19":11,"20":37,"21":20,"22":12,"23":21,"24":27,"25":28,"26":23,"27":9,"28":27,"29":36,"30":27,"31":21,"32":33,"33":25,"34":33,"35":27,"36":23},
  
    "Mishnah Berakhot": {
        "1": 5,
        "2": 8,
        "3": 6,
        "4": 7,
        "5": 5
    },
    "Mishnah Peah": {
        "1": 6,
        "2": 8,
        "3": 8,
        "4": 11,
        "5": 8,
        "6": 11
    },
    "Mishnah Demai": {
        "1": 4,
        "2": 5,
        "3": 6,
        "4": 7
    },
    "Mishnah Kilayim": {
        "1": 9,
        "2": 11,
        "3": 7,
        "4": 9,
        "5": 8,
        "6": 9,
        "7": 8,
        "8": 6,
        "9": 10
    },
    "Mishnah Sheviit": {
        "1": 8,
        "2": 10,
        "3": 10,
        "4": 10,
        "5": 9,
        "6": 6,
        "7": 7,
        "8": 11
    },
    "Mishnah Terumot": {
        "1": 10,
        "2": 6,
        "3": 9,
        "4": 13,
        "5": 9,
        "6": 6,
        "7": 7,
        "8": 12,
        "9": 7,
        "10": 12
    },
    "Mishnah Maasrot": {
        "1": 8,
        "2": 8,
        "3": 10,
        "4": 6,
        "5": 8
    },
    "Mishnah Maaser Sheni": {
        "1": 7,
        "2": 10,
        "3": 13,
        "4": 12,
        "5": 15
    },
    "Mishnah Challah": {
        "1": 9,
        "2": 8,
        "3": 10,
        "4": 11
    },
    "Mishnah Orlah": {
        "1": 9,
        "2": 17,
        "3": 9
    },
    "Mishnah Bikkurim": {
        "1": 11,
        "2": 11,
        "3": 12,
        "4": 5
    },
    "Mishnah Shabbat": {
        "1": 11,
        "2": 7,
        "3": 6,
        "4": 2,
        "5": 4,
        "6": 10,
        "7": 4,
        "8": 7,
        "9": 7,
        "10": 6,
        "11": 6
    },
    "Mishnah Eruvin": {
        "1": 10,
        "2": 6,
        "3": 9,
        "4": 11,
        "5": 9,
        "6": 10,
        "7": 11,
        "8": 11,
        "9": 4,
        "10": 15
    },
    "Mishnah Pesachim": {
        "1": 7,
        "2": 8,
        "3": 8,
        "4": 9,
        "5": 10,
        "6": 6,
        "7": 13
    },
    "Mishnah Shekalim": {
        "1": 7,
        "2": 5,
        "3": 4,
        "4": 9,
        "5": 6,
        "6": 6,
        "7": 7
    },
    "Mishnah Yoma": {
        "1": 8,
        "2": 7,
        "3": 11,
        "4": 6,
        "5": 7,
        "6": 8,
        "7": 5,
        "8": 9
    },
    "Mishnah Sukkah": {
        "1": 11,
        "2": 9,
        "3": 15,
        "4": 10,
        "5": 8
    },
    "Mishnah Beitzah": {
        "1": 10,
        "2": 10,
        "3": 8,
        "4": 7,
        "5": 7
    },
    "Mishnah Rosh Hashanah": {
        "1": 9,
        "2": 9,
        "3": 8,
        "4": 9
    },
    "Mishnah Taanit": {
        "1": 7,
        "2": 10,
        "3": 9,
        "4": 8
    },
    "Mishnah Megillah": {
        "1": 11,
        "2": 6,
        "3": 6,
        "4": 10
    },
    "Mishnah Moed Katan": {
        "1": 10,
        "2": 5,
        "3": 9
    },
    "Mishnah Chagigah": {
        "1": 8,
        "2": 7,
        "3": 8
    },
    "Mishnah Yevamot": {
        "1": 4,
        "2": 10,
        "3": 10,
        "4": 13
    },
    "Mishnah Ketubot": {
        "1": 10,
        "2": 10,
        "3": 9,
        "4": 12,
        "5": 9,
        "6": 7,
        "7": 10,
        "8": 8,
        "9": 9,
        "10": 6
    },
    "Mishnah Nedarim": {
        "1": 4,
        "2": 5,
        "3": 11,
        "4": 8
    },
    "Mishnah Nazir": {
        "1": 7,
        "2": 10,
        "3": 7,
        "4": 7,
        "5": 7,
        "6": 11,
        "7": 4
    },
    "Mishnah Sotah": {
        "1": 9,
        "2": 6,
        "3": 8,
        "4": 5,
        "5": 5,
        "6": 4,
        "7": 8,
        "8": 7,
        "9": 15
    },
    "Mishnah Gittin": {
        "1": 6,
        "2": 7,
        "3": 8,
        "4": 9,
        "5": 9,
        "6": 7
    },
    "Mishnah Kiddushin": {
        "1": 10,
        "2": 10,
        "3": 13,
        "4": 14
    },
    "Mishnah Bava Kamma": {
        "1": 4,
        "2": 6,
        "3": 11,
        "4": 9
    },
    "Mishnah Bava Metzia": {
        "1": 8,
        "2": 11,
        "3": 12,
        "4": 12,
        "5": 11,
        "6": 8,
        "7": 11,
        "8": 9
    },
    "Mishnah Bava Batra": {
        "1": 6,
        "2": 14,
        "3": 8,
        "4": 9,
        "5": 11,
        "6": 8
    },
    "Mishnah Sanhedrin": {
        "1": 6,
        "2": 5,
        "3": 8,
        "4": 5,
        "5": 5,
        "6": 6
    },
    "Mishnah Makkot": {
        "1": 10,
        "2": 8,
        "3": 16
    },
    "Mishnah Shevuot": {
        "1": 7,
        "2": 5,
        "3": 11,
        "4": 13,
        "5": 5,
        "6": 7,
        "7": 8
    },
    "Mishnah Eduyot": {
        "1": 14,
        "2": 10,
        "3": 12,
        "4": 12,
        "5": 7,
        "6": 3,
        "7": 9,
        "8": 7
    },
    "Mishnah Avodah Zarah": {
        "1": 9,
        "2": 7,
        "3": 10,
        "4": 12,
        "5": 12
    },
    "Mishnah Pirkei Avot": {
        "1": 18,
        "2": 16,
        "3": 18,
        "4": 22,
        "5": 23,
        "6": 11
    },
    "Mishnah Horayot": {
        "1": 5,
        "2": 7,
        "3": 8
    },
    "Mishnah Arakhin": {
        "1": 4,
        "2": 6,
        "3": 5,
        "4": 4
    },
    "Mishnah Bekhorot": {
        "1": 7,
        "2": 9,
        "3": 4,
        "4": 10,
        "5": 6,
        "6": 12,
        "7": 7
    },
    "Mishnah Chullin": {
        "1": 7,
        "2": 10,
        "3": 7,
        "4": 7,
        "5": 5,
        "6": 7,
        "7": 6
    },
    "Mishnah Keritot": {
        "1": 7,
        "2": 6,
        "3": 10,
        "4": 3,
        "5": 8,
        "6": 9
    },
    "Mishnah Kinnim": {
        "1": 4,
        "2": 5,
        "3": 6
    },
    "Mishnah Meilah": {
        "1": 4,
        "2": 9,
        "3": 8,
        "4": 6
    },
    "Mishnah Menachot": {
        "1": 4,
        "2": 5,
        "3": 7,
        "4": 5
    },
    "Mishnah Middot": {
        "1": 9,
        "2": 6,
        "3": 8,
        "4": 7,
        "5": 4
    },
    "Mishnah Tamid": {
        "1": 4,
        "2": 5,
        "3": 9,
        "4": 3
    },
    "Mishnah Temurah": {
        "1": 6,
        "2": 3,
        "3": 5,
        "4": 4,
        "5": 6,
        "6": 5
    },
    "Mishnah Zevachim": {
        "1": 4,
        "2": 5,
        "3": 6,
        "4": 6
    },
    "Mishnah Kelim": {
        "1": 9,
        "2": 8,
        "3": 8,
        "4": 4,
        "5": 11,
        "6": 4,
        "7": 6,
        "8": 11,
        "9": 8
    },
    "Mishnah Makhshirin": {
        "1": 6,
        "2": 11,
        "3": 8,
        "4": 10,
        "5": 11,
        "6": 8
    },
    "Mishnah Mikvaot": {
        "1": 8,
        "2": 10,
        "3": 4,
        "4": 5,
        "5": 6,
        "6": 11,
        "7": 7,
        "8": 5
    },
    "Mishnah Negaim": {
        "1": 6,
        "2": 5,
        "3": 8,
        "4": 11,
        "5": 5,
        "6": 8
    },
    "Mishnah Niddah": {
        "1": 7,
        "2": 7,
        "3": 7,
        "4": 7,
        "5": 9,
        "6": 14,
        "7": 5
    },
    "Mishnah Oholot": {
        "1": 8,
        "2": 7,
        "3": 7,
        "4": 3,
        "5": 7,
        "6": 7,
        "7": 6,
        "8": 6
    },
    "Mishnah Oktzin": {
        "1": 6,
        "2": 10,
        "3": 12
    },
    "Mishnah Parah": {
        "1": 4,
        "2": 5,
        "3": 11,
        "4": 4
    },
    "Mishnah Tahorot": {
        "1": 9,
        "2": 8,
        "3": 8,
        "4": 13,
        "5": 9,
        "6": 10,
        "7": 9,
        "8": 9,
        "9": 9
    },
    "Mishnah Tevul Yom": {
        "1": 5,
        "2": 8,
        "3": 6,
        "4": 7
    },
    "Mishnah Yadayim": {
        "1": 5,
        "2": 4,
        "3": 5,
        "4": 8
    },
    "Mishnah Zavim": {
        "1": 6,
        "2": 4,
        "3": 3,
        "4": 7,
        "5": 12
    }
};
let correctWords = [];
let fullVerse = '';  
let blankNumber = 0; 
let globalMemorizedVersesByBook = new Map();
let answersChecked = false;  // Add this flag outside your function to keep track of whether answers have been checked
let originalAnswers = [];
let shouldStoreOriginals = true; // global flag to control whether to store original answers
let gameStarted = false;
let toggleModeActive = false;
let isGameStarting = false;  // Add this variable at the top of your script
let elapsedTime = 0;
let timerInterval = null;
let gameContent = '';
let textSegments;  // Define a variable to hold the segments of text

// Populate the book dropdown
const biblicalBooks = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "I Samuel", "II Samuel", "I Kings", "II Kings", "Isaiah", "Jeremiah", "Ezekiel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Psalms", "Proverbs", "Job", "Song of Songs", "Ruth", "Lamentations", "Ecclesiastes", "Esther", "Daniel", "Ezra", "Nehemiah", "I Chronicles", "II Chronicles"];
const mishnahTractates = ["Mishnah Berakhot", "Mishnah Peah", "Mishnah Demai", "Mishnah Kilayim", "Mishnah Sheviit", "Mishnah Terumot", "Mishnah Maasrot", "Mishnah Maaser Sheni", "Mishnah Challah", "Mishnah Orlah", "Mishnah Bikkurim", "Mishnah Shabbat", "Mishnah Eruvin", "Mishnah Pesachim", "Mishnah Shekalim", "Mishnah Yoma", "Mishnah Sukkah", "Mishnah Beitzah", "Mishnah Rosh Hashanah", "Mishnah Taanit", "Mishnah Megillah", "Mishnah Moed Katan", "Mishnah Chagigah", "Mishnah Yevamot", "Mishnah Ketubot", "Mishnah Nedarim", "Mishnah Nazir", "Mishnah Sotah", "Mishnah Gittin", "Mishnah Kiddushin", "Mishnah Bava Kamma", "Mishnah Bava Metzia", "Mishnah Bava Batra", "Mishnah Sanhedrin", "Mishnah Makkot", "Mishnah Shevuot", "Mishnah Eduyot", "Mishnah Avodah Zarah", "Pirkei Avot"];

const bibleSelect = document.getElementById('bible-book-select');
const mishnahSelect = document.getElementById('mishnah-tractate-select');

// Populate the Bible books dropdown
biblicalBooks.forEach((book) => {
    const option = document.createElement('option');
    option.value = book;
    option.text = book;
    bibleSelect.appendChild(option);
});

// Populate the Mishnah tractates dropdown
mishnahTractates.forEach((tractate) => {
    const option = document.createElement('option');
    option.value = tractate;
    option.text = tractate;
    mishnahSelect.appendChild(option);
});

// Update text input when a book or tractate is selected
// Update text input when a book or tractate is selected
function updateTextReference() {
    const bibleSelect = document.getElementById('bible-book-select');
    const mishnahSelect = document.getElementById('mishnah-tractate-select');
    const textInput = document.getElementById('text-input');

    // Determine which select this change event is coming from
    const isBibleBookChange = this.id === 'bible-book-select';

    // Clear the other select box
    if (isBibleBookChange) {
        mishnahSelect.value = '';
    } else {
        bibleSelect.value = '';
    }

    const selectedBibleBook = bibleSelect.value;
    const selectedTractate = mishnahSelect.value;
    let textReference = '';

    if (selectedBibleBook) {
        // It's a biblical book
        const firstChapter = '1';
        const lastChapter = Object.keys(bibleandMishnahStructure[selectedBibleBook]).pop();
        const firstVerse = '1';
        const lastVerse = bibleandMishnahStructure[selectedBibleBook][lastChapter];
        textReference = `${selectedBibleBook} ${firstChapter}:${firstVerse}-${lastChapter}:${lastVerse}`;
    } else if (selectedTractate) {
        // It's a mishnah tractate
        const firstChapter = '1';
        const lastChapter = Object.keys(bibleandMishnahStructure[selectedTractate]).pop();
        const firstVerse = '1';
        const lastVerse = bibleandMishnahStructure[selectedTractate][lastChapter];
        textReference = `${selectedTractate} ${firstChapter}:${firstVerse}-${lastChapter}:${lastVerse}`;
    }

    textInput.value = textReference;
}

// Make sure the 'updateTextReference' function is bound correctly
document.getElementById('bible-book-select').addEventListener('change', updateTextReference);
document.getElementById('mishnah-tractate-select').addEventListener('change', updateTextReference);




// Helper function to determine if the text is Quranic
function isQuranicText(inputText) {
    // Implement logic to determine if the text is from the Quran
    // This is a placeholder: return true if it matches the Quranic text pattern
    const quranicPattern = /^\d+:\d+$/; // Matches patterns like "2:255"
    return quranicPattern.test(inputText);
}

// Helper function to fetch text from Quranic API
async function fetchFromQuranAPI(inputText) {
    const apiUrl = `https://api.alquran.cloud/v1/ayah/${inputText}/quran-uthmani`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.code === 200) {
            // The Quran API recognizes the text and returns it
            return { text: data.data.text }; // Just return the text for simplicity
        } else {
            // The Quran API does not recognize the text, return an error to try Sefaria next
            throw new Error('Quran API does not recognize the text');
        }
    } catch (error) {
        console.error('Fetch from Quran API failed:', error);
        throw error; // Rethrow to handle in the calling function
    }
}

// Helper function to fetch text from Sefaria API
async function fetchFromSefaria(textInput, difficulty) {
    // This is the existing Sefaria fetching logic
    const isVerseLevel = textInput.includes(":");
    let [book, chapter, verseRange] = textInput.split(/[ :]/);
    let verseStart, verseEnd;
    if (verseRange && verseRange.includes('-')) {
        [verseStart, verseEnd] = verseRange.split('-').map(Number);
    } else {
        verseStart = verseEnd = Number(verseRange);
    }

    textInput = textInput.replace(/\s+/g, '_').replace(/:/g, '.');
    const url = isVerseLevel ? 
        `https://www.sefaria.org/api/texts/${textInput}?context=0` : 
        `https://www.sefaria.org/api/texts/${textInput}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error || !data.he) {
        throw new Error('Sefaria API does not recognize the text');
    }
    
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
        return { text: data.he, verseReferences: [parseInt(textInput.split('.')[1] || 1)] };
    }
}

// Function to decide which API to fetch from
async function fetchText(inputText, inputDifficulty) {
    if (isQuranicText(inputText)) {
        try {
            // First, attempt to fetch from the Quranic API
            return await fetchFromQuranAPI(inputText);
        } catch (error) {
            // If fetching from the Quranic API fails, log the error and proceed
            console.log('Quran API failed, trying Sefaria API...');
        }
    }
    
    // Try the Sefaria API next
    return fetchFromSefaria(inputText, inputDifficulty);
}

// Example usage:
fetchText('2:255', 'medium').then(data => {
    // Do something with the data
}).catch(error => {
    console.error('Error fetching text:', error);
    // Handle the error appropriately
});


// Consolidated function to remove HTML tags
function stripHtml(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    let text = tempDiv.textContent || tempDiv.innerText || "";

    // Define an array of unwanted strings
    const unwantedStrings = [
        '--End of Chapter--',
        '--Start of Chapter--',
        // Add any other unwanted strings here
    ];

    // Remove unwanted strings from the text
    unwantedStrings.forEach(str => {
        text = text.replace(str, '');
    });

    // Trim the text to remove any leading or trailing white space
    return text.trim();
}

function stripHtmlAndCleanText(text) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;
    tempDiv.querySelectorAll('[class]').forEach(el => el.removeAttribute('class'));
    let cleanText = tempDiv.textContent || tempDiv.innerText || "";
    cleanText = cleanText.replace(/\s*{[ספ]}\s*/g, ''); // Remove special characters
    return cleanText.trim();
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
    // Remove any unwanted substrings
    fullVerse = stripHtmlAndCleanText(fullVerse);  // Clean up any unwanted strings and strip HTML
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
    // Fetch memorized texts from Firebase
    getMemorizedTexts(function(fetchedMemorizedTexts) {
        // Display memorized texts with fetched data
        displayMemorizedTexts(fetchedMemorizedTexts);
    });

    // Your checkbox logic here
    const checkbox = document.getElementById('toggle-verse');
    if (checkbox) {
        checkbox.addEventListener('change', toggleFullVerse);
    }
});


// Helper function to count total verses in a book
function countTotalVersesInBook(book) {
    let totalVerses = 0;
    for (const chapter in bibleandMishnahStructure[book]) {
        totalVerses += bibleandMishnahStructure[book][chapter];
    }
    return totalVerses;
}

// Helper function to parse a range of verses and add them to a set
function parseAndAddVerses(book, chapterVerseRange, versesSet) {
    const [chapter, verseRange] = chapterVerseRange.split(':');
    const [startVerse, endVerse] = verseRange.split('-').map(Number);
    const endVerseNumber = endVerse || startVerse; // If endVerse is undefined, it's a single verse

    for (let verse = startVerse; verse <= endVerseNumber; verse++) {
        versesSet.add(`${chapter}:${verse}`);
    }
}

// Function to convert set of verses into a list
function convertSetToList(versesSet) {
    let versesList = Array.from(versesSet).sort();
    // Further processing can be added here if needed to merge contiguous verses into ranges
    return versesList.join(', ');
}

function createMemorizationVisualization(memorizedVersesByBook) {
    // Define the sections of the Tanach
    const Torah = new Set(["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"]);
    const Neviim = new Set(["Joshua", "Judges", "I Samuel", "II Samuel", "I Kings", "II Kings", "Isaiah", "Jeremiah", "Ezekiel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"]);
    const Ketuvim = new Set(["Psalms", "Proverbs", "Job", "Song of Songs", "Ruth", "Lamentations", "Ecclesiastes", "Esther", "Daniel", "Ezra", "Nehemiah", "I Chronicles", "II Chronicles"]);

    // Arrays to hold the data for Plotly
    let books = [];
    let memorizedVersesData = [];
    let nonMemorizedVersesData = [];
    let colors = [];

    // Counters for memorized verses in each section
    let memorizedVersesTorah = 0;
    let memorizedVersesNeviim = 0;
    let memorizedVersesKetuvim = 0;

    // Use the predefined order of biblical books
    biblicalBooks.forEach(book => {
        if (memorizedVersesByBook.has(book)) {
            const versesSet = memorizedVersesByBook.get(book);
            const totalVerses = countTotalVersesInBook(book);
            const memorizedVerses = versesSet.size;
            const nonMemorizedVerses = totalVerses - memorizedVerses;

            books.push(book);
            memorizedVersesData.push(memorizedVerses);
            nonMemorizedVersesData.push(nonMemorizedVerses);

            // Assign color based on section
            if (Torah.has(book)) {
                colors.push('blue');
                memorizedVersesTorah += memorizedVerses;
            } else if (Neviim.has(book)) {
                colors.push('green');
                memorizedVersesNeviim += memorizedVerses;
            } else if (Ketuvim.has(book)) {
                colors.push('red');
                memorizedVersesKetuvim += memorizedVerses;
            } else {
                colors.push('grey'); // For any book not classified
            }
        }
    });

    // Reverse the order of the data
    books.reverse();
    memorizedVersesData.reverse();
    nonMemorizedVersesData.reverse();
    colors.reverse();

    // Define the trace for memorized verses
    let traceMemorizedVerses = {
        x: memorizedVersesData,
        y: books,
        name: 'Memorized Verses',
        type: 'bar',
        orientation: 'h',
        marker: { color: 'green' } // Consistent color for memorized verses
    };

    // Define the trace for non-memorized verses
    let traceNonMemorizedVerses = {
        x: nonMemorizedVersesData,
        y: books,
        name: 'Non-Memorized Verses',
        type: 'bar',
        orientation: 'h',
        marker: { color: 'lightgrey' }
    };

    let data = [traceMemorizedVerses, traceNonMemorizedVerses];

    // Define the layout for the chart
    let layout = {
        title: 'Biblical Memorization Progress',
        barmode: 'stack',
        height: 1200, // Adjust height as needed
        margin: { l: 150, r: 10, t: 100, b: 50 },
        xaxis: { title: 'Number of Verses' },
        yaxis: { title: 'Biblical Book', automargin: true, tickangle: 0 },
        annotations: [ // Repositioned annotations
            {
                x: 0,
                y: books.indexOf('Genesis') + .5, // Adjusted position
                xref: 'paper',
                yref: 'y',
                text: 'Torah: ' + memorizedVersesTorah + ' memorized',
                showarrow: false,
                font: { color: 'blue' }
            },
            {
                x: 0,
                y: books.indexOf('Joshua') + .5, // Adjusted position
                xref: 'paper',
                yref: 'y',
                text: 'Neviim: ' + memorizedVersesNeviim + ' memorized',
                showarrow: false,
                font: { color: 'green' }
            },
            {
                x: 0,
                y: books.indexOf('Psalms') + .5, // Adjusted position
                xref: 'paper',
                yref: 'y',
                text: 'Ketuvim: ' + memorizedVersesKetuvim + ' memorized',
                showarrow: false,
                font: { color: 'red' }
            }
        ]
    };

    // Create the Plotly chart
    Plotly.newPlot('memorizationViz', data, layout);
}







// Function to toggle the visualization
function toggleVisualization() {
    var viz = document.getElementById('memorizationViz');
    if (viz.style.display === 'none') {
        viz.style.display = 'block'; // Or 'inline-block' or other as needed
        // Call the visualization function with the global variable
        createMemorizationVisualization(globalMemorizedVersesByBook);
    } else {
        viz.style.display = 'none';
    }
}

// Add event listener to the button
document.getElementById('toggleVizButton').addEventListener('click', toggleVisualization);




// Updated displayMemorizedTexts function to take memorizedTexts as an argument
function displayMemorizedTexts(memorizedTexts) {
    const memorizedList = document.getElementById('memorized-list');
    memorizedList.innerHTML = '';
  
    // Reset the global Map to store verses by book
    globalMemorizedVersesByBook.clear();
  
    // First, populate the map with sets for each book
    biblicalBooks.forEach(book => {
        globalMemorizedVersesByBook.set(book, new Set());
    });
  
    // Ensure memorizedTexts is always an array
    memorizedTexts = memorizedTexts || [];
  
    // Now, parse the memorized texts and add verses to the corresponding set in the global map
    memorizedTexts.forEach(text => {
        const [book, chapterVerseRange] = text.split(' ');
        if (biblicalBooks.includes(book)) {
            parseAndAddVerses(book, chapterVerseRange, globalMemorizedVersesByBook.get(book));
        }
    });
  
    // Display the books that have been partially memorized along with percentages and memorized verses
    globalMemorizedVersesByBook.forEach((versesSet, book) => {
        const totalVerses = countTotalVersesInBook(book);
        const memorizedVerses = versesSet.size;
  
        if (memorizedVerses > 0) {
            const percentageMemorized = (memorizedVerses / totalVerses * 100).toFixed(2);
            const listItem = document.createElement('li');
            const versesList = Array.from(versesSet).join(', '); // Convert the set to a list for display
            listItem.textContent = `${book}: ${memorizedVerses} verses memorized (${percentageMemorized}%). Memorized verses: ${versesList}`;
            memorizedList.appendChild(listItem);
        }
    });
  
    // After the memorized list is updated, create the visualization
    createMemorizationVisualization(globalMemorizedVersesByBook);
}

// Sample usage
// Assuming memorizedTexts is an array with memorized verses like ["Genesis 1:1", "Genesis 1:1-2", ...]
// This should now be called after fetching data with getMemorizedTexts function
getMemorizedTexts(displayMemorizedTexts);




function stripHebrew(text) {
    // Log the original text to see if there are any leading or trailing whitespaces
    console.log("Original text:", JSON.stringify(text));

    // First, remove HTML tags from the text
    const textWithoutHtml = text.replace(/<[^>]+>/g, '');

    // Log the text after HTML removal
    console.log("Text without HTML:", JSON.stringify(textWithoutHtml));

    // Remove HTML entities like &nbsp;
    const textWithoutEntities = textWithoutHtml.replace(/&nbsp;|&[a-z]+;/gi, ' ');

    // Log the text after entity removal
    console.log("Text without entities:", JSON.stringify(textWithoutEntities));

    // Trim leading and trailing whitespace and replace non-breaking spaces
    const trimmedText = textWithoutEntities.replace(/^\s+|\s+$/g, '').replace(/\u00A0/g, ' ');

    // Log the text after trimming
    console.log("Trimmed text:", JSON.stringify(trimmedText));

    const removeVowels = document.getElementById('toggle-vowels').checked;
    if (!removeVowels) {
        return trimmedText;  // Return the text without HTML and trimmed if the checkbox is not checked
    }

    // Regular expression to match Hebrew vowels, cantillation marks, and other diacritics
    const regex = /[\u0591-\u05BD\u05BF-\u05C5\u05C7]/g;

    // Replace these characters with an empty string
    const strippedText = trimmedText.replace(regex, '');

    // Replace any instance of multiple spaces with a single space
    const normalizedText = strippedText.replace(/\s+/g, ' ');

    // Log the final processed text
    console.log("Final processed text:", JSON.stringify(normalizedText));

    return normalizedText;
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
// Initialize currentSeed to any initial value
let currentSeed = 0;

// Function to get blank interval based on difficulty
function getBlankInterval(verseLength) {
    const difficulty = document.getElementById('difficulty').value;
    let interval;
    switch (difficulty) {
        case 'easy':
            interval = 7;
            break;
        case 'medium':
            interval = 5;
            break;
        case 'hard':
            interval = 3;
            break;
        case 'memorize':
            interval = 1; // In memorize mode, every word will be a blank.
            break;
        default:
            interval = 5;
    }
    // If the verse is too short, set interval to verse length to ensure only 1 blank
    if (verseLength < interval && difficulty !== 'memorize') {
        return verseLength; // Only one blank in the verse
    }
    return interval;
}





// Function to seed the random number generator
function seedRandom(seed) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// Function to get the next random number based on the current seed
function getNextRandom() {
    console.log('getNextRandom called, runningSeed is:', runningSeed);
    runningSeed++; // Increment runningSeed, not currentSeed
    return seedRandom(runningSeed);
}


// Function to generate the quiz URL
function generateQuizURL() {
    const params = new URLSearchParams();
    params.set('text', document.getElementById('text-input').value);
    params.set('difficulty', document.getElementById('difficulty').value);

    // Use currentSeed for generating URL, but no new seed generation here
    params.set('seed', currentSeed);

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}
let runningSeed = 0; // New variable to keep track of the "running seed"

// Function to parse the URL
function parseURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const text = urlParams.get('text');
    const difficulty = urlParams.get('difficulty');
    const seed = urlParams.get('seed');

    if (text) document.getElementById('text-input').value = text;
    if (difficulty) document.getElementById('difficulty').value = difficulty;
    if (seed) currentSeed = Number(seed);  // Update currentSeed from URL
}

// Function to randomize the seed
function randomizeSeed() {
    currentSeed = Date.now(); // Update the seed to a new random value based on the current timestamp
    runningSeed = currentSeed; // Reset runningSeed to the new currentSeed
    const quizURL = generateQuizURL();
    history.pushState({}, '', quizURL); // Update the URL with the new seed
    startGame(); // Restart the game with the new seed
}

function getNextRandomFixed() {
    return seedRandom(runningSeed);
}




// Function to start the game
function startGame() {
    if (isGameStarting) return;
    isGameStarting = true;
    let gameSeed = runningSeed;
    const initialRunningSeed = runningSeed;

    const inputText = document.getElementById('text-input').value;
    const inputDifficulty = document.getElementById('difficulty').value;
    const quizURL = generateQuizURL(); // Generate the quiz URL based on the current input values

    const urlParams = new URLSearchParams(window.location.search);
    const urlText = urlParams.get('text');
    const urlDifficulty = urlParams.get('difficulty');
    if (inputText !== urlText || inputDifficulty !== urlDifficulty) {
        history.pushState({}, '', quizURL);
    }

    gameStarted = true;
    answersChecked = false;
    elapsedTime = 0;
    blankNumber = 0;
    gameContent = '';
    correctWords = [];

// Clear any existing timer before starting a new one
if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
}
// Clear the comparison container
document.getElementById('comparison-container').innerHTML = '';

// Reset the score display
document.getElementById('score').innerText = 'Score:';

// Start the timer
elapsedTime = 0;
document.getElementById('timer').innerText = '00:00';
timerInterval = setInterval(function() {
    elapsedTime++;
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    document.getElementById('timer').innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}, 1000);

    fetchText(inputText, inputDifficulty).then(data => {
        let textSegments;

    // Check if the text begins with "Mishnah"
    if (inputText.startsWith('Mishnah')) {
        textSegments = data.text.split(':').map(verse => verse.trim()).filter(verse => verse.length > 0);
    } else if (Array.isArray(data.he)) {
        textSegments = data.he;
    } else if (data.text) {
        textSegments = data.text.split(/׃(?: {ס}| {פ}|)|\./g)
                               .map(verse => verse.trim())
                               .filter(verse => verse.length > 0);
    } else {
        console.error('Unexpected text structure:', data);
        isGameStarting = false;
        stopTimer();
        return;
    }

        const reference = parseReference(inputText);
        let currentChapter = reference.chapter;
        let currentVerse = reference.startVerse;
        let labelCounter = 1; // Start with the first segment label for non-biblical texts

        textSegments.forEach((segment, segmentIndex) => {
            let verseLabel;
            if (bibleandMishnahStructure && bibleandMishnahStructure[reference.book]) {
                // Initialize currentChapter and currentVerse if they are undefined
                currentChapter = currentChapter || 1;
                currentVerse = currentVerse || 1;
            
                verseLabel = `${reference.book} ${currentChapter}:${currentVerse}`;
                currentVerse++;
                // When the currentVerse exceeds the number of verses in the current chapter, increment the chapter
                if (currentVerse > bibleandMishnahStructure[reference.book][currentChapter.toString()]) {
                    currentChapter++;
                    currentVerse = 1;
                }
            }
            else {
                // For non-biblical texts, use a simple counter for labeling
                verseLabel = labelCounter.toString();
                labelCounter++;
            }
            gameContent += `<div><strong>${verseLabel}</strong> `;
    
            const quizSegment = segment.replace(/\s*{[ספ]}\s*/g, '');
            const strippedSegment = stripHebrew(quizSegment);
            const words = strippedSegment.split(' ');
            const blankInterval = getBlankInterval(words.length);
        
            // Use a local function that uses the initial running seed to ensure consistency during game setup
            function getNextRandomForGameSetup() {
                gameSeed++; // Increment local copy of seed
                return seedRandom(gameSeed);
            }
        
            // If we're in memorize mode, every word is a blank
            if (blankInterval === 1) {
                words.forEach((word, i) => {
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
                        index = Math.floor(getNextRandomForGameSetup() * words.length);
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
        });
          
        // Update the total verses counter in the HTML
        document.getElementById('total-verses').innerText = textSegments.length.toString();

        // After generating all segments, set the innerHTML of the game container
        document.getElementById('game-container').innerHTML = gameContent;

        // Now that the game has started, enable the "Check Answers" button
        document.getElementById('check-answers').disabled = false;
        // Clear any previous selections and disable the blanks
        const blanks = document.querySelectorAll('.blank');
        blanks.forEach(blank => {
            blank.value = '';
            blank.disabled = false;
            blank.style.backgroundColor = '';
            blank.style.color = '';
        });

        // Reset the answersChecked flag and other states as necessary
        answersChecked = false;
        updateTotalBlanks();
        fetchFullVerse();

        // Display the URL for the current quiz
        console.log('Share this URL to challenge others:', quizURL);
        
        // The game is now starting, so we can reset this flag
        isGameStarting = false;
    }).catch(error => {
        console.error('Error fetching text:', error);
        isGameStarting = false;
        stopTimer();
    });


    // Initialize the map and load CSV data when the game starts
    initializeMap();
    prepareCsvData().then(() => {
        console.log("Map and CSV data are ready for search.");

        // Get the value from the text-input and search for biblical references
        const query = document.getElementById('text-input').value;
        if (query) {
            let searchResults = searchBiblicalReferences(query);
            displayPlacesOnMap(searchResults);
        } else {
            console.log("No query provided in text-input.");
        }
    });
}



function startTimer() {
    // Ensure any existing timer is cleared to avoid multiple intervals running
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }
  
    // Reset the time elapsed
    timeElapsed = 0;
  
    // Update the timer every second
    timerInterval = setInterval(() => {
      timeElapsed += 1;
      // Update the UI with the new time
      document.getElementById('timer-display').textContent = formatTime(timeElapsed);
    }, 1000); // 1000 milliseconds = 1 second
  }
  
  function stopTimer() {
    // Clear the interval to stop the timer
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  function formatTime(seconds) {
    // Convert seconds into HH:MM:SS format for display
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
  
    // Pad with zeros to ensure two digits
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    secs = String(secs).padStart(2, '0');
  
    return `${hours}:${minutes}:${secs}`;
  }




document.getElementById('randomize-seed').addEventListener('click', randomizeSeed);

// When the window loads, parse the URL to set initial parameters
window.onload = function() {
    parseURL();
    runningSeed = currentSeed; // Initialize runningSeed when the window loads
}

// Function to parse the text reference
function parseReference(input) {
    const parts = input.match(/([\w\s]+)\s+(\d+):(\d+)(?:-(\d+))?/);
    const defaultReference = {
      book: '',
      chapter: 1,
      startVerse: 1,
      endVerse: 1,
      isBiblical: false
    };
  
    if (parts) {
      return {
        book: parts[1],
        chapter: parseInt(parts[2], 10),
        startVerse: parseInt(parts[3], 10),
        endVerse: parts[4] ? parseInt(parts[4], 10) : parseInt(parts[3], 10),
        isBiblical: true
      };
    }
  
    return defaultReference; // Return a default structure if the pattern is not matched
  }

  function getVerseLabel(bibleandMishnahStructure, reference, currentChapter, currentVerse) {
    if (reference.isBiblical && bibleandMishnahStructure[reference.book]) {
      return `${reference.book} ${currentChapter}:${currentVerse}`;
    } else {
      return `Section ${currentVerse}`;
    }
  }

  function labelVerses(textSegments, bibleandMishnahStructure, inputText) {
    const reference = parseReference(inputText);
    let currentChapter = reference.chapter;
    let currentVerse = reference.startVerse;
    let labelCounter = 1; // Start with the first segment label for non-biblical texts
  
    return textSegments.map((segment, segmentIndex) => {
      let verseLabel;
      if (reference.isBiblical) {
        // Check if the book and chapter exist in the bibleandMishnahStructure
        if (bibleandMishnahStructure[reference.book] && bibleandMishnahStructure[reference.book][currentChapter]) {
          verseLabel = `${reference.book} ${currentChapter}:${currentVerse}`;
          currentVerse++;
          // Check if the next verse exceeds the current chapter's verse count
          if (currentVerse > bibleandMishnahStructure[reference.book][currentChapter]) {
            currentChapter++;
            currentVerse = 1;
          }
        } else {
          // If the book or chapter does not exist in bibleandMishnahStructure, treat as non-biblical
          verseLabel = `Section ${labelCounter}`;
          labelCounter++;
        }
      } else {
        // For non-biblical texts, use a simple counter for labeling
        verseLabel = `Section ${labelCounter}`;
        labelCounter++;
      }
  
      // Combine the segment with its label
      return `<div><strong>${verseLabel}</strong> ${segment}</div>`;
    });
  }




  function stripVowels(str) {
    // This pattern matches Hebrew vowels, cantillation marks, and other diacritics
    const hebrewVowels = /[\u0591-\u05C7]/g;
    // This pattern matches Arabic vowels (tashkeel/harakat)
    const arabicVowels = /[\u0610-\u061A\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g;

    // Replace Hebrew and Arabic diacritics with an empty string
    return str.replace(hebrewVowels, '').replace(arabicVowels, '');
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



function checkAnswers() {
    if ((gameStarted && !answersChecked) || toggleModeActive) {
        answersChecked = true;

        const blanks = document.querySelectorAll('.blank');
        let score = 0;
        let blankIndex = 0;
        let comparisonContent = '';

        // Ensure we have the correct answers available
        if (!correctWords || correctWords.length === 0) {
            console.error('correctWords array is empty');
            alert('An error occurred. Please reload the game.');
            return;
        }

        // Store the user's original answers
        if (displayInBlanks && !toggleModeActive) {
            originalAnswers = Array.from(blanks).map(blank => blank.value.trim());
        }

        blanks.forEach(blank => {
            const userAnswer = stripVowels(blank.value.trim());
            const correctAnswer = correctWords[blankIndex];
            const sanitizedCorrectAnswer = stripHtml(correctAnswer);

            let resultText = `Blank #${blankIndex + 1} - `;
            resultText += isAcceptableAnswer(userAnswer, correctAnswer) ? 'Correct!' : 'Incorrect!';
            resultText += ` Your answer: ${userAnswer}; Correct answer: ${sanitizedCorrectAnswer}.`;

            if (displayInBlanks) {
                // Update the blank with the result text and set direction to LTR
                blank.setAttribute('dir', 'ltr');
                blank.value = resultText;
                blank.style.backgroundColor = isAcceptableAnswer(userAnswer, correctAnswer) ? '#28a745' : '#dc3545'; // Use the updated color scheme
                blank.style.color = 'white';
                blank.style.borderRadius = '4px'; // Add rounded corners
                blank.style.padding = '2px 4px'; // Add padding
                blank.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'; // Add shadow for consistency
            } else {
                // Add the result to the comparison content
                comparisonContent += `<div style="background-color: ${isAcceptableAnswer(userAnswer, correctAnswer) ? '#28a745' : '#dc3545'}; color: white; border-radius: 4px; padding: 2px 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">${resultText}</div>`;
            }            

            blank.disabled = true; // Disable the blank after checking the answer
            if (isAcceptableAnswer(userAnswer, correctAnswer)) {
                score++;
            }
            blankIndex++;
        });

        document.getElementById('score').innerText = `Score: ${score} out of ${blanks.length}`;

        if (!displayInBlanks) {
            // Show the answers at the bottom
            document.getElementById('comparison-container').innerHTML = comparisonContent;
        }

        if (score === blanks.length) {
            // If the user scored 100%, add the memorized text to Firestore
            const textInput = document.getElementById('text-input').value;
            addMemorizedText(textInput, () => {
                // After adding the new text, fetch and display the updated list
                getMemorizedTexts(displayMemorizedTexts);
            });
        }
    } else if (!gameStarted) {
        alert("Please start the game first.");
    } else if (answersChecked) {
        alert("You've already checked the answers.");
    }
    if (!toggleModeActive) {
        stopTimer(); // Stop the timer only if not in toggle mode
    }
}






// Add memorized text to Firestore and then refresh the display
function addMemorizedText(text, callback) {
    const user = auth.currentUser;
    if (user) {
        console.log("Attempting to add text for user:", user.uid);
        addDoc(collection(db, "memorizedTexts"), {
            uid: user.uid,
            text: text,
            createdAt: serverTimestamp()
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            callback(null, docRef.id); // Pass null for error and the docRef.id to the callback
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            callback(error, null); // Pass the error and null for the docRef.id to the callback
        });
    } else {
        console.log("User is not logged in. Cannot add memorized text.");
        callback(new Error("User is not logged in."), null); // Pass a new error to the callback
    }
}

// Example callback function to use with addMemorizedText
function afterAddMemorizedText(error, docId) {
    if (error) {
        console.error("An error occurred after trying to add memorized text:", error);
        // Handle the error, e.g., show a message to the user
    } else {
        console.log("Memorized text added with document ID:", docId);
        // Proceed with any actions after successfully adding the text
        getMemorizedTexts(displayMemorizedTexts); // Fetch and display the updated list
    }
}


// Function to retrieve user's memorized texts from Firestore
function getMemorizedTexts(callback) {
    const user = auth.currentUser;
    if (user) {
        const q = query(collection(db, "memorizedTexts"), where("uid", "==", user.uid));
        getDocs(q)
            .then((querySnapshot) => {
                const texts = [];
                querySnapshot.forEach((doc) => {
                    texts.push(doc.data().text); // Assuming 'text' is the field name of the document
                });
                callback(texts); // Pass the texts to the callback
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
                callback([]); // In case of error, pass an empty array to the callback
            });
    } else {
        console.log("User is not logged in.");
        callback([]); // Pass an empty array if no user is logged in
    }
}


function toggleDisplayMode() {
    const blanks = document.querySelectorAll('.blank');
    const comparisonContainer = document.getElementById('comparison-container');
    
    displayInBlanks = !displayInBlanks;

    if (!displayInBlanks) {
        // Move answers from blanks to the bottom
        let comparisonContent = '';
        blanks.forEach((blank, index) => {
            comparisonContent += `<div>${blank.value}</div>`; // Add the current value of the blank to comparison content
            blank.value = `Blank #${index + 1}`; // Reset the value of the blank to show the blank number
            blank.style.backgroundColor = ''; // Clear any previous colors
            blank.style.color = '';
            blank.removeAttribute('dir'); // Remove the LTR direction since it's just a number
        });
        comparisonContainer.innerHTML = comparisonContent; // Show the comparison content at the bottom
    } else {
        // Move answers from the bottom back to the blanks
        const comparisonContentDivs = comparisonContainer.querySelectorAll('div');
        comparisonContentDivs.forEach((div, index) => {
            blanks[index].setAttribute('dir', 'ltr'); // Set text direction to LTR for the answer
            blanks[index].value = div.textContent; // Set the blank value to the text content of the corresponding div
            // Apply the color based on the correctness of the answer
            if (div.textContent.includes('Correct!')) {
                blanks[index].style.backgroundColor = '#28a745'; // a softer shade of green
                blanks[index].style.color = 'white';
                blanks[index].style.borderRadius = '4px'; // rounded corners
                blanks[index].style.padding = '2px 4px'; // some padding
                blanks[index].style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'; // consistent shadow
            } else {
                blanks[index].style.backgroundColor = '#dc3545'; // a softer shade of red
                blanks[index].style.color = 'white';
                blanks[index].style.borderRadius = '4px'; // rounded corners
                blanks[index].style.padding = '2px 4px'; // some padding
                blanks[index].style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'; // consistent shadow
            }            
        });
        comparisonContainer.innerHTML = ''; // Clear the comparison content from the bottom
    }
}
function isReferenceMatch(biblicalReferences, query) {
    // Ensure the biblicalReferences is a non-null string
    if (typeof biblicalReferences === 'string') {
        // Split the references by comma and normalize them
        return biblicalReferences.split(',').some(ref => {
            // Normalize and compare each reference to the query
            let normalizedRef = normalizeReference(ref);
            return normalizedRef.includes(query);
        });
    }
    return false;
}


function printQuiz() {
    const textReference = document.getElementById('text-input').value;
    const includeComparison = confirm('Include comparison container in the printed quiz? (Yes/No)');
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Create the content to be printed
    const printContent = document.createElement('div');
    printContent.innerHTML = `<h1>${textReference}</h1>`;
    
    if (includeComparison) {
        const comparisonContainer = document.getElementById('comparison-container');
        const clone = comparisonContainer.cloneNode(true);
        printContent.appendChild(clone);
    }
    
    // Append the content to the print window
    printWindow.document.body.appendChild(printContent);
    
    // Print the content
    printWindow.print();
    
    // Close the print window
    printWindow.close();
}


// Attach the print function to the print button
document.getElementById('print-quiz').addEventListener('click', printQuiz);

  
  // You need to define the `isAcceptableAnswer` and `stripHtml` functions, 
  // and also ensure that `originalAnswers` and `correctWords` arrays are properly maintained.
  


// Attach event listener to toggle display mode
document.getElementById('toggle-display').addEventListener('click', toggleDisplayMode);

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('check-answers').addEventListener('click', function() {
        stopTimer();
        checkAnswers();
    });
});




document.addEventListener('DOMContentLoaded', function() {
    displayMemorizedTexts();
});


// Event listener for checkbox// Event listener for checkbox
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
}); // Closing the 'DOMContentLoaded' event listener here

// This event listener should be at the global scope, outside of any other functions or blocks
document.getElementById('startGameButton').addEventListener('click', startGame);




