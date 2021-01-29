import {getSingleAssetData} from "@data";

describe('assets-single', function () {
    test('should return undefined for wrong arguments', async function () {
        const result1 = await getSingleAssetData();
        const result2 = await getSingleAssetData('123');
        const result3 = await getSingleAssetData(['123']);
        const result4 = await getSingleAssetData(100500);
        const result5 = await getSingleAssetData(null);

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
        expect(result4).toBe(undefined);
        expect(result5).toBe(undefined);
    });
});
