import { globalFetchMocks } from './fetch-mocks';

global.beforeAll(() => {
    globalFetchMocks.enable();
});

global.beforeEach(() => {
    globalFetchMocks.set();
});

global.afterEach(() => {
    globalFetchMocks.reset();
});

global.afterAll(() => {
    globalFetchMocks.disable();
});
