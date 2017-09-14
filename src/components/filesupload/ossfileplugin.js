/*
query,
download,
 deletefile,
 url,
 replace,
 update,
 oss_upload,
 stream_upload
*/
/* eslint-disable */
var fileService = {

  query : function (parameter,callback) {
    var path = "file/query";
    if(parameter.cross_url != undefined){
      path = parameter.cross_url + path
    }
    $.ajax({
      type : "GET",
      url : path,
      dataType : "json",
      data : {
        filepath: parameter.filepath,//[必输][单据相关的唯一标示，一般包含单据ID，如果有多个附件的时候由业务自己制定规则]
        groupname: parameter.groupname, //[不必输][分組名称,未来会提供树节点]
        tenant: parameter.tenant //[附件所属的租户Id，若不传，取环境变量中的默认租户Id]
      },
      success : function(data, status) {
        callback(data);
      },
      error : function(data, status){
        callback(status)

      }
    });
  },
  //下载方法的实现
  download : function (parameter,callback) {
    var path = "file/download";
    if(parameter.cross_url != undefined){
      path = parameter.cross_url + path
    }
    $.ajax({
      type : "GET",
      url : path,
      contentType : "application/json",
      dataType : "json",
      data : {
        id:parameter.id,
        permission: parameter.permission,
        stream: true
      },
      success : function(data, status) {
        callback(data);
      },
      error : function(data, status){
        callback(status)

      }
    });
  },
  //删除方法的实现
  deletefile : function (parameter,callback) {
    var path = "file/delete";
    if(parameter.cross_url != undefined){
      path = parameter.cross_url + path
    }
    $.ajax({
      url : path,
      data : {
        //附件信息表的id uap_filesystem表
        id : parameter.id
      },
      dataType : "json",
      success : function(data, status) {
        callback(data);
      },
      error : function(data, status){
        callback(status)

      }
    });
  },
  //获得url地址方法的实现
  url : function (parameter,callback) {
    var path = "file/url";
    if(parameter.cross_url != undefined){
      path = parameter.cross_url + path
    }
    $.ajax({
      url : path,
      type : "GET",
      dataType : "json",
      data : {
        ids : parameter.ids,
        thumbnail : parameter.thumbnail
      },
      success : function(data, status) {
        callback(data);
      },
      error : function(data, status){
        callback(status)

      }
    });
  },
  //替换上传附件方法
  replace : function (parameter,callback) {
    var path = "file/replace";
    if(parameter.cross_url != undefined){
      path = parameter.cross_url + path
    }
    $.ajaxFileUpload({
      url : path,
      fileElementId : parameter.fileElementId,
      type : 'post',
      dataType : 'json',
      data : {
        id : parameter.id,
        filepath:parameter.filepath,
        groupname: parameter.groupname, //分組
        url:parameter.url,  //是否返回附件的连接地址
        permission : parameter.permission, //私有   read是可读
        thumbnail : parameter.thumbnail,
        isencrypt :( parameter.isencrypt == undefined || parameter.isencrypt == false) ? false : true,//是否加密
      },
      success : function(data, status) //服务器成功响应处理函数
      {
        callback(data);
      },
      error : function(data, status) //服务器成功响应处理函数
      {
        callback(status);
      }
    });
  },
  //更新方法实现
  update : function (parameter,callback) {
    var path = "file/update";
    if(parameter.cross_url != undefined){
      path = parameter.cross_url + path
    }
    $.ajax({
      type : "post",
      url : path,
      data : {
        id : parameter.id,
        filepath : parameter.filepath,
        groupname :parameter.groupname
      },
      dataType : "json",
      success : function(data, status) {
        callback(data);
      },
      error : function(data, status){
        callback(status)

      }
    });
  },

  //直传方法实现
  oss_upload : function (parameter,callback) {
    //加载直传js
    var path = "file/oss";//controller 访问地址
    if(parameter.cross_url!= undefined){//跨域地址处理
      path = parameter.cross_url+ path
    }
    parameter.tenantid = getcookie("tenantid");
    parameter.sysid = getcookie("sysid");
    parameter.userid = getcookie("userid");
    parameter.path = path; //添加路径信息
    oss_upload_entrance(parameter,callback);//oss直传入口调用
  },

  //支持所有控件的流式上传
  stream_upload : function (parameter,par,callback) {
    var path = "file/upload";//controller 访问地址
    if(par.cross_url!= undefined){//跨域地址处理
      path = par.cross_url+ path
    }
    $.ajax({
      url : path,
      type : 'POST',
      data : parameter,
      dataType : 'json', //返回值类型 一般设置为json
      contentType : false, //必须
      processData : false, //必须
      success : function(data) {
        callback(data);
      },
      error : function(returndata) {
        callback("{'erroe' : '流式上传错误'}");
      }
    });

  },



  /**
   * 获得cookie
   * @auth zzz
   * @param cookieName
   * @returns {String}
   */
  // 接口中不存在的静态方法 interface_file.getcookie() 可直接调用
  getcookie : function(cookieName) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for(var i = 0; i < arrCookie.length; i++){
      var arr = arrCookie[i].split("=");
      if(cookieName == arr[0]){
        return arr[1];
      }
    }
    return "";
  }
}
export default fileService
/* eslint-disable */
