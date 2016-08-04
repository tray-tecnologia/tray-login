(function($, window, document, _this) {

    /**
     * Identify
     * @example
     */
    var self;
    trayLoginProto.identify = self = {
        data: {},

        elms: {},

        initialized: false,

        methods: {
            /**
             * Init the module
             */
            init: function() {
                if (!self.initialized) {
                    self.initialized = true;
                } else {
                    return;
                }

                $(document).trigger('tray-login#identify');
                this.setElements();
                self.events
                    .onIdentifyKeyUp()
                    .onIdentifyBlur()
                    .onIdentifySubmit();
            },

            setElements: function() {
                self.elms = {
                    identifyForm: document.getElementById('form-identify'),
                    identifyButton: document.getElementById('tray-login-identify'),
                    identifyInput: document.getElementById('input-identify'),
                    identifyMessage: document.getElementById('message-identify'),
                };
            },

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
             * @return {bool}
             */
            isValidEmail: function(email) {
                var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return regex.test(email);
            },

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
             * 
             */
            hasAccount: function(user_input) {
                var type = 'cnpj', dataType, param;

                if (this.isValidEmail(user_input)) {
                    type = 'email';
                }

                if (user_input.length === 11) {
                    type = 'cpf';
                } 

                dataType = 'data-' + type;
                param = type + '=' + user_input;

                $.get(thisElement.routes.methods.route('has_account') + param, function(response) {
                    console.log('hasAccount...');
                    if (response.data && response.data.hasAccount) {
                        thisElement.setAttribute(dataType, user_input);
                    } else {
                        console.log('usuárion não encontrado');
                        self.methods.handleValidation({
                            input: self.elms.identifyInput,
                            message: 'Usuário não encontrado, faça seu cadastro!',
                        });
                    }
                });
            },

            setData(key, val) {
                this.data[key] = val;
            },

            getData(key) {
                return this.data[key];
            }
        },

        /**
         *
         */
        events: {
            /**
             *
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
             *
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
