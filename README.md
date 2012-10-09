database-API
============
web sql database API

仅支持database的浏览器，webkit内核浏览器，chrome/safari，不支持firefox

==================
*Example：*
	var webSql = new webStorage('table1'); // 开启table1库
	webSq.debug = true // 开启调试
	
	常用方法:
	webSql.createTable('ddd')
	webSql.dropTable('ddd')
	webSql.insert('stu2',{id:'1',name:'123456'})
	webSql.del('stu2',{name:'123456'},function(data){console.log(data)})
	webSql.update('stu2',{name:'ddd'},{id:'ddd',name:'fdfd'})
	webSql.query('stu2',{id:'ddd'},function(data){console.log(data.item(0))})
	
	用户自定义方法:
	webSql.execute('create table if not exists stu2 (id REAL UNIQUE, name TEXT)');
	webSql.execute('insert into stu2 (id, name) values("333","444")')
	webSql.execute('delete from stu2 where id=333')
	webSql.execute('update stu2 set name="ddd",id="444" where id=333')
	webSql.execute('select * from stu2 where id=444',function(data){console.log(data.item(0));console.log(data.length)})

