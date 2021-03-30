import {normalizeAssetData} from "@data";

describe('normalize-asset-data', function () {
    const parsedData = [
        {
            date: '2020.02.01',
            value: 99,
        },
        {
            date: '2020.02.02',
            value: 100,
        },
        {
            date: '2020.02.05',
            value: 110,
        },
        {
            date: '2020.02.07',
            value: 90,
        },
    ];

    test('should return undefined for wrong arguments', function () {
        const result1 = normalizeAssetData();
        const result2 = normalizeAssetData(100);
        const result3 = normalizeAssetData('str');
        const result4 = normalizeAssetData(function () { return 2 });
        const result5 = normalizeAssetData(null);

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
        expect(result4).toBe(undefined);
        expect(result5).toBe(undefined);
    });

    test('should return undefined if something wrong with fetched data', function () {
        const result = normalizeAssetData([
            1,
            'string',
            parsedData[3],
            null,
        ]);

        expect(result).toBe(undefined);
    });

    test('should return an empty array if passed empty data', function () {
        const result = normalizeAssetData([]);

        expect(result).toEqual([]);
    });

    test('should return normalized array of data', function () {
        const result1 = normalizeAssetData(parsedData);
        const result2 = normalizeAssetData(parsedData, '2020.01.01', '2020.02.08');
        const result3 = normalizeAssetData(parsedData, '2020.02.01', '2020.02.01');

        const result1Expected = [
            {
                date: '2020.02.01',
                value: 99,
            },
            {
                date: '2020.02.02',
                value: 100,
            },
            {
                date: '2020.02.03',
                value: 100,
            },
            {
                date: '2020.02.04',
                value: 100,
            },
            {
                date: '2020.02.05',
                value: 110,
            },
            {
                date: '2020.02.06',
                value: 110,
            },
            {
                date: '2020.02.07',
                value: 90,
            },
        ];

        const result2Expected = result1Expected.slice();
        result2Expected.push({
            date: '2020.02.08',
            value: 90,
        });

        expect(result1.length).toBeGreaterThanOrEqual(7);
        expect(result1.slice(0, 7)).toEqual(result1Expected);

        expect(result2.length).toBe(8);
        expect(result2).toEqual(result2Expected);

        expect(result3.length).toBe(1);
        expect(result3).toEqual([
            {
                date: '2020.02.01',
                value: 99,
            },
        ]);
    });
});
