/*
 * Copyright 2013 Rocky
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * @version 0.0.3
 *
 * Compatible with IE 6+, FF 3.6+, Safari 5+, Chrome
 */

;(function(window, undefined) {
    var $ = AJ = window.$ = window.AJ = function (selector, context) {
        return new $.fn.init(selector, context);
    };
    // quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
    // cls = /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
    // rclass = /[\n\t]/g;

    // var exprClassName = /^(?:[\w\-]+)?\.([\w\-]+)/,
    //     exprId = /^(?:[\w\-]+)?#([\w\-]+)/,
    //     exprNodeName = /^([\w\*\-]+)/,
    //     exprNodeAttr = /^(?:[\w\-]+)?\[([\w]+)(=(\w+))?\]/;

    // var exprClassName = /^(?:[\w\-]+)?\.([\w\-]+)/,
    //     exprId = /^(?:[\w\-]+)?#([\w\-]+)/,
    //     exprNodeName = /^([\w\*\-]+)/,
    //     exprNodeAttr = /^(?:[\w\-]+)?\[([\w]+)(=(\w+))?\]/,
    //     exprNodeTag = /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/;


AJ.fn = AJ.prototype = {
    du: "1.0",
    /**
     * @property {DOMElement[]} els Selected elements
     */
    els: [],

    /**
     * @property {String|DOMElement|DOMElement[]} selector Selector used for selection
     */
    selector: [],

    /**
     * @property {String|DOMElement|DOMElement[]} context Context used for the selection
     */
    context: [],
    
    /**
     * Set elements for given selection.
     * @constructor
     * @param {String|DOMElement|DOMElement[]} selector
     * @param {String|DOMElement|DOMElement[]} [context=document] !! Will be ignored if selector is not a string !!
     */
    init: function(selector, context){
        // set selector and context property
        this.selector = selector || document;
        this.context = context || document;

        // get elements by selector
        if ( typeof selector == 'string' ) {
            // trim spaces at the begin and end
            selector = AJ.trim( selector );

            if(selector == 'body' && ! context){
                // set body
                this.els = document.body;
            }else if(selector.substr( 0, 1 ) == '<') {
                // create element
                this.els = AJ.create( selector );
            }else{
                // find elements
                this.els = AJ.selector( selector, context );
            }
        }else if(AJ.isFunction(selector)) {
            // set DOM ready function
            AJ.ready( selector );
        }else if(selector instanceof AJ.fn.init) {
            this.els = selector.get();
        }else{
            this.els = selector;
        }

        // make sure elements property is an array
        if(!AJ.isArray(this.els)){
            this.els = this.els ? [this.els] : [];
        }else{
            // remove doubles
            this.els = AJ.clearAJplicates(this.els);
        }

        // support for using AJ object as an array
        // set indices
        for(var i in this.els){
            this[i] = this.els[i];
        }

        // set length property
        this.length = this.els.length;

        return this;
        

        // var match, elem;
        // context = context || document;
        // if (!selector) {
        //     return this;
        // };
        // if (typeof selector === 'string') {
        //     elem = Sizzle(selector);
        //     var i = 0, len = elem.length;
        //     for (; i < len; i++) {
        //         this[i] = elem[i];
        //     };
        //     this.length = len;
            
        //     // if(match = exprId.exec(selector)){
        //     //     elem = context.getElementById(match[1]);
        //     //     this[0] = elem;
        //     //     this.length = 1;
        //     // }else if(match = exprClassName.exec(selector)){
        //     //     elem = context.getElementsByClassName(match[1]);
        //     //     var i = 0, len = elem.length;
        //     //     for (; i < len; i++) {
        //     //         this[i] = elem[i];
        //     //     };
        //     //     this.length = len;
        //     // }else if(match = exprNodeName.exec(selector)){
        //     //     elem = context.getElementsByTagName(match[1]);
        //     //     var i = 0, len = elem.length;
        //     //     for (; i < len; i++) {
        //     //         this[i] = elem[i];
        //     //     };
        //     //     this.length = len;
        //     // }
        // };
        // this.selector = selector;
        // return this;
        // 
        
    },

    /**
     * Get count of current elements
     * @return {Integer}
     */
    size: function(){
        return this.length;
    },

    /**
     * Get element (return all current elements when no index is given)
     * @param {Integer} index
     * @return {DOMElement|DOMElement[]}
     */
    get: function (index) {
        if (typeof index == 'undefined')
            return this.els;

        var el = (index === -1)
                ? this.els.slice(index)
                : this.els.slice(index, +index + 1);

        return el.length ? el[0] : null;
    },

    /**
     * Get count of current elements
     * @return {Integer}
     */
    size: function () {
        return this.els.length;
    },

    /**
     * Call function for each element
     * @param {Function} fn
     * @param {Array} args
     * @return {This}
     */
    each: function (fn) {
        AJ.each(this.els, fn);
        return this;
    },

    /**
     * Find elements within the current elements (context)
     * @param {String} selector
     * @return {AJ.fn.init} Instance of new selection
     */
    find: function (selector) {
        return this.chain(selector, this.els);
    },

    /**
     * Add to the current elements in a new created AJ object
     * @param {String|DOMElement|DOMElement[]} selector When selector is not a string the context will be ignored
     * @param {String|DOMElement|DOMElement[]} [context]
     * @return {AJ.fn.init} Instance of new selection
     */
    add: function (selector, context) {
        var $new = this.chain(selector, context),
            els = this.els.concat($new.get());

        $new.els = AJ.clearAJplicates(els);
        return $new;
    },

    /**
     * Set one of current elements as new AJ object
     * @param {Integer} index  Negative integer also possible, -1 means last item
     * @return {AJ.fn.init} Instance of new selection
     */
    eq: function (index) {
        return this.chain(this.get(index));
    },

    /**
     * Set slice of current elements as new AJ object
     * @param {Integer} start Like the first param of the standard Array.slice() function
     * @param {Integer} end Like the second param of the standard Array.slice() function
     * @return {AJ.fn.init} Instance of new selection
     */
    slice: function (start, end) {
        var els = this.els.slice(start, end || this.els.length);
        return this.chain(els);
    },

    /**
     * Chain completely new AJ object
     * @param {String|DOMElement|DOMElement[]} selector When selector is not a string the context will be ignored
     * @param {String|DOMElement|DOMElement[]} [context]
     * @return {AJ.fn.init} Instance of new selection
     */
    chain: function (selector, context) {
        var $new = AJ(selector, context);
        $new.prevAJ = this;
        return $new;
    },

    /**
     * Set pointer to previous AJ object
     * @return {AJ.fn.init} Previous AJ object in the chain
     */
    end: function () {
        return this.prevAJ || AJ(null);
    }
};

$.fn.init.prototype = $.fn;

/**
 * For extending objects
 * @memberOf AJ
 * @memberOf AJ.fn
 * @return {Object|Array}
 */
AJ.extend = AJ.fn.extend = function () {
    // target is current object if only one argument
    var i = 0,
        target = this,
        deep = false,
        obj, empty, item, x;

    // check extending recursive (deep)
    if (typeof arguments[0] === 'boolean') {
        deep = true;
        i = 1;

        if (arguments.length > 2){
            i = 2;
            target = arguments[1];
        }
    } else if (arguments.length > 1){
        i = 1;
        target = arguments[0];
    }

    // loop through all source objects
    for (x = i; x < arguments.length; x++) {
        obj = arguments[x];

        // copy object items (properties and methods)
        for (item in obj){
            if (obj[item] === target)
                continue;

            if (deep && typeof obj[item] == 'object' && obj[item] !== null) {
                // item is also object, make copy
                empty = AJ.isArray(obj[item]) ? [] : {};
                target[item] = AJ.extend(deep, target[item] || empty, obj[item]);
            } else {
                // copy property or method
                target[item] = obj[item];
            }
        }
    }

    // return modified target
    return target;
};

AJ.extend(
    /**
     * @lends AJ
     */
    {
        /**
         * Selector method
         * @param {String} selector
         * @param {String|DOMElement|DOMElement[]} [context=document]
         * @return {DOMElement|DOMElement[]|Array}
         */
        selector: function (selector, context) {
            return $$(selector, context);
        },

        /**
         * Add callbacks for when DOM is ready
         * @param {Function} fn
         */
        ready: function (fn) {
            DOMReady.add(fn, [AJ]);
        },

        /**
         * Create DOM element
         * @param {String} html
         * @return {DOMElement|DOMElement[]}
         */
        create: function (html) {
            var ph = document.createElement('div'),
                els = [];

            ph.innerHTML = html;

            // get created elements
            els = ph.childNodes;

            // return element or array of elements
            return els.length == 1 ? els[0] : els;
        },

        /**
         * Each function for arrays and objects
         * @param {Object|Array} obj
         * @param {Function} fn
         */
        each: function (obj, fn) {
            var item, retVal;

            // call given function for each item
            for (item in obj) {
                retVal = fn.call(obj[item], item, obj[item]);

                // do not continue further when return value is false
                if (retVal === false)
                    break;
            }
        },

        /**
         * Trim spaces (also tabs and linefeeds)
         * @param {String} str
         * @return {String}
         */
        trim: function (str) {
            return str.replace(/^\s+/, '').replace(/\s+$/, '');
        },

        /**
         * Check if item exists in array
         * @param {Array} arr
         * @param {Mixed} item
         * @return {Boolean}
         */
        itemExists: function (arr, item) {
            for (var j = 0, max = arr.length; j < max; j++) {
                if (arr[j] === item)
                    return true;
            }

            return false;
        },

        /**
         * Return array without duplicate entries
         * @param {Array} arr
         * @return {Array}
         */
        clearAJplicates: function (arr) {
            var a = [];

            for (var i = 0, max = arr.length; i < max; i++) {
                if (!AJ.itemExists(a, arr[i]))
                    a.push(arr[i]);
            }

            return a;
        },

        /**
         * Check if argument is array
         * @param {Mixed} obj
         * @return {Boolean}
         */
        isArray: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },

        /**
         * Check if argument is function
         * @param {Mixed} obj
         * @return {Boolean}
         */
        isFunction: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Function]';
        }
    }
);

