/** Tea.Stack

    A container that acts as a stack, you can push and pop onto it.
    
    The default skin pushes elements onto it from the right to the left, so
    that you only see the top few elements that can fit on the screen.
    
    @requires Tea.Container
    @extends Tea.Container
 **/

Tea.Stack = Tea.Container.extend({
    type: 't-stack',
    cls: 't-stack',

    // Public 
    margin: 6,

    // Private
    _paused: false,

    // Methods
    ready : function() {
        this.__super__();
        $(window).resize(jQuery.proxy(this.refresh, this));
    },
    own : function( item )
    {
        var item = this.__super__(item);
        this.hook(item, 'close', function() {
            this.pop(item);
        });
        return item;
    },
    /** Tea.Stack.push(item, [after])
        
        Pushes the *item* onto the stack.
        
        If *after* is specified, all items after it will be popped before
        pushing the *item*.
    **/
    push : function( item, after )
    {   
        if (after)
        {
            this.pause();
            this.popAfter(after);
            this.play();
        }

        return this.append(item);
    },
    /** Tea.Stack.pop( [item] )
        
        Pops the top item off the stack.
        
        If *item* is specified, it will pop that item and all after it.
    **/
    pop : function( item )
    {
        this.pause();
        
        if ( item )
            this.popAfter( item );
        else
            item = this.items[this.items.length-1];
        
        this.remove(item);
        this.play();
        return item;
    },
    popAfter : function( item )
    {
        if (item._parent !== this) return;
        
        this.pause();
        
        while(this.items.length > item._index + 1) {
            this.remove(this.items[item._index + 1]);
        }
        
        this.play();
    },
    pause : function()
    {
        this._paused += 1;
    },
    play : function()
    {
        this._paused -= 1;
        if (this.paused <= 0) {
            this.paused = 0;
            this.refresh();
        }
    },
    refresh : function(new_item) {
        this.__super__();

        if (!this.concrete) return;
        if (this._paused > 0) return;

        var max_width = this.source.width();
        var gutter = this.margin;
        var width = this.margin;
        
        var show = 0;
        
        for(var i = this.items.length-1; i >= 0; i--) {
            var item = this.items[i];
            var w = item.source.width() + gutter;
            if (width + w > max_width && show > 0)
                break;
            width += w;
            show += 1;
        }
        
        var start = this.items.length - show;
        var left = gutter;
        
        this.each(function(index, item) {
            if (index < start) {
                item.source.hide().css('left', 0 - item.source.width() - gutter);
                return;
            }
            
            if (item == new_item)
                item.source.css({
                  left: left,
                  opacity: 0,
                });

            item.source
                .stop(true, true)
                .show()
                .css('position', 'absolute')
                .animate({
                    left: left,
                    opacity: 1
                });
            
            left += (item.source.width() + gutter);
        });
    }
});
