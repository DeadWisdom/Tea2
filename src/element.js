/** Tea.Element
    
    Copyright (c) 2012 Brantley Harris. All rights reserved.
 **/

Tea.Element = Tea.Class({
    type: 't-element',

    // Public
    source: '<div>',        // The source for this element, will be filtered through jQuery() when rendered, but can
                            // also be a function that returns a jQuery() object and takes the element as its argument.
    appendTo: null,         // After being rendered, append the element's source to this.  If 'body', will append to document.body
    value: null,            // This gets appended to the source when rendered.
    cls: null,              // Class to add to the source when rendered.
    hidden: false,          // Whether or not it is hidden.
    attr: null,             // Extra attributes to add when rendered.
    css: null,              // Extra css/style attributes to add when rendered.
    concrete: false,        // Whether or not the element has actually been added to the document dom. Until then
                            // one cannot expect it to have a proper width or height or other properties.

    // Private
    _parent: null,          // The parent element that "owns" this, when the parent gets destroyed, so does this.
    _children: null,        // Children elements, when this gets destroyed, so do the children.
    _orig_source: null,     // Set to the original source when rendered.

    // Methods
    init : function() {
        this.render();
        this.setup();
        if (this.value)
            this.setValue(this.value);
    },
    setup : function() {},
    render : function() {
        this._orig_source = this.source;

        if (jQuery.isFunction(this.source))
            this.source = this.source(this);
        
        var source = this.source = $(this.source);
        source.data("tea", this);

        if (this.cls)               source.addClass(this.cls);
        if (this.id)                source.attr('id', this.id);
        if (this.css)               source.css(this.css);
        if (this.attr)              source.attr(this.attr);
        if (this.hidden)            source.hide();

        if (this.appendTo == 'body') 
            source.appendTo(document.body);
        else if (this.appendTo)
            source.appendTo($(this.appendTo));

        return source;
    },
    ready : function() {
        this.trigger('ready');
        this.concrete = true;
    },
    destroy : function() {
        this.source.remove();
        this.source = this._orig_source;
        this.concrete = false;
        if (this._parent)
            this._parent.disown(this);
        if (this._children) {
            for( var i = 0; i < this._children.length; i++) {
                this._children[i].destroy();
            }
        }
        this.__super__();
    },
    detach : function() { 
        this.source.detach();
    },
    hide : function()
    {
        this.setHidden(true);
    },
    show : function()
    {
        this.setHidden(false);
    },
    setHidden : function(flag)
    {
        if (flag)
            this.source.hide();
        else
            this.source.show();
    },
    findParent : function(type) {
        var now = this._parent;
        while(now) {
            if (now instanceof type) {
                return now;
            }
            now = now._parent;
        }
        throw new Error("Cannot find owner of the requested type");
    },
    findHandler : function(name) {
        var now = this._parent;
        while(now) {
            if (jQuery.isFunction(now[name]))
                return jQuery.proxy(now[name], now);
            now = now._parent;
        }
        return jQuery.noop;
    },
    setValue : function(v) {
        this.value = v;
        this.source.empty().append(v);
        return v;
    },
    getValue : function() {
        return this.value;
    },
    own : function(e)
    {
        if (e._parent === this)
            return e;

        e = Tea.create(e);

        if (e._parent)
            e._parent.disown(e);
        
        e._parent = this;

        if (!this._children)
            this._children = [];

        this._children.push(e);
        return e;
    },
    disown : function(e) {
        if (e._parent !== this) return;
        
        e._parent = null;
        this._children.splice(this._children.indexOf(e), 1);
        return e;
    },
    appendSourceTo : function(source) {
        return this.source.appendTo(source);
    }
});

jQuery.fn.tea = function() {
    return this.data('tea');
}