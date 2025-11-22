const API_URL = 'http://localhost:8080/api/words';

const wordsList = document.getElementById('wordsList');

async function fetchWords() {

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const words = await response.json();

        console.log("Dados recebidos: ", words);

        displayWords(words);

        return words;

    } catch (error) {
        console.error('Falha na comunicação com a API:', error);
        return [];
    }

    function displayWords(words) {
        wordsList.innerHTML = '';

        if (words.length === 0) {
            wordsList.innerHTML = '<li>Nenhuma palavra cadastrada.</li>';
            return;
        }

        words.forEach(word => {
            const listItem = document.createElement('li');

            listItem.textContent = `[ID: ${word.id}] ${word.term}: ${word.definition}`;
            wordsList.appendChild(listItem);
        });
    }
}