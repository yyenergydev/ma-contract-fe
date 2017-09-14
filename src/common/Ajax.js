let $ = window.$
function getUrl (url, query) {
  if (!query) {
    return url
  }
  url = url.replace(/:[^/.]*/g, function (val) {
    return query[val.slice(1)] || ''
  })
  console.log('Common/Ajax.js:url:' + url)
  return url
}

export function Get (url, data) {
  return $.ajax({
    url: getUrl(url, data),
    method: 'get',
    data: data,
    dataType: 'json',
    contentType: 'application/json'
  })
}

export function Post (url, data) {
  return $.ajax({
    url: getUrl(url, data),
    method: 'post',
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json'
  })
}

export function Put (url, data) {
  return $.ajax({
    url: getUrl(url, data),
    method: 'put',
    data: data,
    dataType: 'json',
    contentType: 'application/json'
  })
}

export function Delete (url, data) {
  return $.ajax({
    url: getUrl(url, data),
    method: 'delete',
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json'
  })
}
