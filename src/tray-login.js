var trayLoginProto = {},
    thisElement;

;(function($, window, document, undefined) {
    var thatDoc = document,
        thisDoc =  (thatDoc._currentScript || thatDoc.currentScript).ownerDocument,
        template = thisDoc.querySelector('template').content,
        screensSelectors = '#identify, #main, #otp, #email-password',
        currentScreen = {},
        titleSelectors = '#tray-login-email, #email-password .tray-title',
        loginMethods = [],
        data = {},
        messages = {},
        initialized = false,
        initializedPassLogin = false;

    trayLoginProto = Object.create(HTMLElement.prototype);

    /**
     * Executes when element was created
     */
    trayLoginProto.createdCallback = function() {
        var clone = thatDoc.importNode(template, true);
        this.appendChild(clone);
        this.initComponent();
    };

    /**
     * Executes when some attribute was changed
     */
    trayLoginProto.attributeChangedCallback = function() {
        thisElement.initComponent();
    };

    /**
     * Initialize the component
     */
    trayLoginProto.initComponent = function() {
        thisElement = this;
        this.setLoginMethods();
        this.addElements();
        this.setLoginCallback();
        this.preventDefaultMessages();
        this.setMessages();

        if (!initialized) {
            this.addListeners();
            this.langs.methods.get();
            initialized = true;
        }

        this.setData('email', this.getAttribute('data-email'));
        this.setData('cpf', this.getAttribute('data-cpf'));
        this.setData('cnpj', this.getAttribute('data-cnpj'));
        this.setData('store', this.getAttribute('data-store'));
        this.setData('session', this.getAttribute('data-session'));

        this.changeLabels();

        if (this.getData('email') || this.getData('cpf') || this.getData('cnpj')) {
            this.openScreen('main');
            this.checkStatus.methods.init();
        } else if (this.hasLoginMethod('identify')) {
            this.openScreen('identify');
            this.identify.methods.init();
        }

        this.bindValues('[data-element="tray-store"]', 'store');
        this.bindValues('[data-element="tray-session"]', 'session');
        this.handleCloseButton();
    };

    /**
     * Trigger a custom event
     * @param {string} eventName
     * @param {object} eventResponse
     * @param {string} eventType - options: success|error
     */
    trayLoginProto.triggerCustomEvent = function(eventName, eventResponse, eventType) {
        var event = new CustomEvent(eventName, {
            detail: {
                response: eventResponse,
                type: eventType,
            },
        });
        window.dispatchEvent(event);
    };

    /**
     * Set the available methods
     */
    trayLoginProto.setLoginMethods = function() {
        loginMethods = this.getAttribute('data-methods') || ['facebook', 'password', 'otp'];
    };

    /**
     * Set login callback
     */
    trayLoginProto.setLoginCallback = function() {
        this.setData('callback', this.getAttribute('data-callback'));
    };

    /**
     * Set store ID
     */
    trayLoginProto.setStoreId = function() {
        this.setData('store', this.getAttribute('store'));
    };

    /**
     * Check if a method is available
     * @param {string} method
     * @return {boolean}
     */
    trayLoginProto.hasLoginMethod = function(method) {
        return loginMethods.indexOf(method) > -1;
    };

    /**
     * Prevent Default Message
     */
    trayLoginProto.preventDefaultMessages = function() {
        $('input, select, textarea').on("invalid", function(e) {
            e.preventDefault();
        });
    };

    /**
     * Set messages
     */
    trayLoginProto.setMessages = function() {
        this.messages = $.parseJSON(this.getAttribute('data-texts'));
        this.applyMessages();
    };

    /**
     * Apply messages in the DOM
     */
    trayLoginProto.applyMessages = function() {
        for (var key in this.messages) {
            if (this.messages.hasOwnProperty(key)) {
                var elements = thatDoc.querySelectorAll('[custom-text="' + key + '"]');
                var message = this.messages[key];
                for (var i = elements.length - 1; i >= 0; i--) {
                    elements[i].innerHTML = this.messages[key];
                }
            }
        }
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
            .onPasswordRecovery()
            .onKeyUpCode()
            .onSubmitCode()
            .ajaxMiddleware();
    };

    /**
     * Ajax middleware loading
     * @return {object} trayLoginProto
     */
    trayLoginProto.ajaxMiddleware = function() {
        $(thatDoc).on('ajaxBeforeSend', function(e, xhr, options){
            thisElement.loading.classList.remove('tray-loading-hidden');
        });

        $(thatDoc).on('ajaxStop', function(e, xhr, options){
            thisElement.loading.classList.add('tray-loading-hidden');
        });

        return this;
    };

    /**
     * Cache elements in the DOM
     * @return {object} trayLoginProto
     */
    trayLoginProto.addElements = function() {
        this.formOTP = thatDoc.getElementById('form-otp');
        this.formPassword = thatDoc.getElementById('form-password');
        this.loading = thatDoc.getElementById('tray-login-loading');
        this.passwordButton = thatDoc.getElementById('tray-login-email');
        this.OTPButton = thatDoc.getElementById('tray-login-otp');
        this.passRecoveryButton = thatDoc.getElementById('password-recovery');
        this.$facebookButton = $(".tray-btn-facebook");
        this.$otherOptionButton = $('[data-element="login-other-option"]');
        this.handleElements();
        return this;
    };

    /**
     * Handle display and show buttons
     * @return {object} trayLoginProto
     */
    trayLoginProto.handleElements = function() {
        this.passwordButton.style.display = 'block';
        this.OTPButton.style.display = 'block';
        this.passRecoveryButton.style.display = 'block';
        this.$facebookButton.show();
        this.$otherOptionButton.show();

        if (!this.hasLoginMethod('password')) {
            this.passwordButton.style.display = 'none';
        }

        if (!this.hasLoginMethod('otp')) {
            this.OTPButton.style.display = 'none';
        }

        if (!this.hasLoginMethod('password')) {
            this.passRecoveryButton.style.display = 'none';
        }

        if (!this.hasLoginMethod('facebook')) {
            this.$facebookButton.hide();
        }

        if (!this.hasLoginMethod('identify') && currentScreen == 'main') {
            this.$otherOptionButton.hide();
        }

        return this;
    },
    /**
     * Open a screen and close others
     * @return {object} trayLoginProto
     */
    trayLoginProto.openScreen = function(screenID) {
        currentScreen = screenID;
        $(thatDoc).trigger('tray-login#' + screenID);
        var screens = thatDoc.querySelectorAll(screensSelectors);

        for (var i = screens.length - 1; i >= 0; i--) {
            screens[i].style.display = 'none';
        }

        thatDoc.getElementById(screenID).style.display = 'block';
        this.handleElements();
        this.cleanErrorMessage();

        return this;
    };

    /**
     * Open a screen and close others
     * @return {object} trayLoginProto
     */
    trayLoginProto.handleCloseButton = function() {
        this.closeButton = thatDoc.querySelector('.tray-close');

        if (this.messages != null && this.messages.closeButton) {
            this.closeButton.style.display = 'none';
        }
    };
    /**
     * When click in the close button
     * @return {object} trayLoginProto
     */
    trayLoginProto.onCloseElement = function() {
        this.closeButton = thatDoc.querySelector('.tray-close');

        this.closeButton.addEventListener('click', function(event) {
            event.preventDefault();
            thisElement.style.display = 'none';
            $(document).trigger('tray-login#close');
        });

        return this;
    };

    /**
     * Listen the button that open the password's screen
     * @return {object} trayLoginProto
     */
    trayLoginProto.onPasswordLogin = function() {
        this.passwordButton.addEventListener('click', function(event) {
            event.preventDefault();
            thisElement.openScreen('email-password')
                .showEmails()
                .showCpfs()
                .showCnpjs()
                .onHidePassword();
            thisElement.byPassword.init();
            trayLoginProto.triggerCustomEvent('tray-login-click', 'tray-password-submit');
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
            var dataMethods = thisElement.hasLoginMethod('identify') ? '["facebook", "identify"]' : '["facebook"]';

            $.ajax({
                type: 'POST',
                url: thisElement.routes.methods.route('password'),
                data: data,
                dataType: 'json',
                success: function(response) {
                    if (response && response.statusCode > 400) {
                        thisElement.showErrorMessage(response);
                        trayLoginProto.triggerCustomEvent('tray-login', response, 'error');
                        return;
                    }

                    trayLoginProto.triggerCustomEvent('tray-login', response, 'success');
                    thisElement.redirectOnSuccess(response.data.token);
                },
                error: function(request, type) {
                    if(request.status < 404) {
                        thisElement.setAttribute('data-methods', dataMethods);
                    }

                    trayLoginProto.triggerCustomEvent('tray-login', request, 'error');
                    thisElement.showErrorMessage($.parseJSON(request.responseText));
                    console.error('Tray Login Error: ' + request.status + ' - ' + request.statusText);
                },
            });
        });
    };


    /**
     * Add/Update values in the DOM
     * @param {string} elementSelector
     * @param {string} data
     * @return {object} trayLoginProto
     *
     * @example
     * this.bindValues('[data-element="tray-store"]', 'store');
     * this.bindValues('[data-element="tray-email"]', 'email');
     */
    trayLoginProto.bindValues = function(elementSelector, data) {
        var elements = thatDoc.querySelectorAll(elementSelector);
        for (var i = elements.length - 1; i >= 0; i--) {
            var value = thisElement.getData(data);
            if (value) {
                elements[i].innerHTML = value;
                elements[i].value = value;
            } else {
                elements[i].style.display = 'none';
            }
        }

        return this;
    };

    /**
     * Show e-mails in the DOM
     * @return {object} trayLoginProto
     */
    trayLoginProto.showEmails = function() {
        var emails = thatDoc.querySelectorAll('[data-element="tray-email"]');
        for (var i = emails.length - 1; i >= 0; i--) {
            var email = thisElement.getData('email');
            if (email) {
                emails[i].innerHTML = email;
                emails[i].value = email;
                emails[i].style.display = 'block';
            } else {
                emails[i].style.display = 'none';
            }
        }
        return this;
    };

    /**
     * Show cpf in the DOM
     * @return {object} trayLoginProto
     */
    trayLoginProto.showCpfs = function() {
        var cpfs = thatDoc.querySelectorAll('[data-element="tray-cpf"]');
        for (var i = cpfs.length - 1; i >= 0; i--) {
            var cpf = thisElement.getData('cpf');
            if (cpf) {
                cpfs[i].innerHTML = cpf;
                cpfs[i].value = cpf;
                cpfs[i].style.display = 'block';
            } else {
                cpfs[i].style.display = 'none';
            }
        }
        return this;
    };

    /**
     * Show cnpj in the DOM
     * @return {object} trayLoginProto
     */
    trayLoginProto.showCnpjs = function() {
        var cnpjs = thatDoc.querySelectorAll('[data-element="tray-cnpj"]');
        for (var i = cnpjs.length - 1; i >= 0; i--) {
            var cnpj = thisElement.getData('cnpj');
            if (cnpj) {
                cnpjs[i].innerHTML = cnpj;
                cnpjs[i].value = cnpj;
                cnpjs[i].style.display = 'block';
            } else {
                cnpjs[i].style.display = 'none';
            }
        }
        return this;
    };

    /**
     * When user is typing the password
     * @return {object} trayLoginProto
     */
    trayLoginProto.onKeyUpPassword = function() {
        var inputPassword = thatDoc.getElementById('input-password');

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
        if(initializedPassLogin) {
            return this;
        }
        initializedPassLogin = true;

        this.onKeyUpPassword();
        this.hidePasswordButton = thatDoc.getElementById('hide-password');
        var hideText = this.hidePasswordButton.innerHTML;
        var showText = this.hidePasswordButton.getAttribute('data-text-toggle');

        this.hidePasswordButton.addEventListener('click', function(event) {
            event.preventDefault();
            var inputPassword = thatDoc.getElementById('input-password');
            if (inputPassword.getAttribute('type') === 'text') {
                inputPassword.setAttribute('type', 'password');
                this.innerHTML = showText;
                return;
            }

            inputPassword.setAttribute('type', 'text');
            this.innerHTML = hideText;
        });

        return this;
    };

    /**
     * Try to login with OTP method
     * @return {object} trayLoginProto
     */
    trayLoginProto.onOTPLogin = function() {
        this.OTPButton.addEventListener('click', function(event) {
            event.preventDefault();
            thisElement.showEmails();
            thatDoc.getElementById('input-email').value = thisElement.getData('email');

            var data = {
                email: thisElement.getData('email'),
                cpf: thisElement.getData('cpf'),
                cnpj: thisElement.getData('cnpj'),
                store_id: thisElement.getData('store'),
                session_id: thisElement.getData('session'),
            };

            $.ajax({
                type: 'POST',
                url: thisElement.routes.methods.route('otp'),
                data: data,
                dataType: 'json',
                success: function(response) {
                    thisElement.openScreen('otp');
                },
                error: function(request, type) {
                    console.error('Tray Login Error: ' + request.status + ' - ' + request.statusText);
                },
                beforeSend: function(response)  {
                    trayLoginProto.triggerCustomEvent('tray-login-click', 'tray-random-code');
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
        for (var i = this.$facebookButton.length - 1; i >= 0; i--) {
            this.$facebookButton[i].addEventListener('click', function(event) {
                event.preventDefault();

                var data = {
                    store_id: thisElement.getAttribute('data-store'),
                    session_id: thisElement.getAttribute('data-session'),
                    crossdm: encodeURIComponent(document.location.origin),
                    callback: thisElement.getAttribute('data-callback'),
                };

                $.get(thisElement.routes.methods.route('facebook'), data, function(response) {
                    if (!response.data.url) {
                        return false;
                    }

                    thatDoc.location = response.data.url;
                });
                trayLoginProto.triggerCustomEvent('tray-login-click', 'tray-login-facebook');
            });
        }

        return this;
    };

    /**
     * Back to other options
     * @return {object} trayLoginProto
     */
    trayLoginProto.onChooseOtherOption = function() {
        for (var i = this.$otherOptionButton.length - 1; i >= 0; i--) {
            this.$otherOptionButton[i].addEventListener('click', function(event) {
                event.preventDefault();
                if (thisElement.hasLoginMethod('identify') && currentScreen === 'main' || thisElement.checkStatus.blockedUser){
                        thisElement.openScreen('identify');
                        thisElement.removeAttribute('data-email');
                        thisElement.removeAttribute('data-cpf');
                        thisElement.removeAttribute('data-cnpj');

                        if(thisElement.checkStatus.blockedUser){
                            thisElement.checkStatus.methods.resetLogin();
                        }

                        return this;
                }
                thisElement.openScreen('main');
            });
        }

        return this;
    };

    /**
     * Listen click on password recovery
     */
    trayLoginProto.onPasswordRecovery = function() {
        this.passRecoveryButton.addEventListener('click', function(event) {
            event.preventDefault();

            var data = {
                email: trayLoginProto.getData('email'),
                cpf: trayLoginProto.getData('cpf'),
                cnpj: trayLoginProto.getData('cnpj'),
                store_id: trayLoginProto.getData('store'),
                session_id: trayLoginProto.getData('session'),
            };

            $.ajax({
                type: 'POST',
                url: thisElement.routes.methods.route('password_recovery'),
                data: data,
                dataType: 'json',
                success: function(response) {
                    if (response.statusCode > 400) {
                        thisElement.showErrorMessage(response);
                        return;
                    }

                    var message = thatDoc.querySelector('#form-password .tray-action');
                    message.innerHTML = response.data.message;

                    thatDoc.getElementById('input-password').focus();
                },
                error: function(request, type) {
                    thisElement.showErrorMessage(request);
                },
                beforeSend: function(response)  {
                    trayLoginProto.triggerCustomEvent('tray-login-click', 'tray-password-recover');
                },
            });
        });

        return this;
    };

    /**
     * Remove error elements when is typing
     * @return {object} trayLoginProto
     */
    trayLoginProto.onKeyUpCode = function() {
        this.inputCode = thatDoc.getElementById('input-code');
        this.inputCode.addEventListener('keyup', function() {
            thatDoc.querySelector('.tray-error-message').innerHTML = '';
            thatDoc.getElementById('input-code').classList.remove('tray-input-invalid');
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

            var data = {
                email: thisElement.getData('email'),
                cpf: thisElement.getData('cpf'),
                cnpj: thisElement.getData('cnpj'),
                store_id: thisElement.getData('store'),
                session_id: thisElement.getData('session'),
                code: thatDoc.getElementById('input-code').value,
            };

            $.ajax({
                type: 'GET',
                data: data,
                url: thisElement.routes.methods.route('otp_login'),
                dataType: 'json',
                success: function(response) {
                    if (response.statusCode > 400) {
                        thisElement.showErrorMessage(response);
                        trayLoginProto.triggerCustomEvent('tray-login', response, 'error');
                        return;
                    }

                    trayLoginProto.triggerCustomEvent('tray-login', response, 'success');
                    thisElement.redirectOnSuccess(response.data.token);
                },
                error: function(request, type) {
                    thisElement.showErrorMessage($.parseJSON(request.responseText));
                    trayLoginProto.triggerCustomEvent('tray-login', request, 'error');
                }
            });
        });

        return this;
    };

    /**
     * Redirect to callback url
     * @param {string} token
     */
    trayLoginProto.redirectOnSuccess = function(token) {
        var redirectParam = '?token=' + token;
        var callback = thisElement.getAttribute('data-callback');

        if (!callback) {
            return;
        }

        if (callback.indexOf('?') > -1) {
            redirectParam = '&token=' + token;
        }

        window.location = callback + redirectParam;
    };

    /**
     * Show error messages to the user
     */
    trayLoginProto.showErrorMessage = function(response) {
        var errorElements = thatDoc.querySelectorAll('.tray-error-message');
        for (var i = errorElements.length - 1; i >= 0; i--) {
            errorElements[i].innerHTML = response.message;
        }

        thatDoc.getElementById('input-code').classList.add('tray-input-invalid');
        thatDoc.getElementById('input-password').classList.add('tray-input-invalid');
    };

    /**
     * Clean error messages to the user
     */
    trayLoginProto.cleanErrorMessage = function(response) {
        var errorElements = thatDoc.querySelectorAll('.tray-error-message');
        for (var i = errorElements.length - 1; i >= 0; i--) {
            errorElements[i].innerHTML = '';
        }

        thatDoc.getElementById('input-code').classList.remove('tray-input-invalid');
        thatDoc.getElementById('input-password').classList.remove('tray-input-invalid');
    };

    /**
     * Change email label if data-cpf exists
     */
    trayLoginProto.changeLabels = function() {
        if (this.getData('cpf')) {
            $(titleSelectors).text(this.langs.methods.getDefaultTexts('password-button-cpf'));
        } else if (this.getData('cnpj')) {
            $(titleSelectors).text(this.langs.methods.getDefaultTexts('password-button-cnpj'));
        } else if (this.getData('email')) {
            $(titleSelectors).text(this.langs.methods.getDefaultTexts('password-button'));
        }
    };

    /**
     * Register the element
     */
    window.trayLogin = thatDoc.registerElement('tray-login', {
        prototype: trayLoginProto
    });

})(Zepto, window, document);
