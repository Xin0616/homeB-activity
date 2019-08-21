import {request} from '@/common/request.js'

//提交申请
export function shopUserRegist(data){
	return request({
		url:'/activity1/partner/addPartner',
		methods:"post",
		contentType: 'application/x-www-form-urlencoded',
		data:data
	}).then(function (res){
		let data = res.data;
		data.result = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
		return data
	});
}