/**
 * External components
 */

/**
 * @namespace DOMReady
 */
AJ.DOMReady = window.DOMReady = (function () {

    // Private vars
    var fns = [],
        isReady = false,
        errorHandler = null,
        run = function (fn, args) {
            try {
                // call function
                fn.apply(this, args || []);
            } catch(err) {
                // error occured while executing function
                if (errorHandler)
                    errorHandler.call(this, err);
            }
        },
        ready = function () {
            isReady = true;

            // call all registered functions
            for (var x = 0; x < fns.length; x++)
                run(fns[x].fn, fns[x].args || []);

            // clear handlers
            fns = [];
        };

    /**
     * Set error handler
     * @static
     * @param {Function} fn
     * @return {DOMReady} For chaining
     */
    this.setOnError = function (fn) {
        errorHandler = fn;

        // return this for chaining
        return this;
    };

    /**
     * Add code or function to execute when the DOM is ready
     * @static
     * @param {Function} fn
     * @param {Array} args Arguments will be passed on when calling function
     * @return {DOMReady} For chaining
     */
    this.add = function (fn, args) {
        // call imediately when DOM is already ready
        if (isReady) {
            run(fn, args);
        } else {
            // add to the list
            fns[fns.length] = {
                fn: fn,
                args: args
            };
        }

        // return this for chaining
        return this;
    };

    // for all browsers except IE
    if (window.addEventListener) {
        window.document.addEventListener('DOMContentLoaded', function () { ready(); }, false);
    } else {
        // for IE
        (function(){
            // check IE's proprietary DOM members
            if (!window.document.uniqueID && window.document.expando)
                return;

            // you can create any tagName, even customTag like <document :ready />
            var tempNode = window.document.createElement('document:ready');

            try {
                // see if it throws errors until after ondocumentready
                tempNode.doScroll('left');

                // call ready
                ready();
            } catch (err) {
                setTimeout(arguments.callee, 0);
            }
        })();
    }

    return this;

})();

