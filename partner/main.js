import Vue from 'vue'
import App from './App'
//import WCore from 'common/wcore.js'

Vue.config.productionTip = false
 
App.mpType = 'app'
// Vue.mixin({
// 	methods: {
// 		MonitorEvent(ec) {
// 			console.log("触发ec监控....")
// 			if(typeof WCore === 'undefined') return ;
// 			var _core = new WCore();
// 			 _core.options.cid = 'partner1';
// 			var _user = new WCore.inputs.User();
// 			let mobile = uni.getStorageSync("mobile")
// 			_user.uid = mobile ? mobile :  '#';
// 			var _pv = new WCore.inputs.PV(_user);
// 			var _event = new WCore.inputs.Event(_pv);
// 			_event.ec = ec;
// 			_event.ea = event.type ? event.type : "click";
// 			_core.send(_event); 
// 		},
// 		MonitorPV(){
// 			console.log("触发PV监控....")
// 			if(typeof WCore === 'undefined') return ;
// 			var _core = new WCore();
// 			 _core.options.cid = 'partner1';
// 			var _user = new WCore.inputs.User();
// 			let mobile = uni.getStorageSync("mobile")
// 			_user.uid = mobile ? mobile :  '#';
// 			var _pv = new WCore.inputs.PV(_user);
// 			_core.send(_pv);
// 		}
// 	}
// })
const app = new Vue({
    ...App
})
app.$mount()
