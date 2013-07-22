Tea.Input = Tea.Element.extend({
    type: 't-input',
    source: '<input type="text"/>',
    cls: 't-input',
    value: "",
    placeholder: null,
    name: null,
    render : function() {
        var source = this.__super__();

        if (this.name)
            this.source.attr('name', this.name);
        if (this.placeholder)
            this.source.attr('placeholder', this.placeholder);

        return source;
    },
    getValue : function() {
        return this.source.val();
    },
    setValue : function(v) {
        this.source.val(v);
    },
    focus : function() {
        return this.source.focus();
    },
    blur : function() {
        return this.source.blur();
    }
});

Tea.PasswordInput = Tea.Input.extend({
    type: 't-password',
    cls: 't-password',
    source: '<input type="password"/>'
});

Tea.SubmitInput = Tea.Input.extend({
    type: 't-submit',
    cls: 't-submit',
    source: '<input type="submit"/>'
});

Tea.ButtonInput = Tea.Input.extend({
    type: 't-button-input',
    cls: 't-button-input',
    source: '<input type="button"/>'
});

Tea.TextArea = Tea.Input.extend({
    type: 't-textarea',
    cls: 't-textarea',
    source: '<textarea/>',
    getValue : function() {
        return this.source.html();
    },
    setValue : function(v) {
        this.source.empty().append(v);
    }
});

Tea.Checkbox = Tea.Input.extend({
    type: 't-checkbox',
    cls: 't-checkbox',
    source: '<input type="checkbox">',
    getValue : function() {
        return this.source.prop('checked');
    },
    setValue : function(v) {
        return this.source.prop('checked', v ? true : false);
    }
});

Tea.Select = Tea.Input.extend({
    type: 't-select',
    cls: 't-select',
    source: '<select>',
    options: null,
    render : function() {
        var source = this.__super__();

        this.setOptions(this.options);

        return source;
    },
    setOptions : function(options) {
        this.source.empty();
        if (!options) return;
        options = $.makeArray(options);

        var self = this;
        jQuery.each(this.options, function(i, item) {
            self.addOption(item);
        });
    },
    addOption : function(option) {
        var value = null;
        var label = null;
        if (option instanceof Array) {
            if (option.length == 1) {
                value = label = option[0];
            } else {
                value = option[0];
                label = option[1];
            }
        } else if (typeof(option) == 'string') {
            value = label = option;
        } else {
            value = option.value;
            label = option.label;
        }

        var option = this.createOption(value, label);
        this.source.append( option );
    },
    createOption : function(value, label) {
        var option = $('<option/>');
        option.append(label)
        option.attr('value', value);
        return option;
    },
    getValue : function() {
        return this.source.find('option').eq(this.source.prop('selectedIndex')).prop('value');
    },
    getLabel : function(value) {
        // Returns the label for the value, or if value is not specified returns the label of the current value.
        var result = null;
        if (value == null)
            value = this.getValue();
        this.source.find('option').each(function(i, item) {
            if (item.value == value) {
                result = $(item).html();
                return false;
            }
        });
        return result;
    },
    setValue : function(v) {
        v = v.toString();
        var source = this.source;
        source.find('option').each(function(i, item) {
            if (item.value == v) {
                source[0].selectedIndex = i;
                return false;  // Stops the each() loop
            }
        });
    }
});

