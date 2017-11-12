var fibo = function fibo (n) {//定义算法
  return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}
process.on('message', function(m) {
  //接收主进程发送过来的消息
  if(typeof m === 'object' && m.type === 'fibo'){
    var num = fibo(~~m.num);
    //计算jibo
    process.send({type: 'fibo',result:num})
    //计算完毕返回结果
  }
});
process.on('SIGHUP', function() {
  process.exit();//收到kill信息，进程退出
});