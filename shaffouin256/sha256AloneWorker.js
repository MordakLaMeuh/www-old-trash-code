/*
 * Crypto-JS v2.5.1
 * http://code.google.com/p/crypto-js/
 * (c) 2009-2011 by Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */

importScripts('crypto-min.js');

var K = [ 0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
          0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
          0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
          0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
          0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
          0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
          0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
          0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
          0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
          0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
          0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
          0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
          0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
          0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
          0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
          0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2 ];

function sha256(m, H) {

    var w = [],
        a, b, c, d, e, f, g, h, i, j,
        t1, t2;

    for (var i = 0; i < m.length; i += 16) {

        a = H[0];
        b = H[1];
        c = H[2];
        d = H[3];
        e = H[4];
        f = H[5];
        g = H[6];
        h = H[7];

        for (var j = 0; j < 64; j++) {

            if (j < 16) w[j] = m[j + i];
            else {

                var gamma0x = w[j - 15],
                    gamma1x = w[j - 2],
                    gamma0  = ((gamma0x << 25) | (gamma0x >>>  7)) ^
                              ((gamma0x << 14) | (gamma0x >>> 18)) ^
                               (gamma0x >>> 3),
                    gamma1  = ((gamma1x <<  15) | (gamma1x >>> 17)) ^
                              ((gamma1x <<  13) | (gamma1x >>> 19)) ^
                               (gamma1x >>> 10);

                w[j] = gamma0 + (w[j - 7] >>> 0) +
                       gamma1 + (w[j - 16] >>> 0);

            }

            var ch  = e & f ^ ~e & g,
                maj = a & b ^ a & c ^ b & c,
                sigma0 = ((a << 30) | (a >>>  2)) ^
                         ((a << 19) | (a >>> 13)) ^
                         ((a << 10) | (a >>> 22)),
                sigma1 = ((e << 26) | (e >>>  6)) ^
                         ((e << 21) | (e >>> 11)) ^
                         ((e <<  7) | (e >>> 25));


            t1 = (h >>> 0) + sigma1 + ch + (K[j]) + (w[j] >>> 0);
            t2 = sigma0 + maj;

            h = g;
            g = f;
            f = e;
            e = (d + t1) >>> 0;
            d = c;
            c = b;
            b = a;
            a = (t1 + t2) >>> 0;

        }

        // Intermediate hash value
        H[0] = (H[0] + a) | 0;
        H[1] = (H[1] + b) | 0;
        H[2] = (H[2] + c) | 0;
        H[3] = (H[3] + d) | 0;
        H[4] = (H[4] + e) | 0;
        H[5] = (H[5] + f) | 0;
        H[6] = (H[6] + g) | 0;
        H[7] = (H[7] + h) | 0;
    }

    return H;

};

/*
 * (c) 2011 by md5file.com. All rights reserved.
 * (modified lightly by Mordak for hash g??n??rating)
 */

self.addEventListener('message', function (event) {

	self.hash = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];

	var uint8_array = new Uint8Array(event.data.message);
	var message = Crypto.util.bytesToWords(uint8_array);
	var block = event.data.block;
	event = null;
	uint8_array = null;
	var output = {
		'block' : block
	};
	var nBitsTotal = block.blockSize * 8;
	var nBitsLeft = block.blockSize * 8;

      var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
      var nBitsTotalL = nBitsTotal & 0xFFFFFFFF;

      // Padding
      message[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsTotal % 32);
      message[((nBitsLeft + 64 >>> 9) << 4) + 14] = nBitsTotalH;
      message[((nBitsLeft + 64 >>> 9) << 4) + 15] = nBitsTotalL;

      self.hash = sha256(message, self.hash);

      output.result = Crypto.util.bytesToHex(Crypto.util.wordsToBytes(self.hash));

	message = null;
	self.postMessage(output);
}, false);