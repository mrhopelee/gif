function readUInt16(buffer, offset, bigEndian) {
    if (buffer.readUInt16) {
        return buffer.readUInt16(offset, bigEndian);
    }

    var value;
    if (bigEndian) {
        if (buffer.readUInt16BE) {
            return buffer.readUInt16BE(offset);
        }
        value = (buffer[offset] << 8) + buffer[offset+1];
    }
    else {
        if (buffer.readUInt16LE) {
            return buffer.readUInt16LE(offset);
        }
        value = buffer[offset] + (buffer[offset+1] << 8);
    }
    return value;
}

function imageInfoGif(buffer) {
    var pos = 6;
    //var gifstr = 'NETSCAPE2.0';
	//var gifstr = [0x21,0xff,0x0b,0x4e,0x45,0x54];
	/* var gifbuffer= new Buffer([ 0x21, 0xff, 0x0b ]) ;
	var gifbufferstr = gifbuffer.toString("utf-8"); 
	var gifstr = gifbuffer+'NETSCAPE2.0';
	
	var bufferstr = buffer.toString('utf-8'); */
    
    return {
        type: 'image',
        format: 'GIF',
        mimeType: 'image/gif',
        width: readUInt16(buffer, pos, false),
        height: readUInt16(buffer, pos+2, false),
        isSingle: checkSorM(buffer),
        SorM: checkSorM(buffer)===-1?"Single-frame":"Multi-frame",
    };
}

function checkSorM(buffer) {
    //var temp = buffer.toString('utf-8').indexOf((new Buffer([ 0x21, 0xff, 0x0b ])+'NETSCAPE2.0').toString("utf-8"));
    return buffer.toString('utf-8').indexOf((new Buffer([ 0x21, 0xff, 0x0b ])+'NETSCAPE2.0').toString("utf-8"));
}

function checkSig(buffer, offset, sig) {
    var len = sig.length;
    for (var i = 0; i < len; i++) {
        var b = buffer[i+offset],
            s = sig[i],
            m = false;

        if ('number' == typeof s) {
            m = s === b;
        }
        else {
            for (var k in s) {
                var o = s[k];
                if (o === b) {
                    m = true;
                }
            }
        }

        if (!m) {
            return false;
        }
    }

    return true;
}

module.exports = function singleframe(buffer, path) {
    var gifSig = [0x47, 0x49, 0x46, 0x38, [0x37, 0x39], 0x61];

    if (checkSig(buffer, 0, gifSig)) return imageInfoGif(buffer);

    return false;
};