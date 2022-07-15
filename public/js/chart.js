
const patId = localStorage.getItem("patient-app-id")
$(() => {

    plotChart(patId)


})

function cmdPlot() {
    plotChart(patId)
}

function createChart(data) {
  const chartOption = {
        chart: {
            type: 'spline',
            marginTop: 70
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            categories: [1609394399999, 1609480799999, 1609912799999, 1609912800000, 1609999200000, 1610171999999, 1610344799999, 1610431199999, 1610517599999, 1610603999999, 1610690399999,
                1610776799999, 1610863199999, 1610949599999, 1611035999999, 1611122399999, 1611295199999, 1611295200000, 1611467999999, 1611554399999, 1611640799999, 1611727199999, 1611813599999,
                1611899999999, 1612072799999, 1612245599999, 1612418399999, 1612504799999, 1612591199999, 1612677599999, 1612677600000, 1612850399999, 1612936799999, 1613023199999, 1613282399999,
                1613368799999, 1613627999999, 1613714399999, 1613887199999, 1613973599999, 1614059999999, 1614146399999, 1614319199999, 1614405599999, 1614491999999, 1614578399999, 1614664799999,
                1614751199999, 1614837599999, 1614923999999, 1615010399999, 1615096799999, 1615183199999, 1615269599999, 1615355999999, 1615442399999, 1615784399999, 1615870799999, 1615957200000, 1616043600000],
            labels: {
                format: '{value:%m-%d-%y}'
                , rotation: 90
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                formatter: function () {
                    return this.value + '°';
                }
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {

            }
        },
        series: [{
            name: 'SQI',
            data: data

        }]
    }



   chart =  new Highcharts.chart('chart', chartOption,  function (chart) {
   })


}

function plotChart(patId) {

    let i = 0, patDataObj = {};
    //if (sleepData[patId] == null) return;
  
    var axisDataChart = [];
  
    const axisName = document.getElementById("axisName").value
      // let axisName = String($("#btnAxis-" + i ).html()).trim();
     // let axisName = String($("#btnAxis-" + i).val()).trim();
  
        patDataObj = patDataArray(patId, axisName);
        axisDataChart.push(patDataObj.dataArray);
  
  //  $("#information").html("<b>Excluded records :</b> " + patDataObj.excluded + " records have recording times < " + $("#recTime").val());
  
    createChart(axisDataChart[0]);
  }
  
  function patDataArray(whichPat, whichAxis) {
    let i = 0, excluded = 0, dataArr = [];
    let patRecordArray = sleepData[whichPat];
    if (patRecordArray == null)
      return { "dataArray": [], "excluded": excluded };
  
    if (whichAxis == 'pAHI' || whichAxis == 'pUsage') {

    } else {
  
      for (i = 0; i < patRecordArray.length; i++) {
        if (patRecordArray[i].Recording_Time < Number($("#recTime").val())) {
          excluded++;
          if (whichAxis == "Recording_Time") dataArr.push([patRecordArray[i].Plot_Date, patRecordArray[i]["Recording_Time"]]);
        } else {
          dataArr.push([patRecordArray[i].Plot_Date, patRecordArray[i][whichAxis]]);
        }
      }
    }
  
    return { "dataArray": dataArr, "excluded": excluded };
  }
  