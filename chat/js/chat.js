(function($, doc) {
    var MIN_SOUND_TIME = 800;
    var user_id = '';
    
    var record = [];
    
    $.init({
		beforeback:function(){
			record = [];
			var indexWebview = plus.webview.currentWebview().opener().opener();
            mui.fire(indexWebview,'quitChat',{
            	
            });
			return true;
		},
        gestureConfig: {
            tap: true,       //默认为true
            doubletap: true, //默认为false
            longtap: true,   //默认为false
            swipe: true,     //默认为true
            drag: true,      //默认为true
            hold: true,      //默认为false，不监听
            release: true    //默认为false，不监听
        }
    });
    template.config('escape', false);

    if (mui.os.ios) {
        // 解决在ios上fixed元素focusin时位置出现错误的问题 
        document.addEventListener('DOMContentLoaded', function() {
            var footerDom = document.querySelector('footer');

            document.addEventListener('focusin', function() {
                footerDom.style.position = 'absolute';
            });
            document.addEventListener('focusout', function() {
                footerDom.style.position = 'fixed';
            });
        });
    }
    
    $.plusReady(function() {
    	
        document.getElementById('backs').onclick = function(){
            mui.back();
        };

        plus.webview.currentWebview().setStyle({
            softinputMode: "adjustResize"
        });
        
        var showKeyboard = function() {
            if ($.os.ios) {
                var webView = plus.webview.currentWebview().nativeInstanceObject();
                webView.plusCallMethod({
                    "setKeyboardDisplayRequiresUserAction": false
                });
            } else {
                var Context = plus.android.importClass("android.content.Context");
                var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
                var main = plus.android.runtimeMainActivity();
                var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
                //var view = ((ViewGroup)main.findViewById(android.R.id.content)).getChildAt(0);
                imm.showSoftInput(main.getWindow().getDecorView(), InputMethodManager.SHOW_IMPLICIT);
            }
        };
        
        
        /**
		 * @Author      JackyQ
		 * @DateTime    2018-08-07
		 * @version     1.0.0
		 * @description 接收对方发来的消息
		 */
        window.addEventListener('msg',function(event){
			// 获取应用顶层显示窗口对象
			var h=plus.webview.getTopWebview();
			
			if(h.getURL().indexOf('chat') != -1){
				var data = event.detail;
				// console.log(JSON.stringify(data,null,4));
				record.push(data);
				bindMsgList();
			}
			
		});
		
		/**
		 * @Author      JackyQ
		 * @DateTime    2018-08-07
		 * @version     1.0.0
		 * @description 接收消息历史
		 */
		window.addEventListener('initChat', function (event) {
			record = [];
			record = record.concat(event.detail);
		  	bindMsgList();
		});
		
        var ui = {
            body: doc.querySelector('body'),
            footer: doc.querySelector('footer'),
            footerRight: doc.querySelector('.footer-right'),
            footerLeft: doc.querySelector('.footer-left'),
            btnMsgType: doc.querySelector('#msg-type'),
            boxMsgText: doc.querySelector('#msg-text'),
            boxMsgSound: doc.querySelector('#msg-sound'),
            btnMsgImage: doc.querySelector('#msg-image'),
            areaMsgList: doc.querySelector('#msg-list'),
            boxSoundAlert: doc.querySelector('#sound-alert'),
            h: doc.querySelector('#h'),
            content: doc.querySelector('.mui-content')
        };
        
        ui.h.style.width = ui.boxMsgText.offsetWidth + 'px';
        //alert(ui.boxMsgText.offsetWidth );
        var footerPadding = ui.footer.offsetHeight - ui.boxMsgText.offsetHeight;
        var msgItemTap = function(msgItem, event) {
            var msgType = msgItem.getAttribute('msg-type');
            var msgContent = msgItem.getAttribute('msg-content')
            if (msgType == 'sound') {
                player = plus.audio.createPlayer(msgContent);
                var playState = msgItem.querySelector('.play-state');
                playState.innerText = '正在播放...';
                player.play(function() {
                    playState.innerText = '点击播放';
                }, function(e) {
                    playState.innerText = '点击播放';
                });
            }
        };
        var imageViewer = new $.ImageViewer('.msg-content-image', {
            dbl: false
        });
        var bindMsgList = function() {
            //绑定数据:
            /*tp.bind({
            	template: 'msg-template',
            	element: 'msg-list',
            	model: record
            });*/
            ui.areaMsgList.innerHTML = template('msg-template', {
                "record": record,
				"domain": domain,
				"selfImg": localStorage.avatar
            });
            var msgItems = ui.areaMsgList.querySelectorAll('.msg-item');
            [].forEach.call(msgItems, function(item, index) {
                item.addEventListener('tap', function(event) {
                    msgItemTap(item, event);
                }, false);
            });
            imageViewer.findAllImage();
            ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
            
            /**
			 * @Author      JackyQ
			 * @DateTime    2018-08-01
			 * @version     1.0.0
			 * @description 经纪人头像点击跳转详情页
			 */
           	var brokerImg = doc.querySelectorAll('.brokerImg');
           	[].forEach.call(brokerImg, function(item, index) {
                item.addEventListener('tap', function(event) {
                    mui.openWindow({
						url: '../brokerDetails/brokerDetails.html',
						id: 'brokerDetails',
						extras: {
							user_id: 'this.showData[index].user_id'
						}
					});
                }, false);
            });
            
            /**
			 * @Author      JackyQ
			 * @DateTime    2018-08-01
			 * @version     1.0.0
			 * @description 个人头像点击跳转详情页
			 */
           	var selfImg = doc.querySelectorAll('.selfImg');
           	[].forEach.call(selfImg, function(item, index) {
                item.addEventListener('tap', function(event) {
                    mui.openWindow({
						url:'../personalInfo/personalInfo.html',
						waiting:{
							autoShow:false
						}
					});
                }, false);
            });
        };
        bindMsgList();
        window.addEventListener('resize', function() {
            ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
        }, false);
        
        //发送方法(通知主页面发送)
        var send = function(msg) {
            record.push(msg);
            bindMsgList();
            // toRobot(msg.content);
            var indexWebview = plus.webview.currentWebview().opener().opener();
            mui.fire(indexWebview,'chat',msg);
        };
        
        var toRobot = function(info) {
            var apiUrl = 'http://www.tuling123.com/openapi/api';
            $.getJSON(apiUrl, {
                "key": 'acfbca724ea1b5db96d2eef88ce677dc',
                "info": info,
                "userid": plus.device.uuid
            }, function(data) {
                //alert(JSON.stringify(data));
                record.push({
                    sender: 'zs',
                    type: 'text',
                    content: data.text
                });
                bindMsgList();
            });
        };

        function msgTextFocus() {
            ui.boxMsgText.focus();
            setTimeout(function() {
                ui.boxMsgText.focus();
            }, 150);
        }
        //解决长按“发送”按钮，导致键盘关闭的问题；
        ui.footerRight.addEventListener('touchstart', function(event) {
            if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
                msgTextFocus();
                event.preventDefault();
            }
        });
        //解决长按“发送”按钮，导致键盘关闭的问题；
        ui.footerRight.addEventListener('touchmove', function(event) {
            if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
                msgTextFocus();
                event.preventDefault();
            }
        });
        //					ui.footerRight.addEventListener('touchcancel', function(event) {
        //						if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
        //							msgTextFocus();
        //							event.preventDefault();
        //						}
        //					});
        //					ui.footerRight.addEventListener('touchend', function(event) {
        //						if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
        //							msgTextFocus();
        //							event.preventDefault();
        //						}
        //					});
        ui.footerRight.addEventListener('release', function(event) {
            if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
                //showKeyboard();
                ui.boxMsgText.focus();
                setTimeout(function() {
                    ui.boxMsgText.focus();
                }, 150);
                //							event.detail.gesture.preventDefault();
                send({
                    sender: 'self',
                    type: 'text',
                    content: ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '<br/>')
                });
                ui.boxMsgText.value = '';
                $.trigger(ui.boxMsgText, 'input', null);
            } else if (ui.btnMsgType.classList.contains('mui-icon-mic')) {
                ui.btnMsgType.classList.add('mui-icon-compose');
                ui.btnMsgType.classList.remove('mui-icon-mic');
                ui.boxMsgText.style.display = 'none';
                ui.boxMsgSound.style.display = 'block';
                ui.boxMsgText.blur();
                document.body.focus();
            } else if (ui.btnMsgType.classList.contains('mui-icon-compose')) {
                ui.btnMsgType.classList.add('mui-icon-mic');
                ui.btnMsgType.classList.remove('mui-icon-compose');
                ui.boxMsgSound.style.display = 'none';
                ui.boxMsgText.style.display = 'block';
                //--
                //showKeyboard();
                ui.boxMsgText.focus();
                setTimeout(function() {
                    ui.boxMsgText.focus();
                }, 150);
            }
        }, false);
        ui.footerLeft.addEventListener('tap', function(event) {
            var btnArray = [{
                title: "拍照"
            }, {
                title: "从相册选择"
            }];
            plus.nativeUI.actionSheet({
                title: "选择照片",
                cancel: "取消",
                buttons: btnArray
            }, function(e) {
                var index = e.index;
                switch (index) {
                    case 0:
                        break;
                    case 1:
                        var cmr = plus.camera.getCamera();
                        cmr.captureImage(function(path) {
                            send({
                                sender: 'self',
                                type: 'image',
                                content: "file://" + plus.io.convertLocalFileSystemURL(path)
                            });
                        }, function(err) {});
                        break;
                    case 2:
                        plus.gallery.pick(function(path) {
                            send({
                                sender: 'self',
                                type: 'image',
                                content: path
                            });
                        }, function(err) {}, null);
                        break;
                }
            });
        }, false);
        var setSoundAlertVisable = function(show) {
            if (show) {
                ui.boxSoundAlert.style.display = 'block';
                ui.boxSoundAlert.style.opacity = 1;
            } else {
                ui.boxSoundAlert.style.opacity = 0;
                //fadeOut 完成再真正隐藏
                setTimeout(function() {
                    ui.boxSoundAlert.style.display = 'none';
                }, 200);
            }
        };
        var recordCancel = false;
        var recorder = null;
        var audio_tips = document.getElementById("audio_tips");
        var startTimestamp = null;
        var stopTimestamp = null;
        var stopTimer = null;

        /**
         * @Author      JackyQ
         * @DateTime    2018-08-02
         * @version     1.0.0
         * @description 发送声音
         */
        ui.boxMsgSound.addEventListener('hold', function(event) {
            recordCancel = false;
            if (stopTimer) clearTimeout(stopTimer);
            audio_tips.innerHTML = "手指上划，取消发送";
            ui.boxSoundAlert.classList.remove('rprogress-sigh');
            setSoundAlertVisable(true);
            recorder = plus.audio.getRecorder();
            if (recorder == null) {
                plus.nativeUI.toast("不能获取录音对象");
                return;
            }
            startTimestamp = (new Date()).getTime();
            
            recorder.record({
                filename: "_doc/audio/"
            }, function(path) {
                if (recordCancel) return;
                send({
                    sender: 'self',
                    type: 'sound',
                    content: path
                });
            }, function(e) {
                plus.nativeUI.toast("录音时出现异常: " + e.message);
            });
            
        }, false);
        ui.body.addEventListener('drag', function(event) {
            //console.log('drag');
            if (Math.abs(event.detail.deltaY) > 50) {
                if (!recordCancel) {
                    recordCancel = true;
                    if (!audio_tips.classList.contains("cancel")) {
                        audio_tips.classList.add("cancel");
                    }
                    audio_tips.innerHTML = "松开手指，取消发送";
                }
            } else {
                if (recordCancel) {
                    recordCancel = false;
                    if (audio_tips.classList.contains("cancel")) {
                        audio_tips.classList.remove("cancel");
                    }
                    audio_tips.innerHTML = "手指上划，取消发送";
                }
            }
        }, false);
        ui.boxMsgSound.addEventListener('release', function(event) {
            if (audio_tips.classList.contains("cancel")) {
                audio_tips.classList.remove("cancel");
                audio_tips.innerHTML = "手指上划，取消发送";
            }
            //
            stopTimestamp = (new Date()).getTime();
            if (stopTimestamp - startTimestamp < MIN_SOUND_TIME) {
                audio_tips.innerHTML = "录音时间太短";
                ui.boxSoundAlert.classList.add('rprogress-sigh');
                recordCancel = true;
                stopTimer = setTimeout(function() {
                    setSoundAlertVisable(false);
                }, 800);
            } else {
                setSoundAlertVisable(false);
            }
            recorder.stop();
        }, false);
        ui.boxMsgSound.addEventListener("touchstart", function(e) {
            console.log("start....");
            e.preventDefault();
        });
        ui.boxMsgText.addEventListener('input', function(event) {
            ui.btnMsgType.classList[ui.boxMsgText.value == '' ? 'remove' : 'add']('mui-icon-paperplane');
            ui.btnMsgType.setAttribute("for", ui.boxMsgText.value == '' ? '' : 'msg-text');
            ui.h.innerText = ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '\n-') || '-';
            ui.footer.style.height = (ui.h.offsetHeight + footerPadding) + 'px';
            ui.content.style.paddingBottom = ui.footer.style.height;
        });
        var focus = false;
        ui.boxMsgText.addEventListener('tap', function(event) {
            ui.boxMsgText.focus();
            setTimeout(function() {
                ui.boxMsgText.focus();
            }, 0);
            focus = true;
            setTimeout(function() {
                focus = false;
            }, 1000);
            // event.detail.gesture.preventDefault();           //首次弹出键盘输入时产生双击事件
        }, false);
        //点击消息列表，关闭键盘
        ui.areaMsgList.addEventListener('click', function(event) {
            if (!focus) {
                ui.boxMsgText.blur();
            }
        })

		
    });
}(mui, document));