var SimpleSelector = window.SimpleSelector = {

    /**
     * Selector function
     * @param {String} selector
     * @param {String|DOMElement|DOMElement[]} [context=window.document]
     * @return {DOMElement[]}
     */
    select: function (selector, context) {
        var s = selector,
            c = context,
            els = [];

        // prepare selector
        s = s.split(',');

        // prepare context
        c = isObjType(c, 'String') ? $$(c) : c && c.length ? c : window.document;

        // make array
        if (!isObjType(c, 'Array'))
            c = [c];

        // loop through given contexts
        for (var i in c) {
            // loop through given selectors
            for ( var j in s) {
                var strim = s[j].replace(/\s+/g, ''),
                    sp = s[j].split(' '),
                    op = strim.substr(0, 1),
                    name = strim.substr(1),
                    tels = [],
                    nextContext;

                if (sp.length > 1) {
                // make recursive call to handle f.e. "body div p strong"
                    nextContext = $$(sp[0], c[i]);
                    tels = $$(sp.slice(1).join(' '), nextContext);
                    els = els.concat(tels);
                } else if (op == '#') {
                // by id
                    tels[0] = c[i].getElementById ? c[i].getElementById(name) : window.document.getElementById(name);

                    // check if founded array is part of context
                    if (tels[0] && SimpleSelector.isDescendant(tels[0], c[i]))
                        els.push(tels[0]);
                } else if (op == '.') {
                // by className
                    var expr = new RegExp('(^|\\s)'+ name +'(\\s|$)'),
                        all = c[i].getElementsByTagName('*');

                        // filter all elements that contain the given className
                        for (var v = 0, w = all.length; v < w; v++) {
                            if (expr.test(all[v].className))
                                els.push(all[v]);
                        }
                } else {
                // by tagName
                    tels = c[i].getElementsByTagName(strim);

                    // add all founded elements
                    for (var y = 0, z = tels.length; y < z; y++)
                        els.push(tels[y]);
                }
            }
        }

        // return array of elements
        return SimpleSelector.clearAJplicates(els);
    },

    /**
     * Check if node is part of root element
     * @param {DOMElement} descendant
     * @param {DOMElement} ancestor
     * @return {Boolean}
     */
    isDescendant: function (descendant, ancestor) {
        return descendant.parentNode == ancestor || descendant.tagName.toUpperCase() != 'HTML' && SimpleSelector.isDescendant(descendant.parentNode, ancestor);
    },

    /**
     * Check if item exists in array
     * @param {Array} arr
     * @param {Mixed} item
     * @return {Boolean}
     */
    itemExists: function (arr, item) {
        for (var j = 0, max = arr.length; j < max; j++) {
            if (arr[j] === item)
                return true;
        }

        return false;
    },

    /**
     * Clear duplicate items out of array
     * @param {Array} arr
     * @return {Array} Cleared array
     */
    clearAJplicates: function (arr) {
        var a = [];

        for (var i = 0, max = arr.length; i < max; i++) {
            if (!SimpleSelector.itemExists(a, arr[i]))
                a.push(arr[i]);
        }

        return a;
    }

};

