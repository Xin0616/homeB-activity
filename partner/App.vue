<script>
	export default {
		mounted(){
			// 执行大数据埋点文件
			this.MonitorPV()
			console.log('执行大数据统计')
			 // 友盟统计添加
			const script = document.createElement("script");
			script.src = "https://s96.cnzz.com/z_stat.php?id=1277768398&web_id=1277768398";
			script.language = "JavaScript";
			document.body.appendChild(script);
			console.log('执行友盟统计')
		},
		watch: {
			$route(to, from) {
				// 路由变化之后执行一次大数据埋点-页面
				window._mreferrer = from.fullPath
				this.MonitorPV();
			}
		},
		onLaunch: function() {
		
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		}
	}
</script>

<style>
	@import './common/uni.css';
	@import './common/iconfont.css';
</style>
