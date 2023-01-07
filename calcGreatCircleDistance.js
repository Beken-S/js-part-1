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

export { calcGreatCircleDistance };
