// region RangeSlider
$.fn.RangeSlider = function(cfg){
    this.sliderCfg = {
        min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null,
        max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
        step: cfg && Number(cfg.step) ? cfg.step : 1,
        callback: cfg && cfg.callback ? cfg.callback : null
    };

    var $input = $(this);
    var min = this.sliderCfg.min;
    var max = this.sliderCfg.max;
    var step = this.sliderCfg.step;
    var callback = this.sliderCfg.callback;

    $input.attr('min', min)
        .attr('max', max)
        .attr('step', step);

    $input.bind("input", function(e){
        $input.attr('value', this.value);
        $input.css( 'background', 'linear-gradient(to right, rgb(65,68,63), white ' + this.value + '%, white)' );

        if ($.isFunction(callback)) {
            callback(this);
        }
    });
};
// endregion
// region selectFilter
jQuery.fn.selectFilter = function (options){
    var defaults = {
        callBack : function (res){}
    };
    var ops = $.extend({}, defaults, options);
    var selectList = $(this).find('select option');
    var that = this;
    var html = '';

    // 读取select 标签的值
    html += '<ul class="filter-list">';

    $(selectList).each(function (idx, item){
        var val = $(item).val();
        var valText = $(item).html();
        var selected = $(item).attr('selected');
        var disabled = $(item).attr('disabled');
        var isSelected = selected ? 'filter-selected' : '';
        var isDisabled = disabled ? 'filter-disabled' : '';
        if(selected) {
            html += '<li class="'+ isSelected +'" data-value="'+val+'"><a title="'+valText+'">'+valText+'</a></li>';
            $(that).find('.filter-title').val(valText);
        }else if (disabled){
            html += '<li class="'+ isDisabled +'" data-value="'+val+'"><a>'+valText+'</a></li>';
        }else {
            html += '<li data-value="'+val+'"><a title="'+valText+'">'+valText+'</a></li>';
        };
    });

    html += '</ul>';
    $(that).append(html);
    $(that).find('select').hide();

    //点击选择
    $(that).on('click', '.filter-text', function (){
        $(that).find('.filter-list').slideToggle(100);
        $(that).find('.filter-list').toggleClass('filter-open');
        $(that).find('.icon-filter-arrow').toggleClass('filter-show');
    });

    //点击选择列表
    $(that).find('.filter-list li').not('.filter-disabled').on('click', function (){
        var val = $(this).data('value');
        var valText =  $(this).find('a').html();
        $(that).find('.filter-title').val(valText);
        $(that).find('.icon-filter-arrow').toggleClass('filter-show');
        $(this).addClass('filter-selected').siblings().removeClass('filter-selected');
        $(this).parent().slideToggle(50);
        var str =$(that)[0].className
        var spstr = str.split("");
        var spstrnum = spstr[spstr.length-1]


        for(var i=0; i<selectList.length; i++){
            var selectVal = selectList.eq(i).val();
            if(val == selectVal) {
                $(that).find('select').val(val);
            };
        };
        ops.callBack(val,spstrnum); //返回值
    });

    //其他元素被点击则收起选择
    $(document).on('mousedown', function(e){
        closeSelect(that, e);
    });
    $(document).on('touchstart', function(e){
        closeSelect(that, e);
    });

    function closeSelect(that, e) {
        var filter = $(that).find('.filter-list'),
            filterEl = $(that).find('.filter-list')[0];
        var filterBoxEl = $(that)[0];
        var target = e.target;
        if(filterEl !== target && !$.contains(filterEl, target) && !$.contains(filterBoxEl, target)) {
            filter.slideUp(50);
            $(that).find('.filter-list').removeClass('filter-open');
            $(that).find('.icon-filter-arrow').removeClass('filter-show');
        };
    }
};

// endregion
// region Collapse
/*
 * Collapse plugin for jQuery
 * --
 * source: http://github.com/danielstocks/jQuery-Collapse/
 * site: http://webcloud.se/jQuery-Collapse
 *
 * @author Daniel Stocks (http://webcloud.se)
 * Copyright 2013, Daniel Stocks
 * Released under the MIT, BSD, and GPL Licenses.
 */
