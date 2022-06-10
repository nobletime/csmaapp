$(document).ready(function () {

});


function autocheck() {
    $.get("/autocheck?vin=" + document.getElementById('vin1').value,
  //  {
 //     vin: document.getElementById('vin1').value
 //   },
    function(data, status){
        var newWindow = window.open("", "newWindow", "resizable=yes");
        if (status = "success"){
            newWindow.document.write(data);
        } else {
            newWindow.document.write('<p>Server returned error</p>');
        }
    });


}