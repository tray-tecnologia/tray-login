(function($, document) {
    /**
     * Langs
     */
    var self;
    trayLoginProto.langs = self = {
        methods: {
            /**
             * Get all langs and call methods that update the view
             */
            get: function() {
                var params = { store_id: thisElement.getAttribute('data-store') } ;
                $.get(thisElement.routes.methods.route('langs'), params, function(response) {
                    if (response) {
                        var texts = response;
                        thisElement.setDefaultTexts(texts);
                        self.methods.updateDefaultText(texts);
                        self.methods.updateAttrs(texts);
                    }
                });
            },

            /**
             * Update DOM elements with [data-default-text]
             * @param {object} texts
             */
            updateDefaultText: function(texts) {
                var elements = document.querySelectorAll('[data-default-text]');

                if (!elements.length) {
                    return;
                }

                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    var elementTextKey = element.getAttribute('data-default-text');

                    if (!this.checkHasCustomText(element)) {
                        var currentHTML = element.innerHTML;
                        element.innerHTML += texts[elementTextKey];
                    }
                }
            },
            /**
             * Update all elements with [data-attr-text] attribute
             * @param {object} texts
             */
            updateAttrs: function(texts) {
                var attrsElements = document.querySelectorAll('[data-attr-text]');

                if (!attrsElements.length) {
                    return;
                }

                for (var i = attrsElements.length - 1; i >= 0; i--) {
                    var element = attrsElements[i];
                    var parse = element.getAttribute('data-attr-text').split(':');
                    var attr = parse[0];
                    var textKey = parse[1];

                    element.setAttribute(attr, texts[textKey]);
                }
            },

            /**
             * Check if an element has custom text ([custom-text] attr)
             * @return {object} HTMLElement
             */
            checkHasCustomText: function(element) {
                var customTextKey = element.getAttribute('custom-text');

                if (!customTextKey) {
                    return false;
                }

                return thisElement.messages[customTextKey] ? true : false;
            },
        },
    };

})(Zepto, document);
