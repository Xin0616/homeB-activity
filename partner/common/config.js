const config = {}
const webHost = window.location.host;
config.host = process.env.NODE_ENV === 'development' 
	? 
		"http://192.168.191.1:8082"
	: 
		'https://'+webHost+'/api'
	//	"https://daojia.motivape.cn/api" // 生产环境/线上环境
export default config