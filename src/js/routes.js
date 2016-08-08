(function($, window, document) {

    /**
     * Routes
     * @example
     */
    var self;
    trayLoginProto.routes = self = {
        routes: {
            "has_account": "/login/api/login/has_account",
            "password": "/login/api/login/password",
            "password_recovery": "/login/api/recover-password",
            "otp": "/login/api/login/service/generateCode",
            "otp_login": "/login/api/login/securitycode",
            "facebook": "/login/api/login/facebook/url",
            "callback": "",
        },

        /**
         * 
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
