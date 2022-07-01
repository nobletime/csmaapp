var result_all = {}
const dsa_json = {
    "logoPosition": "right",
    "completedHtml": "<h3>Your Daily Sleep Assessment is successfully submitted</h3>",
    "completedBeforeHtml": "<h3>Our records show that you have already completed DSA.</h3>",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "DSA1",
                    "title": "Which best describes how you are feeling?",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        {
                            "value": "1",
                            "text": "1. Feeling active, vital, alert or wide awake"
                        },
                        {
                            "value": "2",
                            "text": "2. Functioning at high levels, but not fully alert"
                        },
                        {
                            "value": "3",
                            "text": "3. Awake, but relaxed; responsive but not fully alert"
                        },
                        {
                            "value": "4",
                            "text": "4. Somewhat foggy, let down"
                        },
                        {
                            "value": "5",
                            "text": "5. Foggy; losing interest in remaining awake; slowed down"
                        },
                        {
                            "value": "6",
                            "text": "6. Sleepy, woozy, fighting sleep; prefer to lie down"
                        },
                        {
                            "value": "7",
                            "text": "7. No longer fighting sleep; sleep onset soon; having dream-like thoughts"
                        }
                    ]
                }
            ]
        },
        {
            "name": "page2",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "DSA2",
                    "title": "How would you rate the quality of your sleep last night?",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        {
                            "value": "1",
                            "text": "1. Very poor - could not fall asleep or stay asleep and felt extremely unrested in the morning"
                        },
                        {
                            "value": "2",
                            "text": "2. Poor - Difficulty failing asleep, staying asleep, woke up unrefreshed"
                        },
                        {
                            "value": "3",
                            "text": "3. Fair - Fell asleep relatively quickly, a few brief awakenings, woke up feeling OK"
                        },
                        {
                            "value": "4",
                            "text": "4. Good - Fell asleep relatively quickly, no awakenings, woke up feeling OK"
                        },
                        {
                            "value": "5",
                            "text": "5. Very good - Fell asleep quickly, no awakenings, woke up rested"
                        },
                        {
                            "value": "6",
                            "text": "6. NA"
                        }
                    ]
                }
            ]
        }
    ],
    "navigateToUrlOnCondition": [
        {}
    ]
}

const med_json = {
    "logoPosition": "right",
    "completedHtml": "<h3>Your answers were saved! </h3>",
    "completedBeforeHtml": "<h3>Our records show that you have already completed DSA.</h3>",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "comment",
                    "name": "comment",
                    "title": "List  medication changes: ",
                    "hideNumber": true
                }
            ]
        }
    ],
    "navigateToUrlOnCondition": [
        {}
    ]
}


const inspire_json = {
    "logoPosition": "right",
    "completedHtml": "<h3>Your answers were saved! </h3>",
    "completedBeforeHtml": "<h3>Our records show that you have already completed DSA.</h3>",
    "pages": [
     {
      "name": "page1",
      "elements": [
       {
        "type": "dropdown",
        "name": "inspire_level",
        "title": "Select inspire changes:",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "0 / off / stopped"
         },
         "1",
         "2",
         "3",
         "4",
         "5",
         "6",
         "7",
         "8",
         "9",
         "10",
         "11"
        ]
       }
      ]
     }
    ],
    "navigateToUrlOnCondition": [
     {}
    ],
    "completeText": "Submit"
   }


const appliance_json = {
    "logoPosition": "right",
    "completedHtml": "<h3>Your answers were saved! </h3>",
    "completedBeforeHtml": "<h3>Our records show that you have already completed DSA.</h3>",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "comment",
                    "name": "comment",
                    "title": "Type in the change to your Oral Appliance Therapy: ",
                    "hideNumber": true
                }
            ]
        }
    ],
    "navigateToUrlOnCondition": [
        {}
    ]
}

const pap_json = {
    "logoPosition": "right",
    "completedHtml": "<h3>Your answers were saved! </h3>",
    "completedBeforeHtml": "<h3>Our records show that you have already completed DSA.</h3>",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "comment",
                    "name": "comment",
                    "title": "Type in the change to your PAP treatmen: ",
                    "hideNumber": true
                }
            ]
        }
    ],
    "navigateToUrlOnCondition": [
        {}
    ]
}


function getResultLink() {
    //document.getElementById("result_link").href=`/result?cid=${document.getElementById("cid").value}&pid=${document.getElementById("pid").value}`; 

    $.get(`/results?cid=${document.getElementById("cid").value}`, function (data) {
        Survey
            .StylesManager
            .applyTheme("defaultV2");

        json['clientId'] = `${document.getElementById("cid").value}`

        window.survey = new Survey.Model(json);
        result_all = data;
        convertJsontoHtmlTable(data)

        //   survey.data = JSON.parse(data);
        //    survey.mode = 'display';

        // $("#surveyElement").Survey({ model: survey });
    });

    // fetch(`/result?cid=${document.getElementById("cid").value}&pid=${document.getElementById("pid").value}`)
    //     .then(response => console.log(response.json()))
    //     .then(data => console.log(data));

    // await fetch(`/result?cid=${document.getElementById("cid").value}&pid=${document.getElementById("pid").value}`, {
    //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //     mode: 'cors', // no-cors, *cors, same-origin
    //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //     credentials: 'same-origin', // include, *same-origin, omit
    //     headers: {
    //         'Content-Type': 'application/json'
    //         // 'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     body: JSON.stringify(data) 
    // });
};