/* ������������֮�� www.lanrenzhijia.com */
(function($) {

    // Constructor
    function Collapse (el, options) {
        options = options || {};
        var _this = this,
            query = options.query || "> :even";

        $.extend(_this, {
            $el: el,
            options : options,
            sections: [],
            isAccordion : options.accordion || false,
            db : options.persist ? jQueryCollapseStorage(el[0].id) : false
        });

        // Figure out what sections are open if storage is used
        _this.states = _this.db ? _this.db.read() : [];

        // For every pair of elements in given
        // element, create a section
        _this.$el.find(query).each(function() {
            var section = new Section($(this), _this);
            _this.sections.push(section);

            // Check current state of section
            var state = _this.states[section._index()];
            if(state === 0) {
                section.$summary.removeClass("open");
            }
            if(state === 1) {
                section.$summary.addClass("open");
            }

            // Show or hide accordingly
            if(section.$summary.hasClass("open")) {
                section.open(true);
            }
            else {
                section.close(true);
            }
        });

        // Capute ALL the clicks!
        (function(scope) {
            _this.$el.on("click", "[data-collapse-summary]",
                $.proxy(_this.handleClick, scope));
        }(_this));
    }

    Collapse.prototype = {
        handleClick: function(e) {
            e.preventDefault();
            var sections = this.sections,
                l = sections.length;
            while(l--) {
                if($.contains(sections[l].$summary[0], e.target)) {
                    sections[l].toggle();
                    break;
                }
            }
        },
        open : function(eq) {
            if(isFinite(eq)) return this.sections[eq].open();
            $.each(this.sections, function() {
                this.open();
            });
        },
        close: function(eq) {
            if(isFinite(eq)) return this.sections[eq].close();
            $.each(this.sections, function() {
                this.close();
            });
        }
    };

    // Section constructor
    function Section($el, parent) {
        $.extend(this, {
            isOpen : false,
            $summary : $el
                .attr("data-collapse-summary", "")
                .wrapInner('<a href="#"/>'),
            $details : $el.next(),
            options: parent.options,
            parent: parent
        });
    }

    Section.prototype = {
        toggle : function() {
            if(this.isOpen) this.close();
            else this.open();
        },
        close: function(bypass) {
            this._changeState("close_zu", bypass);
        },
        open: function(bypass) {
            var _this = this;
            if(_this.options.accordion && !bypass) {
                $.each(_this.parent.sections, function() {
                    this.close();
                });
            }
            _this._changeState("open_zu", bypass);
        },
        _index: function() {
            return $.inArray(this, this.parent.sections);
        },
        _changeState: function(state, bypass) {

            var _this = this;
            _this.isOpen = state == "open_zu";
            if($.isFunction(_this.options[state]) && !bypass) {
                _this.options[state].apply(_this.$details);
            } else {
                if(_this.isOpen) _this.$details.show();
                else _this.$details.hide();
            }
            _this.$summary.removeClass("open_zu close_zu").addClass(state);
            _this.$details.attr("aria-hidden", state == "close_zu");
            _this.parent.$el.trigger(state, _this);
            if(_this.parent.db) {
                _this.parent.db.write(_this._index(), _this.isOpen);
            }
        }
    };

    // Expose in jQuery API
    $.fn.extend({
        collapse: function(options, scan) {
            var nodes = (scan) ? $("body").find("[data-collapse]") : $(this);
            return nodes.each(function() {
                var settings = (scan) ? {} : options,
                    values = $(this).attr("data-collapse") || "";
                $.each(values.split(" "), function(i,v) {
                    if(v) settings[v] = true;
                });
                new jQueryCollapse($(this), settings);
            });
        }
    });

    //jQuery DOM Ready
    $(function() {
        $.fn.collapse(false, true);
    });

    // Expose constructor to
    // global namespace
    jQueryCollapse = Collapse;

})(window.jQuery);
/* ������������֮�� www.lanrenzhijia.com */
// endregion
// region honeySwitch
var honeySwitch = {};
honeySwitch.themeColor = "rgb(100, 189, 99)";
honeySwitch.init = function() {
    var s = "<span class='sliderr'></span>";
    $("[class^=switch]").append(s);
    $("[class^=switch]").click(function() {
        if ($(this).hasClass("switch-disabled")) {
            return;
        }
        if ($(this).hasClass("switch-on")) {
            $(this).removeClass("switch-on").addClass("switch-off");
            $(".switch-off").css({
                'border-color' : '#dfdfdf',
                'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
                'background-color' : 'rgb(255, 255, 255)'
            });
        } else {
            $(this).removeClass("switch-off").addClass("switch-on");
            if (honeySwitch.themeColor) {
                var c = honeySwitch.themeColor;
                $(this).css({
                    'border-color' : c,
                    'box-shadow' : c + ' 0px 0px 0px 16px inset',
                    'background-color' : c
                });
            }
            if ($(this).attr('themeColor')) {
                var c2 = $(this).attr('themeColor');
                $(this).css({
                    'border-color' : c2,
                    'box-shadow' : c2 + ' 0px 0px 0px 16px inset',
                    'background-color' : c2
                });
            }
        }
    });
    window.switchEvent = function(ele, on, off) {
        $(ele).click(function() {
            if ($(this).hasClass("switch-disabled")) {
                return;
            }
            if ($(this).hasClass('switch-on')) {
                if ( typeof on == 'function') {
                    on();
                }
            } else {
                if ( typeof off == 'function') {
                    off();
                }
            }
        });
    }
    if (this.themeColor) {
        var c = this.themeColor;
        $(".switch-on").css({
            'border-color' : c,
            'box-shadow' : c + ' 0px 0px 0px 16px inset',
            'background-color' : c
        });
        $(".switch-off").css({
            'border-color' : '#dfdfdf',
            'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
            'background-color' : 'rgb(255, 255, 255)'
        });
    }
    if ($('[themeColor]').length > 0) {
        $('[themeColor]').each(function() {
            var c = $(this).attr('themeColor') || honeySwitch.themeColor;
            if ($(this).hasClass("switch-on")) {
                $(this).css({
                    'border-color' : c,
                    'box-shadow' : c + ' 0px 0px 0px 16px inset',
                    'background-color' : c
                });
            } else {
                $(".switch-off").css({
                    'border-color' : '#dfdfdf',
                    'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
                    'background-color' : 'rgb(255, 255, 255)'
                });
            }
        });
    }
};
honeySwitch.showOn = function(ele) {
    $(ele).removeClass("switch-off").addClass("switch-on");
    if(honeySwitch.themeColor){
        var c = honeySwitch.themeColor;
        $(ele).css({
            'border-color' : c,
            'box-shadow' : c + ' 0px 0px 0px 16px inset',
            'background-color' : c
        });
    }
    if ($(ele).attr('themeColor')) {
        var c2 = $(ele).attr('themeColor');
        $(ele).css({
            'border-color' : c2,
            'box-shadow' : c2 + ' 0px 0px 0px 16px inset',
            'background-color' : c2
        });
    }
}
honeySwitch.showOff = function(ele) {
    $(ele).removeClass("switch-on").addClass("switch-off");
    $(".switch-off").css({
        'border-color' : '#dfdfdf',
        'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
        'background-color' : 'rgb(255, 255, 255)'
    });
}
$(function() {
    honeySwitch.init();
});
// endregion


