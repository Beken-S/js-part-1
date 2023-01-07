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
];

function isCca3Code(code) {
    return CCA3_CODES.includes(code);
}

function isName(value) {
    return (
        typeof value === 'object' &&
        value != null &&
        'common' in value &&
        'official' in value &&
        typeof value.common === 'string' &&
        typeof value.official === 'string'
    );
}

function isBorders(arr) {
    return Array.isArray(arr) && (arr.length === 0 || arr.every((value) => isCca3Code(value)));
}

function isLatLong(arr) {
    return (
        Array.isArray(arr) &&
        arr.length === 2 &&
        arr.every((value, index) => {
            return typeof value === 'number' && Number.isFinite(value) && index === 0
                ? Math.abs(value) <= 90
                : Math.abs(value) <= 180;
        })
    );
}

function isCountry(value) {
    return (
        typeof value === 'object' &&
        value != null &&
        'name' in value &&
        'cca3' in value &&
        'borders' in value &&
        'latlng' in value &&
        isName(value.name) &&
        isCca3Code(value.cca3) &&
        isBorders(value.borders) &&
        isLatLong(value.latlng)
    );
}

function isCountryArray(arr) {
    return Array.isArray(arr) && arr.every((value) => isCountry(value));
}

// Возвращает true если страна имеет в поле borders непустой массив
function hasBorders(country) {
    return country.borders.length !== 0;
}

// Проверяет имеет ли страна в поле borders код страны в формате cca3
function hasBorder(country, code) {
    return country.borders.includes(code);
}

export { CCA3_CODES, isCca3Code, isName, isBorders, isLatLong, isCountry, isCountryArray, hasBorder, hasBorders };
