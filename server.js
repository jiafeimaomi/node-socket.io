var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    socketIo = require('socket.io').listen(server);

    app.use('/', express.static(__dirname+'/public')); //托管静态文件

    server.listen(9090);

var mongoose = require('mongoose');

var uri = 'mongodb://127.0.0.1:27017/lxl'; //连接mongo数据库
mongoose.connect(uri, function(error) {
  // if error is truthy, the initial connection failed.
  console.log('error', error);
})
console.log('server start!')
// console.log('socketIo', socketIo);
var Schema = mongoose.Schema;
var UserModel = require('./module/user');
//定义一个Schema,定义了集合的字段
var UserSchema = new Schema(UserModel);
//将Schema转化为model
var User = mongoose.model('User', UserSchema);

socketIo.on('connection', function(socket){
    console.log('socket已经连接')
    socket.on('login', function(data){
        User.findOne({username: data.username}, function(error, doc){
            if(doc && doc._id){
                socket.emit('nickExisted')
            }else{
                User.create({
                    username: data.username,
                    password: data.password
                },function(error, doc){
                    if(doc._id){
                        socket.emit('success')
                    }
                })
            }
        })
    }),
    socket.on('clear', function(){
        
    })
})



