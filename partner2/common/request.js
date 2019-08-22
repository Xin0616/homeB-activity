import config from './config.js'

function request(params){
	return new Promise(function (resolve,reject){
		uni.showLoading({title: ''});
		const {...rest} = params.data;
		uni.request({
			url: config.host + params.url,
			method: params.methods ? params.methods : 'get',
			header: {
				"content-type": params.contentType ? params.contentType : 'application/x-www-form-urlencoded'
			},
			data: rest,
			success:function (data){
				uni.hideLoading();
				resolve(data)
			},
			fail: function (err){
				uni.hideLoading();
				reject(err)
			}
		})
	})
}
export function shopUserRegist(data){
	return request({
		url:'/activity1/partner/addPartner',
		methods:"post",
		contentType: 'application/x-www-form-urlencoded',
		data:data
	}).then(function (res){
		let data = res.data;
		return data
	});
}