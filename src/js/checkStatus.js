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

        /**
         * Init the module
         */
        init: function() {
            if (!this.initialized) {
                this.setElements();
                this.getLoginMethods();
                this.initialized = true;
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
                'main-action': trayLoginProto.langs.methods.getDefaultTexts('main-action'),
            }));

            self.blockedUser = false;
            self.elms.identifyInput.setCustomValidity('invalid');
        },

        /**
         * Set a locked user
         */
        setBlockedUser: function(message) {
            var dataMethods = thisElement.hasLoginMethod('identify') ? '["facebook", "identify"]' : '["facebook"]';
            thisElement.setAttribute('data-methods', dataMethods);

            thisElement.setAttribute('data-texts', JSON.stringify({
                'general-error-alert': message,
                'main-action': trayLoginProto.langs.methods.getDefaultTexts('main-action'),
            }));

            self.blockedUser = true;
        },

        /**
         * Check Login
         * @param {string} user_input
         */
        checkStatus: function() {
            var userInput = this.getUserInput();

            if(!thisElement.getData(userInput)) {
                return false;
            }

            var storeId = thisElement.getData('store');
            var data = 'store_id=' + storeId + '&' + userInput + '=' + thisElement.getData(userInput);

            $.ajax({
                type: 'GET',
                url: thisElement.routes.methods.route('check_status'),
                data: data,
                dataType: 'json',
                success: function(response) {
                    if (!response.data.message) {
                        return false;
                    }

                    self.setBlockedUser(response.data.message);
                }
            });
        },

    };

})(Zepto, window, document, thisElement);
