(function($, window, document, _this) {
    'use strict';
    var self;
    /**
     * Identify
     */
    trayLoginProto.identify = self = {

        elms: {},

        /**
         * Initialize once
         */
        initialized: false,

        methods: {
            /**
             * Init the module
             */
            init: function() {
                if (self.initialized) {
                    return;
                }

                $(document).trigger('tray-login#identify');
                self.initialized = true;

                this.setElements();
                self.events
                    .onIdentifyKeyUp()
                    .onIdentifyBlur()
                    .onIdentifySubmit();
            },

            /**
             * Set DOM Elements
             */
            setElements: function() {
                self.elms = {
                    identifyForm: document.getElementById('form-identify'),
                    identifyButton: document.getElementById('tray-login-identify'),
                    identifyInput: document.getElementById('input-identify'),
                    identifyMessage: document.getElementById('message-identify'),
                };
            },

            /**
             * Check if input is valid
             * @param {object} input DOM element
             * @return {boolean}
             */
            checkInput: function(input) {
                if (!input || !input.value) {
                    return false;
                }

                if (CPF.isValid(input.value) || CNPJ.isValid(input.value) || this.isValidEmail(input.value)) {
                    return true;
                }

                return false;
            },

            /**
             * Check if an email is valid
             * @param {string} email
             * @return {bool}
             */
            isValidEmail: function(email) {
                var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return regex.test(email);
            },

            /**
             * Handle input validation/class/message
             * @param {object}|{boolean} options
             */
            handleValidation: function(options) {
                var input = options.input;
                var message = options.message;

                if (!input && !message) {
                    return false;
                }

                input.setCustomValidity(message);
                self.elms.identifyMessage.innerHTML = message;

                if (message) {
                    input.classList.add('tray-input-invalid');
                } else {
                    input.classList.remove('tray-input-invalid');
                }
            },

            /**
             * Returns login type
             * @param {string} user_input
             */
            getLoginType: function(user_input) {
                var type = 'cnpj';

                if (this.isValidEmail(user_input)) {
                    type = 'email';
                }

                if (user_input.length === 11) {
                    type = 'cpf';
                }

                return type;
            },

            /**
             * Check if an user has an account
             * @param {string} user_input
             */
            hasAccount: function(user_input) {
                var dataType,
                    data,
                    type = this.getLoginType(user_input);

                dataType = 'data-' + type;
                data = '?' + type + '=' + user_input;

                $.ajax({
                    type: 'GET',
                    url: thisElement.routes.methods.route('has_account'),
                    data: data,
                    dataType: 'json',
                    success: function(response){
                        if (response.data && response.data.hasAccount) {
                            thisElement.setAttribute(dataType, user_input);
                            return;
                        }

                        self.methods.handleValidation({
                            input: self.elms.identifyInput,
                            message: 'Usuário não encontrado, faça seu cadastro.',
                        });
                    },
                    error: function(xhr, type){
                        self.methods.handleValidation({
                            input: self.elms.identifyInput,
                            message: 'Não foi possível verificar seu cadastro, tente novamente.',
                        });
                    }
                });
            },
        },

        /**
         * Listeners
         */
        events: {
            /**
             * Listen form submit
             * @return {object} events
             */
            onIdentifySubmit: function() {
                self.elms.identifyForm.addEventListener('submit', function(event) {
                    event.preventDefault();

                    if (!self.methods.checkInput(self.elms.identifyInput)) {
                        self.methods.handleValidation({
                            input: self.elms.identifyInput,
                            message: 'Dados inválidos, digite novamente!',
                        });
                        return;
                    }

                    self.methods.hasAccount(self.elms.identifyInput.value);
                });

                return this;
            },

            /**
             * Listen input blur
             * @return {object} events
             */
            onIdentifyBlur: function() {
                self.elms.identifyInput.addEventListener('blur', function() {
                    if (!self.methods.checkInput(self.elms.identifyInput)) {
                        self.methods.handleValidation({
                            input: self.elms.identifyInput,
                            message: 'Dados inválidos, digite novamente!',
                        });
                    }
                });

                return this;
            },

            /**
             * Listen input keyup
             * @return {object} events
             */
            onIdentifyKeyUp: function() {
                self.elms.identifyInput.addEventListener('keyup', function(event) {
                    if (self.methods.checkInput(this) && event.keyCode !== 13) {
                        self.methods.handleValidation({
                            input: self.elms.identifyInput,
                            message: '',
                        });
                    }
                });

                return this;
            },
        },

    };

})(Zepto, window, document, thisElement);
