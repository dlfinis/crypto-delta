# CryptoSample

Aplicación de ejepmplo para utilizar las características de PWA brindadas por Angular, utilizando @angular/cli, @angular/material y @angular/pwa.

Probá la [Demo](https://crypto-delta-rb9jq7dh1.now.sh/) publicada en [Now - Global Serverless Deployments](https://zeit.co/now) 


## Pre-requisitos
[Angular CLI](https://github.com/angular/angular-cli) version 7.0.6.
```
npm i -g @angular/cli@7
```


## Pasos

### Crear una nueva Angular app
```
ng new crypto-delta --routing --style=scss
```
`git checkout paso-01`

### Agregar soporte para Angular Material
```
ng add @angular/material
```
`git checkout paso-02`

### Generar componentes custom de Material para la app
```
ng generate @angular/material:nav nav
ng generate @angular/material:dashboard dashboard
ng generate @angular/material:table coin-list
```
`git checkout paso-04`

### Agregar servicio que se conecta con la API externa
```
ng g s services/crypto-compare
ng g i services/crypto-compare/crypto-compare-coin
ng g i services/crypto-compare/crypto-compare-response
```
`git checkout paso-07`

### Agregar soporte para PWA a nuestra app
```
ng add @angular/pwa
```
`git checkout paso-08`

## Corriendo la App con SW
Para lograr que funcionen nuestros service workers debemos buildear la app en modo production `ng build --prod` y servirla desde un http server.
```
npm run start:pwa
```
Luego navega a `http://localhost:3000/`. 

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
