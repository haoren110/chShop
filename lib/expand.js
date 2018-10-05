/**
 * Created by Administrator on 2017/5/24 0024.
 */
function getDom(selecter) {
    return document.querySelector(selecter);
}

function getDoms(selecter) {
    var nodeList = document.querySelectorAll(selecter);
    var ary = [];
    try {
        return ary.slice.call(nodeList, 0);
    } catch (e) {
        for (var i = 0, len = nodeList.length; i < len; i++) {
            ary.push(nodeList[i]);
        }
        return ary;
    }
}

function addClick(dom, fn) {
    dom.addEventListener('tap', function (e) {
        if (!!e.target.timestamp && new Date().getTime() - e.target.timestamp < 200) {
            console.info('太快了！');
            return false;
        }
        e.target.timestamp = new Date().getTime();
        !!fn && fn.call(this, e);
    });
}
//获取url的参数
function searchUrl(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

function createDom(tag) {
    return document.createElement(tag);
}

function removeDom(dom) {
    !!dom && !!dom.parentNode && dom.parentNode.removeChild(dom);
}

//格式化价格
function formatPrice(price) {
    var newStr = '', count = 0, i = 0;
    price = price + '';
    if (price.indexOf('.') == -1) {
        for (i = price.length - 1; i >= 0; i--) {
            if (count % 3 == 0 && count != 0) {
                newStr = price.charAt(i) + newStr;//price.charAt(i) + ',' + newStr;
            } else {
                newStr = price.charAt(i) + newStr;
            }
            count++;
        }
        price = newStr + '.00';
    } else {
        for (i = price.indexOf('.') - 1; i >= 0; i--) {
            if (count % 3 == 0 && count != 0) {
                newStr = price.charAt(i) + newStr; //price.charAt(i) + ',' + newStr;
            } else {
                newStr = price.charAt(i) + newStr;
            }
            count++;
        }
        price = newStr + (price + '00').substr((price + '00').indexOf('.'), 3);
    }
    return price;
}

//格式化时间 new Date(),'yyyy-MM-dd hh:mm:ss'
function formatDate(date, pattern) {
    // 如果不设置，默认为当前时间
    if (!date)
        date = new Date();
    if (typeof (date) === "string") {
        if (date == "")
            date = new Date();
        else
            date = new Date(date.replace(/-/g, "/"));
    }
    /* 补00 */
    var toFixedWidth = function (value) {
        var result = 100 + value;
        return result.toString().substring(1);
    };

    /* 配置 */
    var options = {
        regeExp: /(yyyy|M+|d+|h+|m+|s+|ee+|ws?|p)/g,
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        weeks: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };

    /* 时间切换 */
    var swithHours = function (hours) {
        return hours < 12 ? "AM" : "PM";
    };

    /* 配置值 */
    var pattrnValue = {
        "yyyy": date.getFullYear(), // 年份
        "MM": toFixedWidth(date.getMonth() + 1), // 月份
        "dd": toFixedWidth(date.getDate()), // 日期
        "hh": toFixedWidth(date.getHours()), // 小时
        "mm": toFixedWidth(date.getMinutes()), // 分钟
        "ss": toFixedWidth(date.getSeconds()), // 秒
        "ee": options.months[date.getMonth()], // 月份名称
        "ws": options.weeks[date.getDay()], // 星期名称
        "M": date.getMonth() + 1,
        "d": date.getDate(),
        "h": date.getHours(),
        "m": date.getMinutes(),
        "s": date.getSeconds(),
        "p": swithHours(date.getHours())
    };

    return pattern.replace(options.regeExp, function () {
        return pattrnValue[arguments[0]];
    });
}

function setLocalData(key, data) {
    localStorage.setItem(key, data);
}

function getLocalData(key) {
    return localStorage.getItem(key);
}

function setSessionData(key, data) {
    sessionStorage.setItem(key, data);
}

function getSessionData(key) {
    return sessionStorage.getItem(key);
}
// 清除参数对象中数据为空的属性
function cleanEmptyProperty(obj) {
    var rsObj = clone(obj);
    var _cleanEmptyProperty = function (_obj) {
        for (var o in _obj) {
            if (typeof _obj[o] === 'object') {
                _cleanEmptyProperty(_obj[o]);
            }
            if (_obj[o] === false) {
                continue;
            }
            if (_obj[o] === 0) {
                continue;
            }
            if (!_obj[o] || _obj[o] === '' || _obj[o] === 'undefined') {
                delete _obj[o];
            }
        }
    };
    _cleanEmptyProperty(rsObj);
    return rsObj;
}
//TODO 深复制
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;

    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, l = obj.length; i < l; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("clone: Unable to copy obj! Its type isn't supported.");
}

