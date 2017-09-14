/*
 <filesupload
 params="
 callbackDatas:function(){},
 groupname:'bid_commerce',
 id:model.ref('id'),
 childid:子表id(传入时必须确定值,不允许后续再改动)
 index:0",//index 现在的作用其实是页面中的唯一id
 readonly:true //这个不是必须的>

 TODO:存在重复初始化的问题,样式有一点小问题需要fix
 */
/* eslint-disable */
import './filesupload.css'
import webuploader from 'webuploader'
import _ from 'lodash'
import fileservice from './ossfileplugin'
//区分id的prefix
const ID_PREFIX = "uploader_"
//访问附件服务的url
const URL_PREFIX = window.$fileuploadurl
//入口函数
function entry(params) {
  let uploader
  //初始化index 如果在表格行中则传入的是$index  需要获取$index的实际值
  if (params.index) {
    if (typeof(params.index) == "function") {
      params.index = params.groupname + params.index()
    } else {
      params.index = params.groupname + (params.index || 0 )
    }
  } else {
    params.index = params.groupname + 0
  }
  //设置选择的id
  this.domid = ko.observable(ID_PREFIX + params.index)
  this.el = "fileupload_" + params.index||'0'
  this.progresswidth = ko.observable('0%')
  this.filelist = ko.observableArray([])
  this.filesize = params.filesize
  // intable 专属 start
  this.isActive = ko.observable(false)
  this.showmodal =  () => {
    if(this.size() == 0 && params.readonly) {
      return ''
    }
    $(".modalfileupload.active").removeClass('active');
    this.isActive(!(this.isActive()))
  }
  this.chooseText = params.chooseText || "管理附件"
  this.size = ko.computed(function () {
    return this.filelist().length;
  }, this);
  // intable专属 end
  this.readonly = false
  if (params.readonly) {
    this.readonly = true
    setTimeout(()=>{
      $("#fileupload_"+params.index).find(".btns").css("display","none")
    },0)
  }

  let hasQuery = false
  //如果带了prefix表示是主表id
  this.prefix = params.childid? (params.childid() + '') : ''
  if (params.id) {
    // 这段代码必须留着,为了表体行上的附件初始化用的
    setTimeout(function () {
      //如果初始化的时候就有id值
      if (params.id()) {
        uploader = initWebuploader(params.index, initFormData(this.prefix+params.id(), params.groupname), this.filelist, this.progresswidth, params.filesize)
        console.log('query while init:' + this.prefix+params.id() + "hasQuery:"+hasQuery)
        if(this.filelist().length==0){
          queryAllFilelist(params, this.prefix+params.id(), this.filelist)
        }
        //hasQuery = true

      } else { // 初始化
        uploader = initWebuploader(params.index, initFormData('', params.groupname), this.filelist, this.progresswidth, params.filesize)
      }

    }.bind(this),0)

    //因为是异步获取数据所以需要监听
    params.id.subscribe(function (val) {
      if(!hasQuery){
        //初始化webuploader
        uploader = initWebuploader(params.index, initFormData(this.prefix+val, params.groupname), this.filelist, this.progresswidth, params.filesize)
      }
      //如果值不为空且没有查询过,则认为是第一次进入并查询
      //如果值不为空且已经查询过,则认为是回写id
      //如果值为空则表示不需要查询已经上传过的文件
      console.log("query while subscribe:"+val + "hasQuery:"+hasQuery)
      if (val) {
        //监听到有数据先判断当前有没有附件列表,没有则查询,有则修改
        if(this.filelist().length == 0){
          //查询出所有的附件列表
          queryAllFilelist(params, this.prefix+val, this.filelist)
        }
        else {
          //更新附件id
          updateFilelist(params, this.prefix+val, this.filelist)
        }
      }
      hasQuery = true;
    }.bind(this))
  }

  //确认上传
  this.uploadfile = function(data,event){
    uploader.upload()
  };
  //下载
  this.download = function(_data, event){
    let url = _data.url
    if(_.startsWith(url,"http")){

      window.open(_.split(url,'?',1)[0],"下载","");
    }else{
      window.open("//"+url,"下载","");
    }
  }
  this.delete = (data, event) => {
    if(confirm("确定要删除附件吗？")){
      //如果还没有上传 直接删除
      if (data.id&& data.id.indexOf('WU_FILE_')>=0) {
        deleteFilelistById(data.id, this.filelist)
      }
      else {
        delteFile({id:data.id},() => {
          deleteFilelistById(data.id, this.filelist)
           if(params.filesize){
              params.filesize(this.filelist().length)
            }
        })
      }
    }
  }
}
function deleteFilelistById(id,filelist){
  let index
  _.forEach(filelist(), (item,_index)=>{
    if(item.id == id){
      index= _index
    }
  })
  if(index >= 0){
    filelist.splice(index,1)
  }
}
//only need params.id and crossfile
function delteFile(params, callback) {
  let par = {
    id: params.id,
    cross_url: URL_PREFIX
  }
  fileservice.deletefile(par, (data) => {
    if(data.status == 1){
      callback()
    }
  })
}
//更新附件filepath
function updateFilelist (params, val, filelist) {
  for(var i=0;i<filelist().length; i++){
    //如果filepath一样那就不用更新了
    if(filelist()[i].filepath!=params.groupname+val){
      var par = {
        cross_url: URL_PREFIX,
        id : filelist()[i].fileid,
        filepath :params.groupname+val ,
        groupname : params.groupname
      };
      fileservice.update(par,function(data){
        if(data.status ==1){
          console.log("update success!");
        } else {
          console.log("update fail!"+data)
        }
      });
    }
  }
}
function queryTenantIdByEnterpriseId(enterpriseId){
  var enterpriseMapList = window.mapTenantId;
  if (enterpriseMapList && enterpriseMapList[enterpriseId]) {
    return enterpriseMapList[enterpriseId]
  } else {
    var tenantid =  JSON.parse($.ajax({
      url: "/cpu-basedocrefer/enterprise/getById?id="+enterpriseId,
      type: "get",
      async: false
    }).responseText).tenantid;

    if(!enterpriseMapList){
      enterpriseMapList = {}
    }
    enterpriseMapList[enterpriseId] = tenantid;
    window.mapTenantId = enterpriseMapList;
    return tenantid;
  }


}
//查询所有已上传附件
function queryAllFilelist (params, val, filelist_ko) {
  var tenantId = getCookieValue('tenantid')
  // 判断是否查询其他租户下的附件
  if(params.enterpriseId&&params.enterpriseId()){
    tenantId=queryTenantIdByEnterpriseId(params.enterpriseId())
  }
  let par = {
    cross_url: URL_PREFIX,
    filepath: params.groupname + val,
    groupname: params.groupname,
    tenant: tenantId
  }
  fileservice.query(par, function (response) {
    //清空列表
    filelist_ko([])
    if (response.status == 1) {
      _.forEach(response.data, function(data){
        let item = {
          name: data.filename,
          filepath: data.filepath,
          filesize: data.filesize,
          groupname: data.groupname,
          fileid: data.id,
          id: data.id,
          url: data.url,
          imgtype: getfileimgcls(data.filename),
          type: ""
        }
        filelist_ko.push(item)
      })
    }
    if (params.filesize) {
      params.filesize(filelist_ko().length)
    }
  })
}

