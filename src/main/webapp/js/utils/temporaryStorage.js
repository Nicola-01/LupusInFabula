// Function to store data with expiration time
function storeData(key, value, seconds) {
    const date = new Date();
    date.setTime(date.getTime() + (seconds * 1000));
    document.cookie = key + "=" + JSON.stringify(value) + ";expires=" + date.toUTCString() + ";path=/";
}

// Function to retrieve data
function retrieveData(key) {
    const nameEQ = key + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(nameEQ) === 0)
            return JSON.parse(c.substring(nameEQ.length, c.length));
    }
    return null;
}