/* eslint-disable */
// 数据模型io
import EventEmitter2 from 'eventemitter2'
import _ from 'lodash'
import Countdown from 'components/countdown'
import 'components/countdown/countdown.css'
import 'static/vendor/tweenmax'
import './format.js'
import uMessage from 'components/message'
/* global _ */
//初始化业务事件
const emitter = new EventEmitter2();
var  id = window.global.query('id');
emitter
//大渲染术
.on("render", function(data) {
    emitter.emit('render.registers',data.registers);
    //竞价单
    emitter.emit('render.bidtrade',data.bidtrade);
    //规则
    emitter.emit('render.rule',data.bidtradeSetting)
    //供应商
    emitter.emit('render.supply',data.inBidquotelist)
    emitter.emit('render.outsupply',data.outBidquotelist)
    //排名
    emitter.emit('render.sort',data.bidquotesort)
    //记录
    emitter.emit('render.history',data.bidquotelist)
    //chart图
    var d=_.map(data.bidquotelist,function(v){
        return {
            x:v.bidTime,
            y:v.latestPrice,
            supplyName:v.supplyName
        }
    })

    emitter.emit('render.chartinit',d,data.bidtradeSetting.bidEndTime,data.bidtradeSetting.bidStartTime);
})

.on("websoket", function(bidtrde) {
  //debugger
    var msg=bidtrde.bidtradeMsg;
   //创建长连接-->http://172.20.14.96:9097/auction.html
    var address = msg.receiveAddress;
    var eb = new EventBus(msg.receiveUrl);
    var msgaddress = msg.msgAddress
    var roomn = 'r' + msg.bidtradeId
    eb.onopen = function() {

    //发送在线消息
     var userid=msg.senderId
     var data11 = {
           "userid" : userid
        }
    eb.send("user.online",data11);

    eb.registerHandler(address, function(err, {type,body,address}) {
      debugger
        //根据类型,进行事件分发
        var {data,type}=body.content;
        if(type==0){
            //触发变动
            debugger
            emitter.emit('handler.change',data)
            console.log('yusn', data)
        }
        if(type==2){
           emitter.emit('handler.delaychange',data)
            console.log('zidongyanshi', data)
           
        }
    });
    // 监控成员在线状态
    eb.registerHandler("members.state." + msgaddress, function(err, msg) {
          if (msg.body.state == 'online') {
            msg.body.state = '在线'
          }
          if (msg.body.state == 'offline') {
              msg.body.state = '离线'
          }
          var names = _.find(bidtrde.registers,function (o) {
            return o.enterpriseId == msg.body.originid
          })
          if(names){
            var name = names.enterpriseName
            uMessage('message', name + msg.body.state)
          }
         bidtrde.inBidquotelist.map(function(v){
          if(v.supplyId==msg.body.originid){
            v.isquote = msg.body.state
          }
        })
        emitter.emit('render.supply')
    });
    
    // 发送给个人
    eb.registerHandler("msg.receive." + msgaddress, function(err, msg) {
      var text = msg.body.content.data.msg
      var senderid = msg.body.content.data.senderid
      var receivers = _.find(bidtrde.registers, function (item) {
        return item.enterpriseId == senderid
      })
      var receiver = receivers.enterpriseName
      var info = receiver + '对我说：'
      var sendtime = msg.body.content.data.sendtime
      viewModel.message.push({text:text, info:info, sendtime:sendtime})
    });
    //监控是订阅在线状态，剔除是竞价大厅监听这个消息
    /*eb.registerHandler("kickoff." + address, function(err, msg) {

    });*/

    // eb.registerHandler("msg.receive." + address, function(err, {type,body,address}) {
    //     //根据类型,进行事件分发
    //     console.log(type,body,address)
    //     emitter.emit(type,body);
    // });
};

})


//var  id=1;
setTimeout(function(){
  $.get('/cpu-bidtrade/bidtrade/getHallInfoByTradeId4sup?tradeid='+id)
  .then(function(tpl){
        var {data,status}=JSON.parse(tpl);

        if(status==1){
            emitter.emit('handler.init',data);
            emitter.emit('websoket',data);
        }else{
            console.error('初始化错误')
        }

  })
})
export default emitter;
/* eslint-disable */
