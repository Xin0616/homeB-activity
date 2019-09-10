const config = {}
const webHost = window.location.host;
config.host = process.env.NODE_ENV === 'development' 
	? 
		"http://192.168.10.182:8088"
	: 
		'https://'+webHost+'/api'
	//	"https://daojia.motivape.cn/api" // 生产环境/线上环境
export default config