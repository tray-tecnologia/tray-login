(function($, window, document) {
    'use strict';
    var self;
    /**
     * Identify
     */
    trayLoginProto.identify = self = {

        elms: {},

        classes: {
            empty: 'empty',
        },
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
                    identifyLabel: document.getElementById('label-identify'),
                    identifyMessage: document.getElementById('message-identify'),
                };
            },

            /**
             * Check if input is valid and set them
             * @param {object} input DOM element
             * @return {boolean}
             */
            checkInput: function(input) {
                if (!input || !input.value) {
                    input.classList.add(self.classes.empty);
                    return false;
                }

                input.setCustomValidity('invalid');
                input.classList.remove(self.classes.empty);

                if (CPF.isValid(input.value) || CNPJ.isValid(input.value) || this.isValidEmail(input.value)) {
                    input.setCustomValidity('');
                    return true;
                }

                return false;
            },

            /**
             * Change label according input data
             * @param {string} email
             * @return {bool}
             */
            changeLabel: function(input){
                var regex = /^\d+$/;
                var emailLabel = self.elms.identifyLabel.children[0];
                var documentLabel = self.elms.identifyLabel.children[1];

                if (regex.test(input.value)) {
                    emailLabel.setAttribute('display','none');
                    documentLabel.setAttribute('display','block');
                    return;
                }

                emailLabel.setAttribute('display','block');
                documentLabel.setAttribute('display','none');
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
            hasAccount: function(formData) {
                var userInput = self.elms.identifyInput.value;
                var dataType,
                    data,
                    type = this.getLoginType(userInput);

                dataType = 'data-' + type;
                data = formData + '&' + type + '=' + userInput;

                $.ajax({
                    type: 'GET',
                    url: thisElement.routes.methods.route('has_account'),
                    data: data,
                    dataType: 'json',
                    success: function(response){
                        if (response.data && response.data.hasAccount) {
                            thisElement.setAttribute(dataType, userInput);
                            return;
                        }

                        self.methods.handleValidation({
                            input: self.elms.identifyInput,
                            message: trayLoginProto.langs.methods.getDefaultTexts('identify-error-not-found'),
                        });
                    },
                    error: function(xhr, type){
                        self.methods.handleValidation({
                            input: self.elms.identifyInput,
                            message: trayLoginProto.langs.methods.getDefaultTexts('identify-error'),
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
                            message: trayLoginProto.langs.methods.getDefaultTexts('identify-data-invalid'),
                        });
                        return;
                    }

                    self.methods.hasAccount($(this).serialize());
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
                            message: trayLoginProto.langs.methods.getDefaultTexts('identify-data-invalid'),
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
                    self.methods.changeLabel(this);
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

})(Zepto, window, document);
