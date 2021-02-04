import {parseResponseDataInvestcab} from "@parse";
import {investcabResponseObject} from "../../constants";

// TODO: Добавить в логику тестов расчёты значений
describe('parse-investcab', function () {
    test('should return undefined for wrong arguments', function () {
        const result1 = parseResponseDataInvestcab();
        const result2 = parseResponseDataInvestcab(2);
        const result3 = parseResponseDataInvestcab('str');
        const result4 = parseResponseDataInvestcab(null);
        const result5 = parseResponseDataInvestcab(function () { return 2 });
        const result6 = parseResponseDataInvestcab({ foo: 'bar' });

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
        expect(result4).toBe(undefined);
        expect(result5).toBe(undefined);
        expect(result6).toBe(undefined);
    });

    test('should return an array of data', function () {
        const result = parseResponseDataInvestcab(investcabResponseObject);

        expect(result).toContainEqual({
            date: expect.any(String),
            value: expect.any(Number),
        });
        expect(result.length).toBe(3);
    });

    test('should check for previous date values', function () {
        const result = parseResponseDataInvestcab({
            c: [10, 20, 30],
            h: [11, 21, 31],
            l: [12, 22, 32],
            o: [13, 23, 33],
            s: 'ok',
            t: [1577826000000, 1577826000000, 1577998800000],
            v: [15, 25, 35],
        });

        expect(result).toContainEqual({
            date: expect.any(String),
            value: expect.any(Number),
        });
        expect(result.length).toBe(2);
    });
});
