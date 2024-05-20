export const generateRandomEarthquakeData = (count: number) => {
    const isoCodes = ['us', 'ca', 'gb', 'au', 'nz', 'in', 'cn', 'jp', 'br', 'ar', 'lb'];
    const earthquakes = [];

    for (let i = 0; i < count; i++) {
        const latitude = Math.random() * (90 - (-90)) + (-90);
        const longitude = Math.random() * (180 - (-180)) + (-180);
        const magnitude = Math.random() * (10 - 1) + 1;
        const timestamp = new Date().toISOString();

        const isoCode = isoCodes[Math.floor(Math.random() * isoCodes.length)];

        earthquakes.push({
            id: i + 1,
            latitude,
            longitude,
            magnitude: parseFloat(magnitude.toFixed(1)), // Round magnitude to one decimal place
            time: timestamp,
            name: "Zahle, Lebanon",
            isoCode
        });
    }

    return earthquakes;
}
