Tea.require( '../src/controls.js' )

new Tea.Testing.Suite({
    name: 'Tea.Controls',
    
    test_button : function()
    {
        var button = Tea.Button({
            text: 'The Button!',
            icon: 'gear'
        });
        
        assertEqual(button.getText(), 'The Button!');
        assertEqual(button.getIcon(), 'gear');
        
        var source = button.source;
        
        assertEqual(source[0].childNodes[0].className, 't-icon icon-gear');
        assertEqual(source[0].childNodes[1].innerHTML, 'The Button!');
    },
    test_bubble_event : function() {
        var sentinel = 0;

        var button = Tea.Button({
            text: 'The Button!',
            icon: 'gear',
            click: 'onButton'
        });

        var container = Tea.Container({
            items: [button],
            onButton: function() {
                sentinel += 1;
                assertEqual(this.type, 't-container');
            }
        });

        button.handlePress();
        assertEqual(sentinel, 1);
    }
})