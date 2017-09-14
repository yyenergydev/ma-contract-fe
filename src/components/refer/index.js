/**
 * 统一参照组件
 * @constructor
 * @params {string} type --  对应参照的类型,用于区别参照
 * @params {string} value -- 实际对应的value ko属性
 * @params {string} showtext -- 实际对应的text ko属性
 * @param {string} type -- person,org,
 * @param {string} esurl -- 对应搜索引擎的查询url,默认get方法,默认返回数据为[{ name: 'xxx', value: 'yyy'}]格式.
 * @params {array} extraPorp -- 额外属性:如[id, enterpriseid] 则默认返回数据为[{{ name: 'xxx', value: 'yyy', id: 12, enterpriseid: 23}}]
 * @param {number} delay - 查询延时,默认用_.debounce 来实现.default 200
 * @param {string} placeholder - default '请输入内容'
 * @param {function} onselect - 默认搜搜选中事件 把选中的数据{name:'',value:''}返回.default $.noop
 * @param {function} onmore
 * latest: zhangmyh 2017-3-30 2:14 PM
 */
import { debounce, map } from 'lodash'
import { Get } from 'common'
import __searchlist from './searchlist'
/* global ko $ */

let _searchlist = __searchlist

function init ({type, searchlist, delay = 300, showtext, value, showSearch = true, placeholder = '请输入要查询的内容', showrefer = function () { }, onselect = function () {}}) {
  let defaultValue = ''
  // 初始化
  if (searchlist) {
    _searchlist = searchlist
  }
  this.showsearch = !!(showSearch && _searchlist[type])
  this.loadingtext = ko.observable('暂无数据')
  // 选中显示值
  this.showtext = showtext
  // 实际id
  this.value = value
  // 输入提示
  this.placeholder = placeholder
  // 输入框中查询key
  this.queryvalue = ko.observable()
  // 查询返回的列表
  this.searchlist = ko.observableArray([])
  // 高级搜索点击
  this.showrefer = function () {
    showrefer(this.value())
  }.bind(this)
  // 搜索项点击
  this.handleclick = function (item, event) {
    this.showtext(item.name)
    this.value(item.id)
    onselect(item)
    // 已选择后用于隐藏选择框 并把对应查询框的值设置好
    let target = $(event.target).parents('.search-form')
    target.addClass('hidden')
    setTimeout(function () {
      target.removeClass('hidden')
    }, 200)
    this.queryvalue(item.name)
  }.bind(this)
  // 清空输入
  this.reset = function () {
    this.queryvalue('')
  }.bind(this)
  this.showtext.subscribe(function (val) {
    if (val) {
      this.queryvalue(val)
    }
  }.bind(this))
  // 鼠标移入输入框事件
  this.mouseover = function (item, event) {
    event.target.focus()
  }
  // 输入改变事件
  this.queryvalue.subscribe(debounce(function (val) {
    if (val && defaultValue) {
      this.loadingtext('loading')
      querybykey(this.queryvalue)
    } else {
      defaultValue = val !== '' ? val : defaultValue
      this.loadingtext('暂无数据')
      this.searchlist([])
    }
  }.bind(this), delay))
  var that = this
  function querybykey (key) {
    if (type === 'supplydoc') {
      Get(_searchlist[type].url, {keyword: key()}).then(
        function (response) {
          if (response.success === true) {
            let data = map(response.result.data, function (item) {
              return {
                id: item.id,
                name: item.name
              }
            })
            that.searchlist(data)
            if (data.length === 0) {
              that.loadingtext('暂无数据')
            }
          } else {
            that.loadingtext('暂无数据')
          }
        },
        function () {
          that.loadingtext('暂无数据')
        })
    } else {
      $.ajax({
        url: _searchlist[type].url,
        type: 'post',
        data: JSON.stringify({
          query: key()
        }),
        dataType: 'json',
        contentType: 'application/json',
        success (response) {
          if (response.status === 1) {
            let data = map(response.data, function (item) {
              return {
                id: item.id,
                name: item.name
              }
            })
            that.searchlist(data)
            if (data.length === 0) {
              that.loadingtext('暂无数据')
            }
          } else {
            that.loadingtext('暂无数据')
          }
        },
        error (response) {
          that.loadingtext('暂无数据')
        }
      })
    }
  }
}

export default init
