/*
 *author zhangzhen
 * date 2015-4-21
 * version 1.0
 * */
(function() {
    var _initBridge = false
    var Dingdone = function() {
        var _version = "beta",
        	_debug = false,
        	_bridgeInit = false,
        	_registerevents = null;
        /*API方法集合*/
        var _apiArray = [
          'checkJsApi',
          'enableNavBar',
          'setNavTitle',
          'enableNavMenu',
          'goBack',
          'exit',
          'refresh',
          'loadUrl',
          'alert',
          'getUserInfo',
          'getAppInfo',
          'getLocation',
          'getDevice',
          'previewPic',
          'getNetwork',
          'share',
          'startPay',
          'showPaySheet',
          'selectLocation',
          'toast',
          'gotoPhotos',
          'gotoVideo',
          'gotoCommentsList',
          'gotoRichText',
          'gotoContent',
          'previewImage',
          'getPushToken',
          'getAccessToken',
          'chooseImage',
          'openByUri'
        ];
        var _privateMethod = {
            getPlatform: function() {
                var platform = navigator.userAgent.toLowerCase();
                if (/iphone|ipod|ipad/gi.test(platform)) {
                    return "iOS";
                } else if (/android/gi.test(platform)) {
                    return "Android";
                } else {
                    return "不支持此平台!";
                }
            },
            connectWebViewJavascriptBridge: function(callback) {
                    if (window.WebViewJavascriptBridge) { 
                        return callback(WebViewJavascriptBridge); }
                    else {
                        document.addEventListener('WebViewJavascriptBridgeReady', function() {
                            return callback(WebViewJavascriptBridge);
                        }, false);
                    }
                    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
                    window.WVJBCallbacks = [callback];
                    var WVJBIframe = document.createElement('iframe');
                    WVJBIframe.style.display = 'none';
                    WVJBIframe.src = 'https://__bridge_loaded__';
                    document.documentElement.appendChild(WVJBIframe);
                    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
            },
            setupWebViewJavascriptBridge: function(callback) {
                if (window.WebViewJavascriptBridge) {
                    return callback(WebViewJavascriptBridge);
                }else{
                    document.addEventListener('WebViewJavascriptBridgeReady', function() {
                        return callback(WebViewJavascriptBridge);
                    }, false);
                }
                if (window.WVJBCallbacks) {
                    return window.WVJBCallbacks.push(callback);
                }
                window.WVJBCallbacks = [callback];
                var WVJBIframe = document.createElement('iframe');
                WVJBIframe.style.display = 'none';
                WVJBIframe.src = 'https://__bridge_loaded__';
                document.documentElement.appendChild(WVJBIframe);
                setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
            },
            callApiCenter: function(apikey, options) {
                var platform = this.getPlatform(),
                	apikey = apikey,
                	params = ( options && options.param ) ? options.param : null,
                    callback = ( options && options.callback ) ? options.callback : null;
                if (platform == 'Android') {
                    this.connectWebViewJavascriptBridge(function(bridge) {
                        if(!_initBridge){
                            bridge.init(function(message, responseCallback) {});
                            _initBridge = true;
                        }
                        bridge.callHandler(apikey,params,function(response) {
                            console.log(777)
                            response = typeof response === 'string' ? JSON.parse(response) : response;
                            callback && callback(response);
                        });
                    });
                } else if (platform == 'iOS') {
                    this.setupWebViewJavascriptBridge(function(bridge) {
                        console.log(bridge)
                        if(typeof bridge.init != 'undefined' && bridge.init instanceof Function){
                            if(!_initBridge){
                                bridge.init(function(message, responseCallback) {});
                                _initBridge = true;
                            }
                        }
                        bridge.callHandler(apikey, params , function(response) {
                            response = typeof response === 'string' ? JSON.parse(response) : response;
                            callback && callback(response);
                        });
                    })
                } else {
                    //alert(platform);
                }
            }
        };
        return function() {
        	this.config = function(options,callback){
                _debug = options.debug || false;
        		return this.callApiCenter("checkJsApi", {callback:callback,param : options});
            };
            this.getPlatform = function(){
                return _privateMethod.getPlatform();
            }
            this.getVersion = function() {
                return _version;
            };
            this.getApiCollect = function(){
            	return _apiArray;
            };
            this.registerEvents = function(options){
				_registerevents = options;
			};
            this.callApiCenter = function(apikey, options) {
                _privateMethod.callApiCenter(apikey, options);
                 return this;
            };
            this.registerApi();
        };
    }();
    Dingdone.prototype = {
			registerApi : function(){
				var _this = this,
                    apiArray = this.getApiCollect();
				for(var i = 0; i<apiArray.length; i++){
					var apikey = apiArray[i];
					Dingdone.prototype[apikey] = (function(apikey){
						return function(){
							var len = arguments.length;
							if(!len){
								_this.callApiCenter(apikey);
							}
							if(len){
								var arr0 = arguments[0],
									arr1 = arguments[1];
								if( typeof arr0 == "function" ){
									_this.callApiCenter(apikey,{callback:arr0});
								}else{
									if( arr1 && ( typeof arr1 == "function" ) ){
										_this.callApiCenter(apikey,{param :arr0, callback:arr1 });
									}else{
										_this.callApiCenter(apikey,{param :arr0 });
									}
								}
							}
						};
					})(apikey);

				}
            }    
    };
    window.dingdone = new Dingdone();
})();
