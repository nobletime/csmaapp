window.onload = () => {
  'use strict';

  // get app_id from link
  //          localStorage.setItem("patient-app-id", params.get('app_id') ) 
  if ('serviceWorker' in navigator) {

    navigator.serviceWorker
      .register('/public/sw.js').then(registeration => {
        // const params = new URLSearchParams(window.location.search)
        // if (params.has('app_id')) {
        //   const SHARED_DATA_ENDPOINT = '/app_id';
        //   fetch(SHARED_DATA_ENDPOINT, { method: "POST", body: JSON.stringify({ app_id: params.get('app_id') }) }).then(() => {
        //     console.log('saved to cache')
        //   })
        // }
      })
  }

  navigator.serviceWorker.addEventListener("controllerchange", (evt) => {
    console.log("controller changed");
    this.controller = navigator.serviceWorker.controller;
  });

  navigator.serviceWorker.addEventListener('message', event => {
    const data = JSON.parse(event.data)
    console.log(data.app_data);
  });

  // navigator.serviceWorker.controller.postMessage(JSON.stringify({app_id: "app_id"}));


  if ((window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://')) {
    fetch("/getversion")
      .then(res => res.json())
      .then(data => {
        const oldV = document.getElementById("app-version").value
        const newV = data[0].version
        if ((oldV != newV)) {
          const message = `Your version of app is old ${oldV}, please install the new version of the app (verson ${newV})`
          document.getElementById("appversion-message").innerHTML = message
          document.getElementById("appUpdateBtn").click()
          //   $("#appVersionModal").show();
        }
      })

  } else {

    // alert(`you are running ${getMobile()}`)
    if (getMobile() == "ios") {
      document.getElementById("main-content").innerHTML = '<img src="/public/images/ios_install.jpg"   style="width:100%; border:2px solid green"  >'

    } else {

    }

  }

}
