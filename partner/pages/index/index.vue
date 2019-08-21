<template>
	<view class="partner">
		<view class='img1'></view>
		<view class="img2"></view>
		<view class="img3"></view>
		<view class="img4"></view>
		<view class="img5"></view>
		<view class="img6"></view>
		<view class="img7"></view>
		<view class="img8"></view>
		<view class="img9">
			<view class="formBox">
				<view class="li">
					<view class="title">联系人</view>
					<input type="text" placeholder="请填写联系人姓名">
				</view>
				<view class="li">
					<view class="title">联系电话</view>
					<input type="text" placeholder="请填写联系手机">
				</view>
				<view class="li">
					<view class="title">代理城市</view>
					<input type="text" placeholder="请填写代理城市">
				</view>
			</view>
		</view>
		<view class="img10"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	.partner{
		view{
			width: 100%;
			background-repeat: no-repeat;
			background-size: contain;
		}
		.img1{
			background-image:url('/static/hehuoren1/1.jpg');
			height:926upx;
		}
		.img2{
			background-image:url('/static/hehuoren1/2.jpg');
			height:1036upx;
		}
		.img3{
			background-image:url('/static/hehuoren1/3.jpg');
			height:975upx;
		}
		.img4{
			background-image:url('/static/hehuoren1/4.jpg');
			height:1130upx;
		}
		.img5{
			background-image:url('/static/hehuoren1/5.jpg');
			height:1035upx;
		}
		.img6{
			background-image:url('/static/hehuoren1/6.jpg');
			height:890upx;
		}
		.img7{
			background-image:url('/static/hehuoren1/7.jpg');
			height:1200upx;
		}
		.img8{
			background-image:url('/static/hehuoren1/8.jpg');
			height:2170upx;
		}
		.img9{
			background-image:url('/static/hehuoren1/9.jpg');
			height:1000upx;
			padding-top:1upx;
			.formBox{
				width: 100%;
				height:3px;
				box-sizing: border-box;
				margin-top:250upx;
				padding:0 45upx;
				.li{
					border-bottom:2upx solid #b6b6b6;
					padding-bottom:15upx;
					margin-top:50upx;
					.title{
						font-size: 30upx;
						line-height: 70upx;
					}
					input{
						font-size:32upx;
					}
				}
			}
		}
		.img10{
			background-image:url('/static/hehuoren1/10.jpg');
			height:1050upx;
		}
	}
</style>
