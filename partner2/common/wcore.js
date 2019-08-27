/**wcore.js 2014-06-05 08:48:26 **/


/**
WCore核心模块
@module WCore
**/

(function(window) {

	/**
	WCore 核心类，用于开辟一个程序入口

	@class WCore
	@constructor
	@example
		var _core = new WCore();
		_core.options.cid = '###';
	**/
	function WCore() {

		/**
		当前实例id

		@property instanceId
		@type number
		**/
		this.instanceId = instanceId;
		

		/**
		当前实例所有jsonp请求回调列表

		@property callbacks
		@type array
		@default []
		@example
			// jsonp返回示例
			WCore.instances[1].callbacks[3]();
		**/
		this.callbacks = [];


		/**
		当前实例发送请求时共享的全局参数

		@property options
		@type object
		@default {}
		@example
			var _core1 = new WCore();
			_core1.options.cid = 'aaa';
		**/
		this.options = {};

		
		WCore.instances[instanceId] = this;

		instanceId++;
	}


	/**
	版本号

	@property version
	@type number
	@static
	**/
	WCore.version = '1.0';


	// 实例编号
	var instanceId = 0; 


	/**
	instance实例列表
	
	@property instances
	@type array
	@default []
	@static
	**/
	WCore.instances = [];


	// JSONP方法
	var jsonp = function(url) {
		//修改HTTPS模式url
		var _href = window.location.href;
		if (_href.indexOf("https://") == 0) {
			url = url.replace("http://", "https://");
		}

		//URL中增加时间戳，避免缓存
		if (url.indexOf("?") === -1) {
			url += "?_jv=" + WCore.version + "&_r=" + (new Date()).getTime() + Math.random();
		} else {
			url += "&_jv=" + WCore.version + "&_r=" + (new Date()).getTime() + Math.random();
		}

		// 动态添加JS脚本，是JSONP技术的核心
		//var script = document.createElement('script');
		//script.setAttribute('src', url);
		//script.setAttribute('charset', "utf-8");
    //
		//// 执行脚本，这个脚本实际上是百分点推荐引擎返回的一个回调函数，回调函数名
		//// 已经由url中的callback参数指定，回调函数的参数则是此次请求返回的JSON数据结果
		////document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );
		//var _head = document.getElementsByTagName("head")[0];
		//_head.insertBefore(script, _head.lastChild);
		
		var img = new Image();
		img.src = url
	};


	/**
	发送请求
	
	@method send
	@param {object} req 请求实例
	@param {function} [cb] 回调函数
	@param {object} [_this] 另一个WCore实例, 所有参数均以另一个为准 
	**/
	WCore.prototype.send = function(req, cb, _this) {
		var _this = _this || this;

		if (!req instanceof WCore.Request) return;

		//添加回调函数
		_this.callbacks.push(function(json) {
			cb && cb(json);
		});

		var cblen = _this.callbacks.length;

		var options = (function() {
			var querys = [];

			for (var key in _this.options) {
				if (typeof _this.options[key] !== "string") continue;
				if (typeof req[key] == "undefined") querys.push(key + "=" + encodeURIComponent(_this.options[key]));
			}
			return querys.join("&");
		})();

		var _query = [
			req.query(),
			"callback=WCore.instances[" + _this.instanceId + "].callbacks[" + (cblen - 1) + "]"
		];
		
		options && _query.unshift(options);

		jsonp(req.getUrl() + (req.getUrl().indexOf("?") === -1 ? "?" : "&") + _query.join("&"));
	};

	
	/**
	请求基类, 通常您不需要直接使用此类, 以免写错必要的参数,
	应尽可能使用具体的用户行为请求API。
	
	@class Request
	@constructor
	@namespace WCore
	@param {string} url 请求地址
	**/
	function Request(url) {

		if (url) {
			/**
			获取当前请求url，此方法只有在构造函数WCore.Request参数url存在时才可用
			
			@method getUrl
			@return {string} 请求服务的url
			**/
			this.getUrl = function() {
				return url;
			};
		}
	};


	/**
	遍历当前请求对象ownproperty, 加入请求参数
	
	@method query
	@return {string} get参数字符串
	**/
	Request.prototype.query = function() {
		var query_array = [];
		//实例属性
		for (var key in this) {
			if (typeof this[key] !== "function" && key.indexOf("__") !== 0) {
				query_array.push(key + "=" + encodeURIComponent(this[key]));
			}
		}
		return query_array.join("&");
	};

	WCore.Request = Request;

	window.WCore = WCore;

})(window);
/**
WCore工具模块
@module WCore.tools
**/

