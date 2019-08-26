<script>
	export default {
		onLaunch: function() {
			
			this.MonitorPV()
		},
		onShow: function() {
			
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
