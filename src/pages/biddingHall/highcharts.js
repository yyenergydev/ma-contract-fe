import Highcharts from 'highcharts'
import emitter from './io'

/* eslint-disable */

//1、修改highcharts
emitter.on('render.highchart',function(data){
  //var self=$('#chart').highcharts();
  var series1 = highchart.series[0];
 /* var x, y
  x = data.bidTime;
  y = data.latestPrice;*/
  //series1.addPoint([x, y], false, false)
  //debugger
  series1.addPoint({x:data.bidTime,y: data.latestPrice,supplyName:data.supplyName}, false, false);
  highchart.redraw()
})

//2、初始化x轴、charts数据加载
.on('render.chartinit',function(data,_max,_min){

  //初始化x轴
  Highcharts.setOptions({ global: { useUTC: false } });   
  window.highchart = new Highcharts.Chart({
  credits: {
    enabled: false
  },
  chart: {
    renderTo: 'chart',
    height: 300,
    type: 'spline',
    animation: Highcharts.svg,
    marginRight: 10,
    events: {
      load: function () {
      }
    }
  },
  title: {
    text: '报价信息总览'
  },
  plotOptions: {
    spline : {
        dataLabels: {
            enabled: true
        }
    }
  },
  xAxis: {
    type: 'datetime',
    //tickPixelInterval: 150,
    dateTimeLabelFormats:{
          millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%m-%d',
            week: '%m-%d',
            month: '%Y-%m',
            year: '%Y'
    },
    min:_min,//1490859300000
    max:_max,//_min 1490861100000
    tickInterval: (_max-_min)/5
  },
  yAxis: {
    title: {
      text: '价格'
    },
    plotLines: [{
      value: 0,
      width: 1,
      color: '#808080'
    }]
  },
  
  tooltip: {
    formatter: function () {
      //debugger
      return '<b>' + this.point.options.supplyName + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 2)
    }
  },
  legend: {
    enabled: false
  },
  exporting: {
    enabled: false
  },
  series: [{
    name: '报价信息总览',
    data: []
  }]
})
  //视图模型加载数据
  var series1 = highchart.series[0];
  _.each(data,function(v){
       series1.addPoint({x:v.x,y: v.y,supplyName:v.supplyName}, false, false);

    })
  highchart.redraw();
  //series1.setData(data)
})
 
 

