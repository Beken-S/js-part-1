class BaseError extends Error {
    constructor(public status: number, public message: string) {
        super(message);
        this.status = status;
    }
}

const CCA3_CODES = [
    'VCT',
    'GUF',
    'FRO',
    'PAK',
    'FJI',
    'MNG',
    'CCK',
    'FSM',
    'NOR',
    'MRT',
    'ESP',
    'TUR',
    'ARE',
    'COD',
    'NCL',
    'RWA',
    'AUS',
    'IMN',
    'IDN',
    'ZMB',
    'JEY',
    'URY',
    'CAN',
    'PER',
    'MSR',
    'ATG',
    'DMA',
    'KHM',
    'FLK',
    'GUM',
    'PNG',
    'SYC',
    'LBR',
    'CPV',
    'GRD',
    'CUB',
    'DJI',
    'LBN',
    'MMR',
    'CYM',
    'GAB',
    'PYF',
    'ZAF',
    'SUR',
    'CRI',
    'CAF',
    'TCA',
    'LIE',
    'NIU',
    'UMI',
    'PRK',
    'UKR',
    'GNB',
    'ATA',
    'MYT',
    'TUV',
    'MAR',
    'MDA',
    'OMN',
    'ITA',
    'YEM',
    'KWT',
    'PRI',
    'PSE',
    'COL',
    'MKD',
    'QAT',
    'TWN',
    'MDG',
    'BHS',
    'CUW',
    'SLB',
    'SHN',
    'HND',
    'ARM',
    'GTM',
    'TGO',
    'SEN',
    'CZE',
    'UNK',
    'MHL',
    'MUS',
    'GEO',
    'PHL',
    'ALB',
    'JAM',
    'SRB',
    'CHL',
    'GUY',
    'TZA',
    'BGD',
    'ECU',
    'CYP',
    'DOM',
    'SGS',
    'ALA',
    'FIN',
    'KOR',
    'BFA',
    'NFK',
    'PRT',
    'BRB',
    'JOR',
    'NGA',
    'BHR',
    'KIR',
    'STP',
    'CHN',
    'CHE',
    'KEN',
    'MDV',
    'SLV',
    'KNA',
    'BRN',
    'BEN',
    'GIN',
    'MAC',
    'USA',
    'ERI',
    'SWE',
    'ATF',
    'GHA',
    'DNK',
    'BGR',
    'BWA',
    'IRN',
    'BVT',
    'BOL',
    'PCN',
    'BLR',
    'BMU',
    'KAZ',
    'LAO',
    'UZB',
    'MYS',
    'VGB',
    'SPM',
    'ISL',
    'GRC',
    'PRY',
    'CMR',
    'PLW',
    'BRA',
    'BLM',
    'AIA',
    'ETH',
    'DEU',
    'HUN',
    'SDN',
    'SOM',
    'LTU',
    'AGO',
    'GNQ',
    'SAU',
    'EST',
    'LUX',
    'ZWE',
    'NZL',
    'VEN',
    'GMB',
    'WLF',
    'BEL',
    'BLZ',
    'ESH',
    'SVN',
    'SYR',
    'JPN',
    'RUS',
    'LSO',
    'IRL',
    'MNE',
    'AND',
    'NLD',
    'LVA',
    'TUN',
    'ABW',
    'HRV',
    'MLI',
    'AFG',
    'SLE',
    'IRQ',
    'COM',
    'EGY',
    'VNM',
    'VAT',
    'SXM',
    'SVK',
    'SGP',
    'COK',
    'SWZ',
    'TON',
    'COG',
    'GGY',
    'GLP',
    'NAM',
    'TTO',
    'BTN',
    'HKG',
    'SSD',
    'SMR',
    'TJK',
    'UGA',
    'WSM',
    'DZA',
    'CIV',
    'VIR',
    'AZE',
    'LKA',
    'CXR',
    'TCD',
    'ARG',
    'IND',
    'MAF',
    'HTI',
    'LCA',
    'NPL',
    'TKL',
    'TKM',
    'ISR',
    'BES',
    'MLT',
    'MNP',
    'MWI',
    'GIB',
    'VUT',
    'GBR',
    'MTQ',
    'MEX',
    'BIH',
    'ROU',
    'SJM',
    'HMD',
    'IOT',
    'REU',
    'KGZ',
    'THA',
    'BDI',
    'GRL',
    'AUT',
    'FRA',
    'MCO',
    'NRU',
    'NER',
    'ASM',
    'MOZ',
    'TLS',
    'NIC',
    'PAN',
    'POL',
    'LBY',
] as const;
type Cca3Code = typeof CCA3_CODES[number];
function isCca3Code(code: unknown): code is Cca3Code {
    return CCA3_CODES.includes(code as Cca3Code);
}

