Tea.require( '../src/stack.js' )

Tea.Testing.Suite({
    name: 'Tea.Stack',
    
    test_basic : function()
    {
        var panel1 = Tea.Panel({title: 'Panel 1'});
        var panel2 = Tea.Panel({title: 'Panel 2'});
        var panel3 = Tea.Panel({title: 'Panel 3'});
        var panel4 = Tea.Panel({title: 'Panel 4'});
        var panel5 = Tea.Panel({title: 'Panel 5'});
        
        var stack = new Tea.Stack({
            items: [
                panel1,
                panel2
            ],
            style: {
                width: 200,
                height: 40,
                margin: "10px 0px",
                border: "1px solid #AAA",
                position: "relative",
                overflow: "hidden"
            }
        });
        stack.source.appendTo('#content');
        stack.ready();

        stack.push( panel3 );
        
        source = stack.source;

        assertEqual(source[0].childNodes[0].childNodes[0].innerHTML, 'Panel 1');
        assertEqual(source[0].childNodes[1].childNodes[0].innerHTML, 'Panel 2');
        assertEqual(source[0].childNodes[2].childNodes[0].innerHTML, 'Panel 3');
        
        stack.push( panel4 );
        assertEqual(source[0].childNodes[3].childNodes[0].innerHTML, 'Panel 4');
        
        stack.pop()
        assertEqual(source[0].childNodes[3], null);
        assertEqual(source[0].childNodes[2].childNodes[0].innerHTML, 'Panel 3');
        
        panel2.destroy();
        assertEqual(source[0].childNodes[0].childNodes[0].innerHTML, 'Panel 1');
        assertEqual(source[0].childNodes[1].childNodes[0].innerHTML, 'Panel 3');
        
        for(var i = 4; i < 8; i++) {
            stack.push({
                type: 't-panel',
                title: 'Panel ' + i
            });
        }

        stack.popAfter(panel3);

        assertEqual(source[0].childNodes[0].childNodes[0].innerHTML, 'Panel 1');
        assertEqual(source[0].childNodes[1].childNodes[0].innerHTML, 'Panel 3');
        assertEqual(source[0].childNodes[3], undefined);

        stack.empty();

        assertEqual(source[0].childNodes[0], undefined);
    }
})