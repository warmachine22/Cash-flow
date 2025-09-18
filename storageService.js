const STORAGE_KEY = 'cashflowJournalData';

export const storageService = {
  saveData: (data) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, serializedData);
    } catch (error) {
      console.error("Could not save data to localStorage", error);
    }
  },

  loadData: () => {
    try {
      const serializedData = localStorage.getItem(STORAGE_KEY);
      if (serializedData === null) {
        return null;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error("Could not load data from localStorage", error);
      return null;
    }
  },

  clearData: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Could not clear data from localStorage", error);
    }
  }
};
