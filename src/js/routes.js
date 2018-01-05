(function($, window, document) {

    /**
     * Routes
     * @example
     */
    var self;
    trayLoginProto.routes = self = {
        prefix: 'checkout',
        routes: {
            "has_account": "/has-account",
            "password": "/password",
            "password_update": "/password-update",
            "security_code": "/generate-security-code",
            "otp": "/otp-generate",
            "otp_login": "/otp",
            "facebook": "/facebook/url",
            "check_status": "/check-status",
            "langs": "/langs/login_component",
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

                return '/' + self.prefix + self.routes[name];
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
