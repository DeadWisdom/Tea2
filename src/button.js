/** Tea.Button
    
    Click on me!
 **/

Tea.Button = Tea.Element.extend({
    type: 't-button',
    cls: 't-button',
    source: '<a>',
    text: '',
    icon: '',
    disabled: false,
    click: null,
    context: null,
    hasFocus: null,
    init : function()
    {
        this.__super__();
        
        this.setText(this.text);
        this.setIcon(this.icon);
        this.setDisabled(this.disabled);
    },
    render : function() {
        var source = this.__super__();

        this._icon = $('<div class="t-icon"/>').appendTo(source);
        this._text = $('<div class="t-text"/>').appendTo(source);

        source
            .bind('click', jQuery.proxy(this.handlePress, this))
            .bind('mousedown', jQuery.proxy(this.handleMouseDown, this))
            .bind('mouseup', jQuery.proxy(this.handleMouseUp, this))
            .bind('focus', jQuery.proxy(this.handleFocus, this))
            .bind('blur', jQuery.proxy(this.handleBlur, this))
            .hover(jQuery.proxy(this.handleHoverIn, this), jQuery.proxy(this.handleHoverOut, this));

        return source;
    },
    setText : function(txt) {
        this._text.empty().append(this.value = txt);
    },
    getText : function() {
        return this.value;
    },
    setValue : function(v) {
        this.setText(v);
    },
    setIcon : function(icon) {
        this.icon = icon;
        this._icon.attr('class', 't-icon ' + 'icon-' + icon);
    },
    getIcon : function() {
        return this.icon;
    },
    focus : function() {
        this.source.focus();
    },
    blur : function() {
        this.source.blur();
    },
    setFocus : function(flag) {
        if (flag)
            this.focus();
        else
            this.blur();
    },
    setDisabled : function(flag) {
        this.disabled = flag;

        if (flag) {
            this.source.addClass('disabled');
        } else {
            this.source.removeClass('disabled');
        }
    },
    disable : function() {
        this.setDisabled(true);
    },
    enable : function() {
        this.setDisabled(false);
    },
    handlePress : function() {
        if (this.disabled) return false;

        if (jQuery.isFunction(this.click))
            return this.click.call(this.context || this, this);

        if (typeof(this.click) == 'string')
            return this.findHandler(this.click).call(this.context || this, this);

        return true;
    },
    handleMouseDown : function() {
        if (!this.disabled)
            this.source.addClass('t-mouse-down');
    },
    handleMouseUp : function() {
        this.source.removeClass('t-mouse-down');
    },
    handleHoverIn : function() {
        if (!this.disabled)
            this.source.addClass('t-hover');
    },
    handleHoverOut : function() {
        this.source.removeClass('t-mouse-down');
        this.source.removeClass('t-hover');
    },
    handleFocus : function() {
        if (!this.disabled) {
            this.hasFocus = true;
            this.source.addClass('t-focus');
        }
    },
    handleBlur : function() {
        this.hasFocus = false;
        this.source.removeClass('t-focus');
    }
});