type Translation = {
    official: string;
    common: string;
};
function isTranslation(obj: unknown): obj is Translation {
    return (
        typeof obj === 'object' &&
        obj != null &&
        typeof Reflect.get(obj, 'official') === 'string' &&
        typeof Reflect.get(obj, 'common') === 'string'
    );
}

const TRANSLATIONS = ['rus'] as const;
type Translations = {
    [K in typeof TRANSLATIONS[number]]: Translation;
};
function isTranslations(obj: unknown): obj is Translations {
    return typeof obj === 'object' && obj != null && TRANSLATIONS.every((key) => isTranslation(Reflect.get(obj, key)));
}

type LatLong = [number, number];
function isLatLong(arr: unknown): arr is LatLong {
    return Array.isArray(arr) && arr.length === 2 && arr.every((value) => typeof value === 'number');
}

type Borders = Cca3Code[];
function isBorders(arr: unknown): arr is Cca3Code[] {
    return Array.isArray(arr) && (arr.length == 0 || arr.every((value) => isCca3Code(value)));
}

type Country = {
    name: string;
    cca3: Cca3Code;
    borders: Borders;
    translations: Translations;
    latlng: LatLong;
};
function isCountry(obj: unknown): obj is Country {
    return (
        typeof obj === 'object' &&
        obj != null &&
        typeof Reflect.get(obj, 'name') === 'string' &&
        isCca3Code(Reflect.get(obj, 'cca3')) &&
        isBorders(Reflect.get(obj, 'borders')) &&
        isTranslations(Reflect.get(obj, 'translations')) &&
        isLatLong(Reflect.get(obj, 'latlng'))
    );
}
function isCountryArray(arr: unknown): arr is Country[] {
    return Array.isArray(arr) && arr.every((value) => !isCountry(value));
}

function hasBorders(country: Country): boolean {
    return country.borders.length !== 0;
}

// Проверяет имеет ли страна в поле borders код страны в формате cca3
function hasBorder(country: Country, border: Cca3Code): boolean {
    return country.borders.includes(border);
}

// Вспомогательный класс для оформления ответа от функции поиска маршрута
class ResponseFindLandRouts {
    public isFound: boolean = false;
    public visited: Map<Cca3Code, boolean> = new Map();
    public routs: string[][] = [];
    public requestsCount: number;

    constructor(requestsCount = 0) {
        this.requestsCount = requestsCount;
    }
}

class RESTCountriesAPIProvider {
    private readonly URL = 'https://restcountries.com/v3.1';
    private readonly cash: Map<Cca3Code, Country> = new Map();
    private readonly fullTextQueryParam: string = 'fullText=true';
    private readonly fieldsQueryParams: string;
    private requestsCount = 0;

    constructor(...fields: string[]) {
        this.fieldsQueryParams = RESTCountriesAPIProvider.getFieldsQueryParams(fields);
    }

