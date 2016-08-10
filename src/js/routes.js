(function($, window, document) {

    /**
     * Routes
     * @example
     */
    var self;
    trayLoginProto.routes = self = {
        routes: {
            "has_account": "/checkout/has-account",
            "password": "/checkout/password",
            "password_recovery": "/checkout/password-recovery",
            "otp": "/checkout/otp-generate",
            "otp_login": "/checkout/otp",
            "facebook": "/checkout/facebook/url",
        },

        /**
         * DOM Elements
         */
        elms: {},

        methods: {
            /**
             * Return route URL
             * @param {string} name - Route's name
             * @return {string|false} - Return route's URL or false
             */
            route: function(name) {
                if (!name) {
                    return false;
                }

                return self.routes[name];
            },

            /**
             * Add/update a named route
             * @param {string} name
             * @param {string} url
             */
            setRoute: function(name, url) {
                if (!name || !url) {
                    return false;
                }

                self.routes[name] = url;
            }
        },
    };

})(Zepto, window, document);
