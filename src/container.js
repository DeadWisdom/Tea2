/** Tea.Container
    
    An element that contains other elements.
    
    @requires Tea.Element

 **/

Tea.Container = Tea.Element.extend({
    type: 't-container',

    // Public
    items: null,        // Items within this container
    concrete: false,    // Elements added to a concrete container are automatically made concrete as well.

    // Private
    insertAfter: null,  // Item sources will be inserted after this for pos = 0,
    insertBefore: null, // otherwise it will be inserted before this for pos = 0,
    insertInto: null,   // otherwise, it will be inserted *into* this for pos = 0,

    init : function() {
        this.__super__();
        
        if (this.items) {
            var items = this.items;
            this.items = [];
            this.items = this.insertMany(0, items);
        } else {
            this.items = [];
        }

        if (this.value)
            this.setValue(this.value);
    },
    ready : function() {
        this.__super__();
        this.each(function(i, item) {
            item.ready();
        });
        this.refresh();
    },
    insertMany : function(pos, items) {
        var self = this;
        return jQuery.map(items, function(item, i) {
            return self.insert(pos + i, item);
        });
    },
    append : function(item)
    {
        return this.insert(this.items.length, item);
    },
    insert : function(pos, item)
    {
        if (typeof pos != 'number') throw new Error("First argument of insert(pos, item) must be an integer.");

        item = Tea.create(item);
        this.own(item);

        if (!this.items)
            this.items = [];

        if (pos < 0)
            pos = this.items.length + pos;
        if (pos < 0)
            pos = 0;

        if (pos >= this.items.length) {
            pos = this.items.length;
            if (this.items.length > 0)
                this.items[this.items.length-1].source.after(item.source);
            else if (this.insertAfter)
                this.insertAfter.after(item.source);
            else if (this.insertBefore)
                this.insertBefore.before(item.source);
            else if (this.insertInto)
                this.insertInto.append(item.source);
            else
                this.source.append(item.source);
            this.items.push(item);
            item._index = this.items.length-1;
        } else if (pos == 0) {
            // Note: there is deffinitely at least one element in this.items.
            this.items[0].source.before(item.source);
            this.items.unshift(item); 
            this.each(function(i, obj) {
                obj._index = i;
            });
        } else {
            this.items[pos-1].source.after(item.source);
            this.items.splice(pos, 0, item);
            this.each(function(i, obj) {
                obj._index = i;
            });
        }

        if (this.concrete)
            item.ready();

        this.refresh(item);

        return item;
    },
    prepend : function(item)
    {
        return this.insert(0, item);
    },
    remove : function(item)
    {
        if (item._parent !== this) return;
        this.items.splice(item._index, 1);
        this.disown(item);
        item.destroy();
        this.refresh();
    },
    disown : function(item) {
        if (item._parent !== this) return;
        this.items.splice(item._index, 1);
        this.__super__(item);
        this.refresh();
    },
    empty : function()
    {
        this.each(function(index, item) {
            item.destroy();
        });
        this.items = [];
        this.refresh();
    },
    each : function(func, context)
    {
        context = context || this;
        jQuery.each(jQuery.makeArray(this.items), function(i, item) {
            func.apply(context, arguments);
        });
    },
    setValue : function(value)
    {
        if (value == null || value == undefined) return;
        
        var fields = {};
        this.each(function(i, item) {
            if (item.name == '*')
                item.setValue(value);
            else if (item.name != undefined)
                fields[item.name] = item;
        });

        jQuery.each(value, function(k, v) {
            var item = fields[k];
            if (item) item.setValue(v);
        });
    },
    getValue : function()
    {   
        var gather = {};
        this.each(function(i, item) {
            if (item.name == '*')
                $.extend(gather, item.getValue());
            else if (item.name != undefined)
                gather[item.name] = item.getValue();
        });
        return gather;
    },
    refresh : function(new_item) {
        // Do layout, or whatever you want.  Is triggered after an item is removed / added and after ready();
        this.trigger('refresh', [new_item]);
    }
});