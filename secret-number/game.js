const dbName = 'gameSettings';
const dbVersion = 1;
let db;

// Default settings
const defaultSettings = {
    id: 1, // Single record to update the settings
    rounds: 5,
    minRange: 2,
    maxRange: 8
};
// Global settings
let settings;

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
};

const loadSettings = () => {
    const transaction = db.transaction(['settings'], 'readonly');
    const store = transaction.objectStore('settings');
    const request = store.get(1); // Assume only one record (id=1)

    request.onsuccess = (event) => {
        settings = event.target.result || defaultSettings; // If no settings in DB, use default
        updateSettingsUI(settings); // t: Refactored to update UI with loaded or default settings
    };

    request.onerror = (event) => {
        console.error("Failed to load settings from IndexedDB:", event.target.errorCode);
    };
};

// Function to update UI settings based on the loaded or default values
const updateSettingsUI = (settings) => {
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

        // Capture values to global settings
        settings = {
            id: 1, // Single record to update the settings
            rounds: Math.round(rounds),
            minRange: Math.round(minRange),
            maxRange: Math.round(maxRange)
        };

        saveSettings(settings);

        // Show a toast notification for saved settings
        showToast("Settings saved successfully!");
    });
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
    // Generate 2 random numbers. Starts from `settings.minRange` to `settings.maxRange`
    const randomNumbers = [
        Math.floor(Math.random() * (settings.maxRange - settings.minRange + 1)) + settings.minRange,
        Math.floor(Math.random() * (settings.maxRange - settings.minRange + 1)) + settings.minRange
    ];

    // Generate 12 random numbers within the same range
    const fakeNumbers = Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * (settings.maxRange - settings.minRange + 1)) + settings.minRange
    );


    // Every 200 milliseconds put each `fakeNumbers` consecutively to HTML element `#box-opened`
    const boxOpened = document.getElementById('box-opened');
    for (let i = 0; i < fakeNumbers.length; i++) {
        boxOpened.textContent = fakeNumbers[i];
        await new Promise(resolve => setTimeout(resolve, 200)); // Delay of 200 milliseconds
    }

    // Render randomNumbers[0] to `#box-opened` and `randomNumbers[1]` to `#box-closed`
    boxOpened.textContent = randomNumbers[0];
    const boxClosed = document.getElementById('box-closed');
    boxClosed.textContent = randomNumbers[1];
}