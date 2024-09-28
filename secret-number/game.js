const dbName = 'gameSettings';
const dbVersion = 1;
let db;

// Default settings
const defaultSettings = {
    id: 1, // Single record to update the settings
    players: [
        { name: "Captain Underpants" },
        { name: "Dog Man" }
    ],
    rounds: 5,
    minRange: 2,
    maxRange: 8
};
// Global settings
let settings;

// Mark the current round
let currentRound = 0;

// Elements for player name inputs
const playerInputs = document.getElementsByName('users[]');

// Initialize the sliders at the top level
let roundsSlider = document.getElementById('rounds-slider');
let roundsValue = document.getElementById('rounds-value');
let rangeSlider, rangeValue;

// Open the IndexedDB
const openDB = () => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        db.createObjectStore('settings', { keyPath: 'id' });
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        loadSettings(); // Load settings when the IndexedDB is successfully opened
    };

    request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.errorCode);
    };
};

const saveSettings = (settings) => {
    const transaction = db.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    store.put(settings);

    setCurrentPlayer(settings.players[0]);
};

const loadSettings = () => {
    const transaction = db.transaction(['settings'], 'readonly');
    const store = transaction.objectStore('settings');
    const request = store.get(1); // Assume only one record (id=1)

    request.onsuccess = (event) => {
        settings = Object.assign({}, defaultSettings, event.target.result,)// Replace `defaultSettings` elements by values from DB
        setCurrentPlayer(settings.players[0]);
        updateSettingsUI(settings); // Update UI with loaded or default settings

        // Now start the game!
        nextRound();
    };

    request.onerror = (event) => {
        console.error("Failed to load settings from IndexedDB:", event.target.errorCode);
    };
};

// Function to update all UI related to `settings`, not only in *Settings* modal,  based on the loaded or default values
const updateSettingsUI = (settings) => {
    // Populate player names in the inputs
    playerInputs[0].value = settings.players[0].name;
    playerInputs[1].value = settings.players[1].name;

    roundsSlider.noUiSlider.set(settings.rounds);
    rangeSlider.noUiSlider.set([settings.minRange, settings.maxRange]);

    roundsValue.textContent = settings.rounds;
    rangeValue.textContent = `Min: ${settings.minRange}, Max: ${settings.maxRange}`;
};

document.addEventListener("DOMContentLoaded", function () {
    openDB();

    // Initialize the `roundsSlider`
    noUiSlider.create(roundsSlider, {
        start: defaultSettings.rounds, // Default rounds value
        connect: [true, false],
        range: {
            'min': 3,
            'max': 15
        },
        tooltips: [true],
        format: {
            to: (value) => Math.round(value), // Show rounded numbers
            from: (value) => value
        },
        step: 1
    });

    roundsSlider.noUiSlider.on('update', function (values, handle) {
        roundsValue.textContent = values[handle];
    });

    // Initialize the `rangeSlider`
    rangeSlider = document.getElementById('range-slider');
    noUiSlider.create(rangeSlider, {
        start: [defaultSettings.minRange, defaultSettings.maxRange], // Default min and max
        connect: true,
        range: {
            'min': 1,
            'max': 100
        },
        tooltips: [true, true], // Tooltips for both handles
        format: {
            to: (value) => Math.round(value), // Show rounded numbers
            from: (value) => value
        },
        step: 1
    });

    rangeValue = document.getElementById('range-value');
    rangeSlider.noUiSlider.on('update', function (values, handle) {
        rangeValue.textContent = `Min: ${values[0]}, Max: ${values[1]}`;
    });

    // Save settings to IndexedDB
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    saveSettingsBtn.addEventListener('click', () => {
        const rounds = roundsSlider.noUiSlider.get();
        const [minRange, maxRange] = rangeSlider.noUiSlider.get();

        // Capture player names from input fields
        const players = [
            { name: playerInputs[0].value },
            { name: playerInputs[1].value }
        ];

        // Capture values to global settings
        settings = {
            id: 1, // Single record to update the settings
            players: players,
            rounds: Math.round(rounds),
            minRange: Math.round(minRange),
            maxRange: Math.round(maxRange)
        };

        saveSettings(settings);

        // Show a toast notification for saved settings
        showToast("Settings saved successfully!");
    });

    // Attach closed card callbacks 
    attachClosedCardCallbacks();

});

// Function to show a Bootstrap Toast instead of using an alert
const showToast = (message) => {
    const toastElement = document.getElementById('settingsToast');
    const toastBody = document.querySelector('#settingsToast .toast-body');
    toastBody.textContent = message;

    const toast = new bootstrap.Toast(toastElement);
    toast.show();
};

// Start next round
async function nextRound() {
    // Increase `currentRound`, end game if passes `settings.rounds`
    if (++currentRound > settings.rounds) {
        return gameFinished();
    }

    // TODO: get the next player and set it to `setCurrentPlayer
    // Update the `currentRound` in UI
    document.getElementById('current-turn').textContent = `Round: ${currentRound}`;

    const randomNumbers = [
        Math.floor(Math.random() * (settings.maxRange - settings.minRange + 1)) + settings.minRange,
        Math.floor(Math.random() * (settings.maxRange - settings.minRange + 1)) + settings.minRange
    ];

    const fakeNumbers = Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * (settings.maxRange - settings.minRange + 1)) + settings.minRange
    );

    const boxOpened = document.getElementById('box-opened');
    for (let i = 0; i < fakeNumbers.length; i++) {
        boxOpened.textContent = fakeNumbers[i];
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay of 100 milliseconds
    }

    boxOpened.textContent = randomNumbers[0];
    const boxClosed = document.getElementById('box-closed');
    boxClosed.textContent = randomNumbers[1];
}

// Attach closed cards behaviour
async function attachClosedCardCallbacks() {
    const boxClosed = document.getElementById('box-closed');

    boxClosed.addEventListener('touchstart', () => {
        boxClosed.classList.add('touched');
    });

    boxClosed.addEventListener('touchend', () => {
        setTimeout(() => {
            boxClosed.classList.remove('touched');
        }, 1000); // You can adjust the time before hiding again
    });
}
function setCurrentPlayer(player) {
    // Show current player's name
    document.getElementById('active-player').textContent = settings.players[0].name;
}

// After effect when game is finished (all rounds has been completed)
async function gameFinished() {
    alert("Congrats! Game is finished!");
}