;
(function(window) {


	/**
	工具库

	@class tools
	@namespace WCore
	**/
	WCore.tools = {


		/**
		获取cookie

		@method getCookie
		@static
		@param {string} [name] cookie键, 无参数则获取所有cookie
		@return {string} cookie值
		*/
		getCookie: function(name) {
			if (name) {
				var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
				return match ? match[2] : '';
			} else {
				return document.cookie;
			}
		},


		/**
		设置cookie
		
		@method setCookie
		@static
		@param {string} cname cookie键
		@param {string} cval cookie值
		@param {string} [time] 时间值(默认有效期为浏览器session)
		@param {string} [bool] 时间单位是否为秒(默认单位为天)
		@param {string} [sub] cookie路径是否为当前URL路径(默认cookie存放一级域名下)
		*/
		setCookie: function(cname, cval, time, bool, sub) {
			var exdate = new Date();
			var _domain = "";
			if (bool) exdate.setTime(exdate.getTime() + Number(time));
			else exdate.setDate(exdate.getDate() + Number(time));
			if (!sub) _domain = "domain=" + this.getTopDomain() + ";";
			document.cookie = cname + '=' + encodeURIComponent(cval) + ";expires=" + exdate.toUTCString() + ';path=/;' + _domain;
		},


		/**
		获取域名(一级域名)

		@method getTopDomain
		@static
		@param {string} url 待提取的url
		@return {string} 一级域名字符串
		**/
		getTopDomain: function(url) {
			var a = (url || location.hostname + "/").match(/[\w-]+\.(com|info|net|org|me|mobi|us|biz|xxx|ca|mx|tv|ws|am|asia|at|be|bz|cc|co|de|nom|es|eu|fm|fr|gs|firm|gen|ind|in|it|jobs|jp|ms|nl|nu|se|tc|tk|idv|tw|vg|gov|cn|ha)(\.(cn|hk|jp|tw|kr|mo|uk|ag|es|co|nz|in|br|bz|mx))*\//ig);
			if (a) {
				if (0 < a.length)
					return a[0].substr(0, a[0].length - 1)
			} else
				return document.domain;
		},


		/**
		生成HASH值
		
		@method hash
		@static
		@param {string} str  要HASH的字符串
		@return {string} hash值
		**/
		hash: function(str) {
			var hash = 1,
				charCode = 0,
				idx;
			if (str) {
				hash = 0;
				for (idx = str["length"] - 1; idx >= 0; idx--) {
					charCode = str.charCodeAt(idx);
					hash = (hash << 6 & 268435455) + charCode + (charCode << 14);
					charCode = hash & 266338304;
					hash = charCode != 0 ? hash ^ charCode >> 21 : hash;
				}
			}
			return hash;
		},


		/**
		获取随机整数
		
		@method random
		@static
		@return {number} 随机整数
		**/
		random: function() {
			// 2,147,483,647是2147483646与2147483648之间的自然数，
			// 也是欧拉在1772年所发现的一个梅森素数，它等于2^31 -1，
			// 是32位操作系统中最大的符号型整型常量。
			return Math.round(Math.random() * 2147483647);
		},


		/**
		获取hostname, 如www.baidu.com

		@method getHost
		@static
		@param {string} [url] 待提取的url, 默认当前url
		@return {string} hostname
		**/
		getHost: function(url) {
			var match;
			if (url) {
				match = url.match(/\/\/([^\/]+)/);
				return match && match[1] || '';
			} else {
				return document.location.host;
			}
		},


		/**
		获取URL路径(不包括hostname、queryString、hashMap)
		
		@method getPath
		@static
		@param {string} [url] 待提取的url, 默认当前url
		@return {string} URL路径
		**/
		getPath: function(url) {
			var match;
			if (url) {
				match = url.match(/\/\/[^\/]+([^\?#]+)/);
				return match && match[1] || '';
			} else {
				return document.location.pathname;
			}
		},


		/**
		URL参数反序列化
		
		@method unserizlize
		@static
		@param {string} [url] 待处理的url，默认当前url
		@return {object} URL参数键值表
		**/
		unserizlize: function(url) {
			if (url) {
				url = url.split('?')[1];
			}
			url = url || document.location.search.slice(1);
			var res = {},
				paras = url && url.split('?').join('&').split('&');
			for (var i = 0; i < paras.length; i++) {
				var arr = paras[i].split('=');
				res[arr[0]] = arr[1];
			}
			return res;
		},


		/**
		判断元素是否在数组中
		
		@method inArray
		@static
		@param {array} array 待检测的数组
		@param {all} element 待检测的元素
		@return {number} 元素在数组中的索引, 不存在则返回-1
		**/
		inArray: function(array, element) {
			if (Array.prototype.indexOf) {
				return array.indexOf(element);
			} else {
				var i = 0,
					len = array.length;

				for (; i < len; i++) {
					if (array[i] === element) {
						return i;
					}
				}
				// 找不到
				return -1;
			}
		},


		/**
		JSON.stringify
		
		@method jsonStringify
		@static
		@param {all} element js对象
		@return {string} js对象字符串化
		**/
		jsonStringify: window.JSON && window.JSON.stringify || function(obj) {
			var result;
			var callee = arguments.callee;
			switch (Object.prototype.toString.apply(obj)) {
				case "[object Boolean]":
					if (obj)
						result = "true";
					else
						result = "false";
					break;
				case "[object Number]":
					result = obj.toString();
					break;
				case "[object String]":
					result = "\"" + obj + "\"";
					break;
				case "[object Array]":
					var arr = [];
					for (var i = 0; i < obj.length; ++i) {
						arr.push(callee(obj[i]));
					}
					result = "[" + arr.join(",") + "]";
					break;
				case "[object Object]":
					var arr = [];
					for (var key in obj) {
						if (typeof(obj[key]) === "function") continue;
						arr.push('"' + key + '"' + ":" + callee(obj[key]));
					}
					result = "{" + arr.join(",") + "}";
					break;
				default:
					break;
			}

			return result;
		}
	};

})(window);

/**
WCore输入模块, 包括类及相关方法
@module WCore.inputs
**/

;(function(window) {

	//导入类
	var Request = WCore.Request;

	// 原型继承
	var inhert = function(child, parent) {
		if (Object.create) {
			child.prototype = Object.create(parent.prototype);
		} else {
			function F() {};
			F.prototype = parent.prototype;
			child.prototype = new F();
		}
		child.prototype.constructor = child;
	};
	

	/**
	用户输入相关类及方法
	
	@class inputs
	@namespace WCore
	**/
	WCore.inputs = {};


	/**
	数据采集基类, 通常您不需要直接使用此类, 以免写错必要的参数,
	应尽可能使用具体的用户行为请求API。
	
	@class Input
	@constructor
	@extends WCore.Request
	@namespace WCore.inputs
	@param {string} api 请求名称
	**/
	function Input(api) {
		// Request.call(this, WCore.config.apiPath + api + ".do");

		Request.call(this, WCore.config.apiPath + '?mdtype=' + api);
	}

	/* 继承自 Request */
	inhert(Input, Request);

	/** 默认的请求URL */
	//Input.prototype.__surl = "http://new.baifendian.com/input/";
	// Input.prototype.__surl = "http://ds.api.wfjtest.com/";


	/**
	所有客户资源的基类, 通常您不需要直接使用此类, 以免写错必要的参数,
	应尽可能使用具体的用户行为请求API。

	@class Resources
	@constructor
	@extends WCore.inputs.Input
	@namespace WCore.inputs
	@param {string} api 请求名称
	**/
	function Resources(api) {
		Input.call(this, api);
	}

	/* 继承自 Input */
	inhert(Resources, Input);


	/**
	所有用户行为相关请求的基类, 通常您不需要直接使用此类, 以免写错必要的参数,
	应尽可能使用具体的用户行为请求API。

	@class UserAction
	@constructor
	@extends WCore.inputs.Input
	@namespace WCore.inputs
	@param {string} api 请求名称
	**/
	function UserAction(api) {
		Input.call(this, api);
	}

	/* 继承自 Input */
	inhert(UserAction, Input);


	/**
	用户信息, 与行为一起提交
	
	@class User
	@constructor
	@extends WCore.inputs.Resources
	@namespace WCore.inputs
	@example
		var _user = new WCore.inputs.User();
		_user.uid = '#';
		_user.cuid = '#';
		_user.lvl = '#';
	**/
	function User() {
		Resources.call(this, 'User');
	}

	/* 继承自 Resources */
	inhert(User, Resources);


	/**
	商品信息, 不独立提交, 与其他请求一起提交
	
	@class Item
	@constructor
	@extends WCore.inputs.Resources
	@namespace WCore.inputs
	@example
		var _item = new WCore.inputs.Item();
		_item.iid = '#';
		_item.pid = '#';
		_item.url = '#';
	**/
	function Item() {
		Resources.call(this, 'Item');
	}

	/* 继承自 Resources */
	inhert(Item, Resources);


	/**
	用户浏览页面, 独立提交，也可与其他请求一起提交
	
	@class PV
	@constructor
	@extends WCore.inputs.UserAction
	@namespace WCore.inputs
	@param {object} user User请求实例
	@example
		var _core = new WCore();
		var _user = new WCore.inputs.User();
		_user.uid = '#';
		var _pv = new WCore.inputs.PV(_user);
		// 如果设置url字段(默认为当前页面URL), 则生成orl字段，值为当前页面URL
		_pv.url = 'www.test.com/path?parameter1=test';
		_core.send(_pv);
	**/
	function PV(user) {
		for (var i in user) {
			user.hasOwnProperty(i) && (this[i] = user[i]);
		}
		var url = document.URL;
		if (this.url) {
			this.orl = url;
		} else {
			this.url = url;
		}
		UserAction.call(this, 'PV');
	}

	/* 继承自 UserAction */
	inhert(PV, UserAction);


	/**
	获取请求参数

	@method query
	@return {string} get请求参数字符串
	**/
	PV.prototype.query = function() {
		return [
			UserAction.prototype.query.call(this),
			WCore.inputs.getCookie(),
			WCore.inputs.getParamter()
		].join("&");
	};


	/**
	用户浏览单品, 独立提交

	@class VItem
	@constructor
	@extends WCore.inputs.UserAction
	@namespace WCore.inputs
	@param {object} pv PV请求实例
	@param {object} item Item请求实例
	@example
		var _core = new WCore();
		var _pv = new WCore.inputs.PV(_user);
		var _item = new WCore.inputs.Item();
		_item.iid = '#';
		_item.pid = '#';
		_item.url = '#';
		var _vitem = new WCore.inputs.VItem(_pv, _item);
		_core.send(_vitem);
	**/
	function VItem(pv, item) {
		for (var i in pv) {
			pv.hasOwnProperty(i) && (this[i] = pv[i]);
		}
		for (var i in item) {
			item.hasOwnProperty(i) && (this[i] = item[i]);
		}
		UserAction.call(this, 'VItem');
	}

	/* 继承自 UserAction */
	inhert(VItem, UserAction);


	/**
	获取请求参数

	@method query
	@return {string} get请求参数字符串
	**/
	VItem.prototype.query = function() {
		return PV.prototype.query.call(this);
	};


	/**
	用户收藏单品, 独立提交

	@class FItem
	@constructor
	@extends WCore.inputs.UserAction
	@namespace WCore.inputs
	@param {object} pv PV请求实例
	@example
		var _core = new WCore();
		var _pv = new WCore.inputs.PV(_user);
		var _fitem = new WCore.inputs.FItem(_pv);
		_fitem.iid = '#';
		_fitem.optyp = '#';
		_core.send(_fitem);
	**/
	function FItem(pv) {
		for (var i in pv) {
			pv.hasOwnProperty(i) && (this[i] = pv[i]);
		}
		UserAction.call(this, 'FItem');
	}

	/* 继承自 UserAction */
	inhert(FItem, UserAction);


	/**
	获取请求参数

	@method query
	@return {string} get请求参数字符串
	**/
	FItem.prototype.query = function() {
		return PV.prototype.query.call(this);
	};


	/**
	用户浏览类目, 独立提交

	@class VCat
	@constructor
	@extends WCore.inputs.UserAction
	@namespace WCore.inputs
	@param {object} pv PV请求实例
	@example
		var _core = new WCore();
		var _pv = new WCore.inputs.PV(_user);
		var _vcat = new WCore.inputs.VCat(_pv);
		_vcat.cat = '#';
		_vcat.brd = '#';
		_core.send(_vcat);
	**/
	function VCat(pv) {
		for (var i in pv) {
			pv.hasOwnProperty(i) && (this[i] = pv[i]);
		}
		UserAction.call(this, 'VCat');
	}

	/* 继承自 UserAction */
	inhert(VCat, UserAction);


	/**
	获取请求参数

	@method query
	@return {string} get请求参数字符串
	**/
	VCat.prototype.query = function() {
		return PV.prototype.query.call(this);
	};


	/**
	用户浏览品牌, 独立提交

	@class VBrd
	@constructor
	@extends WCore.inputs.UserAction
	@namespace WCore.inputs
	@param {object} pv PV请求实例
	@example
		var _core = new WCore();
		var _pv = new WCore.inputs.PV(_user);
		var _vbrd = new WCore.inputs.VBrd(_pv);
		_vbrd.cat = '#';
		_vbrd.brd = '#';
		_core.send(_vbrd);
	**/
	function VBrd(pv) {
		for (var i in pv) {
			pv.hasOwnProperty(i) && (this[i] = pv[i]);
		}
		UserAction.call(this, 'VBrd');
	}

	/* 继承自 UserAction */
	inhert(VBrd, UserAction);


	/**
	获取请求参数

	@method query
	@return {string} get请求参数字符串
	**/
	VBrd.prototype.query = function() {
		return PV.prototype.query.call(this);
	};


	/**
	用户收藏品牌, 独立提交

	@class FBrd
	@constructor
	@extends WCore.inputs.UserAction
	@namespace WCore.inputs
	@param {object} pv PV请求实例
	@example
		var _core = new WCore();
		var _pv = new WCore.inputs.PV(_user);
		var _fbrd = new WCore.inputs.FBrd(_pv);
		_fbrd.optyp = '#';
		_fbrd.brd = '#';
		_core.send(_fbrd);
	**/
	function FBrd(pv) {
		for (var i in pv) {
			pv.hasOwnProperty(i) && (this[i] = pv[i]);
		}
		UserAction.call(this, 'FBrd');
	}

	/* 继承自 UserAction */
	inhert(FBrd, UserAction);


	/**
	获取请求参数

	@method query
	@return {string} get请求参数字符串
	**/
	FBrd.prototype.query = function() {
		return PV.prototype.query.call(this);
	};


	/**
	用户添加购物车, 独立提交, 在按钮上提交

	@class Cart
	@constructor
	@extends WCore.inputs.UserAction
	@namespace WCore.inputs
	@param {object} pv PV请求实例
	@example
		var _core = new WCore();
		var _pv = new WCore.inputs.PV(_user);
		var _cart = new WCore.inputs.Cart(_pv);
		_cart.optyp = '#';
		_cart.lst = '#';
		_core.send(_cart);
	**/
	function Cart(pv) {
		for (var i in pv) {
			pv.hasOwnProperty(i) && (this[i] = pv[i]);
		}
		UserAction.call(this, 'Cart');
	}

	/* 继承自 UserAction */
	inhert(Cart, UserAction);


	/**
	获取请求参数

	@method query
	@return {string} get请求参数字符串
	**/
	Cart.prototype.query = function() {
		return PV.prototype.query.call(this);
	};


	/**
	用户下单, 独立提交, 在页面或者中台提交

	@class Order
	@constructor
	@extends WCore.inputs.UserAction
	@namespace WCore.inputs
	@param {object} pv PV请求实例
	@example
		var _core = new WCore();
		var _pv = new WCore.inputs.PV(_user);
		var _order = new WCore.inputs.Order(_pv);
		_order.oid = '#';
		_order.lst = '#';
		_core.send(_order);
	**/
	function Order(pv) {
		for (var i in pv) {
			pv.hasOwnProperty(i) && (this[i] = pv[i]);
		}
		UserAction.call(this, 'Order');
	}

	/* 继承自 UserAction */
	inhert(Order, UserAction);


	/**
	获取请求参数

	@method query
	@return {string} get请求参数字符串
	**/
	Order.prototype.query = function() {
		return PV.prototype.query.call(this);
	};


	/**
	用户站内搜索, 独立提交

	@class Search
	@constructor
	@extends WCore.inputs.UserAction
	@namespace WCore.inputs
	@param {object} pv PV请求实例
	@example
		var _core = new WCore();
		var _pv = new WCore.inputs.PV(_user);
		var _search = new WCore.inputs.Search(_pv);
		_search.kw = '#';
		_search.pw = '#';
		_core.send(_search);
	**/
	function Search(pv) {
		for (var i in pv) {
			pv.hasOwnProperty(i) && (this[i] = pv[i]);
		}
		UserAction.call(this, 'Search');
	}

	/* 继承自 UserAction */
	inhert(Search, UserAction);


	/**
	获取请求参数

	@method query
	@return {string} get请求参数字符串
	**/
	Search.prototype.query = function() {
		return PV.prototype.query.call(this);
	};


	/**
	用户社交事件, 独立提交

	@class Social
	@constructor
	@extends WCore.inputs.UserAction
	@namespace WCore.inputs
	@param {object} pv PV请求实例
	@example
		var _core = new WCore();
		var _pv = new WCore.inputs.PV(_user);
		var _social = new WCore.inputs.Social(_pv);
		_social.sn = '#';
		_social.sa = '#';
		_core.send(_social);
	**/
	function Social(pv) {
		for (var i in pv) {
			pv.hasOwnProperty(i) && (this[i] = pv[i]);
		}
		UserAction.call(this, 'Social');
	}

	/* 继承自 UserAction */
	inhert(Social, UserAction);


	/**
	获取请求参数

	@method query
	@return {string} get请求参数字符串
	**/
	Social.prototype.query = function() {
		return PV.prototype.query.call(this);
	};


	/**
	扩展事件, 独立提交

	@class Event
	@constructor
	@extends WCore.inputs.UserAction
	@namespace WCore.inputs
	@param {object} pv PV请求实例
	@example
		var _core = new WCore();
		var _pv = new WCore.inputs.PV(_user);
		var _event = new WCore.inputs.Event(_pv);
		_event.ec = '#';
		_event.ea = '#';
		_core.send(_event);
	**/
	function Event(pv) {
		for (var i in pv) {
			pv.hasOwnProperty(i) && (this[i] = pv[i]);
		}
		UserAction.call(this, 'Event');
	}

	/* 继承自 UserAction */
	inhert(Event, UserAction);


	/**
	获取请求参数

	@method query
	@return {string} get请求参数字符串
	**/
	Event.prototype.query = function() {
		return PV.prototype.query.call(this);
	};


	WCore.inputs.Input      = Input;
	WCore.inputs.UserAction = UserAction;
	WCore.inputs.Resources  = Resources;
	
	WCore.inputs.User       = User;
	WCore.inputs.Item       = Item;
	
	WCore.inputs.PV         = PV;
	WCore.inputs.VItem      = VItem;
	WCore.inputs.FItem      = FItem;
	WCore.inputs.VCat       = VCat;
	WCore.inputs.VBrd       = VBrd;
	WCore.inputs.FBrd       = FBrd;
	WCore.inputs.Cart       = Cart;
	WCore.inputs.Order      = Order;
	WCore.inputs.Search     = Search;
	WCore.inputs.Social     = Social;
	WCore.inputs.Event      = Event;
	
})(window);
/**
WCore输入模块扩展, 包括类及相关方法
@module WCore.inputs
@submodule WCore-inputsEx
**/
;
(function(window) {

    var Tools = WCore.tools;

    var PV = WCore.inputs.PV;

    var w = window;
    var d = document;
    var n = navigator;
    var e = encodeURIComponent;


    /**
    获取页面类型

    @method getPageType
    @for WCore.inputs.PV
    @return {string} 页面类型字符串
    **/
    PV.prototype.getPageType = function() {
        var paras = Tools.unserizlize();
        if ('pageType' in paras) return paras.pageType;

        // 可自定义键名称, 与相应的正则对应即可
        var regs = WCore.config.pageTypeRegs;
        var url = location.hostname + location.pathname + location.search;

        for (var i in regs) {
            if (regs[i].test(url)) return i;
        }
    };


    // 客户端环境参数获取api
    var getParamter = (function(w, d, n, e) {

        // 浏览器类型数据
        var dataBrowser = [{
            string: navigator.userAgent,
            subString: "Maxthon",
            identity: "MaxThon"
        }, {
            string: navigator.userAgent,
            subString: '360se',
            identity: "360SE"
        }, {
            string: navigator.userAgent,
            subString: 'theworld',
            identity: "TheWorld"
        }, {
            string: navigator.userAgent,
            subString: 'MetaSr',
            identity: "Sogou"
        }, {
            string: navigator.userAgent,
            subString: 'TencentTraveler',
            identity: "QQTT "
        }, {
            string: navigator.userAgent,
            subString: "MQQBrowser",
            identity: "MQQBrowser"
        }, {
            string: navigator.userAgent,
            subString: "QQBrowser",
            identity: "QQBrowser"
        }, {
            string: navigator.userAgent,
            subString: "UCWEB",
            identity: "UC"
        }, {
            string: navigator.userAgent,
            subString: "UC AppleWebKit",
            identity: "UC"
        }, {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        }, {
            string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        }, {
            string: navigator.vendor ? navigator.vendor : '',
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        }, {
            prop: window.opera ? window.opera : '',
            identity: "Opera",
            versionSearch: "Version"
        }, {
            string: navigator.vendor ? navigator.vendor : '',
            subString: "iCab",
            identity: "iCab"
        }, {
            string: navigator.vendor ? navigator.vendor : '',
            subString: "KDE",
            identity: "Konqueror"
        }, {
            string: navigator.userAgent,
            subString: "BlackBerry",
            identity: "BlackBerry",
            versionSearch: "Version"
        }, {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        }, {
            string: navigator.vendor ? navigator.vendor : '',
            subString: "Camino",
            identity: "Camino"
        }, { // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        }, {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "IE",
            versionSearch: "MSIE"
        }, {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        }, { // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }];

        // 操作系统类型数据
        var dataOSType = [{
            string: navigator.userAgent,
            subString: 'Windows',
            identity: "Windows"
        }, {
            string: navigator.userAgent,
            subString: "Windows Phone",
            identity: "Windows Phone"
        }, {
            string: navigator.platform,
            subString: 'Mac',
            identity: "Mac OS X"
        }, {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iOS"
        }, {
            string: navigator.userAgent,
            subString: "iPod",
            identity: "iOS"
        }, {
            string: navigator.userAgent,
            subString: "iPad",
            identity: "iOS"
        }, {
            string: navigator.userAgent,
            subString: "Android",
            identity: "Android"
        }, {
            string: navigator.userAgent,
            subString: "Linux",
            identity: "Linux"
        }];

        // 设备类型数据
        var device = {};
        var _user_agent = window.navigator.userAgent.toLowerCase();
        var _find = function(needle) {
            return _user_agent.indexOf(needle) !== -1;
        };
        device.ios = function() {
            return device.iphone() || device.ipod() || device.ipad();
        };

        device.iphone = function() {
            return _find('iphone');
        };

        device.ipod = function() {
            return _find('ipod');
        };

        device.ipad = function() {
            return _find('ipad');
        };

        device.android = function() {
            return _find('android');
        };

        device.androidPhone = function() {
            return device.android() && _find('mobile');
        };

        device.androidTablet = function() {
            return device.android() && !_find('mobile');
        };

        device.blackberry = function() {
            return _find('blackberry') || _find('bb10') || _find('rim');
        };

        device.blackberryPhone = function() {
            return device.blackberry() && !_find('tablet');
        };

        device.blackberryTablet = function() {
            return device.blackberry() && _find('tablet');
        };

        device.windows = function() {
            return _find('windows');
        };

        device.windowsPhone = function() {
            return device.windows() && _find('phone');
        };

        device.windowsTablet = function() {
            return device.windows() && _find('touch');
        };

        device.fxos = function() {
            return (_find('(mobile;') || _find('(tablet;')) && _find('; rv:');
        };

        device.fxosPhone = function() {
            return device.fxos() && _find('mobile');
        };

        device.fxosTablet = function() {
            return device.fxos() && _find('tablet');
        };

        device.meego = function() {
            return _find('meego');
        };

        device.mobile = function() {
            return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego();
        };

        device.tablet = function() {
            return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();
        };

        // 操作系统数据
        var dataOS = [{
            string: navigator.userAgent,
            subString: 'Windows NT 5.0',
            identity: "Win2000"
        }, {
            string: navigator.userAgent,
            subString: 'Windows NT 5.1',
            identity: "WinXP"
        }, {
            string: navigator.userAgent,
            subString: 'Windows NT 5.2',
            identity: "Win2003"
        }, {
            string: navigator.userAgent,
            subString: 'Windows NT 6.0',
            identity: "WinVista"
        }, {
            string: navigator.userAgent,
            subString: 'Windows NT 6.1',
            identity: "Win7"
        }, {
            string: navigator.userAgent,
            subString: "Windows Phone",
            identity: "WinPhone"
        }, {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        }, {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iPod"
        }, {
            string: navigator.userAgent,
            subString: "iPod",
            identity: "iPod"
        }, {
            string: navigator.userAgent,
            subString: "iPad",
            identity: "iPad"
        }, {
            string: navigator.userAgent,
            subString: "Android 1.0",
            identity: "Android 1.0"
        }, {
            string: navigator.userAgent,
            subString: "Android 1.1",
            identity: "Android 1.1"
        }, {
            string: navigator.userAgent,
            subString: "Android 2.0",
            identity: "Android 2.0"
        }, {
            string: navigator.userAgent,
            subString: "Android 2.1",
            identity: "Android 2.1"
        }, {
            string: navigator.userAgent,
            subString: "Android 2.2",
            identity: "Android 2.2"
        }, {
            string: navigator.userAgent,
            subString: "Android 2.3",
            identity: "Android 2.3"
        }, {
            string: navigator.userAgent,
            subString: "Android 3.0",
            identity: "Android 3.0"
        }, {
            string: navigator.userAgent,
            subString: "Android 3.1",
            identity: "Android 3.1"
        }, {
            string: navigator.userAgent,
            subString: "Android 4.0",
            identity: "Android 4.0"
        }, {
            string: navigator.userAgent,
            subString: "Android 4.1",
            identity: "Android 4.1"
        }, {
            string: navigator.userAgent,
            subString: "Android",
            identity: "Android"
        }, {
            string: navigator.userAgent,
            subString: "Linux",
            identity: "Linux"
        }];

        var search = function(data) {
            var i = 0,
                dataString, dataProp, versionSearchString;
            for (; i < data.length; i++) {
                dataString = data[i].string;
                dataProp = data[i].prop;
                versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.toLowerCase().indexOf(data[i].subString.toLowerCase()) != -1) {
                        return data[i].identity;
                    }
                } else if (dataProp) {
                    return data[i].identity;
                }
            }
        };

        return {

            // 页面url
            url: function() {
                return e(d.URL);
            },

            // 页面title
            title: function() {
                return e(d.title);
            },

            // 前链url
            ln: function() {
                return e(d.location.href);
            },

            // 搜索引擎
            se: function() {
                var ref = d.referrer;
                var seMap = WCore.config.seMap;
                if (!ref) return;
                var match = ref.match(/\/\/([^\/]+)/);
                var se = match && match[1];
                if (se in seMap) return seMap[se];
                else return;
            },

            // 搜索引擎名称
            seName: function() {
                var se = this.se();
                if (se) {
                    return se.name;
                }
                return '';
            },

            // 搜索引擎关键字
            lk: function() {
                var se = this.se(),
                    ref = document.referrer;
                if (se && se.query) {
                    var reg = new RegExp('[&|\\?]' + se.query + '=([^&]+)'),
                        match = ref.match(reg);
                    return match ? match[1] : '';
                }
                return '';
            },

            // 网页编码
            ct: function() {
                return e((d.charset || d.characterSet).toLowerCase());
            },

            // 浏览器类型
            bt: function() {
                var type = search(dataBrowser);
                if (type === 'IE') {
                    var start = n.userAgent.indexOf('MSIE');
                    return type + (parseFloat(n.userAgent.substring(start + 'MSIE'.length + 1)) || 'an unknown version');
                }
                return type || 'None';
            },

            // 操作系统类型
            ot: function() {
                var type = search(dataOSType);
                return type || 'None';
            },

            // 操作系统编码
            oc: function() {
                var type = search(dataOS);
                return type || 'None';
            },

            // 设备类型
            de: function() {
                if (device.mobile()) {
                    return 'mobile';
                } else if (device.tablet()) {
                    return 'tablet';
                } else {
                    return 'desktop';
                }
            },

            // 操作系统语言
            lang: function() {
                return (n.systemLanguage || n.browserLanguage || n.language || n.userLanguage || '').toLowerCase();
            },

            // 浏览器窗口大小
            bs: function() {
                var html = d.documentElement,
                    body = d.getElementsByTagName('body')[0],
                    width = w.innerWidth || html.clientWidth || body.clientWidth,
                    height = w.innerHeight || html.clientHeight || body.clientHeight;
                if (width > height) return width + '*' + height;
                return height + '*' + width;
            },

            // 屏幕分辨率
            rs: function() {
                if (w.screen.width > w.screen.height) return w.screen.width + '*' + w.screen.height;
                return w.screen.height + '*' + w.screen.width;
            },

            // flash版本
            fv: function() {
                var v = '';
                if (n.plugins && n.plugins.length) {
                    for (var ii = 0; ii < n.plugins.length; ii++) {
                        if (n.plugins[ii].name.indexOf('Shockwave Flash') != -1) {
                            v = n.plugins[ii].description.split('Shockwave Flash ')[1];
                            break;
                        }
                    }
                } else if (window.ActiveXObject) {
                    for (var ii = 11; ii >= 2; ii--) {
                        try {
                            var fl = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + ii);
                            if (fl) {
                                v = ii + '.0';
                                break;
                            }
                        } catch (e) {}
                    }
                }
                return v;
            },

            // 是否支持java
            ja: function() {
                return n.javaEnabled() ? 1 : 0
            },

            // 浏览器颜色位数
            cb: function() {
                var lev = 'C',
                    dep = w.screen.colorDepth;
                if (dep === 24) lev = 'B';
                else if (dep === 16) lev = 'A';
                return lev;
            }
        };
    })(window, document, navigator, encodeURIComponent);


    // 获取utma、utmb、utmz参数
    var getUtm = function() {
        var now = Math.round(+new Date / 1000);
        var hash = Tools.hash(Tools.getTopDomain());
        var userID = Tools.random() ^ Tools.hash(navigator.userAgent) & 2147483647;
        var utma = Tools.getCookie('utma');
        var utmb = Tools.getCookie('utmb');
        var utmz = Tools.getCookie('utmz');
        var ref = d.referrer;
        var newvisit = true;
        var override = true;
        var setUtmz = true;
        var source = {};
        var sourceArr = [];
        var sourceStr;
        var res = [];
        var paras = Tools.unserizlize();
        // 根据referrer设置source.utmctr
        var setUtmctr = function() {
            var lk = getParamter.lk();
            try {
                // 忽略gbk
                lk = decodeURIComponent(lk);
            } catch (e) {} finally {
                source.utmctr = lk || 'not provided';
            }
        };
        var setSourceStr = function() {
            if (!source.utmtyp) {
                source.utmtyp = 'Others';
            }

            for (i in source) {
                sourceArr.push(i + '=' + source[i]);
            }
            sourceStr = sourceArr.join('|');
        };
        var utmUpdate = function() {
            if (!utma) utma = [hash, userID, now, now, now, 0];
            utma.expire = 24 * 30 * 24 * 60 * 60 * 1000; // 2年

            if (!utmb) utmb = [0, now, now];
            utmb.expire = 30 * 60 * 1000; // 30分钟

            if (!utmz) utmz = [now, 0, 0];
            utmz.expire = 6 * 30 * 24 * 60 * 60 * 1000; // 6个月

            if (newvisit) {
                utma[3] = utma[4];
                utma[4] = now;
                utma[5]++;

                utmb[0] = 1;
                utmb[1] = utmb[2] = now;
            } else {
                utmb[0]++;
                utmb[1] = utmb[2];
                utmb[2] = now;
            }

            if (override) {
                utmz[0] = now;
                utmz[1] = utma[5];
                utmz[2]++;
                utmz[3] = sourceStr;
            }
        };

        utma = utma && utma.split('.');
        utmb = utmb && utmb.split('.');
        if (utmz) {
            var match = utmz.match(/([\d\.]+?)\.([a-z].*)/);
            if (match) {
                utmz = match[1].split('.');
                utmz.push(match[2]);
                if (utmz[3]) utmz[3] = decodeURIComponent(utmz[3]);
            } else {
                utmz = null;
            }
        }

        if (!utma || utma.length !== 6) utma = utmb = utmz = null;
        if (!utmb || utmb.length !== 3) utmb = null;
        if (!utmz || utmz.length !== 4) utmz = null;
        
        // URL标记
        if ('utm_source' in paras) {
            if (!utmb) {
                if (paras.utm_nooverride === '1' && utmz) override = false;
            }

            source.utmcsr = paras.utm_source;
            source.utmcmd = paras.utm_medium || 'none';
            source.utmccn = paras.utm_campaign || 'none';

            paras.utm_content && (source.utmcct = paras.utm_content);

            if ('utm_term' in paras) {
                source.utmctr = paras.utm_term;
            } else if (ref) {
                setUtmctr();
            }

            if (paras.utm_medium) {
                switch (paras.utm_medium) {
                    case 'cpc':
                    case 'ppc':
                        source.utmtyp = 'Paid Search';
                        break;
                    case 'edm':
                    case 'email':
                        source.utmtyp = 'Email';
                        break;
                    case 'cps':
                        source.utmtyp = 'CPS';
                        break;
                    case 'cpm':
                    case 'display':
                        source.utmtyp = 'Display';
                        break;
                    case 'wzdh':
                        source.utmtyp = 'Site navigation';
                        break;
                    case 'union':
                        source.utmtyp = 'Union';
                        break;
                }
            }
            setSourceStr();
            if (utmb && utmz) {
                if (sourceStr == utmz[3] || paras.utm_nooverride === '1') {
                    newvisit = override = false;
                }
            }
        } else {
            (function check(direct) {
                if (!direct && ref && Tools.getHost() !== Tools.getHost(ref)) {
                    var se, host, reg, i, socials;

                    host = Tools.getHost(ref);

                    // 站内ref算直接访问
                    if (/\.wangfujing\.com$/.test(host)) return check(true);

                    // referrer来源
                    se = getParamter.se();
                    reg = se && new RegExp('[\\?&]' + se.query + '=');
                    if (reg && reg.test(ref) || host in {'www.google.com.hk':'','r.search.yahoo.com':''}) {

                        setUtmctr();

                        // 排除搜索
                        if (Tools.inArray(WCore.config.ignoreWords, source.utmctr) > -1) {
                            return check(true);
                        }

                        // 自然搜索
                        source.utmcsr = se.name;
                        source.utmccn = 'organic';
                        source.utmcmd = 'organic';
                        source.utmtyp = 'Organic Search';

                        setSourceStr();

                        if (utmb && utmz) {
                            if (sourceStr == utmz[3] || paras.utm_nooverride === '1') {
                                newvisit = override = false;
                            }
                        }
                    } else {

                        if (!utmb) {
                            // 排除引荐
                            // 去除www
                            host = host.replace(/^www\./, '');
                            for (i = 0; i < WCore.config.ignoreReferRegs.length; i++) {
                                if (WCore.config.ignoreReferRegs[i].test(host)) return check(true);
                            }
                            // 引荐
                            source.utmcsr = host;
                            source.utmccn = 'referral';
                            source.utmcmd = 'referral';
                            source.utmcct = Tools.getPath(ref);
                            source.utmtyp = 'referral';

                            // 判断是否为社交引荐
                            socials = WCore.config.socials;
                            for (i = 0; i < socials.length; i++) {
                                reg = new RegExp('(^|\\.)' + socials[i] + '$');
                                if (reg.test(host)) {
                                    source.utmtyp = 'Social';
                                    break;
                                }
                            }

                            setSourceStr();
                        } else {
                            // 不算新访问，不覆盖渠道
                            return check(true);
                        }
                    }
                    if (!utmb) {
                        if (paras.utm_nooverride === '1' && utmz) override = false;
                    }
                } else {
                    // 直接访问处理
                    if (!utmb) {
                        if (utmz) override = false;
                        else sourceStr = 'utmcsr=direct|utmccn=direct|utmcmd=none|utmtyp=Direct';
                    } else {
                        newvisit = override = false;
                        if (!utmz) setUtmz = false;
                    }
                }
            })(false);
        }

        utmUpdate();

        Tools.setCookie('utma', utma.join('.'), utma.expire, 1);
        Tools.setCookie('utmb', utmb.join('.'), utmb.expire, 1);

        res.push(
            'utma=' + utma.join('.'),
            'utmb=' + utmb.join('.')
        );

        if (setUtmz) {
            Tools.setCookie('utmz', utmz.join('.'), utmz.expire, 1);
            res.push('utmz=' + e(utmz.join('.')));
        }

        return res.join('&');
    };


    // 站内ref值
    var getRef = function() {
        var paras = Tools.unserizlize();
        return 'ref' in paras ? paras.ref : '';
    };


    /**
    从Cookie中获取参数列表

    @method getCookie
    @for WCore.inputs
    @static
    @return {string} 各参数序列化字符串
    **/
    WCore.inputs.getCookie = function() {
        return getUtm();
    };


    /**
    获取客户端环境相关参数

    @method getParamter
    @for WCore.inputs
    @static
    @return {string} 各参数序列化字符串
    **/
    WCore.inputs.getParamter = function() {
        var res = [];
        res.push(
            'title=' + getParamter['title'](),
            'ln=' + getParamter['ln'](),
            'lk=' + getParamter['lk'](),
            'ct=' + getParamter['ct'](),
            'bt=' + getParamter['bt'](),
            'ot=' + getParamter['ot'](),
            'oc=' + getParamter['oc'](),
            'de=' + getParamter['de'](),
            'lang=' + getParamter['lang'](),
            'bs=' + getParamter['bs'](),
            'rs=' + getParamter['rs'](),
            'fv=' + getParamter['fv'](),
            'ja=' + getParamter['ja'](),
            'cb=' + getParamter['cb'](),
            'ref=' + getRef()
        );
        return res.join('&');
    };

})(window);


/**
自定义配置

@class config
@namespace WCore
**/
WCore.config = {


    /**
    数据采集请求URL路径, 注意以/结尾

    @property socials
    @static
    @example
    WCore.config.apiPath = 'http://test.com/api/';
    // 如发送PV请求, URL会变成http://test.com/api/PV.do?
    */
    apiPath: 'https://md.leiyankeji.com/log.gif',
    //apiPath: 'http://ddns.leiyankeji.com:1081/1.gif',
    // apiPath: 'http://patwu.cn/log.png',


    /**
    搜索引擎配置

    @property seMap
    @static
    */
    seMap: {
        'www.baidu.com': {
            'name': 'baidu', // 搜索引擎名称
            'query': 'word' // 搜索关键词参数名称
        },
        'bzclk.baidu.com': {
            'name': 'baidu',
            'query': 'wd'
        },
        'www.google.com.hk': {
            'name': 'google',
            'query': 'q'
        },
        'www.google.com': {
            'name': 'google',
            'query': 'q'
        },
        'www.sogou.com': {
            'name': 'sogou',
            'query': 'query'
        },
        'www.soso.com': {
            'name': 'soso',
            'query': 'query'
        },
        'www.so.com': {
            'name': '360',
            'query': 'q'
        },
        'www.youdao.com': {
            'name': 'youdao',
            'query': 'q'
        },
        'search.yahoo.com': {
            'name': 'yahoo',
            'query': 'p'
        },
        'r.search.yahoo.com': {
            'name': 'yahoo'
        },
        'sg.search.yahoo.com': {
            'name': 'yahoo',
            'query': 'p'
        },
        'cn.bing.com': {
            'name': 'bing',
            'query': 'q'
        }
    },


    /**
    页面类型正则

    @property pageTypeRegs
    @static
    */
    pageTypeRegs: {
        //"index": /^www\.wangfujing\.com\/(\?|$|\/emall\/wfjstore$)/,
        //"list": /^list\.wangfujing\.com\//,
        //"activity": /^www\.wangfujing\.com\/activity\//,
        //"brand_list": /^brand\.wangfujing\.com\/.+\//,
        //"brand": /^brand\.wangfujing\.com\//,
        //"channel": /^www\.wangfujing\.com\/emall\/(meizhuang|nvzhuang|nanzhuang|xiebao|accessories|sports|home|mingpin)(\?|$)/,
        //"temaihui": /^www\.wangfujing\.com\/webapp\/wcs\/stores\/servlet\/specialSaleView/,
        //"newarrial": /^search\.wangfujing\.com\/.+pattern=5/,
        //"search": /^search\.wangfujing\.com\/(.+pattern=3(&|$)|.+?!pattern)/,
        //"register": /^www\.wangfujing\.com\/webapp\/wcs\/stores\/servlet\/WFJURLUserRegistration/,
        //"verify_email2": /^www\.wangfujing\.com\/webapp\/wcs\/stores\/servlet\/LogonForm\?.*?currentSelection=validationEmail/,
        //"login": /^www\.wangfujing\.com\/webapp\/wcs\/stores\/servlet\/(LogonForm|AjaxLogonForm)\?.*?myAcctMain=/,
        //"member": /^www\.wangfujing\.com\/webapp\/wcs\/stores\/servlet\/(LogonForm|AjaxLogonForm)/,
        //"cart": /^www\.wangfujing\.com\/webapp\/wcs\/stores\/servlet\/AjaxOrderItemDisplayView/,
        //"checkout": /^www\.wangfujing\.com\/webapp\/wcs\/stores\/servlet\/OrderShippingBillingView/,
        //"order": /^www\.wangfujing\.com\/webapp\/wcs\/stores\/servlet\/orderokview\?/,
        //"payment": /^www\.wangfujing\.com\/webapp\/wcs\/stores\/servlet\/punchoutpaymentcallback\?/,
        //"order_detail": /^www\.wangfujing\.com\/webapp\/wcs\/stores\/servlet\/orderInfoView\?/,
        //"help": /^www\.wangfujing\.com\/help\//,
        //"about": /^www\.wangfujing\.com\/about\//,
        //"store": /^www\.wangfujing\.com\/(emall\/store(\?|$))|(webapp\/wcs\/stores\/servlet\/wfjentityview)/,
        //"findpwd_index": /^www\.wangfujing\.com\/webapp\/wcs\/stores\/servlet\/WFJURLFindPasswordIndex\?/,
        //"findpwd": /^www\.wangfujing\.com\/webapp\/wcs\/stores\/servlet\/WFJURLFindPassword\?/,
        //"verify_email1": /^www\.wangfujing\.com\/webapp\/wcs\/stores\/servlet\/WFJVerifyEmailForFindPassword\?/,
        //"bindemail": /^www\.wangfujing\.com\/webapp\/wcs\/stores\/servlet\/WFJOAuthUserBindEmail\?/,
        //"bindphome": /^www\.wangfujing\.com\/webapp\/wcs\/stores\/servlet\/WFJOAuthUserBindPhone\?/,
        //"error": /^www\.wangfujing\.com\/error\/\?url=/,
        //"other": /.*/,        
        
        "index": /^https:\/\/daojia\.motivape\.cn\/#$/,
        "introduce": /^https:\/\/daojia\.motivape\.cn\/#\/pages\/index\/introduce\/introduce$/,
        "goodsDetail": /^https:\/\/daojia\.motivape\.cn\/#\/pages\/goodsDetail\/goodsDetail\?spuId\=\d+\&sendType\=(hour|average)$/,
        "orderDetailInfo": /^https:\/\/daojia\.motivape\.cn\/#\/pages\/orderInfo\/orderInfo\?sendType\=(hour|average)$/,
        "unpaidOrderInfo": /^https:\/\/daojia\.motivape\.cn\/#\/pages\/orderInfo\/orderInfo\?orderId\=\d+$/,
        "payWay": /^https:\/\/daojia\.motivape\.cn\/#\/pages\/payWay\/payWay\?orderId\=\d+.*?$/,
        "addAddress": /^https:\/\/daojia\.motivape\.cn\/#\/pages\/addAddress\/addAddress\?type=(1|2)\&id=(-1|\d+)$/,
        "addressManager": /^https:\/\/daojia\.motivape\.cn\/#\/pages\/addressManager\/addressManager.*?$/,
        "cart": /^https:\/\/daojia\.motivape\.cn\/#\/pages\/cart\/cart$/,
        "mine": /^https:\/\/daojia\.motivape\.cn\/#\/pages\/mine\/mine$/,
        "myOrder": /^https:\/\/daojia\.motivape\.cn\/#\/pages\/myOrder\/myOrder$/,
        "discounts": /^https:\/\/daojia\.motivape\.cn\/#\/pages\/discounts\/discounts$/,
        "exchangeCounts": /^https:\/\/daojia\.motivape\.cn\/#\/pages\/discounts\/exchangeCounts$/,
        "aboutus": /^https:\/\/daojia\.motivape\.cn\/#\/pages\/aboutus\/aboutus$/,
        "deal": /^https:\/\/daojia\.motivape\.cn\/#\/pages\/deal\/deal$/,
        "privacy": /^https:\/\/daojia\.motivape\.cn\/#\/pages\/privacy\/privacy$/,                
        "other": /.*/,
        "category": /^http:\/\/mdemo\.leiyankeji\.com\/moti\_shop\_all\/category\.html\?type=1$/
    },


    /**
    排除搜索关键字

    @property ignoreWords
    @static
    */
    ignoreWords: [
        '排除1',
        '排除2'
    ],


    /**
    排除引荐正则

    @property ignoreReferRegs
    @static
    */
    ignoreReferRegs: [
        /aaa.com$/,
        /^bbb/
    ],


    /**
    社交渠道类型识别范围, 包含子域名

    @property socials
    @static
    */
    socials: [
        'weibo.com',
        't.qq.com',
        'qzone.qq.com',
        'douban.com',
        'renren.com',
        'mp.weixin.qq.com'
    ]
};
export default WCore