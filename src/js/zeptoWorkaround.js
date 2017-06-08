;(function($){
    $.extend($.fn, {
        each: function(callback){
            var $break = {}
            try {
                this.forEach(function(el, idx){ if (callback.call(el, idx, el) === false) throw $break })
            } catch (e) {
                if (e != $break)
                    throw e
            }
        }
    })
})(Zepto)