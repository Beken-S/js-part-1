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

// Функция для расчета кратчайшего расстояния между точками по географическим координатам
// https://gis-lab.info/qa/great-circles.html
function calcGreatCircleDistance(lat1, long1, lat2, long2) {
    if (typeof lat1 !== 'number' || !Number.isFinite(lat1) || lat1 > 360) {
        throw new BaseError(1001, 'Недопустимые значения аргументов.');
    }
    if (typeof long1 !== 'number' || !Number.isFinite(long1) || long1 > 360) {
        throw new BaseError(1001, 'Недопустимые значения аргументов.');
    }
    if (typeof lat2 !== 'number' || !Number.isFinite(lat2) || lat2 > 360) {
        throw new BaseError(1001, 'Недопустимые значения аргументов.');
    }
    if (typeof long2 !== 'number' || !Number.isFinite(long2) || long2 > 360) {
        throw new BaseError(1001, 'Недопустимые значения аргументов.');
    }

    // Средний радиус Земли (WGS 84)
    const EARTH_RADIUS = 6371009;

    // Получение координат точек в радианах
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const long1Rad = (long1 * Math.PI) / 180;
    const long2Rad = (long2 * Math.PI) / 180;

    // Косинусы и синусы широт и разниц долгот
    const cl1 = Math.cos(lat1Rad);
    const cl2 = Math.cos(lat2Rad);
    const sl1 = Math.sin(lat1Rad);
    const sl2 = Math.sin(lat2Rad);
    const delta = long2Rad - long1Rad;
    const cDelta = Math.cos(delta);
    const sDelta = Math.sin(delta);

    // Вычисление углового расстояния
    const y = Math.sqrt(Math.pow(cl2 * sDelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cDelta, 2));
    const x = sl1 * sl2 + cl1 * cl2 * cDelta;
    const ad = Math.atan2(y, x);

    return Math.round(ad * EARTH_RADIUS);
}

function getRequestString(num) {
    if (typeof num !== 'number' || !Number.isFinite(num)) {
        throw new BaseError(1001, 'Недопустимые значения аргументов.');
    }

    let key = num;

    if (key > 100) {
        key %= 100;
    }
    if (key > 19) {
        key %= 10;
    }

    switch (key) {
        case 1:
            return `Потребовалось выполнить ${num} запрос.`;
        case 2:
        case 3:
        case 4:
            return `Потребовалось выполнить ${num} запроса.`;
        default:
            return `Потребовалось выполнить ${num} запросов.`;
    }
}

function getRoutsMarkup({ isFound, requestsCount, routs }) {
    if (isFound == null || requestsCount == null || routs == null) {
        return '';
    }
    if (isFound) {
        return `${routs.reduce((str, rout) => {
            str += `${rout.join(' &#129046; ')}<br />`;
            return str;
        }, '')}
        <br />
        ${getRequestString(requestsCount)}
        `;
    }
    return `Не удалось рассчитать маршрут.<br /><br />${getRequestString(requestsCount)}`;
}

function getSearchMarkup(from, to) {
    if (typeof from !== 'string' || typeof to !== 'string') {
        throw new BaseError(1001, 'Недопустимые значения аргументов.');
    }

    return `${from} &#129046; ${to} <br /><br /> Идет поиск... `;
}

function printInElement(string, output) {
    if (output instanceof HTMLElement) {
        output.innerHTML = string;
    }
}

function toggleUIDisable(...elements) {
    if (elements.every((element) => element instanceof HTMLElement)) {
        elements.forEach((element) => (element.disabled = !element.disabled));
    }
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
