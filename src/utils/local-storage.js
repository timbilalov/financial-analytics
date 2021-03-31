import lz from 'lz-string';

export const LOCAL_STORAGE_KEY_PREFIX = 'fa-';

class LocalStorage {
    set(key, value, shouldClean = false) {
        if (typeof key !== 'string' || (typeof key === 'string' && key.trim() === '') || value === undefined) {
            return false;
        }

        let result = false;

        try {
            if (shouldClean) {
                this.remove(key);
            }

            const valueToSet = JSON.stringify(value);
            localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, valueToSet);
            result = true;
        } catch (error) {
            console.error(`Error while setting '${key}' item to storage`, error);
        }

        return result;
    }

    get(key) {
        let result = undefined;

        if (typeof key !== 'string' || (typeof key === 'string' && key.trim() === '')) {
            return result;
        }

        try {
            result = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);

            if (typeof result === 'string') {
                result = JSON.parse(result);
            }
        } catch (error) {
            console.error(`Error while getting '${key}' item from storage`, error);
            result = undefined;
        }

        return result;
    }

    remove(key) {
        if (typeof key !== 'string' || (typeof key === 'string' && key.trim() === '')) {
            return false;
        }

        let result = false;

        try {
            localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + key);
            result = true;
        } catch (error) {
            console.error(`Error while removing '${key}' item from storage`, error);
        }

        return result;
    }

    export(namesArray) {
        if (Array.isArray(namesArray) === false) {
            return undefined;
        }

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
