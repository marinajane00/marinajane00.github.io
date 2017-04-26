var MongoClient = require('mongodb').MongoClient;//得到mongo的客户端
var DB_CONN_STR = 'mongodb://localhost:/users';//mongo的ip及数据库

function db(tb,operation,str,callback){
	//连接表，操作，data，执行
MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接数据库："+DB_CONN_STR+"成功！");
	console.log("当前表为："+tb);
	console.log("当前操作为："+operation);
	
	var collection = db.collection(tb);//连接到表
	if(!operation) return;
	//路由
	var handler={};
	handler["find"]=find;
	handler["insert"]=insert;
	handler["update"]=update;
	handler["remove"]=remove;
try{
	handler[operation]();
}catch(e){
	console.log(e.description)
}
	
	 function find(){
	 collection.find(str).toArray(function(err, result) {
		if(typeof (callback) =='function'){
		callback(result)
		db.close();
		}
	 });
	 }
	 function insert(){
		collection.insert(str, function(err, result) {
		if(typeof (callback) =='function'){
		callback(result)
	    db.close();
		}
	 });
	}
	 function update(){
	 collection.update(str, function(err, result) { 
		if(typeof (callback) =='function'){
		callback(result)
	    db.close();
		}
	 });
	 }
	 
	 function remove(){
	 collection.remove(str, function(err, result) {
		if(typeof (callback) =='function'){
		callback(result)
	    db.close();
		}
	 });
	 }
});

}
exports.db=db;