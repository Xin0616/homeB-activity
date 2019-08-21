import config from './config.js'

export async function request(params){
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