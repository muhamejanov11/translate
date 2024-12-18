const API_KEY = '106571f753msheee1f008b03459dp121b40jsnaed92ea17639';
const LANGUAGES_URL = 'https://deep-translate1.p.rapidapi.com/language/translate/v2/languages';
const TRANSLATE_URL = 'https://deep-translate1.p.rapidapi.com/language/translate/v2';

const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const translateBtn = document.getElementById('translateBtn');
const speakBtn = document.getElementById('speakBtn');

async function fetchLanguages() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com',
        },
    };

    try {
        const response = await fetch(LANGUAGES_URL, options);

        if (!response.ok) {
            throw new Error(`Ошибка загрузки языков: ${response.statusText}`);
        }

        const result = await response.json();

        if (result && result.languages) {
            const languages = result.languages;

            sourceLang.innerHTML = '';
            targetLang.innerHTML = '';

            languages.forEach(lang => {
                const option = `<option value="${lang.code}">${lang.name}</option>`;
                sourceLang.innerHTML += option;
                targetLang.innerHTML += option;
            });

            sourceLang.value = 'en';
            targetLang.value = 'ru';
        } else {
            alert('Не удалось загрузить языки.');
        }
    } catch (error) {
        console.error('Ошибка при загрузке языков:', error);
        alert('Ошибка при загрузке языков. Проверьте подключение к интернету или API-ключ.');
    }
}

async function fetchTranslation() {
    const text = inputText.value.trim();
    if (!text) {
        alert('Введите текст для перевода!');
        return;
    }

    const body = {
        q: text,
        source: sourceLang.value,
        target: targetLang.value,
    };

    const options = {
        method: 'POST',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    };

    try {
        const response = await fetch(TRANSLATE_URL, options);

        if (!response.ok) {
            throw new Error(`Ошибка перевода: ${response.statusText}`);
        }

        const result = await response.json();

        if (result && result.data && result.data.translations) {
            outputText.value = result.data.translations.translatedText;
        } else {
            alert('Ошибка перевода. Попробуйте снова.');
        }
    } catch (error) {
        console.error('Ошибка перевода:', error);
        alert('Ошибка при выполнении перевода. Проверьте API-ключ или данные.');
    }
}

function speakText() {
    if (!outputText.value) {
        alert('Нет текста для озвучивания!');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(outputText.value);
    utterance.lang = targetLang.value;
    window.speechSynthesis.speak(utterance);
}

translateBtn.addEventListener('click', fetchTranslation);
speakBtn.addEventListener('click', speakText);

fetchLanguages();
