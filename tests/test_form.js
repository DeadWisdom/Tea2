Tea.require( '../src/input.js' );
Tea.require( '../src/form.js' );

Tea.Testing.Suite({
    name: 'Tea.Form',
    
    test_basics : function() {
        var form = Tea.create({
            type: 't-form',
            items: [
                {type: 't-text', name: 'username', label: 'Username'},
                {type: 't-password', name: 'password', label: 'Password'}
            ]
        });

        console.log(form.source);

        assertEqual(form.source.html(), '<div><label for="t-field-1">Username</label><input type="text" class="t-text" name="username" id="t-field-1"></div><div><label for="t-field-2">Password</label><input type="password" class="t-password" name="password" id="t-field-2"></div>')
        
        console.log(form.source.html());
    }
});

<fieldset class="t-fieldset">
  <div class="t-field t-no-label">
  <label class="t-prompt">
    <div style="display: none;" class="t-label"></div>
    <div style="display: none;" class="t-hint"></div></label>
    <div class="t-entry"><div style="display: none;" class="t-errors"></div><input name="username" class="t-text" type="text"></div></div></fieldset><fieldset class="t-fieldset"><div class="t-field t-no-label"><label class="t-prompt"><div style="display: none;" class="t-label"></div><div style="display: none;" class="t-hint"></div></label><div class="t-entry"><div style="display: none;" class="t-errors"></div><input name="password" class="t-password" type="password"></div></div></fieldset>