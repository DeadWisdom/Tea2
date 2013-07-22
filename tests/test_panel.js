Tea.require( 
    '../src/controls.js',
    '../src/panel.js' );

Tea.Testing.Suite({
    name: 'Tea.Panel',
    
    test_basic : function()
    {
        var panel = Tea.Panel({
            title: 'Panel 1',
            content: [{type: 't-element', value: '1'}]
        });
        
        var source = panel.source;

        assertEqual(source[0].childNodes[0].innerHTML, 'Panel 1');
        assertEqual(source[0].childNodes[3].innerHTML, '<div>1</div>');
    }
});