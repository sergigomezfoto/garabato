
const getDataFromLocalStorage = (key: string = 'GarabatoTest'): any | null => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
};

export default getDataFromLocalStorage;