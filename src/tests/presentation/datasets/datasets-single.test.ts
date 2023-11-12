import { prepareSingleDataset } from '@presentation';

describe('datasets-single', function () {
    test('should return an object with data', async function () {
        const result = await prepareSingleDataset('title', [0, 1], ['0', '1']);

        expect(result).toEqual({
            label: expect.any(String),
            backgroundColor: expect.any(String),
            borderColor: expect.any(String),
            data: expect.any(Array),
            dates: expect.any(Array),
            type: 'line',
            pointRadius: expect.any(Number),
            showLine: expect.any(Boolean),
            fill: false,
            lineTension: 0,
            borderWidth: expect.any(Number),
        });
    });
});