/**
 * @private
 */
function isObjType (o, type) {
    return Object.prototype.toString.call(o) === '[object '+ type +']';
};

if (!window.$$) {
    /**
    * Add short name for SimpleSelector method
    * @function
    */
    window.$$ = SimpleSelector.select;
}

AJ.$$ = $$;


/**
 * AJ DOM
 */
AJ.fn.extend(
    /**
     * @lends AJ.fn
     */
    {
        /**
        * Get or set attribute value
        * @param {String} name
        * @param {Mixed} [value] Set new value
        * @return {This|Mixed}
        */
        attr: function (name, value) {
            // getter
            if (typeof value == 'undefined') {
                if (typeof name == 'string') {
                    // getter
                    return this.length ? this.get(0)[name] : null;
                } else {
                    // setter multiple attrs
                    for (var key in name) {
                        this.attr(key, name[key]);
                    }

                    return this;
                }
            }

            // setter
            return this.each(function () {
                if (typeof this[name] != 'undefined') {
                    if (value === null) {
                        this.removeAttribute(name);
                    } else {
                        this[name] = value;
                    }
                }
            });
        },

        /**
        * Remove given attribute
        * @param {String} name
        * @return {This}
        */
        removeAttr: function (name) {
            return this.attr(name, null);
        },

        /**
        * Get or set html of selected elements
        * @param {String} [html] Set new html
        * @return {This|String}
        */
        html: function (html) {
            // getter
            if (typeof html == 'undefined')
                return this.length ? this.get(0).innerHTML : null;

            // setter
            try {
                this.each(function () {
                    this.innerHTML = html;
                });
            } catch (e) {
                this.empty().append(html);
            }

            return this;
        },

        /**
        * Empty all content of selected elements
        * @return {This}
        */
        empty: function () {
            var el;

            for (var x = 0, l = this.size(); x < l; x++) {
                el = this[x];

                while (el.firstChild)
                    el.removeChild(el.firstChild);
            }

            return this;
        },

        /**
        * GEt or set text of selected elements
        * @param {String} [text] Set new text
        * @return {This|String}
        */
        text: function (text) {
            // getter
            if (typeof text == 'undefined')
                return this.length ? this.get(0).innerText : null;

            // setter, first empty element content and then add text
            return this.empty().each(function () {
                var textNode = document.createTextNode(text);
                AJ(this).append(textNode);
            });
        },

        /**
        * Remove selected elements
        * @return {This}
        */
        remove: function () {
            return this.each(function () {
                this.parentNode.removeChild(this);
            });
        },

        /**
        * Append content to selected elements
        * @param {String|DOMElement|DOMElement[]|AJ.fn.init} content
        * @return {This}
        */
        append: function (content) {
            var $content = AJ(content);

            return this.each(function (i) {
                var target = this;

                // clone content when more then one targets
                if (i > 0) $content = $content.clone();

                // add each content element as child of target
                $content.each(function (i) {
                    target.appendChild($content.get(i));
                })
            });
        },

        /**
        * Prepend content to selected elements
        * @param {String|DOMElement|DOMElement[]|AJ.fn.init} content
        * @return {This}
        */
        prepend: function (content) {
            var $content = AJ(content);

            return this.each(function (i) {
                // clone content when more then one targets
                if (i > 0) $content = $content.clone();

                if (this.childNodes.length > 0) {
                    $content.insertBefore(this.childNodes[0]);
                } else {
                    AJ(this).append($content);
                }
            });
        },

        /**
        * Append selected elements to given target
        * @param {String|DOMElement|DOMElement[]|AJ.fn.init} content
        * @return {This}
        */
        appendTo: function (target) {
            AJ(target).append(this);
            return this;
        },

        /**
        * Prepend selected elements to given target
        * @param {String|DOMElement|DOMElement[]|AJ.fn.init} target
        * @return {This}
        */
        prependTo: function (target) {
            AJ(target).prepend(this);
            return this;
        },

        /**
        * Insert selected elements after given target
        * @param {String|DOMElement|DOMElement[]|AJ.fn.init} target
        * @return {This}
        */
        insertAfter: function (target) {
            var $target = AJ(target),
                self = this;

            $target.each(function(i) {
                // clone self when more then one targets
                var $content = (i > 0) ? self.clone() : self,
                    target = this;

                // set other content element
                $content.each(function (i) {
                    if (i == 0) {
                        // set first element after target
                        target.parentNode.insertBefore(this, target.nextSibling);
                    } else {
                        // set other elements
                        var prev = $content.get(i - 1);
                        prev.parentNode.insertBefore(this, prev.nextSibling);
                    }
                });
            });

            return this;
        },

        /**
        * Insert selected elements before given target
        * @param {String|DOMElement|DOMElement[]|AJ.fn.init} target
        * @return {This}
        */
        insertBefore: function (target) {
            var $target = AJ(target),
                self = this;

            $target.each(function (i) {
                // clone self when more then one targets
                var $content = (i > 0) ? self.clone() : self;

                // set first element before target
                this.parentNode.insertBefore($content.get(0), this);

                // insert other elements after the first
                $content.slice(1).insertAfter($content.get(0));
            });

            return this;
        },

        /**
        * Insert content after selected elements
        * @param {String|DOMElement|DOMElement[]|AJ.fn.init} content
        * @return {This}
        */
        after: function (content) {
            AJ(content).insertAfter(this);
            return this;
        },

        /**
        * Insert content before selected elements
        * @param {String|DOMElement|DOMElement[]|AJ.fn.init} content
        * @return {This}
        */
        before: function (content) {
            AJ(content).insertBefore(this);
            return this;
        },

        /**
        * Replace selected elements with the given content
        * @param {String|DOMElement|DOMElement[]|AJ.fn.init} content
        * @return {This}
        */
        replaceWith: function (content) {
            var $content = AJ(content);

            return this.each(function (i) {
                // clone content when more then one targets
                $content = (i > 0) ? $content.clone() : $content;

                // replace with first element
                this.parentNode.replaceChild($content.get(0), this);

                // insert other elements after the first
                $content.slice(1).insertAfter($content.get(0));
            });
        },

        /**
        * Clone selected elements
        * @return {AJ.fn.init} Instance of the clone
        */
        clone: function () {
            var els = [];

            this.each(function () {
                var clone;

                if (typeof this.cloneNode != 'undefined') {
                    // clone DOM node
                    clone = this.cloneNode(true);
                } else if (typeof this == 'object') {
                    // clone object or array
                    clone = AJ.extend({}, this);
                } else {
                    clone = this;
                }

                els.push(clone);
            });

            return this.chain(els);
        }
    }
);

