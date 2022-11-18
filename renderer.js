let connected = false;
var responseDiv = document.getElementById("response");
var requestDiv = document.getElementById("request");
const profilesKey = "connection_profiles";
let profile = {};
let wating = false;
const options = {

    mode: 'code',
    modes: ['code', 'tree', 'text'],
    "search": true
}
const request_editor = new JSONEditor(requestDiv, options)
const response_editor = new JSONEditor(responseDiv, options)


window.api.receive("response", (msg) => {
    console.log("response received")
    $("#btn_send").prop('disabled', false);
    $("#loader").hide();
    var csResponse = new TextDecoder().decode(msg.payload);
    response_editor.set(JSON.parse(csResponse));
});

jQuery(function () {

    var profilesJson = localStorage.getItem(profilesKey);

    if (profilesJson) {
        window.api.send("log", profilesJson);
        var profiles = JSON.parse(profilesJson);
        for (profile in profiles) {
            addProfileToTable(profiles[profile]);
        }
    }

    $("#btn_send").on('click', function () {
        response_editor.set({});
        $("#status").empty();
        //$("#btn_send").prop('disabled', true);
        $("#loader").show();

        window.api.send("request", {
            payload: request_editor.getText(),
            host: $("#host").val(),
            port: $("#port").val(),
            user: $("#user").val(),
            bot: $("#bot").val(),
        });
        wating = true;
    });

});

function generateGuid() {
    var result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
        if (j == 8 || j == 12 || j == 16 || j == 20)
            result = result + '-';
        i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
        result = result + i;
    }
    return result;
}