// TODO: Выяснить, как правильно импортить свелт
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import App from '@app/App.svelte';

const app = new App({
    target: document.body,
});

export default app;