/**
 * AJ CSS
 *
 */
AJ.fn.extend(
    /**
     * @lends AJ.fn
     */
    {
        /**
        * Add class to selected elements
        * @param {String} value
        * @return {This}
        */
        addClass: function (value) {
            return this.each(function () {
                if (!AJ( this ).hasClass(value))
                    this.className += ' '+ value;
            });
        },

        /**
        * Remove class from selected elements
        * @param {String} value
        * @return {This}
        */
        removeClass: function (value) {
            return this.each(function () {
                this.className = this.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '');
            });
        },

        /**
        * Check if first element has given class
        * @param {String} value
        * @return {Boolean}
        */
        hasClass: function (value) {
            return (this.length && this.get(0).className.match(new RegExp( '(\\s|^)' + value + '(\\s|$)')));
        },

        /**
        * Set style(s) of the style attribute
        * @param {String|Object} style
        * @param {Mixed} [value] Set new value
        * @return {This|String}
        */
        style: function (style, value) {
            var key;

            // getter
            if (typeof value == 'undefined') {
                if (typeof style == 'string') {
                    // getter
                    key = AJ.toCamelCase(style);
                    return this.length ? this.get(0).style[key] : null;
                } else {
                    // setter multiple styles
                    for (key in style)
                        this.style(key, style[key]);

                    return this;
                }
            }

            // setter
            key = AJ.toCamelCase(style);

            return this.each(function () {
                if (typeof this.style[key] != 'undefined')
                    this.style[key] = value;
            });
        }
    }
);

