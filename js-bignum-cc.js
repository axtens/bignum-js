var BIGNUM = function() {
  var k = 100;
  0 < arguments.length && (k = arguments[0]);
  return{lastdigit:0, signbit:1, digits:function(g) {
    for(var a = [], b = 0;0 === (a[b++] = 0) && b < g;) {
    }
    return a
  }(k), toString:function() {
    return(-1 === this.signbit ? "-" : "") + this.digits.slice(0, this.lastdigit + 1).reverse().join("")
  }, toInteger:function() {
    return parseInt((-1 === this.signbit ? "-" : "") + this.digits.slice(0, this.lastdigit + 1).reverse().join(""), 10)
  }, toN:function(g) {
    this.lastdigit = 0;
    this.signbit = 1;
    this.digits[0] = g % 10
  }}
}, BIGNUMLIB = function() {
  var k = 100, g = [];
  0 < arguments.length && (k = arguments[0]);
  return{MINUS:-1, PLUS:1, BASE62:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", BASE36:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", BASE16:"0123456789ABCDEF", BASE8:"01234567", BASE2:"01", ZERO:function() {
    var a = new BIGNUM;
    a.toN(0);
    return a
  }, ONE:function() {
    var a = new BIGNUM;
    a.toN(1);
    return a
  }, isZero:function(a) {
    return 0 === this.compare_bignum(this.ZERO(), a)
  }, isOne:function(a) {
    return 0 === this.compare_bignum(this.ONE(), a)
  }, memodump:function() {
    var a = "", b;
    for(b in g) {
      a += b + "\t" + g[b].toString() + "\n"
    }
    return a
  }, memoclear:function() {
    g = []
  }, memorecall:function(a) {
    if(g[a]) {
      return g[a]
    }
  }, clone:function(a) {
    var b = new BIGNUM(k);
    b.lastdigit = a.lastdigit;
    b.signbit = a.signbit;
    b.digits = a.digits.slice(0, a.digits.length);
    return b
  }, clear:function(a) {
    a.lastdigit = 0;
    a.signbit = 1;
    a.digits = [];
    for(var b = 0;0 === (a.digits[b++] = 0) && b < k;) {
    }
    return a
  }, toBignum:function(a) {
    var b, d, c;
    if("number" === typeof a) {
      c = new BIGNUM(k);
      c.signbit = 0 <= a ? 1 : -1;
      c.lastdigit = -1;
      for(b = Math.abs(a);0 < b;) {
        c.lastdigit++, c.digits[c.lastdigit] = b % 10, b = Math.floor(b / 10)
      }
      0 === a && (c.lastdigit = 0)
    }else {
      if("string" === typeof a) {
        if("" === a) {
          return this.toBignum(0)
        }
        c = new BIGNUM(k);
        "-" === a.substr(0, 1) ? (b = 1, c.signbit = -1) : (b = 0, c.signbit = 1);
        c.lastdigit = -1;
        for(d = a.length - 1;d >= b;d--) {
          c.lastdigit++, c.digits[c.lastdigit] = parseInt(a.substr(d, 1), 10)
        }
      }else {
        c = new BIGNUM(k), c.lastdigit = a.lastdigit, c.signbit = a.signbit, c.digits = a.digits.slice(0, a.digits.length)
      }
    }
    return c
  }, add_bignum:function(a, b) {
    var d, c;
    if("0" === a.toString()) {
      return b
    }
    if("0" === b.toString()) {
      return a
    }
    var e = a.toString() + "+" + b.toString();
    if(g[e]) {
      return g[e]
    }
    var f = new BIGNUM(k), f = this.toBignum(0);
    if(a.signbit === b.signbit) {
      f.signbit = a.signbit
    }else {
      return-1 === a.signbit ? (a.signbit = 1, f = this.subtract_bignum(b, a), a.signbit = -1) : (b.signbit = 1, f = this.subtract_bignum(a, b), b.signbit = -1), f
    }
    f.lastdigit = Math.max(a.lastdigit, b.lastdigit) + 1;
    for(c = d = 0;c <= f.lastdigit;c++) {
      f.digits[c] = (d + a.digits[c] + b.digits[c]) % 10, d = Math.floor((d + a.digits[c] + b.digits[c]) / 10)
    }
    f = this.zero_justify(f);
    return g[e] = f
  }, negate:function(a) {
    a = this.clone(a);
    a.signbit *= -1;
    return a
  }, subtract_bignum:function(a, b) {
    var d, c, e;
    if("0" === a.toString()) {
      return this.negate(b)
    }
    if("0" === b.toString()) {
      return a
    }
    var f = a.toString() + "-" + b.toString();
    if(g[f]) {
      return g[f]
    }
    var h = new BIGNUM(k), h = this.toBignum(0);
    if(-1 === a.signbit || -1 === b.signbit) {
      return b.signbit *= -1, h = this.add_bignum(a, b), b.signbit *= -1, h
    }
    if(1 === this.compare_bignum(a, b)) {
      return h = this.subtract_bignum(b, a), h.signbit = -1, h
    }
    h.lastdigit = Math.max(a.lastdigit, b.lastdigit);
    for(e = d = 0;e <= h.lastdigit;e++) {
      c = a.digits[e] - d - b.digits[e], 0 < a.digits[e] && (d = 0), 0 > c && (c += 10, d = 1), h.digits[e] = c % 10
    }
    h = this.zero_justify(h);
    return g[f] = h
  }, compare_bignum:function(a, b) {
    var d = a.toString() + "$" + b.toString();
    if(g[d]) {
      return g[d]
    }
    var c, e = 0;
    if(-1 === a.signbit && 1 === b.signbit) {
      e = 1
    }else {
      if(1 === a.signbit && -1 === b.signbit) {
        e = -1
      }else {
        if(b.lastdigit > a.lastdigit) {
          e = 1 * a.signbit
        }else {
          if(a.lastdigit > b.lastdigit) {
            e = -1 * a.signbit
          }else {
            for(c = a.lastdigit;0 <= c;c--) {
              if(a.digits[c] > b.digits[c]) {
                e = -1 * a.signbit;
                break
              }
              if(b.digits[c] > a.digits[c]) {
                e = 1 * a.signbit;
                break
              }
            }
          }
        }
      }
    }
    return g[d] = e
  }, zero_justify:function(a) {
    for(;0 < a.lastdigit && 0 === a.digits[a.lastdigit];) {
      a.lastdigit--
    }
    0 === a.lastdigit && 0 === a.digits[0] && (a.signbit = 1);
    return a
  }, digit_shift:function(a, b) {
    var d;
    if(0 === a.lastdigit && 0 === a.digits[0]) {
      return a
    }
    for(d = a.lastdigit;0 <= d;d--) {
      a.digits[d + b] = a.digits[d]
    }
    for(d = 0;d < b;d++) {
      a.digits[d] = 0
    }
    a.lastdigit += b;
    return a
  }, multiply_bignum:function(a, b) {
    var d, c;
    if("0" === a.toString() || "0" === b.toString()) {
      return this.ZERO()
    }
    var e = a.toString() + "*" + b.toString();
    if(g[e]) {
      return g[e]
    }
    var f = new BIGNUM(k), f = new BIGNUM(k), f = this.toBignum(0), h = this.clone(a);
    for(d = 0;d <= b.lastdigit;d++) {
      for(c = 1;c <= b.digits[d];c++) {
        f = this.add_bignum(f, h), f = this.clone(f)
      }
      h = this.digit_shift(h, 1)
    }
    f.signbit = a.signbit * b.signbit;
    f = this.zero_justify(f);
    return g[e] = f
  }, divide_bignum:function(a, b) {
    var d, c, e;
    if("0" === b.toString()) {
      throw"divide by zero";
    }
    if("0" === a.toString()) {
      return this.ZERO()
    }
    var f = a.toString() + "/" + b.toString();
    if(g[f]) {
      return g[f]
    }
    var h = new BIGNUM(k), h = this.toBignum(0), l = this.toBignum(0), m = this.toBignum(0);
    h.signbit = a.signbit * b.signbit;
    d = a.signbit;
    c = b.signbit;
    a.signbit = 1;
    b.signbit = 1;
    for(e = h.lastdigit = a.lastdigit;0 <= e;e--) {
      for(l = this.digit_shift(l, 1), l.digits[0] = a.digits[e], h.digits[e] = 0;1 !== this.compare_bignum(l, b);) {
        h.digits[e]++, m = this.subtract_bignum(l, b), l = this.clone(m)
      }
    }
    h = this.zero_justify(h);
    a.signbit = d;
    b.signbit = c;
    return g[f] = h
  }, modulus_bignum:function(a, b) {
    if("0" === b.toString()) {
      throw"divide by zero";
    }
    if("0" === a.toString()) {
      return this.ZERO()
    }
    var d = a.toString() + "%" + b.toString();
    if(g[d]) {
      return g[d]
    }
    var c = new BIGNUM(k), c = this.compare_bignum(a, b);
    -1 === c ? (c = this.divide_bignum(a, b), c = this.multiply_bignum(c, b), c = this.subtract_bignum(a, c)) : c = 1 === c ? a : this.toBignum(0);
    return g[d] = c
  }, power_bignum:function(a, b) {
    var d = a.toString() + "^" + b.toString();
    if(g[d]) {
      return g[d]
    }
    var c = new BIGNUM(k);
    if(0 === b) {
      c = this.toBignum(1)
    }else {
      for(var c = this.clone(a), e = this.toBignum(0), f = 1;f < b;f++) {
        e = this.multiply_bignum(a, c), c = this.clone(e)
      }
    }
    return g[d] = c
  }, bignum_to_base:function(a, b) {
    for(var d = this.toBignum(b.length), c = "";1 === this.compare_bignum(this.ZERO, a);) {
      var e = this.modulus_bignum(a, d), c = b.substr(e.toInteger(), 1) + c;
      a = this.divide_bignum(a, d)
    }
    return c
  }, base_to_bignum:function(a, b) {
    for(var d = this.toBignum(b.length), c = this.toBignum(0), e = 0, f = a.length - 1, g = 0;0 <= f;f--, g++) {
      var e = a.substr(f, 1), k = this.power_bignum(d, g), e = this.toBignum(b.indexOf(e)), k = 1 === this.compare_bignum(e, k) ? this.multiply_bignum(k, e) : this.multiply_bignum(e, k), c = this.add_bignum(c, k)
    }
    return c
  }}
};
"undefined" !== typeof module && (exports.BIGNUM = BIGNUM, exports.BIGNUMLIB = BIGNUMLIB);

