/** Tea.latent(func, milliseconds, context)
    Calls the given function {{{func}}} after the given {{{milliseconds}}} with
    a {{{this}}} of {{{context}}}.
    
    The function returned is a wrapper function.  When it is called, it waits 
    for the specified {{{milliseconds}}} before actually being run.  Also, if
    it is waiting to run, and is called again, it will refresh its timer.
    This is great for things like auto-complete, where you want to cancel and
    refresh the timer every time a key is hit
    
    You can easily bind a latent to an event, the following code will run 
    the method "onKeyup" on "this" 300 milliseconds after the last keyup event 
    of a series:
    
    {{{ $(window).keyup( Tea.latent(this.onKeyup, 300, this) )}}}
    
    The function returned also provides a few extra methods on the function,
    itself:
    
    {{{.cancel()}}} - Cancels the timer.
    
    {{{.refresh([milliseconds])}}} - Refreshes the timer, and optionally resets the
    {{{milliseconds}}}.
    
    Example:
    {{{
    function hello() {
        this.log("Hello World!");
    }
    
    hello = latent(hello, console, 1000);
    hello();
    hello();
    hello();
    
    // After 1 second: "Hello World!"
    
    hello();
    hello.cancel();
    
    // Nothing...
    
    hello.refresh(1000);
    
    // After 1 second: "Hello World!"
    
    hello();
    
    // After 1 second: "Hello World!"
    }}}
 **/
 
Tea.latent = function(func, milliseconds, context)
{
    var timeout = null;
    var args = null;
    context = context || this;
    
    function call()
    {
        clearTimeout(timeout);
        timeout = null;
        func.apply(context, args);
    }
    
    function refresh(new_milliseconds)
    {
        milliseconds = new_milliseconds || milliseconds;
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(call, milliseconds)
    }
    
    function trip()
    {
        call();
        refresh();
    }
    
    function cancel()
    {
        if (timeout)
            clearTimeout(timeout);
        timeout = null;
    }
    
    var self = function()
    {
        args = arguments;
        refresh();
    }
    
    self.trip = trip;
    self.call = call;
    self.refresh = refresh;
    self.cancel = cancel;
    
    return self;
}