AJ.extend(
    /**
     * @lends AJ
     */
    {
        toCamelCase: function(str) {
            return str.replace(/(\-[a-z])/g, function($1) {
                return $1.toUpperCase().replace('-', '');
            });
        }
    }
);


/**
 * AJ Event
 */
(function ($) {

/**
 * Prepare event object for cross-browser compatibility
 * @private
 * @param {EventObject} evt
 * @return {EventObject} Made cross-browser compatible
 */
function getEvent(evt) {
    if (!evt)
        evt = window.event || {};

    // Copy event object
    var e = $.extend({}, evt);

    // Reference to original event object
    e.originalEvent = evt;

    // The source element
    e.target = evt.target || evt.srcElement;

    // keyCode, charCode, which
    if (evt.charCode) {
        e.keyCode = evt.charCode;
        e.which = evt.charCode;
    } else if (evt.keyCode) {
        e.charCode = evt.keyCode;
        e.which = evt.keyCode;
    } else if (evt.which) {
        e.keyCode = evt.which;
        e.charCode = evt.which;
    }

    // Prevent triggering the default action of the event
    e.preventDefault = function () {
        // IE
        evt.returnValue = false;

        // Standard
        if (evt.preventDefault)
            evt.preventDefault();

        e.isDefaultPrevented = true;
    };
    e.isDefaultPrevented = false;

    // Prevent event bubbling
    e.stopPropagation = function () {
        // IE
        evt.cancelBubble = true;

        // Standard
        if ( evt.stopPropagation )
            evt.stopPropagation();

        e.isPropagationStopped = true;
    };
    e.isPropagationStopped = false;

    return e;
};

/**
 * Get or set event handlers
 * @private
 * @param {DOMElement} target
 * @param {String} eventName
 * @param {Function} [fn] Set function as event handler
 * @param {Number} [insertIndex] Insert function at given index
 */
function eventHandlers(target, eventName, fn, insertIndex) {
    var name = $.trim((eventName || '').replace(':', '.')),
        eName = name.substr(0, name.indexOf('.') > -1 ? name.indexOf('.') : name.length),
        nameSpace = name.substr(eName.length + 1) || '__default',
        handlers = target.__AJEventHandlers || {},
        wrapFunc = function (event) {
            if ($.isFunction(curFunc))
                curFunc.call(target);

            triggerEvent(target, eName, [getEvent(event)]);
        },
        curFunc;

    // getter
    if (!fn) {
        // check eventHandlers property
        if (!handlers || !handlers[eName])
            return null;

        return $.trim(eventName) == eName || nameSpace == '__default' ? handlers[eName] : handlers[eName][nameSpace];
    }

    // init handlers prop not exists
    if (!handlers)
        handlers = {};

    // set wrapper function on first use of target
    if (!handlers[eName]) {
        curFunc = target['on'+ eName];
        target['on'+ eName] = wrapFunc;
    }

    // init event when not exists
    if (!handlers[eName])
        handlers[eName] = {};

    // init namespace when not exists
    if (!handlers[eName][nameSpace])
        handlers[eName][nameSpace] = [];

    // add handler function
    if (typeof insertIndex == 'undefined') {
        handlers[eName][nameSpace].push(fn);
    } else {
        handlers[eName][nameSpace].splice(insertIndex, 0, fn);
    }

    // set prop
    target.__AJEventHandlers = handlers;
}

/**
 * Trigger event function
 * @private
 * @param {DOMElement} target
 * @param {String} eventName
 * @param {Array} args
 */
function triggerEvent(target, eventName, args) {
    var handlers = eventHandlers(target, eventName),
        fns;

    // loop through handlers
    for(var k in handlers) {
        fns = handlers[k];

        if ($.isArray(fns)) {
            for(var i in fns) {
                fns[i].apply(target, args);
            }
        } else {
            fns.apply(target, args);
        }
    }
};

$.fn.extend(
    /**
     * @lends AJ.fn
     */
    {
        /**
        * Add function to event
        * @param {String} eventName Event name
        * @param {Function} fn Function to add to event
        * @param {Number} [insertIndex] Insert function at given index
        * @return {This}
        */
        bind: function (eventName, fn, insertIndex) {
            var events = eventName.split(' ');

            return this.each(function () {
                // set handlers
                for (var key in events)
                    eventHandlers(this, events[key], fn, insertIndex);
            });
        },

        /**
        * Remove function from event
        * @param {String} eventName Event name
        * @param {Function} [fn] Function to remove from event listener
        * @return {This}
        */
        unbind: function (eventName, fn) {
            var events = eventName.split(' ');

            return this.each(function () {
                for (var name in events) {
                    var handlers = eventHandlers(this, events[name]) || [], // reference
                        fns, x, k;

                    // remove given function form event
                    if ($.isArray(handlers)) {
                        for (x = 0; x < handlers.length; x++) {
                            if (handlers[x] === fn || !fn)
                                handlers.splice(x--, 1); // decline index (x--) when removing array item
                        }
                    } else {
                        for (k in handlers) {
                            fns = handlers[k];

                            for (x = 0; x < fns.length; x++) {
                                if (fns[x] === fn || !fn)
                                    fns.splice(x--, 1); // decline index (x--) when removing array item
                            }
                        }
                    }
                }
            });
        },

        /**
        * Trigger event
        * @param {Sstring} eventName Event name
        * @return {This}
        */
        trigger: function (eventName) {
            var events = eventName.split(' ');

            return this.each(function () {
                for (var key in events) {
                    if ($.isFunction(this['on'+ events[key]])) {
                        this['on'+ events[key]].call(this);
                    } else {
                        triggerEvent(this, events[key], [getEvent()]);
                    }
                }
            });
        },

        /**
        * Delegate event handlers to a parent element
        * @param {String} selector
        * @param {String} eventName Event name
        * @param {Function} fn Function to add to event
        * @return {This}
        */
        delegate: function (selector, eventName, fn) {
            return this.bind(eventName, function (e) {
                AJ(this).find(selector).each(function () {
                    if (this === e.target) {
                        if ($.isFunction(fn))
                            fn.call(e.target, e);
                    }
                });
            });
        }
    }
);

$.each(['load', 'unload', 'scroll', 'resize', 'error', 'blur', 'change', 'focus', 'select', 'submit', 'keydown', 'keypress', 'keyup',
            'click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup'], function (i, eventName) {
    /**
    * Create core functions of the default events
    *
    * @name AJ.fn[eventName]
    * @function
    * @param {Function} fn
    * @param {Number} [insertIndex] Insert function at given index
    * @return {This}
    *
    * @exports $.fn[eventName] as AJ.fn.load
    * @exports $.fn[eventName] as AJ.fn.unload
    * @exports $.fn[eventName] as AJ.fn.scroll
    * @exports $.fn[eventName] as AJ.fn.resize
    * @exports $.fn[eventName] as AJ.fn.error
    * @exports $.fn[eventName] as AJ.fn.blur
    * @exports $.fn[eventName] as AJ.fn.change
    * @exports $.fn[eventName] as AJ.fn.focus
    * @exports $.fn[eventName] as AJ.fn.select
    * @exports $.fn[eventName] as AJ.fn.submit
    * @exports $.fn[eventName] as AJ.fn.keydown
    * @exports $.fn[eventName] as AJ.fn.keypress
    * @exports $.fn[eventName] as AJ.fn.keyup
    * @exports $.fn[eventName] as AJ.fn.click
    * @exports $.fn[eventName] as AJ.fn.dblclick
    * @exports $.fn[eventName] as AJ.fn.mousedown
    * @exports $.fn[eventName] as AJ.fn.mousemove
    * @exports $.fn[eventName] as AJ.fn.mouseout
    * @exports $.fn[eventName] as AJ.fn.mouseover
    * @exports $.fn[eventName] as AJ.fn.mouseup
    */
    $.fn[eventName] = function (fn, insertIndex) {
        return fn ? this.bind(eventName, fn, insertIndex): this.trigger(eventName);
    };
});

})(AJ);



