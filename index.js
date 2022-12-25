class BaseError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

// Вспомогательный класс для проверок данных от API
class Country {
    static VALID_FIELDS = [
        'name',
        'tld',
        'cca2',
        'ccn3',
        'cca3',
        'cioc',
        'independent',
        'status',
        'unMember',
        'currencies',
        'idd',
        'capital',
        'altSpellings',
        'region',
        'subregion',
        'languages',
        'translations',
        'latlng',
        'landlocked',
        'borders',
        'area',
        'demonyms',
        'flag',
        'maps',
        'population',
        'gini',
        'fifa',
        'car',
        'timezones',
        'continents',
        'flags',
        'coatOfArms',
        'startOfWeek',
        'capitalInfo',
        'postalCode',
    ];

    // Возвращает true если страна имеет в поле borders непустой массив
    static hasBorders(country) {
        if (!Country.isCountry(country)) {
            return new BaseError(1001, 'Недопустимые значения аргументов.');
        }
        return country?.borders && country.borders.length !== 0;
    }

    // Проверяет имеет ли страна в поле borders код страны в формате cca3
    static hasBorder(country, border) {
        if (!Country.isCountry(country)) {
            return new BaseError(1001, 'Недопустимые значения аргументов.');
        }
        if (typeof border !== 'string') {
            return new BaseError(1001, 'Недопустимые значения аргументов.');
        }
        return country.borders.includes(border);
    }

    static isValidCountryField(field) {
        if (typeof field !== 'string') {
            return new BaseError(1001, 'Недопустимые значения аргументов.');
        }
        return this.VALID_FIELDS.includes(field);
    }

    static isCountry(country) {
        if (!country?.cca3 || !country?.latlng || !country?.name) {
            return false;
        }
        return Object.keys(country).every((field) => Country.isValidCountryField(field));
    }
}

// Вспомогательный класс для оформления ответа от функции поиска маршрута
class ResponseFindLandRouts {
    isFound = false;
    visited = new Map();
    routs = [];

    constructor(requestsCount = 0) {
        this.requestsCount = requestsCount;
    }
}

async function getData(url) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
    });

    if (!response.ok) {
        if (response.status === 400) {
            throw new BaseError(400, 'Некорректный запрос. Пожалуйста проверьте введенные данные.');
        }
        if (response.status === 404) {
            throw new BaseError(404, 'Информация не найдена. Пожалуйста проверьте введенные данные.');
        } else {
            throw new BaseError(1000, 'Что-то пошло не так. Попробуйте повторить запрос позже.');
        }
    }

    return response.json();
}

async function loadCountriesData() {
    const countries = await getData('https://restcountries.com/v3.1/all?fields=name&fields=cca3&fields=area');
    return countries.reduce((result, country) => {
        result[country.cca3] = country;
        return result;
    }, {});
}

// Функция для создания query строки
function getQueryString(...params) {
    return `?${params.join('&')}`;
}

const form = document.getElementById('form');
const fromCountry = document.getElementById('fromCountry');
const toCountry = document.getElementById('toCountry');
const countriesList = document.getElementById('countriesList');
const submit = document.getElementById('submit');
const output = document.getElementById('output');

(async () => {
    fromCountry.disabled = true;
    toCountry.disabled = true;
    submit.disabled = true;

    output.textContent = 'Loading…';
    const countriesData = await loadCountriesData();
    output.textContent = '';

    // Заполняем список стран для подсказки в инпутах
    Object.keys(countriesData)
        .sort((a, b) => countriesData[b].area - countriesData[a].area)
        .forEach((code) => {
            const option = document.createElement('option');
            option.value = countriesData[code].name.common;
            countriesList.appendChild(option);
        });

    fromCountry.disabled = false;
    toCountry.disabled = false;
    submit.disabled = false;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        // TODO: Вывести, откуда и куда едем, и что идёт расчёт.
        // TODO: Рассчитать маршрут из одной страны в другую за минимум запросов.
        // TODO: Вывести маршрут и общее количество запросов.
    });
})();
