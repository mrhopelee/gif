var fs = require("fs");
var singleframe = require("./singleframe"),
    imageinfo = require("./imageinfo"),
    gm = require('gm').subClass({imageMagick: true});

var execFile = require('child_process').execFile;
var gifsicle = require('gifsicle');

//异步读取文件并获取gif格式的图片信息
/* fs.readFile('gifimg/mao.gif', function(err, data) {
    if (err) throw err;

    info = singleframe(data);
    console.log("Data is type:", info.mimeType);
    console.log("  Size:", data.length, "bytes");
    console.log("  Dimensions:", info.width, "x", info.height);
    console.log("  SorM:", info.SorM);
    //console.log("  gifstr:", info.gifstr); 
    
}); */

var params = process.argv.slice(2);

//读取目录
if(params[0]) {
    console.log("进入文件目录："+params[0]);
    fs.readdir(params[0],function(err, files){
        if (err) {
            console.log("找不到文件目录："+params[0]);
            return console.error(err);
        }
        console.log("读取对应目录中的所有文件");
        files.forEach( function (file){

            //判断文件还是目录？
            fs.stat(params[0]+'/' + file, function (err, stats) {
                if (err) throw err;

                if (stats.isFile()) {
                    console.log("%s is file", file);
                    //gm判断图片是否单帧
                    //gmSingle(file);
                    //高效版判断图片是否单帧
                    mySingle(params[0],file);
                    //获取图片信息
                    //getImageInfo(params[0],file);
                }
                else if (stats.isDirectory ()) {
                    console.log("%s is a directory", file);
                }
                //输出文件的信息
                //console.log('stats:  %s',JSON.stringify(stats));
            });
        });
    }); 
} else {
    console.log("没有文件目录名参数："+params[0]);
    return false;
}

function gmSingle(file){
    gm('gifimg/'+file).identify(function(err, value){ 
                console.log("正在读取"+file.toString());    
                console.log(value.Iterations);
                console.log("读取"+file+"完毕\n");
            });        
}

function mySingle(dir,file){
    var buf = new Buffer(1024);
            fs.open(dir+'/'+file, 'r+', function(err, fd) {
               if (err) {
                   return console.error(err);
               }
               
               fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
                  if (err){
                     console.log(err);
                      return false;
                  }
                  console.log("文件打开成功！");
                  console.log("正在读取"+file.toString());

                  info = singleframe(buf);
                  if(info.isSingle===-1){
                      /*console.log("Data is type:", info.mimeType);
                      console.log("  Size:", buf.length, "bytes");
                      console.log("  Dimensions:", info.width, "x", info.height);
                      console.log("  NotSingle:", info.isSingle);
                      console.log("  SorM:", info.SorM);*/

                      fs.readFile(dir+'/'+file, function(err, data) {
                          if (err) throw err;
                          gm(data)
                              .stream('jpg', function (err, stdout, stderr) {
                                  var writeStream = fs.createWriteStream(dir+'/opt/'+file.replace(/.gif/, '')+'-g2j'+'.jpg');
                                  stdout.pipe(writeStream);
                              });

                      });
                  }else {
                      /*console.log("图片为多帧gif动画");
                      execFile(gifsicle, ['-O3','-o', dir+'/'+'opt'+file, dir+'/'+file], function (err) {
                          console.log('Image minified!');
                      });*/
                  }

                  console.log(bytes + "  字节被读取");
                  console.log("读取"+file+"完毕\n");

                   fs.close(fd, function(err){
                       if (err){
                           console.log(err);
                       }
                       console.log("文件关闭成功");
                   });

               });
            });       
}

function getImageInfo(dir,file){
    fs.readFile(dir+'/'+file, function(err, data) {
        if (err) throw err;

        info = imageinfo(data);
        console.log("正在读取"+file.toString());
        console.log("Data is type:", info.mimeType);
        console.log("  Size:", data.length, "bytes");
        console.log("  Dimensions:", info.width, "x", info.height);
    });
}

//打开文件->读取图片信息
// var buf = new Buffer(1024);
// console.log("准备打开已存在的文件！");
// fs.open('gifimg/'+params[0], 'r+', function(err, fd) {
   // if (err) {
       // return console.error(err);
   // }
   
   // console.log("文件打开成功！");
   // console.log("准备读取文件：");
   // fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
      // if (err){
         // console.log(err);
      // }
      
      // info = singleframe(buf);
      // if(info){
          // console.log("Data is type:", info.mimeType);
          // console.log("  Size:", buf.length, "bytes");
          // console.log("  Dimensions:", info.width, "x", info.height);
          // console.log("  NotSingle:", info.isSingle);
          // console.log("  SorM:", info.SorM);
      // }else {
          // console.log("format not gif");
      // }
      // console.log(bytes + "  字节被读取");
      
      ////写入读取到的1024字节数据到gifinfo.txt
      // /* if(bytes > 0){
         // console.log(buf.slice(0, bytes).toString());
      // }
      
      // fs.writeFile('gifinfo.txt', buf, {encoding: 'utf8'},  function(err) {
          // if (err) {
            // return console.error(err);
          // }
          // console.log("数据写入成功！");
          // console.log("--------我是分割线-------------")
          // console.log("读取写入的数据！");
          // fs.readFile('gifinfo.txt', function (err, data) {
            // if (err) {
              // return console.error(err);
            // }
            // console.log("异步读取文件数据: " + data.toString());
          // });
      // }); */
   // });
// });