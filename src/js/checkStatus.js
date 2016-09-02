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

                this.checkLogin();
            },

            /**
             * Check Login
             * @param {string} user_input
             */
            checkLogin: function() {
                console.log(this);
                $.ajax({
                    type: 'GET',
                    url: thisElement.routes.methods.route('check_status'),
                    data: '',
                    dataType: 'json',
                    success: function(response){
                        if (response.data.message) {
                            thisElement.setAttribute('data-texts', JSON.stringify({
                                'general-error-alert': response.data.message,
                            }));

                            thisElement.setAttribute('data-methods', '["facebook"]');
                        }
                    },
                    error: function(xhr, type){
                        thisElement.setAttribute('data-texts',JSON.stringify({
                            'general-error-alert': 'xaxa',
                        }));
                    }
                });
            },
        },

    };

})(Zepto, window, document, thisElement);
