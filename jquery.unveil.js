/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(opts, callback) {

    opts = opts || {
      threshold: 0,
      useBgImage: false,
      isPictureElement: false
    }

    var $w = $(window),
        th = opts.threshold,
        useBgImage = opts.useBgImage,
        isPictureElement = opts.isPictureElement,
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-src-retina" : "data-src",
        images = this,
        loaded;

    this.one("unveil", function() {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) {
        if (useBgImage) {
          var currentValues = this.style.getPropertyValue("background-image");
          var newValues     = currentValues + ", url(" + source + ")";
          this.style.setProperty("background-image", newValues);
        }
        else
          this.setAttribute("src", source);
        if (typeof callback === "function") callback.call(this);
      }
      if (isPictureElement) {
        $(this).find("source").each(function(index, elem) {
          var source = $(elem).attr("data-src") || $(elem).attr("data-srcset")
          $(elem).attr("srcset", source)
        })
      }
    });

    function unveil() {
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    $w.on("scroll.unveil resize.unveil lookup.unveil", unveil);

    unveil();

    return this;

  };

})(window.jQuery || window.Zepto);
