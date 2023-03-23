// Get the input field, search button, API key, and other required elements
const input = document.querySelector('#input');
const searchBtn = document.querySelector('#search');
const apiKey = '';  //add API Key here..
const notFound = document.querySelector('.not__found');
const defBox = document.querySelector('.def');
const audioBox = document.querySelector('.audio');
const loading = document.querySelector('.loading');

// Add event listener to the search button to handle search requests
searchBtn.addEventListener('click', handleSearch);

// handle search requests.
async function handleSearch(e) {
    e.preventDefault();

    // clear data from the previous search.
    clearData();

    // Get input data
    const word = input.value.trim();
    if (word === '') {
        alert('Word is required');
        return;
    }

    // call API to get data
    const data = await getData(word);

    // Show not found message if no data is returned 
    if (data.length === 0) {
        showNotFound();
        return;
    }

    
    if (typeof data[0] === 'string') {
        showSuggestions(data);
        return;
    }

     // Show definition and audio pronunciation if single meaning is found
    showDefinition(data[0]);
    showSound(data[0]);
}

// fetch data from the API.
async function getData(word) {
    // Display the loading indicator while fetching the data
    loading.style.display = 'block';
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`);
    
    // Parse the response into JSON format
    const data = await response.json();

    // Hide the loading indicator once the data is fetched
    loading.style.display = 'none';
    return data;
}

// Clear data from the previous search
function clearData() {
    audioBox.innerHTML = '';
    notFound.innerText = '';
    defBox.innerText = '';
}

// Show not found message
function showNotFound() {
    notFound.innerText = ' No result found';
}

function showSuggestions(data) {
    const heading = document.createElement('h3');
    heading.innerText = 'Did you mean?';
    notFound.appendChild(heading);
    data.forEach(element => {
        const suggestion = document.createElement('span');
        suggestion.classList.add('suggested');
        suggestion.innerText = element;
        notFound.appendChild(suggestion);
    });
}  

// Show definition if single meaning is found
function showDefinition(data) {
    const definition = data.shortdef[0];
    defBox.innerText = definition;
}

// Show audio pronunciation if available
function showSound(data) {
    const sound = data.hwi.prs[0].sound.audio;
    if(sound) {
        const soundSrc = `https://media.merriam-webster.com/soundc11/${sound.charAt(0)}/${sound}.wav?key=${apiKey}`;
        const audio = document.createElement('audio');
        audio.src = soundSrc;
        audio.controls = true;
        audioBox.appendChild(audio);
    }
}
