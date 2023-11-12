import { normalizeAssetData } from '@data';

describe('normalize-asset-data', function () {
    const parsedData = [
        {
            date: '2020.02.01',
            values: {
                current: 99,
            },
        },
        {
            date: '2020.02.02',
            values: {
                current: 100,
            },
        },
        {
            date: '2020.02.05',
            values: {
                current: 110,
            },
        },
        {
            date: '2020.02.07',
            values: {
                current: 90,
            },
        },
    ];

    test('should return an empty array if passed empty data', function () {
        const result = normalizeAssetData([]);

        expect(result).toEqual([]);
    });

    test('should return normalized array of data', function () {
        const result1 = normalizeAssetData(parsedData);
        const result2 = normalizeAssetData(parsedData, '2020.02.08');
        const result3 = normalizeAssetData(parsedData, '2020.02.01');

        const result1Expected = [
            {
                date: '2020.02.01',
                values: {
                    current: 99,
                },
            },
            {
                date: '2020.02.02',
                values: {
                    current: 100,
                },
            },
            {
                date: '2020.02.03',
                values: {
                    current: 100,
                },
            },
            {
                date: '2020.02.04',
                values: {
                    current: 100,
                },
            },
            {
                date: '2020.02.05',
                values: {
                    current: 110,
                },
            },
            {
                date: '2020.02.06',
                values: {
                    current: 110,
                },
            },
            {
                date: '2020.02.07',
                values: {
                    current: 90,
                },
            },
        ];

        const result2Expected = result1Expected.slice();
        result2Expected.push({
            date: '2020.02.08',
            values: {
                current: 90,
            },
        });

        expect(result1.length).toBeGreaterThanOrEqual(7);
        expect(result1.slice(0, 7)).toEqual(result1Expected);

        expect(result2.length).toBe(8);
        expect(result2).toEqual(result2Expected);

        expect(result3.length).toBe(1);
        expect(result3).toEqual([
            {
                date: '2020.02.01',
                values: {
                    current: 99,
                },
            },
        ]);
    });
});
