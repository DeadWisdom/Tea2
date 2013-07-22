/** Tea
    
    Complex UI framework based on jQuery.
    
    Copyright (c) 2012 Brantley Harris. All rights reserved.

 **/

(function() {
    var Tea = window.Tea = (window.Tea == undefined ?  {root: ''} : window.Tea);

    /** Tea.require(...)
        Imports the given arguments by appending <script> or <style> tags to the head.
        Note: Importing is done relative to the page we're on, not the script.
        Note: The required script is loaded sometime AFTER the requiring script, so you can't use
              the provided namespace (functions and variables) right away.
    
        arguments:
            Strings of urls to the given resource.  If the string ends with .css, it is added with
            a <style> tag; if it's a .js, it is added with a <script> tag.
     **/
    Tea.require = function()
    {
    	for(var i=0; i < arguments.length; i++)
    	{
    		var src = Tea.root + arguments[i];
    		if (Tea.require.map[src])
    			return;
    		Tea.require.map[src] = true;
    		try {
    			extension = src.match(/.*?\.(js|css)/i)[1];
    		} catch(e) { throw "Can only import .css or .js files, not whatever this is: " + src; }
    		if (extension == 'js')
    			document.write('<script type="text/javascript" src="' + src + '"></script>\n');
    		else if (extension == 'css')
    			document.write('<link rel="stylesheet" href="' + src + '" type="text/css"/>\n');
    	}
    }
    Tea.require.map = {}

    /** Tea.overrideMethod(super_function, function)
        Creates a callback that when run, provides a {{{__super__}}} on *this* which points to 
        {{{super_function}}}, and then runs {{{func}}}.  A great way to do inheritance.
     **/
    Tea.overrideMethod = function(super_func, func)
    {
        return function()
        {
            this.__super__ = function() { return super_func.apply(this, arguments) };
            var r = func.apply(this, arguments);
            delete this.__super__;
            return r;
        }
    }

    /** Tea.generateUniqueID(prefix)
        
        Generates a unique id with the given {{{prefix}}}.
     **/
    Tea.generateUniqueID = function(prefix) {
        if (!Tea._uniqueID)
            Tea._uniqueID = 1;
        return prefix + "-" + Tea._uniqueID++;
    }

    /// Types /////////
    Tea.types = {}

    /** Tea.registerType(name, object)
        Registeres an {{{object}}} as a type with the given {{{name}}}.
    
        name:
            Name of the type.
        
        object:
            The object.
     **/
    Tea.registerType = function(name, object) { Tea.types[name] = object; }


    /** Tea.getType(name)
        Returns the object registered with the given {{{name}}}.
     **/
    Tea.getType = function(name)
    { 
        return Tea.types[name];
    }


    /** Tea.create(options) 
        Returns an object created using the {{{options}}}, which can be an object 
        or a string.
    
        If {{{options}}} is a string, a type returned by {{{Tea.getType()}}} will 
        be returned, unless it can't find the type, then it is treated as a 
        jQuery object.
        
        If {{options}} is a jQuery object it is wrapped as the source of a 
        Tea.Element and returned.
    
        If {{{options}}} is an {{{Object}}}, the {{{.type}}} attribute will be
        used to look up the correct type and will be used to create an instance
        of that type.
    
        If {{{options}}} is an instance of a {{{Tea.Object}}}, it will be returned
        unaffected.
     **/
    Tea.create = function(options, extra) {
        if (options instanceof Tea.Object) return options;
        if (typeof(options) == 'string') {
            var t = Tea.getType(options);
            if (t)
                return t(extra);
            try {
                var jq = jQuery(options);
                options = jq;
            } catch(e) {}
        }
        if (options instanceof jQuery) {
            return Tea.create({type: 't-element', source: options}, extra);
        }
        if (options instanceof Object) {
            if (!options.type) throw "Tea.create() called with an object that has no type";
            var type = Tea.getType(options.type);
            if (!type) throw "Tea.create() called with unknown type: " + options.type;
            return type(jQuery.extend({}, options, extra));
        }
        throw "Tea.create() called with incorrect argument: " + options;
    }
    
    /// Tea.Object //////////
    var _creating = false;
    
    Tea.createInstance = function(Type) {
        _creating = true;
        var instance = new Type();
        //console.log('createInstance', instance, instance.constructor, Type);
        _creating = false;
        return instance;
    }
    
    Tea.extend = function(object, properties) {
        jQuery.each(properties, function(k, v) {
            if (jQuery.isFunction(v)) {
                var supr = object[k];
                if (jQuery.isFunction(supr))
                    v = Tea.overrideMethod(supr, v);
            }
            object[k] = v;
        });
    }
    
    Tea.extendType = function(SuperType, name, properties) {
        var Type = makeType(name);
        Type.supertype = SuperType;
        Type.prototype = Tea.createInstance(SuperType);
        Tea.extend(Type.prototype, properties);
        Type._name = name;
        Type.prototype.constructor = Type;
        Tea.registerType(name, Type);
        return Type;
    }
    
    function makeType(name) {
        var Type = function() {
            if (_creating) return this;
            return Type.create.apply(this, arguments);   
        }

        Type.name = name || "t-object";
        
        if (name) {
            Type.toString = function() {
                return "[type: " + name + "]";
            }
            Tea.registerType(name, Type);
        }
        
        Type.extend = function(properties) {
            properties = properties || {};
            return Tea.extendType(Type, properties.type, properties);
        }
        
        Type.create = function(options) {
            var instance = Tea.createInstance(Type);
            //console.log("create", instance, instance.constructor, Type, options);
            instance.__options__ = options || {};
            Tea.extend(instance, instance.__options__);
            instance.init(instance.__options__);
            return instance;
        }
        
        return Type;
    }
    
    /** Tea.Object

        Base object that allows class/subclass behavior, events, and a regard
        for "options".
        
        Mamal = Tea.Class({type: 'Mamal'});
        Human = Mamal.extend({type: 'Mamal'});
        Bob = Human({name: 'Bob'});
     **/
    Tea.Object = makeType("t-object");
    
    Tea.Object.prototype = {
        /** Tea.Object.init(options)
            
            Override this to change initialization code.
            
            Note: Not called on class prototypes.
        **/
        init : jQuery.noop,
        
        /** Tea.Object.toString()
        
            Returns a string representation of the object.
         **/
        toString : function()
        {
            return (this.constructor._name || "t-object");
        },
            
        /** Tea.Object.bind(event, handler, [args])
            Binds an event for this instance to the given function which will be 
            called with the given args.
    
            event:
                An event name to bind.
    
            handler:
                The function to call when the event is triggered.
    
            args (optional):
                A list of arguments to pass into when calling the handler.
         **/
        bind : function(event, handler, args)
        {
            if (!this.__events) this.__events = {};
            if (!this.__events[event]) this.__events[event] = [];
            this.__events[event].push([handler, args]);
        },
    
        /** Tea.Object.prototype.unbind(event, [handler])
            Unbinds an events from this instance.  If a handler is given, only 
            events pointing to that handler are unbound.  Otherwise all handlers 
            for that event are unbound.
    
            event:
                An event name to unbind.
    
            handler:
                Only events pointing the given handler are unbound.
         **/
        unbind : function(event, handler) { 
            if (!this.__events) return;
            var handlers = this.__events[event];
            if (!handlers) return;
            if (handler) {
                jQuery.each(handlers, function(i, pair) {
                    if (pair && pair[0] == handler) {
                        handlers.splice(i, 1);
                    }
                });
            } else {
                delete this.__events[event];
            }
        },

        /** Tea.Object.hook(target, event, handler, [args])
            Binds onto the target, but does so in a manner that allows this object
            to track its "hooks".  One can then unhook(target), or unhookAll() to
            release the bind.  This is beneficial from a memory standpoint, as
            hooks won't leak like a bind will.
        
            target:
                The target to bind onto.
        
            event:
                An event name to bind.
    
            handler:
                The function to call when the event is triggered.
    
            args (optional):
                A list of arguments to pass into when calling the handler.
         **/
        hook : function(target, event, func, args) {
            if (!this.__hooks) this.__hooks = [];
            var handler = jQuery.proxy(func, this);
            target.bind(event, handler, args);
            this.__hooks.push([target, event, handler]);
        },
    
        /** Tea.Object.unhook(target)
            Unhooks all binds on target.
        
            target:
                The target to release all binds from.
         **/
        unhook : function(target)
        {
            if (!this.__hooks) return;
            for(var i=0; i<this.__hooks.length; i++) {
                var hook = this.__hooks[i];
                if (target != hook[0]) continue;
                var event =   hook[1];
                var handler = hook[2];
                target.unbind(event, handler);
            }
        },
    
        /** Tea.Object.unhookAll()
            Unhooks all binds on all targets.
         **/ 
        unhookAll : function()
        {
            if (!this.__hooks) return;
            while(this.__hooks.length > 0) {
                var hook = this.__hooks.pop();
                var target =  hook[0];
                var event =   hook[1];
                var handler = hook[2];
                target.unbind(event, handler);
            }
        },
    
        /** Tea.Object.prototype.trigger(name)
    
            event:
                The event name to trigger.
        
            args:
                Arguments to pass onto the function.  These go after
                any arguments set in the bind().
         **/
        trigger : function(event, args) { 
            if (!this.__events) return;
            var handlers = this.__events[event];
            if (!handlers) return;
            if (!args) args = [];
            for(var i = 0; i < handlers.length; i++)
            {
                handlers[i][0].apply(this, (handlers[i][1] || []).concat(args));
            }
        },

        /** Tea.Object.prototype.destroy()
            
            Destroys the object and unhooks all events.
        **/
        destroy : function() {
            this.trigger('destroy');
            this.unhookAll();
        }
    }
    
    Tea.Class = Tea.Object.extend;
})();
