Tea.require(
    '../src/testing.js',
    '../tests/test_core.js',
    '../tests/test_element.js',
    '../tests/test_container.js',
    '../tests/test_panel.js',
    '../tests/test_stack.js',
    '../tests/test_controls.js',
    '../tests/test_input.js',
    '../tests/test_form.js'
    /*
    '../tests/test_template.js',
    '../tests/test_resource.js'
    '../tests/test_dialog.js',
    
    '../tests/test_form.js'
    
    //'../tests/test_list.js',      Refactor
    */
);

$(function()
{
    var results = Tea.Testing.run();
    
    if (results.count < 1) {
        $('.byline').append(" - <span style='color: #CC00BB'>Error</span>"); 
    } else if (results.count > results.passed) {
        $('.byline').append(" - <span style='color: #CC0000'>Fail</span>"); 
    } else {
        $('.byline').append(" - <span style='color: #88AA88'>Pass</span>");
    }
})