    // Для формирования query строки с полями ответа
    private static getFieldsQueryParams(fields: string[]): string {
        const set = new Set(fields);
        set.add('cca3');
        set.add('name');
        set.add('borders');
        set.add('latlng');
        set.add('translations');
        return [...set].map(RESTCountriesAPIProvider.getFieldQueryParam).join('&');
    }

    // Для формирования query строки с полями ответа
    private static getFieldQueryParam(field: string): string {
        return `fields=${field}`;
    }

    public async getCountryAll(): Promise<Country[]> {
        this.requestsCount += 1;
        const { URL, fieldsQueryParams } = this;
        const result = await getData(`${URL}/all${getQueryString(fieldsQueryParams)}`);

        if (!isCountryArray(result)) {
            throw new BaseError(1001, 'Неверный ответ от севера');
        }

        result
            .sort((a, b) => {
                const nameA = a.translations.rus.common;
                const nameB = b.translations.rus.common;

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            })
            .forEach((country) => {
                this.cash.set(country.cca3, country);
            });

        return result;
    }

    // Получения страны от API по коду cca3
    public async getCountryByCode(code: Cca3Code): Promise<Country> {
        // Проверяем есть ли в кеше страна
        if (this.cash.has(code)) {
            return this.cash.get(code) as Country;
        }

        this.requestsCount += 1; // увеличиваем счетчик запросов
        const { URL, fieldsQueryParams } = this;
        const result = await getData(`${URL}/alpha/${code}${getQueryString(fieldsQueryParams)}`);

        // Если в ответе придет массив стран добавляем все станы в кеш и возвращаем искомую
        if (isCountryArray(result)) {
            result.forEach((country) => this.cash.set(country.cca3, country));
            const desiredCountry = result.find((country) => country.cca3 === code);

            if (desiredCountry == null) {
                throw new BaseError(1001, 'Неверный ответ от севера');
            }

            return desiredCountry;
        }

        if (!isCountry(result)) {
            throw new BaseError(1001, 'Неверный ответ от севера');
        }

        this.cash.set(result.cca3, result); // добавляем страну в кеш
        return result;
    }

    // Получения стран от API по массиву кодов cca3
    public async getCountriesByCodes(codes: Cca3Code[]): Promise<Country[]> {
        return Promise.all(codes.map(this.getCountryByCode.bind(this)));
    }

    // Функция расчета сухопутного маршрута
    public async findLandRouts(
        from: Country,
        to: Country,
        depth = 10,
        result = new ResponseFindLandRouts(this.requestsCount),
        currentRout: string[] = []
    ): Promise<ResponseFindLandRouts> {
        // Проверка наличия сухопутных границ у заданных стран
        if (!hasBorders(from)) {
            throw new BaseError(
                2000,
                'Страна отправления не имеет сухопутных границ. Попробуйте выбрать другую страну.'
            );
        }
        if (!hasBorders(to)) {
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
            return result;
        }

        // Отметить узел как посещенный
        result.visited.set(from.cca3, true);

        // Если узел граничит с местом назначения вернуть результат поиска
        if (hasBorder(from, to.cca3)) {
            result.isFound = true;
            result.routs.push([...currentRout, from.translations.rus.common, to.translations.rus.common]);
            return result;
        }

        // Если маршрут уже найден в другом промисе прекратить поиск
        if (result.isFound) {
            return result;
        }

        // Отфильтровать посещенные узлы
        const filteredBorders = from.borders.filter((cca3) => !result.visited.get(cca3));

        if (filteredBorders.length === 0) {
            return result;
        }

        const countries = await this.getCountriesByCodes(filteredBorders);
        result.requestsCount = this.requestsCount;

        // Отсортировать полученные от API страны по степени удаления от места назначения
        const sortedCountries = countries
            .map((country) => ({
                country,
                dist: calcGreatCircleDistance(...country.latlng, ...to.latlng),
            }))
            .sort((a, b) => a.dist - b.dist);

        // Рекурсивно вызвать функцию для отсортированного массива стран
        return Promise.all(
            sortedCountries.map((sortedCountry) =>
                this.findLandRouts(sortedCountry.country, to, depth - 1, result, [
                    ...currentRout,
                    from.translations.rus.common,
                ])
            )
        )
            .then((result) => result.flat())
            .then((flatResult) => flatResult[0]);
    }
}

