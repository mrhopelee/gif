var fs = require('fs')
  , gm = require('gm').subClass({imageMagick: true});

fs.readFile('otherimg/mao.png', function(err, data) {
    if (err) throw err;

    
	//gm('otherimg/google.png')
	gm(data)
	.stream('gif', function (err, stdout, stderr) {
	  var writeStream = fs.createWriteStream('gifimg/mao.gif');
	  stdout.pipe(writeStream);
	});   
    
});

