;(function($, window, document, undefined) {
    var thatDoc = document,
        thisDoc =  (thatDoc._currentScript || thatDoc.currentScript).ownerDocument,
        template = thisDoc.querySelector('template').content,
        trayLoginProto = Object.create(HTMLElement.prototype),
        thisElement,
        screensSelectors = '#main, #otp, #email-password',
        urls = {},
        data = {};

    /**
     * Load the callback URL
     */
    $(document).on('tray-login', function(event, response, type) {
        if (type === 'success') {
            window.location = urls.callback;
        }
    });

    if (window.ShadowDOMPolyfill) {
        WebComponents.ShadowCSS.shimStyling(template, 'tray-login');
    }

    /**
     * Executes when element was created
     */
    trayLoginProto.createdCallback = function() {
        var shadowRoot = this.createShadowRoot();
        var clone = thatDoc.importNode(template, true);
        shadowRoot.appendChild(clone);
        thisElement = this;
        this.addElements();
        this.setUrls();
        this.addListeners();
        this.setData('email', this.getAttribute('data-email'));
        this.openScreen('main');
    };

    /**
     * Define API's urls
     */
    trayLoginProto.setUrls = function() {
        urls.otp = this.getAttribute('api-otp');
        urls.otpLogin = this.getAttribute('api-otp-login');
        urls.callback = this.getAttribute('url-callback');
        urls.facebook = this.getAttribute('url-facebook');
        urls.password = this.getAttribute('url-password');
    };

    /**
     * Set a data
     * @param {string} key
     * @param {string} val
     */
    trayLoginProto.setData = function(key, val) {
        data[key] = val;
    };

    /**
     * Get a data
     * @param {string} key
     * @return {string} - Value of the array key
     */
    trayLoginProto.getData = function(key) {
        return data[key];
    };

    /**
     * Add event listeners
     */
    trayLoginProto.addListeners = function() {
        this.onCloseElement()
            .onPasswordLogin()
            .onOTPLogin()
            .onFacebookLogin()
            .onChooseOtherOption()
            .onKeyUpCode()
            .onSubmitCode();
    };

    /**
     * Cache elements in the DOM
     * @return {object} trayLoginProto
     */
    trayLoginProto.addElements = function() {
        this.formOTP = this.shadowRoot.getElementById('form-otp');
        this.formPassword = this.shadowRoot.getElementById('form-password');
        return this;
    };

    /**
     * Open a screen and close others
     * @return {object} trayLoginProto
     */
    trayLoginProto.openScreen = function(screenID) {
        $(thatDoc).trigger('tray-login#' + screenID);
        var screens = thisElement.shadowRoot.querySelectorAll(screensSelectors);
        for (var i = screens.length - 1; i >= 0; i--) {
            screens[i].style.display = 'none';
        }
        this.shadowRoot.getElementById(screenID).style.display = 'block';

        this.cleanErrorMessage();

        return this;
    };

    /**
     * When click in the close button
     * @return {object} trayLoginProto
     */
    trayLoginProto.onCloseElement = function() {
        this.closeButton = this.shadowRoot.querySelector('.tray-close');

        this.closeButton.addEventListener('click', function(event) {
            event.preventDefault();
            thisElement.style.display = 'none';
        });

        return this;
    };

    /**
     * Listen the button that open the password's screen
     * @return {object} trayLoginProto
     */
    trayLoginProto.onPasswordLogin = function() {
        this.passwordButton = this.shadowRoot.getElementById('tray-login-email');
        this.passwordButton.addEventListener('click', function(event) {
            event.preventDefault();
            thisElement.openScreen('email-password')
                .showEmails()
                .onHidePassword();
        });

        this.onPasswordSubmit();

        return this;
    };

    /**
     * Listen submit when is trying to login with e-mail and password
     */
    trayLoginProto.onPasswordSubmit = function() {
        this.formPassword.addEventListener('submit', function(event) {
            event.preventDefault();
            var data = $(thisElement.formPassword).serialize();
            $.ajax({
                type: 'POST',
                url: urls.password,
                data: data,
                dataType: 'json',
                success: function(response) {
                    if (response.statusCode > 400) {
                        thisElement.showErrorMessage(response);
                        $(document).trigger('tray-login', [response, 'error']);
                        return;
                    }

                    $(document).trigger('tray-login', [response, 'success']);
                },
                error: function(request, type) {
                    $(document).trigger('tray-login', [request, 'error']);
                    thisElement.showErrorMessage($.parseJSON(request.responseText));
                    console.error('Tray Login Error: ' + request.status + ' - ' + request.statusText);
                }
            });
        });
    };

    /**
     * Show e-mails in the DOM
     * @return {object} trayLoginProto
     */
    trayLoginProto.showEmails = function() {
        var emails = thisElement.shadowRoot.querySelectorAll('[data-element="tray-email"]');
        for (var i = emails.length - 1; i >= 0; i--) {
            emails[i].innerHTML = thisElement.getData('email');
            emails[i].value = thisElement.getData('email');
        }
        return this;
    };

    /**
     * When user is typing the password
     * @return {object} trayLoginProto
     */
    trayLoginProto.onKeyUpPassword = function() {
        var inputPassword = thisElement.shadowRoot.getElementById('input-password');

        inputPassword.addEventListener('keyup', function(event) {
            if (this.value.length > 0) {
                thisElement.hidePasswordButton.style.display = 'block';
            } else {
                thisElement.hidePasswordButton.style.display = 'none';
            }
            thisElement.cleanErrorMessage();
        });

        return this;
    };

    /**
     * When clicks on the button "hide"
     * @return {object} trayLoginProto
     */
    trayLoginProto.onHidePassword = function() {
        this.onKeyUpPassword();
        this.hidePasswordButton = this.shadowRoot.getElementById('hide-password');
        this.hidePasswordButton.addEventListener('click', function(event) {
            event.preventDefault();
            var inputPassword = thisElement.shadowRoot.getElementById('input-password');
            if (inputPassword.getAttribute('type') === 'text') {
                inputPassword.setAttribute('type', 'password');
            } else {
                inputPassword.setAttribute('type', 'text');
            }
        });

        return this;
    };

    /**
     * Try to login with OTP method
     * @return {object} trayLoginProto
     */
    trayLoginProto.onOTPLogin = function() {
        this.OTPButton = this.shadowRoot.getElementById('tray-login-otp');
        
        this.OTPButton.addEventListener('click', function(event) {
            event.preventDefault();
            thisElement.showEmails();
            thisElement.shadowRoot.getElementById('input-email').value = thisElement.getData('email');
            thisElement.openScreen('otp');
            $.ajax({
                type: 'POST',
                url: urls.otp,
                dataType: 'json',
                success: function(response) {},
                error: function(request, type) {
                    console.error('Tray Login Error: ' + request.status + ' - ' + request.statusText);
                }
            });
        });

        return this;
    };

    /**
     * Try to login with Facebook
     * @return {object} trayLoginProto
     */
    trayLoginProto.onFacebookLogin = function() {
        this.facebookButton = this.shadowRoot.getElementById('tray-login-facebook');

        if (!urls.facebook) {
            this.facebookButton.style.display = 'none';
        }

        this.facebookButton.addEventListener('click', function(event) {
            event.preventDefault();
            $.get(urls.facebook, function(response) {
                if (!response.data.url) {
                    return false;
                }
                window.open(response.data.url, "Facebook", "width=400,height=500,toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no");
            });
        });

        return this;
    };

    /**
     * Back to other options
     * @return {object} trayLoginProto
     */
    trayLoginProto.onChooseOtherOption = function() {
        this.otherOptionButton = this.shadowRoot.querySelectorAll('[data-element="login-other-option"]');

        for (var i = this.otherOptionButton.length - 1; i >= 0; i--) {
            this.otherOptionButton[i].addEventListener('click', function(event) {
                event.preventDefault();
                thisElement.openScreen('main');
            });
        }

        return this;
    };

    /**
     * Remove error elements when is typing
     * @return {object} trayLoginProto
     */
    trayLoginProto.onKeyUpCode = function() {
        this.inputCode = this.shadowRoot.getElementById('input-code');
        this.inputCode.addEventListener('keyup', function() {
            thisElement.shadowRoot.querySelector('.tray-error-message').innerHTML = '';
            thisElement.shadowRoot.getElementById('input-code').classList.remove('tray-input-invalid');
        });

        return this;
    },

    /**
     * Event listener to the form submit
     * @return {object} trayLoginProto
     */
    trayLoginProto.onSubmitCode = function() {
        this.formOTP.addEventListener('submit', function(event) {
            event.preventDefault();
            var data = $(this).serialize();
            $.ajax({
                type: 'GET',
                data: data,
                url: urls.otpLogin,
                dataType: 'json',
                success: function(response) {
                    if (response.statusCode > 400) {
                        thisElement.showErrorMessage(response);
                        $(document).trigger('tray-login', [response, 'error']);
                        return;
                    }

                    $(document).trigger('tray-login', [response, 'success']);
                },
                error: function(request, type) {
                    thisElement.showErrorMessage($.parseJSON(request.responseText));
                    $(document).trigger('tray-login', [request, 'error']);
                }
            });
        });

        return this;
    };

    /**
     * Show error messages to the user
     */
    trayLoginProto.showErrorMessage = function(response) {
        var errorElements = thisElement.shadowRoot.querySelectorAll('.tray-error-message');
        for (var i = errorElements.length - 1; i >= 0; i--) {
            errorElements[i].innerHTML = response.message;
        };

        thisElement.shadowRoot.getElementById('input-code').classList.add('tray-input-invalid');
        thisElement.shadowRoot.getElementById('input-password').classList.add('tray-input-invalid');
    };

    /**
     * Clean error messages to the user
     */
    trayLoginProto.cleanErrorMessage = function(response) {
        var errorElements = thisElement.shadowRoot.querySelectorAll('.tray-error-message');
        for (var i = errorElements.length - 1; i >= 0; i--) {
            errorElements[i].innerHTML = '';
        };

        thisElement.shadowRoot.getElementById('input-code').classList.remove('tray-input-invalid');
        thisElement.shadowRoot.getElementById('input-password').classList.remove('tray-input-invalid');
    };

    /**
     * Register the element
     */
    window.trayLogin = thatDoc.registerElement('tray-login', {
        prototype: trayLoginProto
    });

})(Zepto, window, document);
