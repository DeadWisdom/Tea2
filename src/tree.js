/** Tea.Tree

    A Tree item, buttons with containers on the back.
    
    @extends Tea.Button
 **/

Tea.Tree = Tea.Button.extend({
    type: 't-tree',
    cls: 't-tree t-button',
    items: null,
    expanded: false,
    render : function() {
        var source = this.__super__();
        this.tick = jQuery('<div class="t-tick"/>').prependTo(source);
        this.tick.bind('click', jQuery.proxy(this.handleTick, this));
        this.tail = Tea.create({type: 't-container', cls:'t-tail', items: this.items});
        this.tail.hook(this, 'remove', this.tail.remove);
        this.tail.render().appendTo(source);
        this.tail._parent = this;
        if (!this.expanded)
            this.collapse()
        else
            this.expand();
        return source;
    },
    expand : function() {
        this.expanded = true;
        this.source.addClass('t-expanded');
        this.source.removeClass('t-collapsed');
    },
    collapse : function() {
        this.expanded = false;
        this.source.removeClass('t-expanded');
        this.source.addClass('t-collapsed');
    },
    toggleExpanded : function() {
        if (this.expanded)
            this.collapse();
        else
            this.expand();
    },
    handleTick : function(e) {}
});
