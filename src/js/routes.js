(function($, window, document, _this) {

    /**
     * Routes
     * @example
     */
    var self;
    trayLoginProto.routes = self = {
        routes: {
            "has_account": "mock/has_account_fail.json?store_id=351572&",
            "otp": "mock/otp.json",
            "opt_login": "mock/otp.json",
            "facebook": "login/facebook",
            "password": "mock/password_error.json",
            "password_recovery": "login/recovery",
            "callback": "",
        },

        /**
         * 
         */
        elms: {},

        methods: {
            /**
             * Init the module
             */
            route: function(name) {
                if (!name) {
                    return false;
                }

                return self.routes[name];
            },

            setRoute: function(name, url) {
                if (!name || !url) {
                    return false;
                }

                self.routes[name] = url;
            }
        },
    };

})(Zepto, window, document, thisElement);
