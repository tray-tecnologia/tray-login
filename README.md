# Tray Login Component
Web Component para realizar login no Checkout das lojas da Tray.

## Instalação

`bower install -S tray-tecnologia/tray-login`

## Atributos
Atributo      | Descrição
--------      | -----------
api-otp       | URL de geração do código (POST, params: email)
api-otp-login | URL de login (GET, params: email, code)
url-callback  | URL de callback caso o login esteja correto

## Event Listeners

Em caso de sucesso ou em caso de falha, é disparado um evento no documento principal.
Exemplo de utilização do evento:
```js
$(document).on('tray-login', function(event, response, type) {
    if (type === 'finished') {
        console.log('Success!');
    } else {
        console.error('Error!');
    }
});
```

## Uso

1. Adicione o polyfill no `<head>`:
`<script src="bower_components/webcomponentsjs/webcomponentsjs.min.js">`

2. Adicione o elemento no seu HTML substituindo as URLs da aplicação.

```HTML
<tray-login
    api-otp="/otp/"
    api-otp-login="/otp/login"
    url-callback="/callback.html">
</tray-login>
```

## Dev

Para configurar o ambiente de dev, execute:
```sh
npm install
bower install
gulp watch
```

Não altere os arquivos da pasta `dist/`, é apenas o build. O `dist/tray-login.html` deverá existir no controle de versão.
