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
		<view class="img9" id="formCon">
			<view class="formBox">
				<view class="li">
					<view class="title">联系人</view>
					<input type="text" :focus="partnerNameType" placeholder="请填写联系人姓名" v-model="formParams.partnerName">
				</view>
				<view class="li">
					<view class="title">联系电话</view>
					<input type="text" :focus="partnerMobileType" placeholder="请填写联系手机" maxlength="11" v-model="formParams.partnerMobile">
				</view>
				<view class="li">
					<view class="title">代理城市</view>
					<input type="text" placeholder="请填写代理城市" v-model="formParams.agentCityName"/>
				</view>
			</view>
		</view>
		<view class="img10">
			<image src="../../static/hehuoren1/10.jpg" mode="widthFix"></image>
		</view>
		<view class="btn" @tap="btnJoin">{{btnText}}</view>
		<uniPopup :show='popup.isShow' position="middle" mode="fixed">
			<popupContent :operation='operation' :dataInfo='popup' v-on:isShow='isShow'></popupContent>
		</uniPopup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import popupContent from "@/components/popupContent/popupContent.vue"
	import { shopUserRegist } from '@/common/request.js'
	export default {
		data() {
			return {
				btnText:'立即加入',
				formParams:{
					partnerMobile:'',
					partnerName: '',
					agentCityName:'',
					source:'1'
				},
				partnerNameType: false,
				partnerMobileType: false,
				popup: {
					isShow: false,
					tipsMsg: '您已提交',
					tipsExplain: '我们会在1-3个工作日内联系您！',
					btn2: '知道了',
				},
				material:''
			};
		},
		onLoad(e) {
			this.material = e.material
			console.log(this.material)
		},
		mounted() {
			 // 友盟统计添加
			const script = document.createElement("script");
			script.src = "https://s96.cnzz.com/z_stat.php?id=1277768398&web_id=1277768398";
			script.language = "JavaScript";
			document.body.appendChild(script);
			// 声明_czc对象
			var _czc = _czc || [];
			_czc.push(['_setAccount','1277768398'])
		},
		components:{
			uniPopup,
			popupContent
		},
		watch:{
			formParams:{
				deep: true,
				handler: function (){
					if(this.formParams.partnerMobile != '' || this.formParams.partnerName != ''){
						this.btnText = '提交申请'
					}else{
						this.btnText = '立即加入'
					}
				}
			}
		},
		methods:{
			checkMobile: function (mobile) {//检查手机号
				let reg = /^1[3456789]\d{9}$/
				return reg.test(mobile)
			},
			btnJoin:async function (){
				var anchor = this.$el.querySelector('#formCon') // 参数为要跳转到的元素id
				document.body.scrollTop = anchor.offsetTop; // chrome
				document.documentElement.scrollTop = anchor.offsetTop; // firefox
				if(this.btnText == '提交申请'){
					if(this.formParams.partnerName == ''){
						this.showErr('请填写联系人姓名')
						this.partnerNameType = true;
						return;
					}
					if(this.formParams.partnerMobile == ''){
						this.showErr("请填写联系手机")
						this.partnerMobileType = true;
						return;
					}else{
						if(this.checkMobile(this.formParams.partnerMobile)){
							uni.setStorageSync("mobile",this.formParams.partnerMobile)
							this.clearType();
							// this.MonitorEvent("submit_btn_tap") // 执行大数据埋点
							let succ = await shopUserRegist(this.formParams)
							if(succ.code == 0){
								// 友盟事件埋点
								let label = '获取关键词（material）为'+ this.material
								_czc.push(['_trackEvent','partner1按钮','提交合伙人信息',label,'','btnCon'])
								this.popup.isShow = true;
							}else{
								this.showErr(succ.msg)
							}
						}else{
							this.showErr("手机号填写错误，请重新填写")
							this.partnerMobileType = true;
							return;
						}
					}
				}
			},
			clearType: function (){
				this.partnerNameType = false;
				this.partnerMobileType = false;
			},
			showErr: function (msg){
				uni.showToast({
					icon: 'none',
					title: msg
				})
			},
			isShow(val) {
				this.popup.isShow = val;
			},
			operation() {
				this.popup.isShow = false;
				this.formParams.partnerMobile = '';
				this.formParams.partnerName = '';
				this.formParams.agentCityName = '';
			}
		}
	}
</script>

<style lang="scss" scoped>
	.partner{
		padding-bottom: 90upx;
		>view{
			width: 100%;
			background-repeat: no-repeat;
			background-size: contain;
		}
		.img1{
			background-image:url('../../static/hehuoren1/1.jpg');
			height:926upx;
		}
		.img2{
			background-image:url('../../static/hehuoren1/2.jpg');
			height:1036upx;
		}
		.img3{
			background-image:url('../../static/hehuoren1/3.jpg');
			height:975upx;
		}
		.img4{
			background-image:url('../../static/hehuoren1/4.jpg');
			height:1130upx;
		}
		.img5{
			background-image:url('../../static/hehuoren1/5.jpg');
			height:1035upx;
		}
		.img6{
			background-image:url('../../static/hehuoren1/6.jpg');
			height:890upx;
		}
		.img7{
			background-image:url('../../static/hehuoren1/7.jpg');
			height:940upx;
		}
		.img8{
			background-image:url('../../static/hehuoren1/8.jpg');
			height:2170upx;
		}
		.img9{
			background-image:url('../../static/hehuoren1/9.jpg');
			height:730upx;
			padding-top:1upx;
			background-size: 100%;
			.formBox{
				width: 100%;
				height:3px;
				box-sizing: border-box;
				margin-top:150upx;
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
			// background-image:url('../../static/hehuoren1/10.jpg');
			// height:1050upx;
			// padding-bottom: 100upx;
			image{
				width: 100%;
				height: 100%;
				-webkit-touch-callout: default!important;
				// -webkit-touch-callout: initial
				// -webkit-touch-callout: inherit
				// -webkit-touch-callout: unset
			}
		}
		.btn{
			position: fixed;
			left: 0;
			bottom:0;
			width: 100%;
			color:#fff;
			text-align: center;
			background: #f93822;
			line-height:100upx;
			z-index: 99;
			font-size: 36upx;
		}
	}
</style>
