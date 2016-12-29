'use strict';

var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

gulp.task('sass', function () {
    gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
    gulp.watch('./src/**/*', ['vulcanize']);
});

var hasAccountSuccess = {
    "data": {
        "hasAccount": true,
        "types": [
            "commerce",
            "tray_checkout"
        ],
    },
    "statusCode": 200
};

var passwordFail = {
    "data": {
        "hasAccount": false
    },
    "statusCode": 404,
    "message": "Autentica\u00e7\u00e3o incorreta."
};

var passwordSuccess = {
    "data": {
        "hasAccount": true,
        "token": "xpto",
    },
    "statusCode": "200"
};

var otpGenerate = {
    "data": {
        "message": "created",
        "email": "rsantos@tray.com.br"
    },
    "statusCode": 200
};

var otpSuccess = {
    "data": {
        "customer": {},
        "hasAccount": true,
        "token": "xpto",
        "message": "Voc\u00ea est\u00e1 logado, prossiga com sua compra"
    },
    "statusCode": 200
};

var otpFail = {
    "data": {
        "hasAccount": false
    },
    "statusCode": 404,
    "message": "Autentica\u00e7\u00e3o incorreta."
};

var facebook = {
    "data": {
        "url": "https:\/\/www.facebook.com\/v2.5\/dialog\/oauth?client_id=954834467922279&state=83a04ca2f6c5dc2a1588fda9728a9d4c&response_type=code&sdk=php-sdk-5.0.0&redirect_uri=https%3A%2F%2Fcheckoutexpress.tray.com.br%2Fcheckout%2Fapi%2Flogin%2Ffacebook%2Fauthorize%3Fstore_id%3D351572%26crossdm%3Dhttps%253A%252F%252Frsantos.commercesuite.com.br%26session_id%3D30ls6r01r9jqdl999b9iq9tph1&scope=email&display=popup"
    },
    "statusCode": 200
};

var passwordRecovery = {
    "data": {
        "message": "Enviamos um e-mail com a sua senha"
    },
    "statusCode": 200
};

var checkStatusSucess = {
    "data": {
        blocked: false
    },
    "statusCode": 200
};

var langs = {
    "identify-title": "Identifique-se",
    "identify-input": "E-mail ou CPF/CNPJ (números)",
    "identify-error-not-found": "Não foi possível verificar seu cadastro, tente novamente.",
    "identify-data-invalid": "Dados inválidos, digite novamente!",
    "main-title": "Autenticação",
    "main-action": "Escolha uma das opções para se identificar:",
    "identify-button": "Continuar",
    "password-title": "E-mail e senha da loja",
    "password-button": "E-mail e senha da loja",
    "password-button-cpf": "CPF e senha da loja",
    "password-button-cnpj": "CNPJ e senha da loja",
    "password-action": "Informe sua senha.",
    "password-hide": "Ocultar",
    "password-show": "Mostrar",
    "password-input-label": "Senha",
    "password-forget": "Esqueci ou não tenho senha",
    "otp-title": "Código de Segurança",
    "otp-action": "Informe o código de segurança que enviamos para seu e-mail.",
    "otp-receive": "Receber código de segurança por e-mail",
    "otp-input-label": "Código de segurança",
    "other-option": "Escolher outra opção",
    "go-back": "Voltar",
    'proceed': 'Continuar',
};

var checkStatusFail = {
    "data": {
        blocked: true,
        message: "Por motivos de segurança bloqueamos o acesso por e-mail e senha durante 60 minutos.",
    },
    "statusCode": 200
};

var mocks = {
    "/checkout/has-account": function (req, res) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(hasAccountSuccess));
    },

    "/checkout/langs/login_component": function(req, res) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(langs));
    },

    "/checkout/password": function (req, res) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(passwordFail));
    },

    "/checkout/otp-generate": function (req, res) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(otpGenerate));
    },

    "/checkout/otp": function (req, res) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(otpSuccess));
    },

    "/checkout/facebook/url": function (req, res) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(facebook));
    },

    "/checkout/password-recovery": function (req, res) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(passwordRecovery));
    },

    "/checkout/check-status": function (req, res) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(checkStatusSucess));
    },
};

gulp.task('server', () => {
    browserSync({
        server: {
            baseDir: "./"
        },
        middleware: function (req, res, next) {
            var url = req.url.split('?')[0];
            if (!mocks[url]) {
                next();
            }

            setTimeout(function() {
                if (mocks[url]) {
                    mocks[url](req, res);
                    next();
                }
            }, 2000);
        },
        open: false,
        files: [
            "dist/*",
            '*.html',
        ]
    });
});

gulp.task('vulcanize', function () {
    gulp.src('./src/tray-login.html')
        .pipe(vulcanize({
            inline: true,
            inlineCss: true,
            inlineScripts: true,
            excludes: [],
            stripComments: true,
            stripExcludes: false
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('dev', ['server', 'watch']);
gulp.task('default', ['sass', 'vulcanize']);
