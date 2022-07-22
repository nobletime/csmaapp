"use strict";

$(() => {




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



  getAppId(); 
})

function getAppId() {
  let app_id = localStorage.getItem("patient-app-id")
  alert("APP_ID = " + app_id)
  if (!app_id) {
    const SHARED_DATA_ENDPOINT = '/app_id';
    fetch(SHARED_DATA_ENDPOINT).then(response => response.json()).then(data => {
      localStorage.setItem("patient-app-id", data.app_id)
      console.log('Got', data, 'from cache');
      alert("APP_ID = " + data.app_id)
    });
  }
  

}

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

function addVin() {
  var indexValue = Number($("#indexVin").val());
  indexValue++;
  $("#indexVin").val(indexValue);
  var vinDivContent = $("#VinDiv").html() + '<input type="text" id="vin"' + indexValue + ' name="vin' + indexValue + '" placeholder="VIN ' + indexValue + '" required />';
  $("#VinDiv").html(vinDivContent);

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

function showCredits() {
  $('#report').hide();
  $('#credits').show();
  $('#settings').hide();
  $('#support').hide();
  document.getElementById("pageTitle").innerHTML = "Add Credits"
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

function getreport() {
  localStorage.setItem("autocheck-email", document.getElementById("email").value.toLowerCase().trim())
  const url = `/autocheck?username=${document.getElementById("username").value}`
  let params = [
    'toolbar=no',
    'location=no',
    'resizable=yes',
    'height=' + screen.height,
    'width=' + screen.width,
    'fullscreen=yes' // only works in IE, but here for completeness
  ].join(',');
  var win = window.open("", "Report", params);
  // let data = new FormData()
  //   data.append('name', form.name.value)
  var status;

  fetch(url,
    {
      method: "POST",
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      // whatever data you want to post with a key-value pair

      body: `email=${document.getElementById("email").value}&vin=${document.getElementById("vin").value}`,
      headers:
      {
        "Content-Type": "application/x-www-form-urlencoded"
      }

    }).then((response) => {
      status = response.status
      response.text().then(re => {
        if (status == 403) {
          window.location.replace("/signin");

        } else if (status == 405) {
          document.getElementById('report_message').innerHTML = re
          win.close()
        } else if (status == 302) {
          document.getElementById('report_message').innerHTML = re
          win.close()
        } else if (status == 200) {
          document.getElementById('report_message').innerHTML = '<span style="color:green"><b> Successful! </b></span>'
          const data = JSON.parse(re);

          const mycredits = document.getElementsByClassName("mycredits")
          mycredits[0].innerHTML = mycredits[1].innerHTML = data.credits;
          //  document.getElementById("report_message").innerHTML = `<span style="color:green"> Report downloaded for ${data.vin}</span>`

          const btnDownload = `<div style="margin-top:40px; margin-bottom:40px;">  <button onclick="viewReport()" style="background:darkblue !important" class="form-control btn btn-primary rounded px-3"   onclick="getreport()"><b>Download Report: ${data.vin}</b></button></div>`;

          document.getElementById("report_download").innerHTML = `${btnDownload}`;

          document.getElementById("reportdata").innerHTML = data.pagedata;
          win.document.body.innerHTML = data.pagedata;
          // win.moveTo(0, 0)


        } else {
          document.getElementById('report_message').innerHTML = "Server error, please contact support"
          win.close()
        }


        // console.log(re);
      });

      //  document.getElementById('report_message').innerHTML = response.body
    });

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