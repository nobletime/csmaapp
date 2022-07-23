"use strict";

$(() => {


//alert(localStorage.getItem("patient-app-id"))

  // setTimeout(() => {
  //   fetch(SHARED_DATA_ENDPOINT).then(response => response.json()).then(data => {
  //     app_id = data.app_id
  //     console.log('Got', data, 'from cache');
  //   })
  // }, 3000)

  fetch("/public/html/slider.html")
    .then(response => {
      // status = response.status
      response.text().then(re => {
        if (document.getElementById("left-slider"))
          document.getElementById("left-slider").innerHTML = re;
      })
    })

  // add logo 
  // const target = document.getElementById("pageTitle")
  // const logo ='<img id="app-logo" src="/public/images/logo.jpg" style="position: absolute;    top: 5px;    right: 0; height:60px"/>'
  // target.insertAdjacentHTML('beforebegin', logo);

  $(".toggle-password").click(function () {

    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  });


})


function saveUsername() {
  if (document.getElementById("remember").checked) {
    localStorage.setItem("resttrackerapp-username", document.getElementById("app_id").value)
    localStorage.setItem("resttrackerapp-password", document.getElementById("password").value)
  }
  return true;
}


function showSignIn() {
  $("#signup-div").hide()
  $("#signin-div").show()
  $("#password-reset-div").hide()
}

function showSignUp() {
  $("#signup-div").show()
  $("#signin-div").hide()
  $("#password-reset-div").hide()
}

function showPasswordReset() {
  $("#signup-div").hide()
  $("#signin-div").hide()
  $("#password-reset-div").show()
}


function validateConfirmPassword() {

  if (document.getElementById("patient_app_id").value == "") {
    document.getElementById('note').innerHTML = 'APP ID cannot be empty. Please contact support to report this issue!'
    return false;
  }

  if (document.getElementById('newpassword').value != document.getElementById('confirm_password').value) {
    document.getElementById('note').innerHTML = 'Password and confirmation passwords do NOT match!'
    return false;
  } else {
    return true;
  }
}

function showReport() {
  $('#report').show();
  $('#credits').hide();
  $('#settings').hide();
  $('#support').hide();
  document.getElementById("pageTitle").innerHTML = "AutoCheck Report"
  w3_close();
}

function showDSA() {
  $('#report').hide();
  $('#credits').hide();
  $('#settings').hide();
  $('#support').hide();
  document.getElementById("pageTitle").innerHTML = "AutoCheck Report"
  w3_close();
}



function showSettings() {
  $('#report').hide();
  $('#credits').hide();
  $('#settings').show();
  $('#support').hide();
  document.getElementById("pageTitle").innerHTML = "Settings"
  w3_close();
}

function showSupport() {
  $('#report').hide();
  $('#credits').hide();
  $('#settings').hide();
  $('#support').show();
  document.getElementById("pageTitle").innerHTML = "Support"
  w3_close();
}

function w3_open() {
  //	document.getElementById("mySidebar").style.display = "block";
  $("#mySidebar").show("slide", { direction: "left" }, 300);

}

function savePatId() {
  //  localStorage.setItem("patient-app-id", document.getElementById("patient_app_id").value)
}

function w3_close() {
  //  document.getElementById("mySidebar").style.display = "none";			
  $("#mySidebar").hide("slide", { direction: "left" }, 300);
}

function viewReport() {
  let params = [
    'toolbar=no',
    'location=no',
    'resizable=yes',
    'height=' + screen.height,
    'width=' + screen.width,
    'fullscreen=yes' // only works in IE, but here for completeness
  ].join(',');
  var win = window.open("", "Report", params);
  win.document.body.innerHTML = document.getElementById("reportdata").innerHTML;
  win.moveTo(0, 0)
}




function addCamera() {
  var resultContainer = document.getElementById('qr-reader-results');
  var lastResult, countResults = 0;

  function onScanSuccess(decodedText, decodedResult) {
    if (decodedText !== lastResult) {
      ++countResults;
      lastResult = decodedText;
      // Handle on success condition with the decoded message.
      console.log(`Scan result ${decodedText}`, decodedResult);
      alert(decodedText)
      localStorage.setItem("patient-app-id" , decodedText)
      html5QrCode.stop().then((ignore) => {
        alert(" QR Code scanning is stopped.")
      }).catch((err) => {
        // Stop failed, handle it.
      });
    }
  }

  var html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader", { fps: 10, qrbox: 250 });
  html5QrcodeScanner.render(onScanSuccess);


}

function getMobile() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/windows phone/i.test(userAgent)) {
    return "windows_phone";
  }

  if (/android/i.test(userAgent)) {
    return "android";
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "ios";
  }

  return userAgent;
}