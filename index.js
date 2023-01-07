import Maps from '/maps.js';

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
        return country?.borders && country.borders.length !== 0;
    }

    // Проверяет имеет ли страна в поле borders код страны в формате cca3
    static hasBorder(country, border) {
        return country.borders.includes(border);
    }

    static isValidCountryField(field) {
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

class RESTCountriesAPIProvider {
    static BASE_URL = 'https://restcountries.com';
    byCodeParams = new URLSearchParams([
        ['fields', 'cca3'],
        ['fields', 'name'],
        ['fields', 'borders'],
        ['fields', 'latlng'],
    ]);
    requestsCount = 0;
    cash = new Map();

    constructor(...fields) {
        if (fields != null) {
            fields.forEach((field) => this.byCodeParams.append('fields', field));
        }
        this.byNameParams = new URLSearchParams(this.byCodeParams.toString()).append('fullText', 'true');
    }

    // Получения страны от API по коду cca3
    async getCountryByCode(code) {
        // Проверяем есть ли в кеше страна
        if (this.cash.has(code)) {
            return this.cash.get(code);
        }

        this.requestsCount += 1; // увеличиваем счетчик запросов
        const getCountryByCodeURL = new URL(`v3.1/alpha/${code}`, RESTCountriesAPIProvider.BASE_URL);
        getCountryByCodeURL.search = this.byCodeParams.toString();
        const result = await getData(getCountryByCodeURL.toString());

        // Если в ответе придет массив стран добавляем все станы в кеш и возвращаем искомую
        if (Array.isArray(result)) {
            result.forEach((country) => this.cash.set(country.cca3, country));
            return result.find((country) => country.cca3 === code);
        }

        this.cash.set(result.cca3, result); // добавляем страну в кеш
        return result;
    }

    // Получения стран от API по массиву кодов cca3
    async getCountriesByCodes(codes) {
        return Promise.all(codes.map(this.getCountryByCode.bind(this)));
    }

    // Функция расчета сухопутного маршрута
    async findLandRouts(
        from,
        to,
        depth = 10,
        result = new ResponseFindLandRouts(this.requestsCount),
        currentRout = []
    ) {
        // Проверка наличия сухопутных границ у заданных стран
        if (!Country.hasBorders(from)) {
            throw new BaseError(
                2000,
                'Страна отправления не имеет сухопутных границ. Попробуйте выбрать другую страну.'
            );
        }
        if (!Country.hasBorders(to)) {
            throw new BaseError(
                2000,
                'Страна назначения не имеет сухопутных границ. Попробуйте выбрать другую страну.'
            );
        }

        // Проверка глубины поиска
        if (depth < 0) {
            return result;
        }

        // Если узел уже посещен вернуть reject
        if (result.visited.get(from.cca3)) {
            return Promise.reject('Узел уже посещен.');
        }

        // Отметить узел как посещенный
        result.visited.set(from.cca3, true);

        // Если узел граничит с местом назначения вернуть результат поиска
        if (Country.hasBorder(from, to.cca3)) {
            result.isFound = true;
            result.routs.push([...currentRout, from.name.common, to.name.common]);
            return result;
        }

        // Если маршрут уже найден в другом промисе прекратить поиск
        if (result.isFound) {
            return result;
        }

        // Отфильтровать посещенные узлы
        const filteredBorders = from.borders.filter((cca3) => !result.visited.get(cca3));
        const countries = await this.getCountriesByCodes(filteredBorders);
        Maps.markAsVisited(filteredBorders);
        result.requestsCount = this.requestsCount;

        if (countries.length === 0) {
            return Promise.reject('Нет стран для продолжения поиска.');
        }

        // Отсортировать полученные от API страны по степени удаления от места назначения
        const sortedCountries = countries
            .map((country) => ({
                country,
                dist: calcGreatCircleDistance(...country.latlng, ...to.latlng),
            }))
            .sort((a, b) => a.dist - b.dist);

        // Если маршрут не найден рекурсивно вызвать функцию для отсортированного массива стран
        return Promise.any(
            sortedCountries.map((sortedCountry) =>
                this.findLandRouts(sortedCountry.country, to, depth - 1, result, [...currentRout, from.name.common])
            )
        );
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

// Функция для расчета кратчайшего расстояния между точками по географическим координатам
// https://gis-lab.info/qa/great-circles.html
function calcGreatCircleDistance(lat1, long1, lat2, long2) {
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
    return `${from} &#129046; ${to} <br /><br /> Идет поиск... `;
}

function printInElement(string, output) {
    if (output instanceof HTMLElement) {
        output.innerHTML = string;
    }
}

function toggleUIDisable(...elements) {
    elements.forEach((element) => (element.disabled = !element.disabled));
}

function errorHandler(err, output) {
    if (err instanceof BaseError) {
        switch (err.status) {
            case 400:
            case 404:
            case 1000:
            case 2000:
            case 2001:
                printInElement(err.message, output);
                break;
            default:
                printInElement('Что-то пошло не так. Попробуйте повторит запрос позже', output);
                console.error(err);
                break;
        }
    } else {
        printInElement('Что-то пошло не так. Попробуйте повторить запрос позже.', output);
        console.error(err);
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

    form.addEventListener('submit', async (event) => {
        try {
            event.preventDefault();
            toggleUIDisable(fromCountry, toCountry, submit);

            if (fromCountry.value === '' || toCountry.value === '') {
                throw new BaseError(2001, 'Оба поля должны быть заполнены.');
            }

            // TODO: Вывести, откуда и куда едем, и что идёт расчёт.
            printInElement(getSearchMarkup(fromCountry.value, toCountry.value), output);

            // TODO: Рассчитать маршрут из одной страны в другую за минимум запросов.
            const API = new RESTCountriesAPIProvider();
            const cca3Codes = Object.keys(countriesData).reduce((codes, code) => {
                if (countriesData[code].name.common === fromCountry.value) {
                    codes[0] = code;
                }
                if (countriesData[code].name.common === toCountry.value) {
                    codes[1] = code;
                }
                return codes;
            }, []);

            const [from, to] = await API.getCountriesByCodes(cca3Codes);
            Maps.setEndPoints(from.cca3, to.cca3);
            const result = await API.findLandRouts(from, to);

            toggleUIDisable(fromCountry, toCountry, submit);

            // TODO: Вывести маршрут и общее количество запросов.
            printInElement(getRoutsMarkup(result), output);
        } catch (err) {
            toggleUIDisable(fromCountry, toCountry, submit);
            errorHandler(err, output);
        }
    });
})();
