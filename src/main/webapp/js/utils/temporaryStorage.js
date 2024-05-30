// Function to store data with expiration time
function storeData(key, value, duration) {
    const expirationTime = Date.now() + duration;
    const data = { value: value, expirationTime: expirationTime };

    localStorage.setItem(key, JSON.stringify(data));
}

// Function to retrieve data
function retrieveData(key) {
    const dataString = localStorage.getItem(key);

    if (!dataString)
        return null;

    const data = JSON.parse(dataString);

    if (Date.now() > data.expirationTime) {
        localStorage.removeItem(key);
        console.log(`Data with key "${key}" has expired and has been removed`);
        return null;
    }
    return data.value;
}