function createFooterItem(hint) {
    var ary = [{
        img: '../../image/Home01.png',
        image: '../../image/Home_0.png',
        name: '首页',
        href: '../../html/home_page/index.html'
    }, {
        img: '../../image/shop01.png',
        image: '../../image/shop.png',
        name: '购物车',
        href: '../../html/shpping_cart/shopcar.html?shop=' + "shopcar"
    },
        {
            img: '../../image/person01.png',
            image: '../../image/person.png',
            name: '我的',
            href: '../../html/person/person.html'
        }];
    var div = createDom('div');
    div.classList.add('foot');
    ary.forEach(function (item, index) {
        var div1 = createDom('div');
        div1.classList.add('foot-item');
        var img = createDom('img');
        if (index == hint) {
            img.src = item.image;
        } else {
            img.src = item.img;
        }
        div1.appendChild(img);
        var p = createDom('p');
        p.textContent = item.name;
        div1.appendChild(p);
        addClick(div1, function () {
            location.replace(item.href);
            // location.href = item.href;
        });
        div.appendChild(div1);
    });

    document.getElementsByTagName("body")[0].appendChild(div);
}

var BASE_URL = '';
function ImageLoader(defaultUrl) {
    var _load = new Image();
    _load.src = defaultUrl;
    // this._history = {};
    this.defaultUrl = defaultUrl;
    this.load = function (targetDom, url, autoSize) {
        if (!!autoSize) {
            autoSize = (typeof autoSize) === 'boolean' ? 80 : autoSize;
        }
        url = url || '';
        url = url.indexOf('http') != 0 ? BASE_URL + url : url;
        targetDom.src = this.defaultUrl;
        if (autoSize) {
            targetDom.style.width = autoSize + 'px';
            targetDom.style.height = autoSize + 'px';
        }
        var _img = new Image();
        _img.src = url;
        _img.onload = function () {
            targetDom.src = _img.src;
            if (autoSize) {
                if (_img.height > _img.width) {
                    targetDom.style.width = autoSize + 'px';
                    targetDom.style.height = 'auto';
                } else {
                    targetDom.style.width = 'auto';
                    targetDom.style.height = autoSize + 'px';
                }
            } else {

            }
        };
        _img.onerror = function (e) {
            console.error(_img.src, e);
        }
    };
    // }
}
//TODO 创建slider
function createSlider(targetDom, list, height, creater) {
    if (!list) {
        throw 'arg 2 invalid';
    }
    var placeholder = {
        slider: function () {
        }
    };
    if (list.length == 0) {
        return placeholder;
    }
    var targetClass = targetDom.classList;
    if (!targetClass.contains('mui-slider')) {
        targetClass.add('mui-slider');
    }
    targetDom.style.height = height + 'px';
    //TODO 创建mui-slider-group
    var sliderGroup = createDom('div');
    sliderGroup.classList.add('mui-slider-group');
    sliderGroup.classList.add('mui-slider-loop');
    sliderGroup.id = 'slider_group';
    sliderGroup.style.height = height + 'px';
    targetDom.appendChild(sliderGroup);
    //TODO 只有一条数据
    if (list.length == 1) {
        //TODO 创建slideritem
        var sliderItemOnlyOne = document.createElement('div');
        sliderItemOnlyOne.classList.add('mui-slider-item');
        sliderGroup.appendChild(sliderItemOnlyOne);
        creater(list[0], sliderItemOnlyOne, 0);
        sliderGroup.style.webkitTransform = 'translate(0,0)';
        sliderGroup.style.transform = 'translate(0,0)';
        return placeholder;
    }
    //TODO 创建mui-slider-indicator
    var sliderIndicator = createDom('div');
    sliderIndicator.classList.add('mui-slider-indicator');
    sliderIndicator.id = 'slider_indicator';
    targetDom.appendChild(sliderIndicator);

    var firstDom = null, lastDom = null, firstChild = null;
    list.forEach(function (data, index) {
        //TODO 创建slideritem
        var sliderItem = document.createElement('div');
        sliderItem.classList.add('mui-slider-item');
        sliderGroup.appendChild(sliderItem);
        //TODO 创建point
        var point = document.createElement('div');
        point.classList.add('mui-indicator');
        sliderIndicator.appendChild(point);
        if (index == 0) {
            firstChild = sliderItem;
            point.classList.add('mui-active');
        }
        var dom = creater(data, sliderItem, index);
        if (index == 0) {
            lastDom = creater(data, sliderItem, index);
        }
        if (index == list.length - 1) {
            firstDom = creater(data, sliderItem, index);
        }
        // if (!!dom) {
        //     if (index == 0) {
        //         lastDom = dom.cloneNode(true);
        //     }
        //     if (index == list.length - 1) {
        //         firstDom = dom.cloneNode(true);
        //     }
        // } else {
        //     throw 'creater return is undefined!'
        // }
    });
    var firstDuplicateSliderDom = document.createElement('div');
    firstDuplicateSliderDom.classList.add('mui-slider-item');
    firstDuplicateSliderDom.classList.add('mui-slider-item-duplicate');
    firstDuplicateSliderDom.appendChild(firstDom);
    sliderGroup.insertBefore(firstDuplicateSliderDom, firstChild);

    var lastDuplicateSliderDom = document.createElement('div');
    lastDuplicateSliderDom.classList.add('mui-slider-item');
    lastDuplicateSliderDom.classList.add('mui-slider-item-duplicate');
    lastDuplicateSliderDom.appendChild(lastDom);
    sliderGroup.appendChild(lastDuplicateSliderDom);
    return mui(targetDom);
}
//关闭当前页面
function CloseWebPage() {
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null; window.close();
        }
        else {
            window.open('', '_top'); window.top.close();
        }
    }
    else if (navigator.userAgent.indexOf("Firefox") > 0) {
        window.location.href = 'about:blank '; //火狐默认状态非window.open的页面window.close是无效的
        //window.history.go(-2);
    }
    else {
        window.opener = null;
        window.open('', '_self', '');
        window.close();
    }
}
function removeChildren(dom) {
    dom.innerHTML = '';
}
function isEmpty(obj) {
    for (var name in obj) {
        return false;
    }
    return true;
}
function formatString() {
    if (arguments.length == 0)
        return this;
    for (var i = 1, rs = arguments[0]; i < arguments.length; i++)
        rs = rs.replace(new RegExp('\\{' + (i - 1) + '\\}', 'g'), arguments[i]);
    return rs;
}
(function () {
    var _ajax = $.ajax;
    $.ajax = function (url, opt) {
        // var BASE_URL = 'http://www.huas360.com:8057';
        //var BASE_URL = 'http://192.168.100.211:8100';
        var BASE_URL = 'http://117.34.80.112:8080';
        // TODO 处理 只传option参数的情况
        if (typeof url === 'object' && !opt) {
            opt = url;
            url = opt.url;
        }
        if (!!opt && !opt.timeout) {
            opt.timeout = 10000;
        }
        var sid = getSessionData('sid') || "";
        if (url.indexOf('?') >= 0) {
            url += formatString('&pcSession_3rd={0}', sid);
        } else {
            url += formatString('?pcSession_3rd={0}', sid);
        }

        //TODO 统一处理 所有POST请求 ContentType 置成 application/json
        // if (!!opt.type && opt.type.toUpperCase() == 'POST' && !opt.headers) {
        //     opt.headers = {'Content-Type': 'application/json;charset=UTF-8'};
        //     !!opt.data && (opt.data = JSON.stringify(opt.data));
        // }

        //TODO 获取本地JSON ---start 这个鬼地方有bug
        if (url.indexOf('http://') == 0 || url.indexOf('../') == 0 || url.indexOf('./') == 0) {
            BASE_URL = '';
        }
        //TODO 获取本地JSON ---end
        var _fn = opt.success, _newUrl = BASE_URL + url;
        opt.success = function (data) {
            // console.info(_newUrl, data);
            if (data['success'] == "888" || data['statusCode'] == 400) {
         console.log(1111);

                layui.use(['layer', 'form'], function () {
                    layer.msg("请先登录账号!");
                });
                setTimeout(function () {
                    location.href="/html/login.html";
                }, 200);
                return;
            } else {
                _fn(data);
            }
        };
        opt.error = function (data) {
            var _result = {};
            if (data.status == 0) {
                // jj.toast('服务器超时');
                _result._result = -99;
                _result._desc = '服务器超时';
            } else {
                _result._result = -98;
                _result._desc = 'http error: ' + data.status;
            }
            _fn(_result);
        };
        _ajax(_newUrl, opt);
    };

})();
