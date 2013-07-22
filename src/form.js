Tea.Field = Tea.Container.extend({
    type: 't-field',
    cls: 't-field',
    errors: null,
    hint: null,
    label: null,
    id: null,
    name: null,
    input: 't-text',
    validators: [],
    render : function() {
        var source = this.__super__();
        this.id = this.id || Tea.generateUniqueID('t-field');
        
        this._prompt = $('<label class="t-prompt"/>').appendTo(source);
        this._entry = $('<div class="t-entry"/>').appendTo(source);
        this._label = $('<div class="t-label"/>').appendTo(this._prompt);
        this._hint = $('<div class="t-hint"/>').appendTo(this._prompt);

        this.input = Tea.create(this.input);
        this.input.source.appendTo(this._entry);

        this._errors = $('<div class="t-errors"/>').appendTo(this._entry);

        this.setValue(this.value);
        this.setLabel(this.label);
        this.setHint(this.hint);
        this.setErrors(this.errors);
        return source;
    },
    destroy : function() {
        this.__super__();
        this.input.destroy();
    },
    setValue : function(v) {
        return this.input.setValue(v);
    },
    getValue : function() {
        return this.input.getValue();
    },
    setErrors : function(errors) {
        this.errors = errors;
        if (errors && errors.length) {
            this.source.addClass('t-has-errors');
            this._errors.empty().append(errors.join(" &middot; ")).show();
        } else {
            this.source.removeClass('t-has-errors');
            this._errors.empty().hide();
        }
    },
    getErrors : function() {
        return this.errors;
    },
    setLabel : function(html) {
        this.label = html;
        if (html == null) {
            this.source.addClass('t-no-label');
            this._label.empty().hide();
        } else {
            this.source.removeClass('t-no-label');
            this._label.empty().append(html).show();
        }
    },
    getLabel : function() {
        return this.label;
    },
    setHint : function(html) {
        this.hint = html;
        if (html) {
            this._hint.empty().append(html).show();
        } else {
            this._hint.empty().hide();
        }
    },
    validate : function() {
        var value = this.getValue();
        var errors = [];
        var self = this;
        jQuery.each(this.validators, function(i, validator) {
            var error = validator(value, self);
            if (error)
                errors.push(error);
        });
    }
})

Tea.Fieldset = Tea.Container.extend({
    type: 't-fieldset',
    cls: 't-fieldset',
    field: 't-field',
    source: '<fieldset/>',
    own : function(item) {
        var item = Tea.create(item);
        if (item instanceof Tea.Input) {
            return this.__super__({
                type: this.field,
                input: item,
                label: item.label || null,
                errors: item.errors || null,
                hint: item.hint || null,
                value: item.value || null,
                name: item.name || null
            })
        } else {
            var item = this.__super__(item);
            return item;
        }
    },
    validate : function() {
        
    },
    setErrors : function(errorMap) {
        this.each(function(i, item) {
            if (jQuery.isFunction(item.setErrors)) {
                item.setErrors(errorMap[item.name]);
            }
        });
    },
    getErrors : function() {
        var errorMap = {};
        this.each(function(i, item) {
            if (jQuery.isFunction(item.getErrors)) {
                errorMap[item.name] = item.getErrors();
            }
        });
        return errorMap;
    }
});

Tea.Form = Tea.Fieldset.extend({
    type: 't-form',
    cls: 't-form t-fieldset',
    action: ".",
    method: "post",
    source: '<form/>',
    submit: jQuery.noop,
    context: null,
    render : function() {
        var source = this.__super__();

        source.attr({
            action: this.action,
            method: this.method
        });

        this._submit = $('<input type="submit" class="t-submit t-hide"/>').appendTo(source);

        this.hook(source, 'submit', this.triggerSubmit);

        return source;
    },
    triggerSubmit : function(e) {
        return false;
        if (this.submit)
            return this.submit.call(this || this.context, e);
        else
            return true;
    }
});
