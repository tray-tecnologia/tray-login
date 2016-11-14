(function($, window, document, _this) {
    'use strict';
    var self;
    /**
     * checkStatus
     */
    trayLoginProto.checkStatus = self = {

        elms: {},

        /**
         * Initialize once
         */
        initialized: false,
        blockedUser: false,
        loginMethods: [],

        methods: {
            /**
             * Init the module
             */
            init: function() {
                if(!self.initialized){
                    this.setElements();
                    this.getLoginMethods();
                    self.initialized = true;
                }

                this.checkStatus();
            },

            /**
             * Set DOM elements
             */
            setElements: function() {
                self.elms = {
                    identifyInput: document.getElementById('input-identify'),
                };
            },

            /**
             * Get initial login methods for reset
             */
            getLoginMethods: function() {
                self.loginMethods = thisElement.getAttribute('data-methods');
            },

            /**
             * Check user input for mount data
             * @return {string} input
             */
            getUserInput: function() {
                var input = 'email';

                if (thisElement.getData('cpf')) {
                    input = 'cpf';
                }

                if (thisElement.getData('cnpj')) {
                    input = 'cnpj';
                }

                return input;
            },

            /**
             * Reset Login Methods
             */
            resetLogin: function() {
                thisElement.setAttribute('data-methods', self.loginMethods);
                thisElement.setAttribute('data-texts', JSON.stringify({
                    'general-error-alert': '',
                    'main-action': 'Escolha uma das op&ccedil;&etilde;s para se identificar:'
                }));
                self.elms.identifyInput.setCustomValidity('invalid');
            },

            /**
             * Check Login
             * @param {string} user_input
             */
            checkStatus: function() {
                var storeId = thisElement.getData('store');
                var userInput = this.getUserInput();
                var data = 'store_id=' + storeId + '&' + userInput + '=' + thisElement.getData(userInput);
                var dataMethods = thisElement.hasLoginMethod('identify') ? '["facebook", "identify"]' : '["facebook"]';

                $.ajax({
                    type: 'GET',
                    url: thisElement.routes.methods.route('check_status'),
                    data: data,
                    dataType: 'json',
                    success: function(response){
                        if (response.data.message) {
                            thisElement.setAttribute('data-methods', dataMethods);
                            thisElement.setAttribute('data-texts', JSON.stringify({
                                'general-error-alert': response.data.message,
                                'main-action': '',
                            }));

                            self.blockedUser = true;
                        }
                    }
                });
            },
        },

    };

})(Zepto, window, document, thisElement);