async function getData(url: string): Promise<unknown> {
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

// Функция для создания query строки
function getQueryString(...params: string[]): string {
    return `?${params.join('&')}`;
}

// Функция для расчета кратчайшего расстояния между точками по географическим координатам
// https://gis-lab.info/qa/great-circles.html
function calcGreatCircleDistance(lat1: number, long1: number, lat2: number, long2: number): number {
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

function getRequestString(num: number): string {
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

function getRoutsMarkup({ isFound, requestsCount, routs }: ResponseFindLandRouts): string {
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

function getLoadingMarkup(): string {
    return 'Идет загрузка...';
}

function getSearchMarkup(from: string, to: string) {
    return `${from} &#129046; ${to} <br /><br /> Идет поиск... `;
}

function fillDatalist(datalist: HTMLDataListElement, countriesData: Country[]): Map<string, Cca3Code> {
    const optionsList: DocumentFragment = document.createDocumentFragment();
    const countriesNameMap: Map<string, Cca3Code> = new Map();

    countriesData.forEach((country) => {
        const option: HTMLOptionElement = document.createElement('option');
        option.value = country?.translations.rus.common;
        optionsList.appendChild(option);
        countriesNameMap.set(country?.translations.rus.common, country?.cca3);
    });

    datalist.appendChild(optionsList);

    return countriesNameMap;
}

function printInElement(str: string, output: HTMLElement): void {
    output.innerHTML = str;
}

function toggleUIDisable(...elements: Array<HTMLInputElement | HTMLButtonElement>): void {
    elements.forEach((element) => (element.disabled = !element.disabled));
}

function errorHandler(err: Error, output: HTMLElement) {
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

if (
    !(form instanceof HTMLFormElement) ||
    !(fromCountry instanceof HTMLInputElement) ||
    !(toCountry instanceof HTMLInputElement) ||
    !(countriesList instanceof HTMLDataListElement) ||
    !(submit instanceof HTMLButtonElement) ||
    !(output instanceof HTMLDivElement)
) {
    throw new Error('Не найден или неверный DOM элемент.');
}

(async () => {
    try {
        toggleUIDisable(fromCountry, toCountry, submit);
        printInElement(getLoadingMarkup(), output);

        const API = new RESTCountriesAPIProvider();

        const countriesData = await API.getCountryAll();
        printInElement('', output);

        // Заполняем список стран для подсказки в инпутах
        const countriesNameMap = fillDatalist(countriesList, countriesData);

        toggleUIDisable(fromCountry, toCountry, submit);

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
                const fromCountryCode = countriesNameMap.get(fromCountry.value);
                const toCountryCode = countriesNameMap.get(toCountry.value);

                if (fromCountryCode == null || toCountryCode == null) {
                    throw new BaseError(404, `Одна или обе страны не найдены. Пожалуйста проверьте введенные данные.`);
                }

                const [from, to] = await Promise.all([
                    API.getCountryByCode(fromCountryCode),
                    API.getCountryByCode(toCountryCode),
                ]).then((result) => result.flat());
                const routs = await API.findLandRouts(from, to);

                toggleUIDisable(fromCountry, toCountry, submit);

                // TODO: Вывести маршрут и общее количество запросов.
                printInElement(getRoutsMarkup(routs), output);
            } catch (err: unknown) {
                toggleUIDisable(fromCountry, toCountry, submit);
                if (err instanceof Error) {
                    errorHandler(err, output);
                }
            }
        });
    } catch (err: unknown) {
        toggleUIDisable(fromCountry, toCountry, submit);
        if (err instanceof Error) {
            errorHandler(err, output);
        }
    }
})();
