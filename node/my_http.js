var http = require('http');
var url = require('url');
var querystring=require('querystring');
var my_db=require("./my_db");
var fs=require("fs");

var i=0;

//http监听
http.createServer(function(request,response
){	
	console.log('第'+i+'次请求+++++++++++++++++++');
	i++;
	//请求地址处理
	var my_url= url.parse(request.url);
	var pathname = my_url.pathname;
	var my_query=querystring.parse(my_url.query);
	console.log("请求路径为 " + pathname );
	console.log("请求参数为 "+my_url.query);
	console.log("请求方式为 "+request.method);
	//响应
	function write(d){
		response.writeHead(200,{"Access-Control-Allow-Origin":"*"});
		console.log(d)
		response.write(JSON.stringify(d));
		response.end();
	}
	//数据库操作
	function db(tb,oper){
		my_db.db(tb,oper,my_query,function(d){
			write(d)
		});
	}
	//多媒体post
	function my_post(){
		var postData = "";
		var my_src=my_query.userid+my_query.name;
		//post数据传输
		request.addListener("data", function (data) {
			postData += data;
		});
		//传输结束
		request.addListener("end", function () {
			var temp=postData.split(",")[1];
			var dataBuffer = new Buffer(temp, 'base64');
			//文件写入
			fs.writeFile(my_src+my_query.format, dataBuffer, function (err) {
			  if (err) throw err;
			  console.log('写入完成');
			});
			response.writeHead(200,{"Access-Control-Allow-Origin":"*"});
			response.write(my_src);
			response.end();
		});
	}
	//路径处理
	var my_path=pathname.split("/");
try{
	if(my_path[1] == "public"){
		console.log("以下是POST请求体————————————————")
		console.log(request.body);
		my_post();
	}else{
		//执行
		db(my_path[1],my_path[2]);
	}
}catch(err){
	console.log("出错啦--------------")
	console.log(err.description);
	response.end();
}
}).listen(8080);