//const { AxesFactory } = require("matter");

const API_URL = 'http://localhost:8081/api/words';

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
}
/**
 * Busca um único objeto Palavra na API por ID (GET /api/words/{id}).
 * @param {number} id - O ID da palavra a ser buscada.
 * @returns {object|null} O objeto Palavra ou null em caso de falha.
 */
async function fetchWordById(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            console.error(`Erro ${response.status}: Palavra Id ${id} não encontrada.`);
            return null;
        }

        return response.json();

    } catch (error) {
        console.error('Falha de rede ao buscar palavra por ID:', error);
        return null;
    }
}

function displayWords(words) {
    wordsList.innerHTML = '';

    if (words.length === 0) {
        wordsList.innerHTML = '<li>Nenhuma palavra cadastrada.</li>';
        return;
    }

    words.forEach(word => {
        const listItem = document.createElement('li');
        // botoẽs
        const deleteButton = document.createElement('button');
        const editButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        editButton.textContent = 'Editar';

        // **A CHAVE:** Liga o evento de clique à nova função.
        // O valor `word.id` é o ID que veio do Java, e é passado como argumento.
        deleteButton.addEventListener('click', () => {
            deleteWord(word.id);
        });
        editButton.addEventListener('click', () => {
            editWord(word.id);
        });

        listItem.textContent = `[ID: ${word.id}] ${word.term}: ${word.definition}`;
        listItem.appendChild(deleteButton);
        listItem.appendChild(editButton);
        wordsList.appendChild(listItem);
    });
}

async function deleteWord(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`,
            { method: 'DELETE' }
        );
        if (response.ok) {
            console.log(`Palavra com ID ${id} excluída com sucesso.`);

            fetchWords();

        }
    } catch (error) {
        console.error('Falha na comunicação com a API:', error);
    }
}

async function editWord(id) {
    try {
        const wordToEdit = await fetchWordById(id);

        if (!wordToEdit) {
            alert('Não foi possível carregar os dados para edição.');
            return;
        }
    } catch (error) {

    }

}


