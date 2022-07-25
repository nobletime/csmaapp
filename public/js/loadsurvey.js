$(() => {

    const params = new URLSearchParams(window.location.search)
    let cid = "", pid = "", cname = "";

    // if (params.has('cid') && params.has('pid')) {   
    //    // cname = document.getElementById("cname").innerHTML;
    //   //  console.log(cname);
    //     cid = params.get('cid');
    //     pid = params.get('pid');
    // } else {
    //     return 
    // }       

    Survey
        .StylesManager
        .applyTheme("defaultV2");

    let json = {};

    switch (document.querySelector(".surveyElement").id) {
        case "dsa":
            json = dsa_json
            break;
        case "med":
            json = med_json
            break;
        case "general":
            json = general_json
            break;
        case "inspire":
            json = inspire_json
            break;
        case "pap":
            json = pap_json
            break;
        case "appliance":
            json = appliance_json
            break;

        default:
    }


    window.survey = new Survey.Model(json);
    (new Date().getHours() < 14 || document.querySelector(".surveyElement").id == "dsa") ? 
            window.survey.setValue("whichnight", "last_night") : window.survey.setValue("whichnight", "tonight")

    survey
        .onComplete
        .add(function (sender) {

            if (localStorage.getItem("patient-app-id") == null || localStorage.getItem("patient-app-id").trim() == "") {
                if (document.getElementById("activateBtn"))
                  document.getElementById("activateBtn").click()
                  return false;
            }

            const plot_date = (sender.data.whichnight == "last_night") ?  new Date().setHours(0,0,0,0)-1
                                    : new Date().setHours(23,59,59,999);

            const surveydata = {
                clinic_id: "CSMA",
                patient_app_id: localStorage.getItem("patient-app-id"),
                date: new Date(),
                plot_date: plot_date,
                type: document.querySelector(".surveyElement").id,
                data: sender.data
            }


            //   surveydata.clinic_name = cname
            //    surveydata.date = new Date(moment(new Date()).format('MM/DD/YYYY'));

            fetch("/save-comment", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(surveydata)
            }).then(res => {
                console.log("Request complete! response:", res);
            });
        });

    //   survey.data = JSON.parse(data);
    //    survey.mode = 'display';

    $(`#${document.querySelector(".surveyElement").id}`).Survey({ model: survey });
})