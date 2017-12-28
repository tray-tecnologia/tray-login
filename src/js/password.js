(function($, window, document, _this) {

    /**
     * Login by password
     * @example trayLoginProto.byPassword.init();
     */
    trayLoginProto.byPassword = {
        layout: {},

        /**
         * Initialized once
         */
        initialized: false,

        /**
         * Init the module
         */
        init: function() {
            if (this.initialized) {
                return;
            }

            this.configureBreakPoints().changePasswordType();
            this.initialized = true;
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
                this.setDefaultTypeAttribute();
                var passwordButtons = document.querySelectorAll('.tray-login-hide-password');

                for (i = 0; i < passwordButtons.length; i++) {
                    passwordButtons[i].dispatchEvent(new Event('click'));
                }

                return this;
            }
        },

        /**
         * Sets the default input type attribute
         */
        setDefaultTypeAttribute: function() {
            var passwordButtons = document.querySelectorAll('.tray-login-hide-password');
            for (i = 0; i < passwordButtons.length; i++) {
                if (!passwordButtons[i].getAttribute('type')) {
                    passwordButtons[i].setAttribute('type', 'text');
                }
            }
        }
    };

})(Zepto, window, document, thisElement);
