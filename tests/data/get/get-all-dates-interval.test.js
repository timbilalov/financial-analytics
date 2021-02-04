import {getAllDatesInterval} from "@data";

describe('get-all-dates-interval', function () {
    test('should return undefined for wrong arguments', function () {
        const result1 = getAllDatesInterval();
        const result2 = getAllDatesInterval(23);
        const result3 = getAllDatesInterval('str');
        const result4 = getAllDatesInterval(null);
        const result5 = getAllDatesInterval(function () { return 2; });
        const result6 = getAllDatesInterval({ foo: 'bar' });

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
        expect(result4).toBe(undefined);
        expect(result5).toBe(undefined);
        expect(result6).toBe(undefined);
    });

    test('should return an array of dates, sorted and straight', function () {
        const items = [
            {
                data: [
                    {
                        date: '2020.02.15',
                    },
                ],
            },
            {
                data: [
                    {
                        date: '2020.02.18',
                    },
                    {
                        date: '2020.02.10',
                    },
                ],
            },
            {
                data: [
                    {
                        date: '2020.02.11',
                    },
                ],
            },
        ];
        const result = getAllDatesInterval(items);

        expect(result).toEqual([
            '2020.02.10',
            '2020.02.11',
            '2020.02.12',
            '2020.02.13',
            '2020.02.14',
            '2020.02.15',
            '2020.02.16',
            '2020.02.17',
            '2020.02.18',
        ]);
    });
});
