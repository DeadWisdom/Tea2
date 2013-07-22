Tea.require( '../src/input.js' );

Tea.Testing.Suite({
    name: 'Tea.Input',
    
    test_text : function()
    {
        var a = Tea.Input({value: 'foo'});
        var b = Tea.Input();

        assertEqual(a.getValue(), 'foo');
        assertEqual(b.getValue(), '');

        b.setValue('bar');
        assertEqual(b.getValue(), 'bar');

        var c = Tea.create({type: 't-input',
                        placeholder: 'empty',
                        name: 'bob'});

        assertEqual(c.source.attr('placeholder'), 'empty');
        assertEqual(c.source.attr('name'), 'bob');

        c.source.appendTo($('#content'));
        c.focus();

        a.destroy();
        b.destroy();
    },
    test_password : function() {
        var a = Tea.create({type: 't-password',
                        placeholder: 'empty',
                        name: 'bob'});

        assertEqual(a.source.attr('type'), 'password');

        a.setValue('bar');
        assertEqual(a.getValue(), 'bar');
    },
    test_submit : function() {
        var a = Tea.create('t-submit');

        a.setValue('bar');
        assertEqual(a.getValue(), 'bar');
    },
    test_button : function() {
        var a = Tea.create('t-button');
        
        a.setValue('bar');
        assertEqual(a.getValue(), 'bar');
    },
    test_checkbox : function() {
        var a = Tea.create('t-checkbox');
        
        a.setValue(true);
        assertEqual(a.getValue(), true);
        a.setValue(false);
        assertEqual(a.getValue(), false);
    },
    test_textarea : function() {
        var a = Tea.create('t-inputarea');
        
        assertEqual(a.getValue(), "");
        a.setValue("Hello");
        assertEqual(a.getValue(), "Hello");
        a.setValue("Howdy");
        assertEqual(a.getValue(), "Howdy");
    },
    test_select : function() {
        var a = Tea.create({type: 't-select', options: ['a', 'b', 'c']});

        assertEqual(a.source[0].childNodes[0].tagName, "OPTION");
        assertEqual(a.source[0].childNodes[1].tagName, "OPTION");
        assertEqual(a.source[0].childNodes[2].tagName, "OPTION");
        assertEqual(a.source[0].childNodes[3], undefined);

        assertEqual(a.source[0].childNodes[0].innerHTML, "a");
        assertEqual($(a.source[0].childNodes[0]).attr('value'), "a");

        a.setValue('a');
        assertEqual(a.getValue(), 'a');
        assertEqual(a.source[0].selectedIndex, 0);

        a.setValue('b');
        assertEqual(a.getValue(), 'b');
        assertEqual(a.source[0].selectedIndex, 1);

        a.setValue('c');
        assertEqual(a.getValue(), 'c');
        assertEqual(a.source[0].selectedIndex, 2);

        var b = Tea.create({type: 't-select', options: [['a', 'First'], ['b', 'Second']]});

        b.setValue('b');
        assertEqual(b.getValue(), 'b');
        assertEqual(b.source[0].selectedIndex, 1);
        assertEqual(b.getLabel(), 'Second');

        assertEqual(b.getLabel('a'), 'First');
    }
});