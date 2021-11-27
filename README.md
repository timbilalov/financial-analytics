# Financial analytics

![Version](https://img.shields.io/github/package-json/v/timbilalov/financial-analytics)
![Issues](https://img.shields.io/github/issues/timbilalov/financial-analytics)
![Last commit](https://img.shields.io/github/last-commit/timbilalov/financial-analytics)
![Top language](https://img.shields.io/github/languages/top/timbilalov/financial-analytics)

Сервис для анализа доходности инвестиционных портфелей, сравнения с индексом.

[История релизов](https://github.com/timbilalov/financial-analytics/blob/master/CHANGELOG.md)

## Разработка

```
npm install
npm run dev
```

Сервис откроется локально по адресу [localhost:5000](http://localhost:5000). По-умолчанию настроен live-reload на сохранение файлов.

## Тестирование

Разработка, преимущественно, ведётся по методологии TDD. Команды на тесты и линтинг:

```
npm run test
npm run lint
npm run lint -- --fix
```

## Деплой

Настроена кастомная система версионирования и релиза. Можно указать конкретную версию, можно релизить патч/минор/мажор. Запускать из ветки `dev`, всё остальное сделает автоматика.

```
./bin/release.sh patch
./bin/release.sh minor
./bin/release.sh major
./bin/release.sh 0.3.0
```

На каждый пуш в ветку `master` (т. е. на каждый релиз) настроен деплой на сервис [surge.sh](https://unfriend-financial-analytics.surge.sh/). 