//获取上传附件图片的类型
function getfileimgcls (name) {
  let result
  result = judgeFileTpe(name, ['.png', '.jpg', '.gif', '.jpeg', '.tif'], 'image')
  if(!result)
    result = judgeFileTpe(name, ['.doc', '.docx'], 'doc')
  if(!result)
    result = judgeFileTpe(name, ['.xls', '.xlsx'], 'xls')
  if(!result)
    result = judgeFileTpe(name, ['.ppt', '.pptx'], 'ppt')
  if(!result)
    result = judgeFileTpe(name, ['.txt'], 'txt')
  if(!result)
    result = judgeFileTpe(name, ['.zip','.rar'], 'zip')
  if(!result)
    result = 'link'
  return 'fileicon-' + result
}
//将扩展名与文件类型比较
function judgeFileTpe(name, array, type){
  let result = '';
  _.forEach(array,function(item){
    if (_.endsWith(_.toLower(name), item)) {
      result = type
    }
  })
  return result;
}
//生成待提交的formData
function initFormData (filepath, groupname = 'default', thumbnail = '') {
  let formData = {
    filepath: groupname + ((filepath&&filepath!='null')?filepath:(new Date())),   //【必填】单据相关的唯一标示，一般包含单据ID，如果有多个附件的时候由业务自己制定规则
    groupname: groupname,//【必填】分組名称,未来会提供树节点
    permission: 'read', //【选填】 read是可读=公有     private=私有     当这个参数不传的时候会默认private
    url: true,          //【选填】是否返回附件的连接地址，并且会存储到数据库
    thumbnail :  thumbnail,//【选填】缩略图--可调节大小，和url参数配合使用，不会存储到数据库
    isencrypt: false,  //【选填】文件加密，若是设置为true，则会对文件进行加密后上传，下载需解密
    tenantid: getCookieValue('tenantid')
    //cross_url : "http://localhost:8081/iuap-saas-fileservice-base/" //【选填】跨iuap-saas-fileservice-base 时候必填
  }
  return formData
}
//获取cookie
function getCookieValue(cookieName)
{
  var cookieValue = document.cookie;
  var cookieStartAt = cookieValue.indexOf(""+cookieName+"=");
  if(cookieStartAt==-1)
  {
    cookieStartAt = cookieValue.indexOf(cookieName+"=");
  }
  if(cookieStartAt==-1)
  {
    cookieValue = null;
  }
  else
  {
    cookieStartAt = cookieValue.indexOf("=",cookieStartAt)+1;
    var cookieEndAt = cookieValue.indexOf(";",cookieStartAt);
    if(cookieEndAt==-1)
    {
      cookieEndAt = cookieValue.length;
    }
    cookieValue = unescape(cookieValue.substring(cookieStartAt,cookieEndAt));//解码latin-1
  }
  return cookieValue;
}
//初始化webuploader
function initWebuploader (index, formData, filelist, progresswidth_ko, filesize) {
  let uploader = webuploader.create({
    // swf文件路径,使用baidu的cdn
    swf: '/yuncai/js/vendor/webuploader/Uploader.swf',
    formData: formData,
    // 文件接收服务端。
    server: URL_PREFIX + 'file/upload',

    fileSizeLimit: 20*2024*1024,//限制大小20M，所有被选文件，超出选择不上

    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: "#" + ID_PREFIX + index,

    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
    resize: false
  })
  // ie9 flash上传的时候默认使用accept: text/html,但服务端返回的是json/application
  uploader.on('uploadBeforeSend', function (obj, data, headers) {
    $.extend(headers, {
      Accept: "*/*"
    })
  })
  //监听附件上传事件
  uploader.on( 'fileQueued', function( file ) {
    file.imgtype = getfileimgcls(file.name)
    file.type = '等待上传'
    filelist.push(file)
    if (filesize) {
      filesize(filelist().length)
    }
    uploader.upload()
  })
  uploader.on( 'uploadStart', function(file) {
    $( '#'+file.id ).find(".progress").addClass('active')
  })
  //监听上传事件 进度条
  uploader.on( 'uploadProgress', function( file, percentage ) {
    progresswidth_ko(percentage * 100 + '%')
  });
  //上传成功后事件
  uploader.on( 'uploadSuccess', function( file ,response) {
    if(response.status == 1){
      $( '#'+file.id ).find('p.state').text('已上传');
      //原来filelist中存的是webupload的id,需要改成response返回的id
      _.forEach(filelist(), function(item) {
        if (item.id == file.id) {
          let _data = response.data[0]
          item.fileid = _data.id
          item.filepath = _data.filepath
          item.groupname = _data.groupname
          item.url = _data.url
          item.filename = _data.filename
        }
      })
    }else{
      $( '#'+file.id ).find('p.state').text(response.message);
      $( '#'+file.id ).find('.nouploaded').removeClass('nouploaded');
    }
  });
  //上传失败后事件
  uploader.on( 'uploadError', function( file ) {
    $( '#'+file.id ).find('p.state').text('上传出错');
  });
  //上传完毕事件
  uploader.on( 'uploadComplete', function( file ) {
    $( '#'+file.id ).find('.progress').fadeOut();
  });
  return uploader
}
export default entry;
/* eslint-disable */
