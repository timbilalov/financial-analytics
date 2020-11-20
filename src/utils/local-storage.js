import lz from 'lz-string';

const PREFIX = 'fa-';

class LocalStorage {
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

    export(namesArray) {
        const values = {};

        for (const name of namesArray) {
            const savedValue = this.get(name);

            if (!savedValue) {
                continue;
            }

            values[name] = savedValue;
        }

        let encoded = JSON.stringify(values);
        encoded = lz.compressToEncodedURIComponent(encoded);

        return encoded;
    }

    import(encodedString) {
        let decoded;
        let hasError = false;

        try {
            decoded = lz.decompressFromEncodedURIComponent(encodedString);
            decoded = JSON.parse(decoded);
        } catch (error) {
            hasError = true;
        }

        if (hasError || !decoded) {
            console.warn(`Wrong string to import from`);
            return;
        }

        for (const name in decoded) {
            const value = decoded[name];
            this.set(name, value);
        }

        return decoded;
    }
}

export default new LocalStorage();
