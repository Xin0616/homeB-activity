<script>
	export default {
		onLaunch: function() {
			
			this.MonitorPV()
		},
		onShow: function() {
			// this.MonitorPV()
		},
		onHide: function() {
			
		},
		watch:{
			'$route'(to,from){
				this.MonitorPV()
			}
		},
	}
</script>

<style>
	@import './common/uni.css';
	@import './common/iconfont.css';
</style>
