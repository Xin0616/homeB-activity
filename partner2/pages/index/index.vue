<template>
	<view class="partnerBox">
		<view class="img1"></view>
		<view class="img2"></view>
		<view class="img3"></view>
		<view class="img4"></view>
		<view class="img5"></view>
		<view class="img6"></view>
		<view class="img7"></view>
		<view class="img8"></view>
		<view class="img9"></view>
		<view class="img10"></view>
		<view class="img11">
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
		<view class="img12">
			<view>立即加入</view>
		</view>
	</view>
</template>

<script>
	export default {
		
	}
</script>

<style>
	.partnerBox>view{
		width:100%;
		background-repeat: no-repeat;
		background-size: contain;
	}
	.img1{
		background-image: url('/static/1.jpg');
		height: 930upx;
	}
	.img2{
		background-image: url('/static/2.jpg');
		height: 368upx;
	}
	.img3{
		background-image: url('/static/3.jpg');
		height: 830upx;
	}
	.img4{
		background-image: url('/static/4.jpg');
		height: 1275upx;
	}
	.img5{
		background-image: url('/static/5.jpg');
		height: 1515upx;
	}
	
	.img6{
		background-image: url('/static/6.jpg');
		height: 1310upx;
	}
	.img7{
		background-image: url('/static/7.jpg');
		height: 1200upx;
	}
	.img8{
		background-image: url('/static/8.jpg');
		height: 885upx;
	}
	.img9{
		background-image: url('/static/9.jpg');
		height: 1000upx;
	}
	.img10{
		background-image: url('/static/10.jpg');
		height: 2200upx;
	}
	.img11{
		background-image: url('/static/11.jpg');
		height: 1000upx;
		padding-top:1upx;
	}
	.img12{
		background-image: url('/static/12.jpg');
		height: 1055upx;
		position:relative;
	}
	.img12>view{
		position:absolute;
		bottom:0;
		background: #E93A27;
		color:#fff;
		line-height:100upx;
		width:100%;
		text-align: center;
	}
	.formBox .li{
		border-bottom:2upx solid #b6b6b6;
		padding-bottom:15upx;
		margin-top:50upx;
	}
	.formBox .li .title{
		font-size: 30upx;
		line-height: 70upx;
	}
	.li .title input{
		font-size:32upx;
	}
	.formBox{
		width: 100%;
		height:3px;
		box-sizing: border-box;
		margin-top:170upx;
		padding:0 45upx;
	}
</style>
