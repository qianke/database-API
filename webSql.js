/**
web sql database API
Example：
	var webSql = new webStorage('table1'); // 开启table1库
	webSq.debug = true // 开启调试
	
	常用方法:
	//webSql.createTable('ddd')
	//webSql.dropTable('ddd')
	//webSql.insert('stu2',{id:'1',name:'123456'})
	//webSql.del('stu2',{name:'123456'},function(data){console.log(data)})
	//webSql.update('stu2',{name:'ddd'},{id:'ddd',name:'fdfd'})
	//webSql.query('stu2',{id:'ddd'},function(data){console.log(data.item(0))})
	
	用户自定义方法:
	//webSql.execute('create table if not exists stu2 (id REAL UNIQUE, name TEXT)');
	//webSql.execute('insert into stu2 (id, name) values("333","444")')
	//webSql.execute('delete from stu2 where id=333')
	//webSql.execute('update stu2 set name="ddd",id="444" where id=333')
	//webSql.execute('select * from stu2 where id=444',function(data){console.log(data.item(0));console.log(data.length)})

*/

var webStorage = function (databaseName) {

    var _this = this;

    //数据库
    var _dataBase;
	
	//调试模式
	this.debug = false;

    //打开数据库连接或者创建数据库
    this.openDatabase = function (databaseName) {
		if(databaseName != undefined){
			if (!!_dataBase) {
				return _dataBase;
			}
			_dataBase = openDatabase(databaseName, "1.0", "database", 1024 * 1024, function () { });
			return _dataBase;
		}
		else{
			console.log('数据库不能为空');
		}

    }
	/**
	* 创建数据表
	* @param {string} table 表名称
	* @param {string} sql sql语句 exp:'id REAL UNIQUE, name TEXT'
	* @return 无
	*/
    this.createTable = function (table,fields) {//id REAL UNIQUE, name TEXT
		if(table != undefined){
			var sql = "create table if not exists "+table+" ("+fields+")";	
			_this.transaction(sql);
		}
		else{
			console.log('表不能为空');
		}
    }
	/**
	* 添加数据
	* @param {string} table 表名称
	* @param {object} Data 插入的数据 exp:{id:'1','version':'123456'}
	* @param {func} success 回调函数
	* @return 无
	*/
    this.insert = function (table,Data,success) {	
		var dataKey = '';
		var dataValue = '';
		for(var i in Data){
		    var data = Data[i];
		    if(typeof data == 'string'){
		        data = "'"+data+"'";
		    }
			if(dataKey ==''){
				dataValue += data;
				dataKey += i;
			}
			else{
				dataValue += ',' + data;
				dataKey += ',' + i;
			}
		}
		var sql = "insert into "+table+" ("+dataKey+") VALUES ("+dataValue+")";
        _this.transaction(sql,success);
    }
	
	/**
	* 删除数据
	* @param {string} table 表名称
	* @param {object} con 查找条件 exp: {name:'xxx'}
	* @param {func} success 回调函数
	* @return 无
	*/
    this.del = function (table,con,success) {
		for(var i in con){			
			var condition = " "+i+"='"+ con[i] +"'"; 
		}
		var sql = "delete from  "+table+" where "+condition;
        _this.transaction(sql,success);
    }	

    /**
	* 更新数据
	* @param {string} table 表名称
	* @param {object} con 查找条件 exp: {name:'xxx'}
	* @param {object} obj 要更新的数据 exp:{id:'1','version':'123456'}
	* @param {func} success 回调函数
	* @return 无
	*/
    this.update = function (table,con,obj,success) {
		for(var i in con){			
			var condition = " "+i+"='"+ con[i] +"'"; 
		}
		var setData = '';
		for(var k in obj){
			if(setData ==''){
				setData += k+"='"+obj[k]+"'";
			}else{
				setData += ','+k+'=' + "'"+obj[k]+"'";
			}
		}
		var sql = "update "+table+" set "+setData+" where"+condition;
        _this.transaction(sql,success);
    }
	
    
    
	/**
	* 查询数据
	* @param {string} table 表名称
	* @param {object|string} con 查找条件 exp: {name:'xxx'}
	* @param {func} success 回调函数 exp: data.item(0)
	* @return 无
	*/
    this.query = function (table,con,success) {
		for(var i in con){
			var sql = "select * from "+table+" where "+i+"='"+ con[i] +"'"; 
		}
        _this.transaction(sql,success);
    }


    /**
	* 删除表
	* @param {string} table 表名称
	* @param {func} success 回调函数
	* @return 无
	*/
    this.dropTable = function (table,success) {
	
		var sql = "drop  table "+table;
		_this.transaction(sql,success);
    }
	
	/**
	*  自定义sql方法
	*  @param {string} sql 查询语句
	*  @param {func} success 回调函数
	*  @return 无
	*/
	this.execute = function(sql,success){
		_this.transaction(sql,success);
	}
	
	/**
	*  sql查询
	*  @param {string} sql 查询语句
	*  @param {func} success 回调函数
	*  @return 无
	*/
	this.transaction = function(sql,success){		
		_dataBase.transaction(function (tx) {
            tx.executeSql(sql,
			[],
			function(tx, result){
				if(_this.debug == true){
					_this.openDebug(sql)
				}
				if(success != undefined){
					success(result.rows);
				}
			},
			function(tx, error){
				console.log(error)
			});
        });
	}
	
	//debug 方法
	this.openDebug = function(sql){
		var type = sql.split(' ')[0];
		switch(type){
			case 'create':
				console.log('创建表成功: '+sql);
				break;
			case 'drop':
				console.log('删除表成功: '+sql);
				break;
			case 'insert':
				console.log('增加数据成功: '+sql);
				break;
			case 'delete':
				console.log('删除数据成功: '+sql);
				break;
			case 'update':
				console.log('更新数据成功: '+sql);
				break;
			case 'select':
				console.log('查询数据成功: '+sql);
				break;
			default:
				console.log('执行语句成功: '+sql);
				return;
		}
	}
	this.openDatabase(databaseName);
}