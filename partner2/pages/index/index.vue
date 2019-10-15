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
		<view class="img9"></view>
		<view class="img10"></view>
		<view class="img11" id="formCon">
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
					<input type="text" placeholder="请填写代理城市" v-model="formParams.agentCityName" />
				</view>
			</view>
		</view>
		<view class="img12">
			<image src="../../static/12.jpg" mode="widthFix"></image>
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
					source:'2'
				},
				partnerNameType: false,
				partnerMobileType: false,
				popup: {
					isShow: false,
					tipsMsg: '您已提交',
					tipsExplain: '我们会在1-3个工作日内联系您！',
					btn2: '知道了',
				},
				sourceInfo:{}
			};
		},
		components:{
			uniPopup,
			popupContent
		},
		onLoad(e) {
			let sourceObj = {
				material: e.material?e.material:'',
				orderSource: e.material?e.material:'',
				channel: e.channel?e.channel:''
			}
			this.sourceInfo = sourceObj
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
							this.formParams.channel = this.sourceInfo.channel;
							let succ = await shopUserRegist(this.formParams)
							if(succ.code == 0){
								let sourceInfo = this.sourceInfo
								// 友盟事件埋点
								let label = 'material:'+sourceInfo.material+'orderSource:'+sourceInfo.orderSource+'channel:'+sourceInfo.channel
								_czc.push(['_trackEvent','partner2按钮','提交合伙人信息',label,'','btnCon'])
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
	.partner {
		padding-bottom: 90upx;
		view {
			width: 100%;
			background-repeat: no-repeat;
			background-size: contain;
		}

		.img1 {
			background-image: url('../../static/1.jpg');
			height: 930upx;
		}

		.img2 {
			background-image: url('../../static/2.jpg');
			height: 368upx;
		}

		.img3 {
			background-image: url('../../static/3.jpg');
			height: 830upx;
		}

		.img4 {
			background-image: url('../../static/4.jpg');
			height: 1275upx;
		}

		.img5 {
			background-image: url('../../static/5.jpg');
			height: 1515upx;
		}

		.img6 {
			background-image: url('../../static/6.jpg');
			height: 1310upx;
		}

		.img7 {
			background-image: url('../../static/7.jpg');
			height: 1040upx;
		}

		.img8 {
			background-image: url('../../static/8.jpg');
			height: 885upx;
		}

		.img9 {
			background-image: url('../../static/9.jpg');
			height: 940upx;
		}

		.img10 {
			background-image: url('../../static/10.jpg');
			height: 2200upx;
		}

		.img11 {
			background-image: url('../../static/11.jpg');
			height:730upx;
			padding-top: 1upx;

			.formBox {
				width: 100%;
				height: 3px;
				box-sizing: border-box;
				margin-top:150upx;
				padding: 0 45upx;

				.li {
					border-bottom: 2upx solid #b6b6b6;
					padding-bottom: 15upx;
					margin-top: 50upx;

					.title {
						font-size: 30upx;
						line-height: 70upx;
					}

					input {
						font-size: 32upx;
					}
				}
			}
		}

		.img12 {
			// background-image: url('../../static/12.jpg');
			// height: 1055upx;
			image{
				-webkit-touch-callout: default;
				width: 100%;
				height: 100%;
			}
		}

		.btn {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			color: #fff;
			text-align: center;
			background: #E93A27;
			line-height: 100upx;
			z-index: 20;
			font-size: 36upx;
		}
	}
</style>
