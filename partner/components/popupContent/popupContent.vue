<template>
	<view class='show-box'>
		<view class='icon_pic'>
			<text @tap='close' class='iconfont moti-close_light'></text>
		</view>
		<view class='tips-msg'>{{dataInfo.tipsMsg}}</view>
		<view class='tips-explain'>{{dataInfo.tipsExplain}}</view>
		<view class='tips-btn'>
			<!-- <text class='cancel' @tap='close'>{{dataInfo.btn1}}</text> -->
			<text class='confirm' @tap='childMethod'>{{dataInfo.btn2}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			dataInfo:{
				type:Object
			},
			operation:{
				type:Function,
				default:null
			}
		},
		data() {
			return {
				// data:{
				// 	isShow:false,
				// 	tipsMsg:'',
				// 	tipsExplain:'',
				// 	btn1:"取消",
				// 	btn2:'确定'
				// },
			};
		},
		methods:{
			close(){
				this.$emit('isShow',false);
			},
			childMethod(){
				if(this.operation){
					this.operation();
				}
			}
		}
	}
</script>

<style lang="scss">
	.show-box {
		width: 560upx!important;
		height: 350upx;
		background: #fff;
		border-radius: 8upx;
		box-sizing: border-box;
		padding: 20upx 40upx 40upx 40upx;
		display: flex;
		flex-direction: column;

		.icon_pic {
			text-align: right;
			flex: 0 0 auto;
		}

		.tips-msg {
			font-size: 30upx;
			text-align: center;
			color: #000;
			margin-bottom: 20upx;
		}

		.tips-explain {
			color: #000;
			font-size: 30upx;
			line-height: 40upx;
			flex: 1 0 auto;
			text-align: center;
		}

		.tips-btn {
			display: flex;
			justify-content: center;

			>text {
				width: 100%;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				border-radius: 8upx;
				font-size: 28upx;
				font-weight: 500;
			}

			.confirm {
				background: rgba(250, 70, 80, 1);
				color: #fff;
			}
		}
	}
</style>
