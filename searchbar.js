const buildingNames = [
    "Arca",
    "Samonte",
    "Rodriguez",
    "Mascardo",
    "CSS",
    "Hard Trade",
    "Soft Trade 1",
    "Soft Trade 2"
];

const searchBar = document.getElementById('searchBar');
const suggestionsContainer = document.getElementById('suggestions');

searchBar.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    suggestionsContainer.innerHTML = '';

    if (query) {
        const filteredNames = buildingNames.filter(name => name.toLowerCase().includes(query));
        filteredNames.forEach(name => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.textContent = name;
            suggestionItem.onclick = function() {
                searchBar.value = name;
                suggestionsContainer.innerHTML = '';
            };
            suggestionsContainer.appendChild(suggestionItem);
        });
    }
});

// Function of directions button
function onDirectionsButtonClick() {
    if (!searchBar.value.trim()) {
        alert("Please enter a building name.");
        return;
    }

    const directionsButton = document.getElementById("directionsButton");
    directionsButton.disabled = true;
    directionsButton.textContent = "Loading...";

    const iframe = document.getElementById("mapIframe");
    if (iframe && iframe.contentWindow && iframe.contentWindow.unityInstance) {
        const unityInstance = iframe.contentWindow.unityInstance;

        if (unityInstance) {
            console.log("Sending message to Unity: " + searchBar.value.trim());
            unityInstance.SendMessage("PathManagerObject", "ShowPath", searchBar.value.trim());

            // Focus to iframe
            iframe.focus();
        } else {
            console.error("Unity instance is not available.");
            alert("Unity instance is not available.");
        }

    } else {
        console.error("Iframe or Unity instance not loaded.");
        alert("Iframe or Unity instance not loaded.");
    }

    directionsButton.disabled = false;
    directionsButton.textContent = "Directions";
}

// Function of map loading
function onMapLoaded() {
    console.log("Unity map has finished loading");
    
    // Wait
    function waitForUnity() {
        if (typeof unityInstance !== 'undefined') {
            console.log("Unity instance is available.");
            return true;
        } else {
            console.log("Waiting for Unity instance...");
            setTimeout(waitForUnity, 100);
        }
    }

    // Check for Unity instance
    waitForUnity();
}

window.onload = function() {
    resizeIframe();
    onMapLoaded();
};

// Function of iframe resizing
function resizeIframe() {
    var iframe = document.getElementById('mapIframe');
    var iframeWindow = iframe.contentWindow || iframe.contentDocument.parentWindow;
    var contentHeight = iframeWindow.document.body.scrollHeight;

    if (contentHeight > iframe.style.height) {
        iframe.style.height = contentHeight + 'px';
    }
}

// For Iframze content resizing
setInterval(resizeIframe, 100);

// Ifram still moving when clicked outside
document.addEventListener('click', function(event) {
    const iframe = document.getElementById('mapIframe');
    const mapContainer = document.getElementById('mapContainer');

    // Click outside
    if (!mapContainer.contains(event.target)) {
        // Refocus the iframe
        iframe.focus();
    }
});