/*
 * jQuery 1.2.3 - New Wave Javascript
 *
 * Copyright (c) 2008 John Resig (jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-02-06 00:21:25 -0500 (Wed, 06 Feb 2008) $
 * $Rev: 4663 $
 */
(function () {
    if (window.jQuery)
        var _jQuery = window.jQuery;
    var jQuery = window.jQuery = function (selector, context) {
        return new jQuery.prototype.init(selector, context);
    };
    if (window.$)
        var _$ = window.$;
    window.$ = jQuery;
    var quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/;
    var isSimple = /^.[^:#\[\.]*$/;
    jQuery.fn = jQuery.prototype = {
        init: function (selector, context) {
            selector = selector || document;
            if (selector.nodeType) {
                this[0] = selector;
                this.length = 1;
                return this;
            } else if (typeof selector == "string") {
                var match = quickExpr.exec(selector);
                if (match && (match[1] || !context)) {
                    if (match[1])
                        selector = jQuery.clean([match[1]], context);
                    else {
                        var elem = document.getElementById(match[3]);
                        if (elem)
                            if (elem.id != match[3])
                                return jQuery().find(selector);
                            else {
                                this[0] = elem;
                                this.length = 1;
                                return this;
                            }
                        else
                            selector = [];
                    }
                } else
                    return new jQuery(context).find(selector);
            } else if (jQuery.isFunction(selector))
                return new jQuery(document)[jQuery.fn.ready ? "ready" : "load"](selector);
            return this.setArray(
                selector.constructor == Array && selector ||
                (selector.jquery || selector.length && selector != window && !selector.nodeType && selector[0] != undefined && selector[0].nodeType) && jQuery.makeArray(selector) ||
                [selector]);
        },
        jquery: "1.2.3",
        size: function () {
            return this.length;
        },
        length: 0,
        get: function (num) {
            return num == undefined ?
                jQuery.makeArray(this) :
                this[num];
        },
        pushStack: function (elems) {
            var ret = jQuery(elems);
            ret.prevObject = this;
            return ret;
        },
        setArray: function (elems) {
            this.length = 0;
            Array.prototype.push.apply(this, elems);
            return this;
        },
        each: function (callback, args) {
            return jQuery.each(this, callback, args);
        },
        index: function (elem) {
            var ret = -1;
            this.each(function (i) {
                if (this == elem)
                    ret = i;
            });
            return ret;
        },
        attr: function (name, value, type) {
            var options = name;
            if (name.constructor == String)
                if (value == undefined)
                    return this.length && jQuery[type || "attr"](this[0], name) || undefined;
                else {
                    options = {};
                    options[name] = value;
                }
            return this.each(function (i) {
                for (name in options)
                    jQuery.attr(
                        type ?
                            this.style :
                            this,
                        name, jQuery.prop(this, options[name], type, i, name)
                    );
            });
        },
        css: function (key, value) {
            if ((key == 'width' || key == 'height') && parseFloat(value) < 0)
                value = undefined;
            return this.attr(key, value, "curCSS");
        },
        text: function (text) {
            if (typeof text != "object" && text != null)
                return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(text));
            var ret = "";
            jQuery.each(text || this, function () {
                jQuery.each(this.childNodes, function () {
                    if (this.nodeType != 8)
                        ret += this.nodeType != 1 ?
                            this.nodeValue :
                            jQuery.fn.text([this]);
                });
            });
            return ret;
        },
        wrapAll: function (html) {
            if (this[0])
                jQuery(html, this[0].ownerDocument)
                    .clone()
                    .insertBefore(this[0])
                    .map(function () {
                        var elem = this;
                        while (elem.firstChild)
                            elem = elem.firstChild;
                        return elem;
                    })
                    .append(this);
            return this;
        },
        wrapInner: function (html) {
            return this.each(function () {
                jQuery(this).contents().wrapAll(html);
            });
        },
        wrap: function (html) {
            return this.each(function () {
                jQuery(this).wrapAll(html);
            });
        },
        append: function () {
            return this.domManip(arguments, true, false, function (elem) {
                if (this.nodeType == 1)
                    this.appendChild(elem);
            });
        },
        prepend: function () {
            return this.domManip(arguments, true, true, function (elem) {
                if (this.nodeType == 1)
                    this.insertBefore(elem, this.firstChild);
            });
        },
        before: function () {
            return this.domManip(arguments, false, false, function (elem) {
                this.parentNode.insertBefore(elem, this);
            });
        },
        after: function () {
            return this.domManip(arguments, false, true, function (elem) {
                this.parentNode.insertBefore(elem, this.nextSibling);
            });
        },
        end: function () {
            return this.prevObject || jQuery([]);
        },
        find: function (selector) {
            var elems = jQuery.map(this, function (elem) {
                return jQuery.find(selector, elem);
            });
            return this.pushStack(/[^+>] [^+>]/.test(selector) || selector.indexOf("..") > -1 ?
                jQuery.unique(elems) :
                elems);
        },
        clone: function (events) {
            var ret = this.map(function () {
                if (jQuery.browser.msie && !jQuery.isXMLDoc(this)) {
                    var clone = this.cloneNode(true),
                        container = document.createElement("div");
                    container.appendChild(clone);
                    return jQuery.clean([container.innerHTML])[0];
                } else
                    return this.cloneNode(true);
            });
            var clone = ret.find("*").andSelf().each(function () {
                if (this[expando] != undefined)
                    this[expando] = null;
            });
            if (events === true)
                this.find("*").andSelf().each(function (i) {
                    if (this.nodeType == 3)
                        return;
                    var events = jQuery.data(this, "events");
                    for (var type in events)
                        for (var handler in events[type])
                            jQuery.event.add(clone[i], type, events[type][handler], events[type][handler].data);
                });
            return ret;
        },
        filter: function (selector) {
            return this.pushStack(
                jQuery.isFunction(selector) &&
                jQuery.grep(this, function (elem, i) {
                    return selector.call(elem, i);
                }) ||
                jQuery.multiFilter(selector, this));
        },
        not: function (selector) {
            if (selector.constructor == String)
                if (isSimple.test(selector))
                    return this.pushStack(jQuery.multiFilter(selector, this, true));
                else
                    selector = jQuery.multiFilter(selector, this);
            var isArrayLike = selector.length && selector[selector.length - 1] !== undefined && !selector.nodeType;
            return this.filter(function () {
                return isArrayLike ? jQuery.inArray(this, selector) < 0 : this != selector;
            });
        },
        add: function (selector) {
            return !selector ? this : this.pushStack(jQuery.merge(
                this.get(),
                selector.constructor == String ?
                    jQuery(selector).get() :
                    selector.length != undefined && (!selector.nodeName || jQuery.nodeName(selector, "form")) ?
                        selector : [selector]));
        },
        is: function (selector) {
            return selector ?
                jQuery.multiFilter(selector, this).length > 0 :
                false;
        },
        hasClass: function (selector) {
            return this.is("." + selector);
        },
        val: function (value) {
            if (value == undefined) {
                if (this.length) {
                    var elem = this[0];
                    if (jQuery.nodeName(elem, "select")) {
                        var index = elem.selectedIndex,
                            values = [],
                            options = elem.options,
                            one = elem.type == "select-one";
                        if (index < 0)
                            return null;
                        for (var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++) {
                            var option = options[i];
                            if (option.selected) {
                                value = jQuery.browser.msie && !option.attributes.value.specified ? option.text : option.value;
                                if (one)
                                    return value;
                                values.push(value);
                            }
                        }
                        return values;
                    } else
                        return (this[0].value || "").replace(/\r/g, "");
                }
                return undefined;
            }
            return this.each(function () {
                if (this.nodeType != 1)
                    return;
                if (value.constructor == Array && /radio|checkbox/.test(this.type))
                    this.checked = (jQuery.inArray(this.value, value) >= 0 ||
                        jQuery.inArray(this.name, value) >= 0);
                else if (jQuery.nodeName(this, "select")) {
                    var values = value.constructor == Array ?
                        value :
                        [value];
                    jQuery("option", this).each(function () {
                        this.selected = (jQuery.inArray(this.value, values) >= 0 ||
                            jQuery.inArray(this.text, values) >= 0);
                    });
                    if (!values.length)
                        this.selectedIndex = -1;
                } else
                    this.value = value;
            });
        },
        html: function (value) {
            return value == undefined ?
                (this.length ?
                    this[0].innerHTML :
                    null) :
                this.empty().append(value);
        },
        replaceWith: function (value) {
            return this.after(value).remove();
        },
        eq: function (i) {
            return this.slice(i, i + 1);
        },
        slice: function () {
            return this.pushStack(Array.prototype.slice.apply(this, arguments));
        },
        map: function (callback) {
            return this.pushStack(jQuery.map(this, function (elem, i) {
                return callback.call(elem, i, elem);
            }));
        },
        andSelf: function () {
            return this.add(this.prevObject);
        },
        data: function (key, value) {
            var parts = key.split(".");
            parts[1] = parts[1] ? "." + parts[1] : "";
            if (value == null) {
                var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);
                if (data == undefined && this.length)
                    data = jQuery.data(this[0], key);
                return data == null && parts[1] ?
                    this.data(parts[0]) :
                    data;
            } else
                return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function () {
                    jQuery.data(this, key, value);
                });
        },
        removeData: function (key) {
            return this.each(function () {
                jQuery.removeData(this, key);
            });
        },
        domManip: function (args, table, reverse, callback) {
            var clone = this.length > 1, elems;
            return this.each(function () {
                if (!elems) {
                    elems = jQuery.clean(args, this.ownerDocument);
                    if (reverse)
                        elems.reverse();
                }
                var obj = this;
                if (table && jQuery.nodeName(this, "table") && jQuery.nodeName(elems[0], "tr"))
                    obj = this.getElementsByTagName("tbody")[0] || this.appendChild(this.ownerDocument.createElement("tbody"));
                var scripts = jQuery([]);
                jQuery.each(elems, function () {
                    var elem = clone ?
                        jQuery(this).clone(true)[0] :
                        this;
                    if (jQuery.nodeName(elem, "script")) {
                        scripts = scripts.add(elem);
                    } else {
                        if (elem.nodeType == 1)
                            scripts = scripts.add(jQuery("script", elem).remove());
                        callback.call(obj, elem);
                    }
                });
                scripts.each(evalScript);
            });
        }
    };
    jQuery.prototype.init.prototype = jQuery.prototype;
    function evalScript(i, elem) {
        if (elem.src)
            jQuery.ajax({
                url: elem.src,
                async: false,
                dataType: "script"
            });
        else
            jQuery.globalEval(elem.text || elem.textContent || elem.innerHTML || "");
        if (elem.parentNode)
            elem.parentNode.removeChild(elem);
    }
    jQuery.extend = jQuery.fn.extend = function () {
        var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;
        if (target.constructor == Boolean) {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        if (typeof target != "object" && typeof target != "function")
            target = {};
        if (length == 1) {
            target = this;
            i = 0;
        }
        for (; i < length; i++)
            if ((options = arguments[i]) != null)
                for (var name in options) {
                    if (target === options[name])
                        continue;
                    if (deep && options[name] && typeof options[name] == "object" && target[name] && !options[name].nodeType)
                        target[name] = jQuery.extend(target[name], options[name]);
                    else if (options[name] != undefined)
                        target[name] = options[name];
                }
        return target;
    };
    var expando = "jQuery" + (new Date()).getTime(), uuid = 0, windowData = {};
    var exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i;
    jQuery.extend({
        noConflict: function (deep) {
            window.$ = _$;
            if (deep)
                window.jQuery = _jQuery;
            return jQuery;
        },
        // See test/unit/core.js for details concerning this function.
        isFunction: function (fn) {
            return !!fn && typeof fn != "string" && !fn.nodeName &&
                fn.constructor != Array && /function/i.test(fn + "");
        },
        isXMLDoc: function (elem) {
            return elem.documentElement && !elem.body ||
                elem.tagName && elem.ownerDocument && !elem.ownerDocument.body;
        },
        globalEval: function (data) {
            data = jQuery.trim(data);
            if (data) {
                // http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
                var head = document.getElementsByTagName("head")[0] || document.documentElement,
                    script = document.createElement("script");
                script.type = "text/javascript";
                if (jQuery.browser.msie)
                    script.text = data;
                else
                    script.appendChild(document.createTextNode(data));
                head.appendChild(script);
                head.removeChild(script);
            }
        },
        nodeName: function (elem, name) {
            return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
        },
        cache: {},
        data: function (elem, name, data) {
            elem = elem == window ?
                windowData :
                elem;
            var id = elem[expando];
            if (!id)
                id = elem[expando] = ++uuid;
            if (name && !jQuery.cache[id])
                jQuery.cache[id] = {};
            if (data != undefined)
                jQuery.cache[id][name] = data;
            return name ?
                jQuery.cache[id][name] :
                id;
        },
        removeData: function (elem, name) {
            elem = elem == window ?
                windowData :
                elem;
            var id = elem[expando];
            if (name) {
                if (jQuery.cache[id]) {
                    delete jQuery.cache[id][name];
                    name = "";
                    for (name in jQuery.cache[id])
                        break;
                    if (!name)
                        jQuery.removeData(elem);
                }
            } else {
                try {
                    delete elem[expando];
                } catch (e) {
                    if (elem.removeAttribute)
                        elem.removeAttribute(expando);
                }
                delete jQuery.cache[id];
            }
        },
        each: function (object, callback, args) {
            if (args) {
                if (object.length == undefined) {
                    for (var name in object)
                        if (callback.apply(object[name], args) === false)
                            break;
                } else
                    for (var i = 0, length = object.length; i < length; i++)
                        if (callback.apply(object[i], args) === false)
                            break;
            } else {
                if (object.length == undefined) {
                    for (var name in object)
                        if (callback.call(object[name], name, object[name]) === false)
                            break;
                } else
                    for (var i = 0, length = object.length, value = object[0];
                        i < length && callback.call(value, i, value) !== false; value = object[++i]) { }
            }
            return object;
        },
        prop: function (elem, value, type, i, name) {
            if (jQuery.isFunction(value))
                value = value.call(elem, i);
            return value && value.constructor == Number && type == "curCSS" && !exclude.test(name) ?
                value + "px" :
                value;
        },
        className: {
            add: function (elem, classNames) {
                jQuery.each((classNames || "").split(/\s+/), function (i, className) {
                    if (elem.nodeType == 1 && !jQuery.className.has(elem.className, className))
                        elem.className += (elem.className ? " " : "") + className;
                });
            },
            remove: function (elem, classNames) {
                if (elem.nodeType == 1)
                    elem.className = classNames != undefined ?
                        jQuery.grep(elem.className.split(/\s+/), function (className) {
                            return !jQuery.className.has(classNames, className);
                        }).join(" ") :
                        "";
            },
            has: function (elem, className) {
                return jQuery.inArray(className, (elem.className || elem).toString().split(/\s+/)) > -1;
            }
        },
        swap: function (elem, options, callback) {
            var old = {};
            for (var name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name];
            }
            callback.call(elem);
            for (var name in options)
                elem.style[name] = old[name];
        },
        css: function (elem, name, force) {
            if (name == "width" || name == "height") {
                var val, props = { position: "absolute", visibility: "hidden", display: "block" }, which = name == "width" ? ["Left", "Right"] : ["Top", "Bottom"];
                function getWH() {
                    val = name == "width" ? elem.offsetWidth : elem.offsetHeight;
                    var padding = 0, border = 0;
                    jQuery.each(which, function () {
                        padding += parseFloat(jQuery.curCSS(elem, "padding" + this, true)) || 0;
                        border += parseFloat(jQuery.curCSS(elem, "border" + this + "Width", true)) || 0;
                    });
                    val -= Math.round(padding + border);
                }
                if (jQuery(elem).is(":visible"))
                    getWH();
                else
                    jQuery.swap(elem, props, getWH);
                return Math.max(0, val);
            }
            return jQuery.curCSS(elem, name, force);
        },
        curCSS: function (elem, name, force) {
            var ret;
            function color(elem) {
                if (!jQuery.browser.safari)
                    return false;
                var ret = document.defaultView.getComputedStyle(elem, null);
                return !ret || ret.getPropertyValue("color") == "";
            }
            if (name == "opacity" && jQuery.browser.msie) {
                ret = jQuery.attr(elem.style, "opacity");
                return ret == "" ?
                    "1" :
                    ret;
            }
            if (jQuery.browser.opera && name == "display") {
                var save = elem.style.outline;
                elem.style.outline = "0 solid black";
                elem.style.outline = save;
            }
            if (name.match(/float/i))
                name = styleFloat;
            if (!force && elem.style && elem.style[name])
                ret = elem.style[name];
            else if (document.defaultView && document.defaultView.getComputedStyle) {
                if (name.match(/float/i))
                    name = "float";
                name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
                var getComputedStyle = document.defaultView.getComputedStyle(elem, null);
                if (getComputedStyle && !color(elem))
                    ret = getComputedStyle.getPropertyValue(name);
                else {
                    var swap = [], stack = [];
                    for (var a = elem; a && color(a); a = a.parentNode)
                        stack.unshift(a);
                    for (var i = 0; i < stack.length; i++)
                        if (color(stack[i])) {
                            swap[i] = stack[i].style.display;
                            stack[i].style.display = "block";
                        }
                    ret = name == "display" && swap[stack.length - 1] != null ?
                        "none" :
                        (getComputedStyle && getComputedStyle.getPropertyValue(name)) || "";
                    for (var i = 0; i < swap.length; i++)
                        if (swap[i] != null)
                            stack[i].style.display = swap[i];
                }
                if (name == "opacity" && ret == "")
                    ret = "1";
            } else if (elem.currentStyle) {
                var camelCase = name.replace(/\-(\w)/g, function (all, letter) {
                    return letter.toUpperCase();
                });
                ret = elem.currentStyle[name] || elem.currentStyle[camelCase];
                // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
                if (!/^\d+(px)?$/i.test(ret) && /^\d/.test(ret)) {
                    var style = elem.style.left, runtimeStyle = elem.runtimeStyle.left;
                    elem.runtimeStyle.left = elem.currentStyle.left;
                    elem.style.left = ret || 0;
                    ret = elem.style.pixelLeft + "px";
                    elem.style.left = style;
                    elem.runtimeStyle.left = runtimeStyle;
                }
            }
            return ret;
        },
        clean: function (elems, context) {
            var ret = [];
            context = context || document;
            if (typeof context.createElement == 'undefined')
                context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
            jQuery.each(elems, function (i, elem) {
                if (!elem)
                    return;
                if (elem.constructor == Number)
                    elem = elem.toString();
                if (typeof elem == "string") {
                    elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function (all, front, tag) {
                        return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ?
                            all :
                            front + "></" + tag + ">";
                    });
                    var tags = jQuery.trim(elem).toLowerCase(), div = context.createElement("div");
                    var wrap =
                        !tags.indexOf("<opt") &&
                        [1, "<select multiple='multiple'>", "</select>"] ||
                        !tags.indexOf("<leg") &&
                        [1, "<fieldset>", "</fieldset>"] ||
                        tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
                        [1, "<table>", "</table>"] ||
                        !tags.indexOf("<tr") &&
                        [2, "<table><tbody>", "</tbody></table>"] ||
                        (!tags.indexOf("<td") || !tags.indexOf("<th")) &&
                        [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
                        !tags.indexOf("<col") &&
                        [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"] ||
                        jQuery.browser.msie &&
                        [1, "div<div>", "</div>"] ||
                        [0, "", ""];
                    div.innerHTML = wrap[1] + elem + wrap[2];
                    while (wrap[0]--)
                        div = div.lastChild;
                    if (jQuery.browser.msie) {
                        var tbody = !tags.indexOf("<table") && tags.indexOf("<tbody") < 0 ?
                            div.firstChild && div.firstChild.childNodes :
                            wrap[1] == "<table>" && tags.indexOf("<tbody") < 0 ?
                                div.childNodes :
                                [];
                        for (var j = tbody.length - 1; j >= 0; --j)
                            if (jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length)
                                tbody[j].parentNode.removeChild(tbody[j]);
                        if (/^\s/.test(elem))
                            div.insertBefore(context.createTextNode(elem.match(/^\s*/)[0]), div.firstChild);
                    }
                    elem = jQuery.makeArray(div.childNodes);
                }
                if (elem.length === 0 && (!jQuery.nodeName(elem, "form") && !jQuery.nodeName(elem, "select")))
                    return;
                if (elem[0] == undefined || jQuery.nodeName(elem, "form") || elem.options)
                    ret.push(elem);
                else
                    ret = jQuery.merge(ret, elem);
            });
            return ret;
        },
        attr: function (elem, name, value) {
            if (!elem || elem.nodeType == 3 || elem.nodeType == 8)
                return undefined;
            var fix = jQuery.isXMLDoc(elem) ?
                {} :
                jQuery.props;
            if (name == "selected" && jQuery.browser.safari)
                elem.parentNode.selectedIndex;
            if (fix[name]) {
                if (value != undefined)
                    elem[fix[name]] = value;
                return elem[fix[name]];
            } else if (jQuery.browser.msie && name == "style")
                return jQuery.attr(elem.style, "cssText", value);
            else if (value == undefined && jQuery.browser.msie && jQuery.nodeName(elem, "form") && (name == "action" || name == "method"))
                return elem.getAttributeNode(name).nodeValue;
            else if (elem.tagName) {
                if (value != undefined) {
                    if (name == "type" && jQuery.nodeName(elem, "input") && elem.parentNode)
                        throw "type property can't be changed";
                    elem.setAttribute(name, "" + value);
                }
                if (jQuery.browser.msie && /href|src/.test(name) && !jQuery.isXMLDoc(elem))
                    return elem.getAttribute(name, 2);
                return elem.getAttribute(name);
                // elem is actually elem.style ... set the style
            } else {
                if (name == "opacity" && jQuery.browser.msie) {
                    if (value != undefined) {
                        elem.zoom = 1;
                        elem.filter = (elem.filter || "").replace(/alpha\([^)]*\)/, "") +
                            (parseFloat(value).toString() == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")");
                    }
                    return elem.filter && elem.filter.indexOf("opacity=") >= 0 ?
                        (parseFloat(elem.filter.match(/opacity=([^)]*)/)[1]) / 100).toString() :
                        "";
                }
                name = name.replace(/-([a-z])/ig, function (all, letter) {
                    return letter.toUpperCase();
                });
                if (value != undefined)
                    elem[name] = value;
                return elem[name];
            }
        },
        trim: function (text) {
            return (text || "").replace(/^\s+|\s+$/g, "");
        },
        makeArray: function (array) {
            var ret = [];
            if (typeof array != "array")
                for (var i = 0, length = array.length; i < length; i++)
                    ret.push(array[i]);
            else
                ret = array.slice(0);
            return ret;
        },
        inArray: function (elem, array) {
            for (var i = 0, length = array.length; i < length; i++)
                if (array[i] == elem)
                    return i;
            return -1;
        },
        merge: function (first, second) {
            if (jQuery.browser.msie) {
                for (var i = 0; second[i]; i++)
                    if (second[i].nodeType != 8)
                        first.push(second[i]);
            } else
                for (var i = 0; second[i]; i++)
                    first.push(second[i]);
            return first;
        },
        unique: function (array) {
            var ret = [], done = {};
            try {
                for (var i = 0, length = array.length; i < length; i++) {
                    var id = jQuery.data(array[i]);
                    if (!done[id]) {
                        done[id] = true;
                        ret.push(array[i]);
                    }
                }
            } catch (e) {
                ret = array;
            }
            return ret;
        },
        grep: function (elems, callback, inv) {
            var ret = [];
            for (var i = 0, length = elems.length; i < length; i++)
                if (!inv && callback(elems[i], i) || inv && !callback(elems[i], i))
                    ret.push(elems[i]);
            return ret;
        },
        map: function (elems, callback) {
            var ret = [];
            for (var i = 0, length = elems.length; i < length; i++) {
                var value = callback(elems[i], i);
                if (value !== null && value != undefined) {
                    if (value.constructor != Array)
                        value = [value];
                    ret = ret.concat(value);
                }
            }
            return ret;
        }
    });
    var userAgent = navigator.userAgent.toLowerCase();
    jQuery.browser = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: /webkit/.test(userAgent),
        opera: /opera/.test(userAgent),
        msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
        mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
    };
    var styleFloat = jQuery.browser.msie ?
        "styleFloat" :
        "cssFloat";
    
    jQuery.each({
        parent: function (elem) { return elem.parentNode; },
        parents: function (elem) { return jQuery.dir(elem, "parentNode"); },
        next: function (elem) { return jQuery.nth(elem, 2, "nextSibling"); },
        prev: function (elem) { return jQuery.nth(elem, 2, "previousSibling"); },
        nextAll: function (elem) { return jQuery.dir(elem, "nextSibling"); },
        prevAll: function (elem) { return jQuery.dir(elem, "previousSibling"); },
        siblings: function (elem) { return jQuery.sibling(elem.parentNode.firstChild, elem); },
        children: function (elem) { return jQuery.sibling(elem.firstChild); },
        contents: function (elem) { return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.makeArray(elem.childNodes); }
    }, function (name, fn) {
        jQuery.fn[name] = function (selector) {
            var ret = jQuery.map(this, fn);
            if (selector && typeof selector == "string")
                ret = jQuery.multiFilter(selector, ret);
            return this.pushStack(jQuery.unique(ret));
        };
    });
    
    
    var chars = jQuery.browser.safari && parseInt(jQuery.browser.version) < 417 ?
        "(?:[\\w*_-]|\\\\.)" :
        "(?:[\\w\u0128-\uFFFF*_-]|\\\\.)",
        quickChild = new RegExp("^>\\s*(" + chars + "+)"),
        quickID = new RegExp("^(" + chars + "+)(#)(" + chars + "+)"),
        quickClass = new RegExp("^([#.]?)(" + chars + "*)");
    
	/*
	 * A number of helper functions used for managing events.
	 * Many of the ideas behind this code orignated from 
	 * Dean Edwards' addEvent library.
	 */
    jQuery.event = {
        add: function (elem, types, handler, data) {
            if (elem.nodeType == 3 || elem.nodeType == 8)
                return;
            if (jQuery.browser.msie && elem.setInterval != undefined)
                elem = window;
            if (!handler.guid)
                handler.guid = this.guid++;
            if (data != undefined) {
                var fn = handler;
                handler = function () {
                    return fn.apply(this, arguments);
                };
                handler.data = data;
                handler.guid = fn.guid;
            }
            var events = jQuery.data(elem, "events") || jQuery.data(elem, "events", {}),
                handle = jQuery.data(elem, "handle") || jQuery.data(elem, "handle", function () {
                    var val;
                    if (typeof jQuery == "undefined" || jQuery.event.triggered)
                        return val;
                    val = jQuery.event.handle.apply(arguments.callee.elem, arguments);
                    return val;
                });
            handle.elem = elem;
            // jQuery(...).bind("mouseover mouseout", fn);
            jQuery.each(types.split(/\s+/), function (index, type) {
                var parts = type.split(".");
                type = parts[0];
                handler.type = parts[1];
                var handlers = events[type];
                if (!handlers) {
                    handlers = events[type] = {};
                    if (!jQuery.event.special[type] || jQuery.event.special[type].setup.call(elem) === false) {
                        if (elem.addEventListener)
                            elem.addEventListener(type, handle, false);
                        else if (elem.attachEvent)
                            elem.attachEvent("on" + type, handle);
                    }
                }
                handlers[handler.guid] = handler;
                jQuery.event.global[type] = true;
            });
            elem = null;
        },
        guid: 1,
        global: {},
        remove: function (elem, types, handler) {
            if (elem.nodeType == 3 || elem.nodeType == 8)
                return;
            var events = jQuery.data(elem, "events"), ret, index;
            if (events) {
                if (types == undefined || (typeof types == "string" && types.charAt(0) == "."))
                    for (var type in events)
                        this.remove(elem, type + (types || ""));
                else {
                    if (types.type) {
                        handler = types.handler;
                        types = types.type;
                    }
                    // jQuery(...).unbind("mouseover mouseout", fn);
                    jQuery.each(types.split(/\s+/), function (index, type) {
                        var parts = type.split(".");
                        type = parts[0];
                        if (events[type]) {
                            if (handler)
                                delete events[type][handler.guid];
                            else
                                for (handler in events[type])
                                    if (!parts[1] || events[type][handler].type == parts[1])
                                        delete events[type][handler];
                            for (ret in events[type]) break;
                            if (!ret) {
                                if (!jQuery.event.special[type] || jQuery.event.special[type].teardown.call(elem) === false) {
                                    if (elem.removeEventListener)
                                        elem.removeEventListener(type, jQuery.data(elem, "handle"), false);
                                    else if (elem.detachEvent)
                                        elem.detachEvent("on" + type, jQuery.data(elem, "handle"));
                                }
                                ret = null;
                                delete events[type];
                            }
                        }
                    });
                }
                for (ret in events) break;
                if (!ret) {
                    var handle = jQuery.data(elem, "handle");
                    if (handle) handle.elem = null;
                    jQuery.removeData(elem, "events");
                    jQuery.removeData(elem, "handle");
                }
            }
        },
        trigger: function (type, data, elem, donative, extra) {
            data = jQuery.makeArray(data || []);
            if (type.indexOf("!") >= 0) {
                type = type.slice(0, -1);
                var exclusive = true;
            }
            if (!elem) {
                if (this.global[type])
                    jQuery("*").add([window, document]).trigger(type, data);
            } else {
                if (elem.nodeType == 3 || elem.nodeType == 8)
                    return undefined;
                var val, ret, fn = jQuery.isFunction(elem[type] || null),
                    event = !data[0] || !data[0].preventDefault;
                if (event)
                    data.unshift(this.fix({ type: type, target: elem }));
                data[0].type = type;
                if (exclusive)
                    data[0].exclusive = true;
                if (jQuery.isFunction(jQuery.data(elem, "handle")))
                    val = jQuery.data(elem, "handle").apply(elem, data);
                if (!fn && elem["on" + type] && elem["on" + type].apply(elem, data) === false)
                    val = false;
                if (event)
                    data.shift();
                if (extra && jQuery.isFunction(extra)) {
                    ret = extra.apply(elem, val == null ? data : data.concat(val));
                    if (ret !== undefined)
                        val = ret;
                }
                if (fn && donative !== false && val !== false && !(jQuery.nodeName(elem, 'a') && type == "click")) {
                    this.triggered = true;
                    try {
                        elem[type]();
                    } catch (e) { }
                }
                this.triggered = false;
            }
            return val;
        },
        handle: function (event) {
            var val;
            event = jQuery.event.fix(event || window.event || {});
            var parts = event.type.split(".");
            event.type = parts[0];
            var handlers = jQuery.data(this, "events") && jQuery.data(this, "events")[event.type], args = Array.prototype.slice.call(arguments, 1);
            args.unshift(event);
            for (var j in handlers) {
                var handler = handlers[j];
                args[0].handler = handler;
                args[0].data = handler.data;
                if (!parts[1] && !event.exclusive || handler.type == parts[1]) {
                    var ret = handler.apply(this, args);
                    if (val !== false)
                        val = ret;
                    if (ret === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            }
            if (jQuery.browser.msie)
                event.target = event.preventDefault = event.stopPropagation =
                    event.handler = event.data = null;
            return val;
        },
        fix: function (event) {
            var originalEvent = event;
            event = jQuery.extend({}, originalEvent);
            event.preventDefault = function () {
                if (originalEvent.preventDefault)
                    originalEvent.preventDefault();
                originalEvent.returnValue = false;
            };
            event.stopPropagation = function () {
                if (originalEvent.stopPropagation)
                    originalEvent.stopPropagation();
                originalEvent.cancelBubble = true;
            };
            if (!event.target)
                event.target = event.srcElement || document;
            if (event.target.nodeType == 3)
                event.target = originalEvent.target.parentNode;
            if (!event.relatedTarget && event.fromElement)
                event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;
            if (event.pageX == null && event.clientX != null) {
                var doc = document.documentElement, body = document.body;
                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
            }
            if (!event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode))
                event.which = event.charCode || event.keyCode;
            if (!event.metaKey && event.ctrlKey)
                event.metaKey = event.ctrlKey;
            if (!event.which && event.button)
                event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
            return event;
        },
        special: {
            ready: {
                setup: function () {
                    bindReady();
                    return;
                },
                teardown: function () { return; }
            },
            mouseenter: {
                setup: function () {
                    if (jQuery.browser.msie) return false;
                    jQuery(this).bind("mouseover", jQuery.event.special.mouseenter.handler);
                    return true;
                },
                teardown: function () {
                    if (jQuery.browser.msie) return false;
                    jQuery(this).unbind("mouseover", jQuery.event.special.mouseenter.handler);
                    return true;
                },
                handler: function (event) {
                    if (withinElement(event, this)) return true;
                    arguments[0].type = "mouseenter";
                    return jQuery.event.handle.apply(this, arguments);
                }
            },
            mouseleave: {
                setup: function () {
                    if (jQuery.browser.msie) return false;
                    jQuery(this).bind("mouseout", jQuery.event.special.mouseleave.handler);
                    return true;
                },
                teardown: function () {
                    if (jQuery.browser.msie) return false;
                    jQuery(this).unbind("mouseout", jQuery.event.special.mouseleave.handler);
                    return true;
                },
                handler: function (event) {
                    if (withinElement(event, this)) return true;
                    arguments[0].type = "mouseleave";
                    return jQuery.event.handle.apply(this, arguments);
                }
            }
        }
    };
    jQuery.fn.extend({
        bind: function (type, data, fn) {
            return type == "unload" ? this.one(type, data, fn) : this.each(function () {
                jQuery.event.add(this, type, fn || data, fn && data);
            });
        },
        one: function (type, data, fn) {
            return this.each(function () {
                jQuery.event.add(this, type, function (event) {
                    jQuery(this).unbind(event);
                    return (fn || data).apply(this, arguments);
                }, fn && data);
            });
        },
        unbind: function (type, fn) {
            return this.each(function () {
                jQuery.event.remove(this, type, fn);
            });
        },
        trigger: function (type, data, fn) {
            return this.each(function () {
                jQuery.event.trigger(type, data, this, true, fn);
            });
        },
        triggerHandler: function (type, data, fn) {
            if (this[0])
                return jQuery.event.trigger(type, data, this[0], false, fn);
            return undefined;
        },
        toggle: function () {
            var args = arguments;
            return this.click(function (event) {
                this.lastToggle = 0 == this.lastToggle ? 1 : 0;
                event.preventDefault();
                return args[this.lastToggle].apply(this, arguments) || false;
            });
        },
        hover: function (fnOver, fnOut) {
            return this.bind('mouseenter', fnOver).bind('mouseleave', fnOut);
        },
        ready: function (fn) {
            bindReady();
            if (jQuery.isReady)
                fn.call(document, jQuery);
            else
                jQuery.readyList.push(function () { return fn.call(this, jQuery); });
            return this;
        }
    });
    
    var readyBound = false;
    function bindReady() {
        if (readyBound) return;
        readyBound = true;
        if (document.addEventListener && !jQuery.browser.opera)
            document.addEventListener("DOMContentLoaded", jQuery.ready, false);
        if (jQuery.browser.msie && window == top) (function () {
            if (jQuery.isReady) return;
            try {
                // http://javascript.nwbox.com/IEContentLoaded/
                document.documentElement.doScroll("left");
            } catch (error) {
                setTimeout(arguments.callee, 0);
                return;
            }
            jQuery.ready();
        })();
        if (jQuery.browser.opera)
            document.addEventListener("DOMContentLoaded", function () {
                if (jQuery.isReady) return;
                for (var i = 0; i < document.styleSheets.length; i++)
                    if (document.styleSheets[i].disabled) {
                        setTimeout(arguments.callee, 0);
                        return;
                    }
                jQuery.ready();
            }, false);
        if (jQuery.browser.safari) {
            var numStyles;
            (function () {
                if (jQuery.isReady) return;
                if (document.readyState != "loaded" && document.readyState != "complete") {
                    setTimeout(arguments.callee, 0);
                    return;
                }
                if (numStyles === undefined)
                    numStyles = jQuery("style, link[rel=stylesheet]").length;
                if (document.styleSheets.length != numStyles) {
                    setTimeout(arguments.callee, 0);
                    return;
                }
                jQuery.ready();
            })();
        }
        jQuery.event.add(window, "load", jQuery.ready);
    }
    
    // Used in jQuery.event.special.mouseenter and mouseleave handlers
    var withinElement = function (event, elem) {
        var parent = event.relatedTarget;
        while (parent && parent != elem) try { parent = parent.parentNode; } catch (error) { parent = elem; }
        return parent == elem;
    };
    jQuery(window).bind("unload", function () {
        jQuery("*").add(document).unbind();
    });

    var queue = function (elem, type, array) {
        if (!elem)
            return undefined;
        type = type || "fx";
        var q = jQuery.data(elem, type + "queue");
        if (!q || array)
            q = jQuery.data(elem, type + "queue",
                array ? jQuery.makeArray(array) : []);
        return q;
    };
    jQuery.fn.dequeue = function (type) {
        type = type || "fx";
        return this.each(function () {
            var q = queue(this, type);
            q.shift();
            if (q.length)
                q[0].apply(this);
        });
    };
    
    jQuery.fx.prototype = {
        update: function () {
            if (this.options.step)
                this.options.step.apply(this.elem, [this.now, this]);
            (jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this);
            if (this.prop == "height" || this.prop == "width")
                this.elem.style.display = "block";
        },
        cur: function (force) {
            if (this.elem[this.prop] != null && this.elem.style[this.prop] == null)
                return this.elem[this.prop];
            var r = parseFloat(jQuery.css(this.elem, this.prop, force));
            return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
        },
        custom: function (from, to, unit) {
            this.startTime = (new Date()).getTime();
            this.start = from;
            this.end = to;
            this.unit = unit || this.unit || "px";
            this.now = this.start;
            this.pos = this.state = 0;
            this.update();
            var self = this;
            function t(gotoEnd) {
                return self.step(gotoEnd);
            }
            t.elem = this.elem;
            jQuery.timers.push(t);
            if (jQuery.timerId == null) {
                jQuery.timerId = setInterval(function () {
                    var timers = jQuery.timers;
                    for (var i = 0; i < timers.length; i++)
                        if (!timers[i]())
                            timers.splice(i--, 1);
                    if (!timers.length) {
                        clearInterval(jQuery.timerId);
                        jQuery.timerId = null;
                    }
                }, 13);
            }
        },
        show: function () {
            this.options.orig[this.prop] = jQuery.attr(this.elem.style, this.prop);
            this.options.show = true;
            this.custom(0, this.cur());
            if (this.prop == "width" || this.prop == "height")
                this.elem.style[this.prop] = "1px";
            jQuery(this.elem).show();
        },
        hide: function () {
            this.options.orig[this.prop] = jQuery.attr(this.elem.style, this.prop);
            this.options.hide = true;
            this.custom(this.cur(), 0);
        },
        step: function (gotoEnd) {
            var t = (new Date()).getTime();
            if (gotoEnd || t > this.options.duration + this.startTime) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();
                this.options.curAnim[this.prop] = true;
                var done = true;
                for (var i in this.options.curAnim)
                    if (this.options.curAnim[i] !== true)
                        done = false;
                if (done) {
                    if (this.options.display != null) {
                        this.elem.style.overflow = this.options.overflow;
                        this.elem.style.display = this.options.display;
                        if (jQuery.css(this.elem, "display") == "none")
                            this.elem.style.display = "block";
                    }
                    if (this.options.hide)
                        this.elem.style.display = "none";
                    if (this.options.hide || this.options.show)
                        for (var p in this.options.curAnim)
                            jQuery.attr(this.elem.style, p, this.options.orig[p]);
                }
                if (done && jQuery.isFunction(this.options.complete))
                    this.options.complete.apply(this.elem);
                return false;
            } else {
                var n = t - this.startTime;
                this.state = n / this.options.duration;
                this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
                this.now = this.start + ((this.end - this.start) * this.pos);
                this.update();
            }
            return true;
        }
    };
    jQuery.fx.step = {
        scrollLeft: function (fx) {
            fx.elem.scrollLeft = fx.now;
        },
        scrollTop: function (fx) {
            fx.elem.scrollTop = fx.now;
        },
        opacity: function (fx) {
            jQuery.attr(fx.elem.style, "opacity", fx.now);
        },
        _default: function (fx) {
            fx.elem.style[fx.prop] = fx.now + fx.unit;
        }
    };
    jQuery.fn.offset = function () {
        var left = 0, top = 0, elem = this[0], results;
        if (elem) with (jQuery.browser) {
            var parent = elem.parentNode,
                offsetChild = elem,
                offsetParent = elem.offsetParent,
                doc = elem.ownerDocument,
                safari2 = safari && parseInt(version) < 522 && !/adobeair/i.test(userAgent),
                fixed = jQuery.css(elem, "position") == "fixed";
            if (elem.getBoundingClientRect) {
                var box = elem.getBoundingClientRect();
                add(box.left + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
                    box.top + Math.max(doc.documentElement.scrollTop, doc.body.scrollTop));
                add(-doc.documentElement.clientLeft, -doc.documentElement.clientTop);
            } else {
                add(elem.offsetLeft, elem.offsetTop);
                while (offsetParent) {
                    add(offsetParent.offsetLeft, offsetParent.offsetTop);
                    if (mozilla && !/^t(able|d|h)$/i.test(offsetParent.tagName) || safari && !safari2)
                        border(offsetParent);
                    if (!fixed && jQuery.css(offsetParent, "position") == "fixed")
                        fixed = true;
                    offsetChild = /^body$/i.test(offsetParent.tagName) ? offsetChild : offsetParent;
                    offsetParent = offsetParent.offsetParent;
                }
                while (parent && parent.tagName && !/^body|html$/i.test(parent.tagName)) {
                    if (!/^inline|table.*$/i.test(jQuery.css(parent, "display")))
                        add(-parent.scrollLeft, -parent.scrollTop);
                    if (mozilla && jQuery.css(parent, "overflow") != "visible")
                        border(parent);
                    parent = parent.parentNode;
                }
                if ((safari2 && (fixed || jQuery.css(offsetChild, "position") == "absolute")) ||
                    (mozilla && jQuery.css(offsetChild, "position") != "absolute"))
                    add(-doc.body.offsetLeft, -doc.body.offsetTop);
                if (fixed)
                    add(Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
                        Math.max(doc.documentElement.scrollTop, doc.body.scrollTop));
            }
            results = { top: top, left: left };
        }
        function border(elem) {
            add(jQuery.curCSS(elem, "borderLeftWidth", true), jQuery.curCSS(elem, "borderTopWidth", true));
        }
        function add(l, t) {
            left += parseInt(l) || 0;
            top += parseInt(t) || 0;
        }
        return results;
    };
})();