/**
 * AJ Ajax
 *
 */
AJ.fn.extend(
    /**
     * @lends AJ.fn
     */
    {
        /**
        * Set content loaded by an ajax call
        * @param {String} url The url of the ajax call (include GET vars in querystring)
        * @param {String} [data] The POST data, when set method will be set to POST
        * @param {Function} [complete] Callback when loading is completed
        * @return {This}
        */
        load: function (url, data, complete) {
            var self = this;

            AJ.ajax({
                url: url,
                type: data ? 'POST' : 'GET',
                data: data || null,
                complete: complete || null,
                success: function (html) {
                    self.html(html);
                }
            });

            return this;
        }
    }
);

AJ.extend(
    /**
     * @lends AJ
     */
    {
        /**
        * Make querystring outof object or array of values
        * @param {Object|Array} obj Keys/values
        * @return {String} The querystring
        */
        param: function (obj) {
            var s = [];

            AJ.each( obj, function (k, v) {
                s.push(encodeURIComponent(k) +'='+ encodeURIComponent(v));
            });

            return s.join('&');
        },

        /**
        * Default ajax settings
        * @property {Object} ajaxSettings
        */
        ajaxSettings: {
            url: '',
            type: 'GET',
            async: true,
            cache: true,
            data: null,
            contentType: 'application/x-www-form-urlencoded',
            success: null,
            error: null,
            complete: null
        },

        /**
        * Change the default ajax settings
        * @param {Object} settings Overwrite the default settings, see ajaxSettings
        */
        ajaxSetup: function (settings) {
            AJ.extend(AJ.ajaxSettings, settings);
        },

        /**
        * Ajax call
        * @param {Object} [options] Overwrite the default settings for this call, see ajaxSettings
        * @return {XMLHttpRequest|ActiveXObject}
        */
        ajax: function (options) {
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
                opts = AJ.extend({}, AJ.ajaxSettings, options),
                ready = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            if (AJ.isFunction(opts.success))
                                opts.success.call(opts, xhr.responseText, xhr.status, xhr);
                        } else {
                            if (AJ.isFunction(opts.error))
                                opts.error.call(opts, xhr, xhr.status);
                        }

                        if (AJ.isFunction(opts.complete))
                            opts.complete.call(opts, xhr, xhr.status);
                    }
                };

            if (!opts.cache)
                opts.url += ((opts.url.indexOf('?') > -1) ? '&' : '?') + '_nocache='+ (new Date()).getTime();

            if ( opts.data ) {
                if (opts.type == 'GET') {
                    opts.url += ((opts.url.indexOf('?') > -1) ? '&' : '?') + AJ.param(opts.data);
                    opts.data = null;
                } else {
                    opts.data = AJ.param(opts.data);
                }
            }

            // set request
            xhr.open(opts.type, opts.url, opts.async);
            xhr.setRequestHeader('Content-type', opts.contentType);

            if (opts.async) {
                xhr.onreadystatechange = ready;
                xhr.send(opts.data);
            } else {
                xhr.send(opts.data);
                ready();
            }

            return xhr;
        },

        /**
        * Ajax GET request
        * @param {String} url
        * @param {String|Object} [data] Containing GET values
        * @param {Function} [success] Callback when request was succesfull
        * @return {XMLHttpRequest|ActiveXObject}
        */
        get: function (url, data, success) {
            if (AJ.isFunction(data)) {
                success = data;
                data = null;
            }

            return AJ.ajax({
                url: url,
                type: 'GET',
                data: data,
                success: success
            });
        },

        /**
        * Ajax POST request
        * @param {String} url
        * @param {String|Object} [data] Containing post values
        * @param {Function} [success] Callback when request was succesfull
        * @return {XMLHttpRequest|ActiveXObject}
        */
        post: function (url, data, success) {
            if (AJ.isFunction(data)) {
                success = data;
                data = null;
            }

            return AJ.ajax({
                url: url,
                type: 'POST',
                data: data,
                success: success
            });
        }
    }
);




})(window);
