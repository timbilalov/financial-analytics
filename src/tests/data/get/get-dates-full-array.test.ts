import type {TAsset} from "@types";
import {assetBase} from "@test-constants";
import {getDatesFullArray} from "@data";

// TODO: Добавить проверку на воспроизводимость (мемоизация?)
describe('get-dates-full-array', function () {
    test('should return an array of dates, sorted and straight', function () {
        const assets: TAsset[] = [
            Object.assign({}, assetBase, {
                data: [
                    {
                        date: '2020.02.15',
                        value: 100,
                    },
                ],
            }),
            Object.assign({}, assetBase, {
                data: [
                    {
                        date: '2020.02.18',
                        value: 100,
                    },
                    {
                        date: '2020.02.10',
                        value: 100,
                    },
                ],
            }),
            Object.assign({}, assetBase, {
                data: [
                    {
                        date: '2020.02.11',
                        value: 100,
                    },
                ],
            }),
        ];
        const result = getDatesFullArray(assets);

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
