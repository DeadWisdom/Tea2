Tea.Panel = Tea.Container.extend({
    type: 't-panel',
    title: '',
    closable: false,
    fill: true,
    render : function() {
        source = this.__super__();

        this.top = this.own({type: 't-container', cls: 't-top-bar t-bar', items: this.top});
        this.bottom = this.own({type: 't-container', cls: 't-bottom-bar t-bar', items: this.bottom});

        this._title = $('<div class="t-title">').append(this.title).appendTo(source);
        this._closer = $('<a class="t-closer">').append('Close').appendTo(source);
        this.top.source.appendTo(source);
        this._content = $('<div class="t-content">').appendTo(source);
        this.bottom.source.appendTo(source);

        this.insertInto = this._content;

        return source;
    },
    setTitle : function(title)
    {
        this.title = title;
        this._title.empty().append(title);
    },
    getTitle : function()
    {
        return this.title;
    },
    close : function()
    {
        this.trigger('close');
    },
    onClose : function() {
        this.close();
    }
});

/*
Tea.Panel({
    items: [
        {type: 't-title', text: 'Hello'},
        {type: 't-closer', text: ''},
        {type: 't-menu-bar', items: ['save'], name: null},
        {type: 't-content', text: '', fill: 'vertical'},
        {type: 't-menu-bar', items: ['save'], name: null},
    ],
    onClose : function() {
        this.trigger('close');
    },
    onSave : function() {

    }
})*/