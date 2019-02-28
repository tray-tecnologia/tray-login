# Tray Login Component
Web Component para realizar login nas lojas da Tray.

## Instalação

`npm install tray-login`

## Atributos
Atributo        | Descrição
--------        | -----------
store           | ID da loja
methods         | Tipos de login que você deseja utilizar, opções: ['facebook', 'password', 'otp']
callback        | URL de callback caso o login esteja correto
texts           | Textos personalizados (opcional)
identification  | Identificação utilizada para login (opcional)


## Eventos
Lista de eventos disparados pelo componente.

Evento              | Descrição
--------            | -----------
tray-login          | Dispara quando finalizou o processo de login
tray-login#action   | Dispara sempre que uma ação é efetuada no componente
tray-login#close    | Dispara quando fecha o componente


## Uso

1 - Adicione a bibilioteca vue e importe o componente no `<head>`:
```HTML
<script src="https://unpkg.com/vue"></script>
<script src="dist/tray-login.min.js"></script>
```

2 - Adicione o elemento no seu HTML substituindo as URLs da aplicação.

```HTML
<tray-login
    methods="['facebook']"
    callback="/callback.html"
    store="351572"
    texts="{}">
</tray-login>
```

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
```js
$(window).on('tray-login', function(event) {
    var response = event.detail.response;
    var type = event.detail.type;

    if (type === 'success') {
        console.log('Success!');
    } else {
        console.error('Error!');
    }
});
```
## Contribuindo

Caso você possua o docker instalado juntamente com o docker-compose, execute o comando abaixo para levantar o container.

```sh
docker-compose up -d
```

Utilizando o comando abaixo é possível entrar no container para configurar as dependencias.

```sh
docker-compose exec tray_login bash
```

Para configurar o ambiente de dev, execute:

```sh
yarn
```

Agora que o ambiente está configurado, execute na raiz:
```sh
yarn serve
```

Caso você esteja utilizando o docker o comando acima já é executado automaticamente ao levantar o ontainer
