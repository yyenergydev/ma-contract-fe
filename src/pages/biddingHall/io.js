/* eslint-disable */
// http://127.0.0.1:8084/cpu-bidtrade/bidtrade/getHallInfoByTradeId?tradeid=1
import EventEmitter2 from 'eventemitter2'
import _ from 'lodash'
import uMessage from 'components/message'
import Countdown from 'components/countdown'
import 'components/countdown/countdown.css'
import 'static/vendor/tweenmax'
import './format.js'
//初始化业务事件
const emitter = new EventEmitter2();
var  id = window.global.query('id');
emitter
//大渲染术
.on("render", function(data) {
  //竞价单
    emitter.emit('render.bidtrade',data.bidtrade);
    //规则
    emitter.emit('render.rule',data.bidtradeSetting)
    //排名
    emitter.emit('render.sort',data.bidquotesort)
    //记录
    emitter.emit('render.history',data.bidquotelist)


     //报价单
    emitter.emit('render.bidquote',data.bidquote)

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
     var msg=bidtrde.bidtradeMsg;
   //创建长连接-->http://172.20.14.96:9097/auction.html
    var address = msg.receiveAddress;
    try{
        debugger
        var eb = new EventBus(msg.receiveUrl);
    }catch(err){
        alert("无法连接！");
        //返回 todo
    }
    var myaddress = bidtrde.myself.msgAddress;
    var roomn = 'r' + bidtrde.myself.bidtradeId
    eb.onopen = function() {
//debugger
    //发送在线消息 
     var userid=msg.senderAddress+"."+bidtrde.myself.enterpriseId
     var data11 = {
           "userid" : userid
        }
    eb.send("user.online",data11);

    debugger
    //处理报价消息、延时消息type=2
    eb.registerHandler(address, function(err, {type,body,address}) {
        //根据类型,进行事件分发
        
        debugger
        var {data,type}=body.content;
        if(type==0){
            //触发变动
            emitter.emit('handler.change',data)
        }
        if(type==1){
          var info = '公告:'
          viewModel.message.push({text:data.msg,info:info, sendtime:data.sendtime})
        }
        if(type==2){
            emitter.emit('handler.delaychange',data)
            console.log('yanshi', data)
            uMessage('message', '延时')
        }
    });

    //处理剔除消息 ：提示剔除、冻结报价 type 关闭也走这里类型不同
    eb.registerHandler("kickoff." + myaddress, function(err, {type,body,address}) {
        
        if(body.type=="kickoff"){
            debugger
            alert("您已被踢出！"+body.reason||'');
            viewModel.shouldShowMessage(false);
            //
            // 禁止报价 todo
        }else{
            alert("房间已经被关闭");
            viewModel.shouldShowMessage(false);
            var t = 0
            var d = new Date()
            d.setTime(t)
            var s = d.format('yyyy/MM/dd HH:mm:ss')
            Countdown.init('#timer', s)
        }


    });
   
    // 发送给个人
    eb.registerHandler("msg.receive." + myaddress, function(err, msg) {
      var text = msg.body.content.data.msg
      var info = bidtrde.bidtrade.enterpriseName + '对我说：'
      var sendtime = msg.body.content.data.sendtime
      viewModel.message.push({text:text,info:info, sendtime:sendtime})
    });
    // eb.registerHandler("msg.receive." + address, function(err, {type,body,address}) {
    //     //根据类型,进行事件分发
    //     console.log(type,body,address)
    //     emitter.emit(type,body);
    // });
};

})

setTimeout(function(){
  $.get('/cpu-bidtrade/bidtrade/getHallInfoByTradeId?tradeid='+id)

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
