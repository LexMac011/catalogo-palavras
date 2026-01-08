//const { AxesFactory } = require("matter");

const API_URL = 'https://catalogo-palavras-production.up.railway.app/api/words';
const wordsList = document.getElementById('wordsList');
const form = document.getElementById('wordForm');
const termInput = document.getElementById('term');
const definitionInput = document.getElementById('definition');
const submitButton = form.querySelector('button[type="submit"]');
const btnNovo = document.getElementById('btnNovo');

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

        listItem.innerHTML = `
            <p><strong>ID: ${word.id}</strong></p>
            <p>${word.term}:</p>
            <p>${word.definition}</p>`;
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

async function createWord(wordData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wordData)
    });
    return response
}

async function updateWord(id, wordData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wordData)
    });
    return response
}

async function editWord(id) {
    try {
        // 1. Busca os dados para preencher
        const wordToEdit = await fetchWordById(id);

        if (wordToEdit) {
            // 2. PREPARA A TELA (Isso deve acontecer ANTES do clique de salvar)
            termInput.value = wordToEdit.term;
            definitionInput.value = wordToEdit.definition;

            form.setAttribute('data-editing-id', id);
            submitButton.textContent = 'Atualizar Palavra';
            form.removeAttribute('hidden'); // Mostra o formulário agora!
            termInput.focus();

            console.log(`Editando a palavra: ${wordToEdit.term} (ID: ${id})`);

        };
    } catch (error) {
        console.error('Falha na comunicação com a API:', error);
    }
}

btnNovo.addEventListener('click', () => {
    form.reset();
    form.removeAttribute('data-editing-id');
    submitButton.textContent = 'Salvar';
    form.removeAttribute('hidden');
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = form.getAttribute('data-editing-id');
    const wordData = { term: termInput.value, definition: definitionInput.value };

    if (id) {
        await updateWord(id, wordData);
    } else {
        await createWord(wordData);
    }
    form.reset();
    form.removeAttribute('data-editing-id');
    form.setAttribute('hidden', true);
    fetchWords();
})

fetchWords();



