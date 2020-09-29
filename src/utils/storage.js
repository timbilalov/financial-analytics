const PREFIX = 'fa-';

class Storage {
    set(key, value) {
        if (typeof key !== 'string' || (typeof key === 'string' && key.trim() === '')) {
            console.error('Key must be a non-empty string');
            return false;
        }

        let result = false;

        try {
            const valueToSet = JSON.stringify(value);
            localStorage.setItem(PREFIX + key, valueToSet);
            result = true;
        } catch (error) {
            console.error(`Error while setting '${key}' item to storage`, error);
        }

        return result;
    }

    get(key) {
        if (typeof key !== 'string' || (typeof key === 'string' && key.trim() === '')) {
            console.error('Key must be a non-empty string');
            return false;
        }

        let result;

        try {
            result = localStorage.getItem(PREFIX + key);
            result = JSON.parse(result);
        } catch (error) {
            console.error(`Error while getting '${key}' item from storage`, error);
        }

        return result;
    }
}

export default new Storage();
