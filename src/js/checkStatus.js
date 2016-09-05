(function($, window, document, _this) {
    'use strict';
    var self;
    /**
     * Identify
     */
    trayLoginProto.checkStatus = self = {

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
                self.initialized = true;

                this.checkEmail();
            },

            /**
             * Check Login
             * @param {string} user_input
             */
            checkEmail: function() {
                var storeId = thisElement.getData('store');
                var email = thisElement.getData('email');
                var data = 'store_id=' + storeId + '&' + 'email=' + email;

                $.ajax({
                    type: 'GET',
                    url: thisElement.routes.methods.route('check_status'),
                    data: data,
                    dataType: 'json',
                    success: function(response){
                        if (response.data.message) {
                            thisElement.setAttribute('data-methods', '["facebook"]');
                            thisElement.setAttribute('data-texts', JSON.stringify({
                                'main-action': '',
                            }));

                            thisElement.showErrorMessage(response.data);
                            blockedUser = true;
                        }
                    }
                });
            },
        },

    };

})(Zepto, window, document, thisElement);
