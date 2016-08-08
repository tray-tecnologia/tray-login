# Tray Login Component
Web Component para realizar login no Checkout das lojas da Tray.

## Instalação

`bower install -S tray-tecnologia/tray-login`

## Atributos
Atributo      | Descrição
--------      | -----------
data-store    | ID da loja
data-methods | Tipos de login que você deseja utilizar
data-callback | URL de callback caso o login esteja correto
data-texts    | Textos personalizados (opcional)
data-email    | E-mail utilizado para login (opcional)
data-cpf      | CPF utilizado para login (opcional)
data-cnpj     | CNPJ utilizado para login (opcional)

## Eventos

Lista de eventos disparados pelo componente.

Evento           | Descrição
--------         | -----------
tray-login       | Dispara quando finalizou o processo de login
tray-login#identify | Dispara quando abre a tela de identificação
tray-login#main  | Dispara quando abre a tela inicial do componente
tray-login#otp   | Dispara quando abre a tela do OTP
tray-login#close | Dispara quando fecha o componente

Exemplo de utilização do evento:
```js
$(window).on('tray-login', function(event) {
    var response = event.originalEvent.detail.response;
    var type = event.originalEvent.detail.type;
    if (type === 'success') {
        console.log('Success!');
    } else {
        console.error('Error!');
    }
});

$(window).on('tray-login#close', function() {
    console.log('Closed!');
});
```

Mudamos a forma como recuperamos os parâmetros do evento:
```diff
- $(document).on('tray-login', function(event, response, type) {
+ $(window).on('tray-login', function(event) {
+    var response = event.detail.response;
+    var type = event.detail.type;
    if (type === 'success') {
        console.log('Success!');
    } else {
        console.error('Error!');
    }
});
```


## Uso

1 - Adicione o polyfill e importe o componente no `<head>`:
```HTML
<script src="bower_components/webcomponentsjs/webcomponentsjs-lite.min.js">
<link rel="import" href="dist/tray-login.html">
```

2 - Adicione o elemento no seu HTML substituindo as URLs da aplicação.

```HTML
<tray-login
    data-login-methods="['password', 'facebook', 'otp']"
    data-callback="/callback.html"
    data-store="351572"
    data-texts="{}">
</tray-login>
```

## Contribuindo

Para configurar o ambiente de dev, execute:
```sh
npm install
bower install
gulp watch
```

Não altere os arquivos da pasta `dist/`, é apenas o build. O `dist/tray-login.html` deverá existir no controle de versão.