function callExport() {
    exportAllToCSV(result_all, document.getElementById("cid").value)
}


function convertJsontoHtmlTable(employess) {

    //Getting value for table header
    // {'EmployeeID', 'EmployeeName', 'Address' , 'City','Country'}
    var tablecolumns = [];
    //  tablecolumns.push('clinic_id')
    tablecolumns.push('patient_id')
    tablecolumns.push('dob')
    tablecolumns.push('gender')
    tablecolumns.push('relationship_child')
    tablecolumns.push("Q 1")
    tablecolumns.push("Q 2")
    tablecolumns.push("Q 3")
    tablecolumns.push("Q 4")
    tablecolumns.push("Q 5")
    tablecolumns.push("rating")
    tablecolumns.push('<button type="button" onclick="callExport()" class="btn btn-primary">Export All to XLS</button>')
    // tablecolumns.push("  ")

    //Creating html table and adding class to it
    var tableemployee = document.createElement("table");
    tableemployee.classList.add("table");
    tableemployee.classList.add("table-striped");
    tableemployee.classList.add("table-bordered");
    tableemployee.classList.add("table-hover")

    //Creating header of the HTML table using
    //tr
    var tr = tableemployee.insertRow(-1);

    for (var i = 0; i < tablecolumns.length; i++) {
        //header
        var th = document.createElement("th");
        th.innerHTML = tablecolumns[i];
        tr.appendChild(th);
    }

    // Add employee JSON data in table as tr or rows
    for (var i = 0; i < employess.length; i++) {
        tr = tableemployee.insertRow(-1);
        for (var j = 0; j < tablecolumns.length; j++) {
            var tabCell = tr.insertCell(-1);
            if (tablecolumns[j] == "Q 1") {
                tabCell.innerHTML = employess[i].main_questions['1'];
            } else
                if (tablecolumns[j] == "Q 2") {
                    tabCell.innerHTML = employess[i].main_questions['2'];
                } else
                    if (tablecolumns[j] == "Q 3") {
                        tabCell.innerHTML = employess[i].main_questions['3'];
                    } else if (tablecolumns[j] == "Q 4") {
                        tabCell.innerHTML = employess[i].main_questions['4'];
                    } else if (tablecolumns[j] == "Q 5") {
                        tabCell.innerHTML = employess[i].main_questions['5'];
                    } else if (tablecolumns[j].indexOf("button") > -1) {
                        tabCell.innerHTML = `<button type="button" onclick="downloadResult('${employess[i].clinic_id}', '${employess[i].patient_id}', 'download')" class="btn btn-primary">Download</button>`
                    } else {
                        tabCell.innerHTML = employess[i][tablecolumns[j]];
                    }
        }
    }

    //Final step , append html table to the container div
    var employeedivcontainer = document.getElementById("employeedivcontainer");
    employeedivcontainer.innerHTML = ""; // '<div style="text-align:right; margin-bottom:10px;"><button type="button" onclick="exportToCSV()" class="btn btn-primary">Export All to XLS</button></div>';
    employeedivcontainer.appendChild(tableemployee);
}


function downloadResult(cid, pid, openOrDownload) {
    var options = {
        fontSize: 14,
        margins: {
            left: 10,
            right: 10,
            top: 18,
            bot: 10
        }
    };


    const response = fetch(`/download-results?cid=${cid}&pid=${pid}`)
        .then(response => response.json())
        .then(data => {
            data = data[0]

            if (openOrDownload == 'open') {
                //     Survey
                //     .StylesManager
                //     .applyTheme("defaultV2");

                // window.survey = new Survey.Model(json);

                // survey
                //     .onComplete
                //     .add(function (sender) {


                //     });

                // //   survey.data = JSON.parse(data);
                // //    survey.mode = 'display';

                // $("#surveyElement").Survey({ model: survey });



                // delete data.clinic_id;
                // delete data.patient_id;
                // delete data._id;
                ///   survey.data = data;
                //   survey.mode = 'display';

            } else {

                //json is same as for SurveyJS Library
                var surveyPDF = new SurveyPDF.SurveyPDF(json, options);
                surveyPDF.data = data;
                surveyPDF.haveCommercialLicense = true;
                //uncomment next code to add html and markdown text support
                /*var converter = new showdown.Converter();
                surveyPDF.onTextMarkdown.add(function(survey, options) {
                    var str = converter.makeHtml(options.text);
                    str = str.substring(3);
                    str = str.substring(0, str.length - 4);
                    options.html = str;
                });*/

                surveyPDF.onRenderHeader.add(function (_, canvas) {
                    canvas.drawText({
                        text: `Clinic = ${document.getElementById("clinic_name").value}, Patient Id=${pid}                                airwayassessment.azurewebsites.net`,
                        fontSize: 10
                    });
                });
                surveyPDF.save(`${cid}_${pid}.pdf`);
            }
        });


}

