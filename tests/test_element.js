Tea.require( '../src/element.js' )

Tea.Testing.Suite({
    name: 'Tea.Element',

    test_element_basics : function()
    {
        var e = Tea.Element({});
        assertEqual(e.source[0].tagName, 'DIV');
        
        var e = Tea.Element({source: '<p>'});
        assertEqual(e.source[0].tagName, 'P');
        
        var e = Tea.Element({source: '<p>', cls: 'a', attr: {id: 'b'}, value: "<br/>"});
        assertEqual(e.source[0].tagName, 'P');
        assertEqual(e.source[0].className, 'a');
        assertEqual(e.source[0].id, 'b');
        assertEqual(e.source[0].childNodes[0].tagName, 'BR');
    },

    test_element_data : function() {
        var a = Tea.Element({});
        var b = Tea.Element({});

        assertEqual(a.source.data('tea'), a);
        assertEqual(a.source.tea(), a);
    }
});