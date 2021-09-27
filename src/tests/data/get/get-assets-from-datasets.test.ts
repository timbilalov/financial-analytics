import { getAssetsFromDatasets } from '@data';
import { assets, datasets } from '@test-constants';

describe('get-assets-from-datasets', function () {
    it('should return an array of assets', function () {
        const result = getAssetsFromDatasets(datasets);

        expect(result).toEqual(assets);
    });
});

