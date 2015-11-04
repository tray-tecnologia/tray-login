(function($, window, document, _this) {

    /**
     * Login by password
     * @example trayLoginProto.byPassword.init();
     */
    trayLoginProto.byPassword = {
        layout: {},

        /**
         * Init the module
         */
        init: function() {
            this.configureBreakPoints().changePasswordType();
        },

        /**
         * Set breakpoints to the vendor "Breakjs"
         */
        configureBreakPoints: function() {
            this.layout = Breakjs({
                mobile: 0,
                tablet: 768,
                desktop: 992
            });

            return this;
        },

        /**
         * Dispatch event that hides the password
         * if is desktop
         */
        changePasswordType: function() {
            if (this.layout.atLeast('desktop')) {
                _this.shadowRoot.getElementById('hide-password').dispatchEvent(new Event('click'));
            }

            return this;
        }
    };

})(Zepto, window, document, thisElement);
