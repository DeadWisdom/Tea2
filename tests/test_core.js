Tea.Testing.Suite({
    name: 'Tea',
    
    test_class_example : function()
    {
        Mammal = Tea.Class({
            type: 'Mammal',
            greet: function(name) {
                return "Grrrr!";
            }
        });
        
        Human = Mammal.extend({
            type: 'Human',
            greet: function(name) {
                return "Hello, " + name + ".";
            }
        });
        
        Politician = Human.extend({
            type: 'Politician',
            name: 'Candidate',
            greet: function(name) {
                return this.__super__(name) + ' Vote ' + this.name + '.';
            }
        });
        
        var mammal = Tea.create('Mammal');
        var human = Tea.create({type: 'Human'});
        var quimby = Politician({name: 'Quimby'});
        
        assertEqual(mammal.greet('Bob'), 'Grrrr!');
        assertEqual(human.greet('Bob'), 'Hello, Bob.');
        assertEqual(quimby.greet('Bob'), 'Hello, Bob. Vote Quimby.');

        assertEqual(human.toString(), 'Human');
        assertEqual(quimby.toString(), 'Politician');
    },
    
    test_instanceof : function()
    {
        var A = Tea.Class('A', {});
        var B = Tea.Class('B', {});
        var C = B.extend('C', {});
        
        var a = new A();
        var b = new B();
        var c = new C();
        var d = new Object();
        
        // Basics
        assert(a instanceof A);
        assert(b instanceof B);
        assert(c instanceof C);
        assert(d instanceof Object);
        
        // Inheritance
        assert(c instanceof B);
        assert(c instanceof Object);
        assert(c instanceof Tea.Object);
        assert(a instanceof Object);
        assert(a instanceof Tea.Object);
        
        // Anti
        assert(! (c instanceof A));
        assert(! (d instanceof A));
        assert(! (b instanceof C));
    },
    
    test_supertype : function()
    {
        var One = Tea.Class({});
        var Two = One.extend({});
        
        assertEqual(Two.supertype, One);
    },
    
    test_registration : function()
    {
        var Class = Tea.Class({
            type: 'Class'
        });

        assertEqual(Class, Tea.getType('Class'));
    },
    
    test_events : function()
    {
        var object = Tea.Object();
        var state = 0;
        
        object.bind("signal", function(step) { state += step }, [1]);
        object.trigger('signal');
        assertEqual(state, 1);
        
        object.bind("signal", function(step) { state += step }, [2]);
        object.trigger('signal');
        assertEqual(state, 4)
        
        object.unbind('signal');
        object.trigger('signal');
        assertEqual(state, 4);
        
        var add_one = function() { state += 1 };
        object.bind('signal', add_one);
        object.trigger('signal');
        assertEqual(state, 5);
        
        var add_two = function() { state += 2 };
        object.bind('signal', add_two);
        object.trigger('signal');
        assertEqual(state, 8);
        
        object.unbind('signal', add_two);
        object.trigger('signal');
        assertEqual(state, 9);
    },
    
    test_hook : function() {
        var counter = 0;
        
        a = Tea.Object();
        b = Tea.Object();
        
        a.hook(b, 'incr', function() { counter += 1; });
        
        assertEqual(counter, 0);
        b.trigger('incr');
        assertEqual(counter, 1);
        b.trigger('incr');
        assertEqual(counter, 2);
        
        a.unhookAll();
        b.trigger('incr');
        assertEqual(counter, 2);
        
        a.hook(b, 'incr', function() { counter += 1; });
        b.trigger('incr');
        assertEqual(counter, 3);
        
        a.unhook(b);
        b.trigger('incr');
        assertEqual(counter, 3);
    }
})