import lz from 'lz-string';
import type { TObject } from '@types';
import { hasOwnProperty, isEmptyString } from '@helpers';

export const LOCAL_STORAGE_KEY_PREFIX = 'fa-';

class LocalStorageClass {
    set(key: string, value: unknown): boolean {
        if (isEmptyString(key) || value === undefined) {
            return false;
        }

        let result = false;

        try {
            const valueToSet: string = JSON.stringify(value);
            localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, valueToSet);
            result = true;
        } catch (error) {
            console.error(`Error while setting '${key}' item to storage`, error);
        }

        return result;
    }

    get(key: string): unknown | undefined {
        let result: unknown | undefined = undefined;

        if (isEmptyString(key)) {
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

    remove(key: string): boolean {
        if (isEmptyString(key)) {
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

    export(namesArray: string[]): string {
        const values = {};

        for (const name of namesArray) {
            const savedValue = this.get(name);

            if (!savedValue) {
                continue;
            }

            values[name] = savedValue;
        }

        let encoded: string = JSON.stringify(values);
        encoded = lz.compressToEncodedURIComponent(encoded);

        return encoded;
    }

    import(encodedString: string): TObject | undefined {
        let decodedString: string;
        let decodedObject: TObject | undefined = undefined;
        let hasError = false;

        try {
            decodedString = lz.decompressFromEncodedURIComponent(encodedString);
            decodedObject = JSON.parse(decodedString);
        } catch (error) {
            hasError = true;
        }

        if (hasError || !decodedObject) {
            console.warn('Wrong string to import from');
            return;
        }

        for (const name in decodedObject) {
            if (!hasOwnProperty(decodedObject, name)) {
                continue;
            }

            const value = decodedObject[name];
            this.set(name, value);
        }

        return decodedObject;
    }

    logSize(): void {
        let total = 0;
        const lines: string[] = [];

        for (const prop in localStorage) {
            if (!hasOwnProperty(localStorage, prop)) {
                continue;
            }

            const size = ((localStorage[prop].length + prop.length) * 2);
            total += size;
            lines.push(prop + ' = ' + (size / 1024).toFixed(2) + ' KB');
        }

        console.groupCollapsed(`LocalStorage size = ${(total / 1024).toFixed(2)} KB`);
        lines.forEach(line => console.log(line));
        console.groupEnd();
    }
}

const instance = new LocalStorageClass();
export const LocalStorage = instance;
