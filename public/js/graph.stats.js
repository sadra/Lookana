/**
 * Created by sadra on 2/13/18.
 */


// Build the chart

let HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        let anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.response);
        };

        anHttpRequest.open( "GET", aUrl, true );
        anHttpRequest.send( null );
    }
};

let client = new HttpClient();
client.get('/stats', function(response) {
    drawCharts(JSON.parse(response));
});


function drawCharts(stats){

    let users = stats.users;

    //User characteristics section

    Highcharts.chart('gender', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Users Gender'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Gender',
            colorByPoint: true,
            data: [{
                name: 'Male',
                y: users.gender.male.total
            }, {
                name: 'Female',
                y: users.gender.female.total,
                sliced: true,
                selected: true
            }]
        }]
    });

    Highcharts.chart('mood', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Users Mood'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Gender',
            colorByPoint: true,
            data: [
                {
                    name: 'Happy',
                    y: users.mood.happy.total
                },
                {
                    name: 'Sad',
                    y: users.mood.sad.total
                },
                {
                    name: 'Angry',
                    y: users.mood.angry.total
                },
                {
                    name: 'Surprised',
                    y: users.mood.surprised.total
                },
                {
                    name: 'Scared',
                    y: users.mood.scared.total
                },
                {
                    name: 'Neutral',
                    y: users.mood.neutral.total
                },
                {
                    name: 'Disgusted',
                    y: users.mood.disgusted.total
                },
            ]
        }]
    });

    let keys = Object.keys(users.age);
    let ages = []; let maleAges =[]; let femaleAges =[];
    for(let i=0;i<keys.length;i++){
        ages.push(keys[i]);
        maleAges.push(users.age[keys[i]].gender.male);
        femaleAges.push(-users.age[keys[i]].gender.female);
    }

    Highcharts.chart('age', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Ages Population'
        },
        subtitle: {
            text: 'There is '+users.total+' users.'
        },
        xAxis: [{
            categories: ages,
            reversed: false,
            labels: {
                step: 1
            }
        }, { // mirror axis on right side
            opposite: true,
            reversed: false,
            categories: ages,
            linkedTo: 0,
            labels: {
                step: 1
            }
        }],
        yAxis: {
            title: {
                text: null
            },
            labels: {
                formatter: function () {
                    return Math.abs(this.value) + '%';
                }
            }
        },

        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                    'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
            }
        },

        series: [{
            name: 'Male',
            data: maleAges
        }, {
            name: 'Female',
            data: femaleAges
        }]
    });



    //Recommend Compare

    let recommendCompare = stats.compare;
    Highcharts.chart('compare-recommends', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Recommends Compare'
        },
        subtitle: {
            text: 'Compare between accepted and denied recommends' + "\n" +
                'The lookana recommended '+recommendCompare.total+' cases, with ' +
                recommendCompare.accepted_places.total + ' accepted and, ' +
                recommendCompare.denied_places.total + ' denied.'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Recommends',
            colorByPoint: true,
            data: [
                {
                    name: 'Accepted Recommends',
                    y: recommendCompare.accepted_places.total
                }, {
                    name: 'Denied Recommend',
                    y: recommendCompare.denied_places.total,
                    sliced: true,
                    selected: true
                }
            ]
        }]
    });


    let acceptedRecommends = stats.accepted_places;
    Highcharts.chart('accepted-recommends-compare', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Accepted Recommends Compare'
        },
        subtitle: {
            text: 'The lookana recommended '+acceptedRecommends.compare.total+' cases that accepted, with ' +
            acceptedRecommends.compare.context_aware.total + ' context-aware and, ' +
            acceptedRecommends.compare.regular.total + ' regular recommends.'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Recommends',
            colorByPoint: true,
            data: [
                {
                    name: 'Context-Aware Recommends',
                    y: acceptedRecommends.compare.context_aware.total
                }, {
                    name: 'Regular Recommend',
                    y: acceptedRecommends.compare.regular.total,
                    sliced: true,
                    selected: true
                }
            ]
        }]
    });

    Highcharts.chart('accepted-recommends-details', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Accepted Context-aware vs. Regular'
        },
        subtitle: {
            text: 'The lookana recommended '+acceptedRecommends.compare.total+' cases that accepted, with ' +
            acceptedRecommends.compare.context_aware.total + ' context-aware and, ' +
            acceptedRecommends.compare.regular.total + ' regular recommends.'
        },
        xAxis: {
            categories: ['Context-Aware Recommend', 'Regular Recommend']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total of accepted recommends'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'First Recommend',
            data: [
                acceptedRecommends.context_awareness_recommends.first_recommend.total,
                acceptedRecommends.regular_recommends.first_recommend.total
            ]
        }, {
            name: 'Second Recommend',
            data: [
                acceptedRecommends.context_awareness_recommends.second_recommend.total,
                acceptedRecommends.regular_recommends.second_recommend.total
            ]
        }, {
            name: 'Third Recommend',
            data: [
                acceptedRecommends.context_awareness_recommends.third_recommend.total,
                acceptedRecommends.regular_recommends.third_recommend.total
            ]
        }, {
            name: 'Other Steps',
            data: [
                acceptedRecommends.context_awareness_recommends.other_rates_recommend.total,
                acceptedRecommends.regular_recommends.other_rates_recommend.total
            ]
        }]
    });


    let deniedRecommends = stats.denied_places;
    Highcharts.chart('denied-recommends-compare', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Denied Recommends Compare'
        },
        subtitle: {
            text: 'The lookana recommended '+deniedRecommends.compare.total+' cases that denied, with ' +
            deniedRecommends.compare.context_aware.total + ' context-aware and, ' +
            deniedRecommends.compare.regular.total + ' regular recommends.'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Recommends',
            colorByPoint: true,
            data: [
                {
                    name: 'Context-Aware Recommends',
                    y: deniedRecommends.compare.context_aware.total
                }, {
                    name: 'Regular Recommend',
                    y: deniedRecommends.compare.regular.total,
                    sliced: true,
                    selected: true
                }
            ]
        }]
    });

    Highcharts.chart('denied-recommends-details', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Denied Context-aware vs. Regular'
        },
        subtitle: {
            text: 'The lookana recommended '+deniedRecommends.compare.total+' cases that denied, with ' +
            deniedRecommends.compare.context_aware.total + ' context-aware and, ' +
            deniedRecommends.compare.regular.total + ' regular recommends.'
        },
        xAxis: {
            categories: ['Context-Aware Recommend', 'Regular Recommend']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total of denied recommends'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'First Recommend',
            data: [
                deniedRecommends.context_awareness_recommends.first_recommend.total,
                deniedRecommends.regular_recommends.first_recommend.total
            ]
        }, {
            name: 'Second Recommend',
            data: [
                deniedRecommends.context_awareness_recommends.second_recommend.total,
                deniedRecommends.regular_recommends.second_recommend.total
            ]
        }, {
            name: 'Third Recommend',
            data: [
                deniedRecommends.context_awareness_recommends.third_recommend.total,
                deniedRecommends.regular_recommends.third_recommend.total
            ]
        }, {
            name: 'Other Steps',
            data: [
                deniedRecommends.context_awareness_recommends.other_rates_recommend.total,
                deniedRecommends.regular_recommends.other_rates_recommend.total
            ]
        }]
    });


    let recommendsTimeLine = stats.recommends_time_line;
    Highcharts.chart('usage-timeline', {

        title: {
            text: 'For 1-'+recommendsTimeLine.today.day+' '+recommendsTimeLine.today.month
        },

        yAxis: {
            title: {
                text: 'Number of Recommends'
            }
        },
        xAxis: {
            title: {
                text: recommendsTimeLine.today.month+" Days"
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: true
                },
                pointStart: 1
            }
        },

        series: [
            {
                name: 'Accepted Regular',
                data: recommendsTimeLine.accepted.regular
            }, {
                name: 'Accepted ContextAware',
                data: recommendsTimeLine.accepted.context_aware
            },{
                name: 'Denied Regular',
                data: recommendsTimeLine.denied.regular
            }, {
                name: 'Denied ContextAware',
                data: recommendsTimeLine.denied.context_aware
            }
        ],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });

}