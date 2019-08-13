var BIGNUM = function() {
  var MAXDIGITS = 100;
  var MINUS = -1;
  var PLUS = 1;
  var initArray = function(n) {
    var e = [],
        c = 0;
    while ((e[c++] = 0) === 0 && c < n) {}
    return e;
  };
  if (arguments.length > 0) {
    MAXDIGITS = arguments[0];
  }
  return {
    lastdigit: 0,
    signbit: 1,
    digits: initArray(MAXDIGITS),
    toString: function() {
      return (this.signbit === MINUS ? '-' : '') +
          this.digits.slice(0, this.lastdigit + 1).reverse().join('');
    },
    toInteger: function() {
      return parseInt((this.signbit === MINUS ? '-' : '') +
          this.digits.slice(0, this.lastdigit + 1).reverse().join(''), 10);
    },
	toN: function (N) {
		this.lastdigit = 0;
		this.signbit = 1;
		this.digits[0] = N % 10;
	}
  };
};

var BIGNUMLIB = function() {
  var MAXDIGITS = 100;
  var MINUS = -1;
  var PLUS = 1;
  var memo = [];
  if (arguments.length > 0) {
    MAXDIGITS = arguments[0];
  }
  return {
    MINUS: -1,
    PLUS: 1,
    BASE62: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    BASE36: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    BASE16: '0123456789ABCDEF',
    BASE8: '01234567',
    BASE2: '01',
    ZERO: function () {
		var x = new BIGNUM();
		x.toN(0);
		return x;
	},
    ONE: function () {
		var x = new BIGNUM();
		x.toN(1);
		return x;
	},
    isZero: function(a) {
      return this.compare_bignum(this.ZERO(), a) === 0;
    },
    isOne: function(a) {
      return this.compare_bignum(this.ONE(), a) === 0;
    },
    memodump: function() {
      var res = '';
      for (var key in memo) {
        res += (key + '\t' + memo[key].toString() + '\n');
      }
      return res;
    },
    memoclear: function() {
      memo = [];
    },
    memorecall: function(key) {
      if (memo[key]) {
        return memo[key];
      } else {
        return;
      }
    },
    clone: function(b) {
      var b2 = new BIGNUM(MAXDIGITS);
      b2.lastdigit = b.lastdigit;
      b2.signbit = b.signbit;
      b2.digits = b.digits.slice(0, b.digits.length);
      return b2;
    },
    clear: function(b) {
      b.lastdigit = 0;
      b.signbit = 1;
      b.digits = [];
      var c = 0;
      while ((b.digits[c++] = 0) === 0 && c < MAXDIGITS) {}
      return b;
    },
    toBignum: function(n) {
      var t, i, b;
      if ('number' === typeof n) {
        b = new BIGNUM(MAXDIGITS);

        if (n >= 0) {
          b.signbit = PLUS;
        } else {
          b.signbit = MINUS;
        }

        b.lastdigit = -1;

        t = Math.abs(n);
        while (t > 0) {
          b.lastdigit++;
          b.digits[b.lastdigit] = (t % 10);
          t = Math.floor(t / 10);
        }

        if (n === 0) {
          b.lastdigit = 0;
        }
        return b;
      } else if ('string' === typeof n) {

        if (n === '') {
          return this.toBignum(0);
        }

        b = new BIGNUM(MAXDIGITS);

        if (n.substr(0, 1) === '-') {
          t = 1;
          b.signbit = MINUS;
        } else {
          t = 0;
          b.signbit = PLUS;
        }

        b.lastdigit = -1;

        for (i = n.length - 1; i >= t; i--) {
          b.lastdigit++;
          b.digits[b.lastdigit] = parseInt(n.substr(i, 1), 10);
        }
        return b;
      } else {
        // assuming it's a Bignum. Anything else will likely crash.
        b = new BIGNUM(MAXDIGITS);
        b.lastdigit = n.lastdigit;
        b.signbit = n.signbit;
        b.digits = n.digits.slice(0, n.digits.length);
        return b;
      }
    },
    add_bignum: function(a, b) {
      var carry,
          i;

/*       if (this.isZero(a)) {
        return b;
      } else if (this.isZero(b)) {
        return a;
      }
 */
	  if (a.toString() === "0") {
        return b;
      } else if (b.toString() === "0") {
        return a;
      }

      var key = a.toString() + '+' + b.toString();
      if (memo[key]) {
        return memo[key];
      }

      var c = new BIGNUM(MAXDIGITS);
      c = this.toBignum(0);

      if (a.signbit === b.signbit) {
        c.signbit = a.signbit;
      } else {
        if (a.signbit === MINUS) {
          a.signbit = PLUS;
          c = this.subtract_bignum(b, a);
          a.signbit = MINUS;
        } else {
          b.signbit = PLUS;
          c = this.subtract_bignum(a, b);
          b.signbit = MINUS;
        }
        return c;
      }

      c.lastdigit = Math.max(a.lastdigit, b.lastdigit) + 1;
      carry = 0;

      for (i = 0; i <= (c.lastdigit); i++) {
        c.digits[i] = (carry + a.digits[i] + b.digits[i]) % 10;
        carry = Math.floor((carry + a.digits[i] + b.digits[i]) / 10);
      }

      c = this.zero_justify(c);
      memo[key] = c;
      return c;
    },
    negate: function(a) {
      var b = this.clone(a);
      b.signbit *= MINUS;
      return b;
    },
    subtract_bignum: function(a, b) {
      var borrow,
          v,
          i;

/*       if (this.isZero(a)) {
        return this.negate(b);
      } else if (this.isZero(b)) {
        return a;
      }
*/
      if (a.toString() === "0") {
        return this.negate(b);
      } else if (b.toString() === "0") {
        return a;
      }

      var key = a.toString() + '-' + b.toString();
      if (memo[key]) {
        return memo[key];
      }

      var c = new BIGNUM(MAXDIGITS);
      c = this.toBignum(0);

      if ((a.signbit === MINUS) || (b.signbit === MINUS)) {
        b.signbit = -1 * b.signbit;
        c = this.add_bignum(a, b);
        b.signbit = -1 * b.signbit;
        return c;
      }

      if (this.compare_bignum(a, b) === PLUS) {
        c = this.subtract_bignum(b, a);
        c.signbit = MINUS;
        return c;
      }

      c.lastdigit = Math.max(a.lastdigit, b.lastdigit);
      borrow = 0;

      for (i = 0; i <= (c.lastdigit); i++) {
        v = (a.digits[i] - borrow - b.digits[i]);
        if (a.digits[i] > 0) {
          borrow = 0;
        }
        if (v < 0) {
          v = v + 10;
          borrow = 1;
        }

        c.digits[i] = v % 10;
      }

      c = this.zero_justify(c);
      memo[key] = c;
      return c;
    },
    compare_bignum: function(a, b) {

      var key = a.toString() + '$' + b.toString();
      if (memo[key]) {
        return memo[key];
      }

      var i;
      var res = 0;
      if ((a.signbit === MINUS) && (b.signbit === PLUS)) {
        res = (PLUS);
      } else if ((a.signbit === PLUS) && (b.signbit === MINUS)) {
        res = (MINUS);
      } else if (b.lastdigit > a.lastdigit) {
        res = (PLUS * a.signbit);
      } else if (a.lastdigit > b.lastdigit) {
        res = (MINUS * a.signbit);
      } else {
        for (i = a.lastdigit; i >= 0; i--) {
          if (a.digits[i] > b.digits[i]) {
            res = (MINUS * a.signbit);
            break;
          }
          if (b.digits[i] > a.digits[i]) {
            res = (PLUS * a.signbit);
            break;
          }
        }
      }
      memo[key] = res;
      return res;
    },
    zero_justify: function(n) {
      while ((n.lastdigit > 0) && (n.digits[n.lastdigit] === 0)) {
        n.lastdigit--;
      }

      if ((n.lastdigit === 0) && (n.digits[0] === 0)) {
        n.signbit = PLUS;
      }
      return n;
      /* hack to avoid -0 */
    },
    digit_shift: function(n, d) {
      var i;

      if ((n.lastdigit === 0) && (n.digits[0] === 0)) {
        return n;
      }

      for (i = n.lastdigit; i >= 0; i--) {
        n.digits[i + d] = n.digits[i];
      }

      for (i = 0; i < d; i++) {
        n.digits[i] = 0;
      }

      n.lastdigit = n.lastdigit + d;
      return n;
    },
    multiply_bignum: function(a, b) {
      var i,
          j;

/*       if (this.isZero(a)) {
        return this.ZERO;
      } else if (this.isZero(b)) {
        return this.ZERO;
      }
 */
      if (a.toString() === "0") {
        return this.ZERO();
      } else if (b.toString() === "0") {
        return this.ZERO();
      }

      var key = a.toString() + '*' + b.toString();
      if (memo[key]) {
        return memo[key];
      }

      var tmp = new BIGNUM(MAXDIGITS);
      var c = new BIGNUM(MAXDIGITS);
      c = this.toBignum(0);

      var row = this.clone(a);

      for (i = 0; i <= b.lastdigit; i++) {
        for (j = 1; j <= b.digits[i]; j++) {
          tmp = this.add_bignum(c, row);
          c = this.clone(tmp);
        }
        row = this.digit_shift(row, 1);
      }

      c.signbit = a.signbit * b.signbit;

      c = this.zero_justify(c);
      memo[key] = c;
      return c;
    },
    divide_bignum: function(a, b) {
      var asign,
          bsign,
          i;

/*       if (this.isZero(b)) {
        throw 'divide by zero';
      } else if (this.isZero(a)) {
        return this.ZERO;
      }
 */
      if (b.toString() === "0") {
        throw 'divide by zero';
      } else if (a.toString() === "0") {
        return this.ZERO();
      }


      var key = a.toString() + '/' + b.toString();
      if (memo[key]) {
        return memo[key];
      }

      var c = new BIGNUM(MAXDIGITS);
      c = this.toBignum(0);
      var row = this.toBignum(0);
      var tmp = this.toBignum(0);

      c.signbit = a.signbit * b.signbit;

      asign = a.signbit;
      bsign = b.signbit;

      a.signbit = PLUS;
      b.signbit = PLUS;

      c.lastdigit = a.lastdigit;

      for (i = a.lastdigit; i >= 0; i--) {
        row = this.digit_shift(row, 1);
        row.digits[0] = a.digits[i];
        c.digits[i] = 0;
        while (this.compare_bignum(row, b) !== PLUS) {
          c.digits[i]++;
          tmp = this.subtract_bignum(row, b);
          row = this.clone(tmp);
        }
      }

      c = this.zero_justify(c);

      a.signbit = asign;
      b.signbit = bsign;
      memo[key] = c;
      return c;
    },
    modulus_bignum: function(a, b) {

/*       if (this.isZero(b)) {
        throw 'divide by zero';
      } else if (this.isZero(a)) {
        return this.ZERO;
      }
 */
      if (b.toString() === "0") {
        throw 'divide by zero';
      } else if (a.toString() === "0") {
        return this.ZERO();
      }

      var key = a.toString() + '%' + b.toString();
      if (memo[key]) {
        return memo[key];
      }
      var c = new BIGNUM(MAXDIGITS);
      var comp = this.compare_bignum(a, b);
      if (comp === MINUS) {
        var div = this.divide_bignum(a, b);
        var mul = this.multiply_bignum(div, b);
        var sub = this.subtract_bignum(a, mul);
        c = sub;
      } else if (comp === PLUS) {
        c = a;
      } else {
        c = this.toBignum(0);
      }
      memo[key] = c;
      return c;

    },
    power_bignum: function(a, n) {
      var key = a.toString() + '^' + n.toString();
      if (memo[key]) {
        return memo[key];
      }

      var c = new BIGNUM(MAXDIGITS);

      if (n === 0) {
        c = this.toBignum(1);
      } else {

        c = this.clone(a);
        var res = this.toBignum(0);

        for (var i = 1; i < n; i++) {
          res = this.multiply_bignum(a, c);
          c = this.clone(res);
        }
      }

      memo[key] = c;
      return c;
    },
    bignum_to_base: function(bignum, numset) {
      var base = this.toBignum(numset.length);
      // var zero = this.toBignum(0);
      var c = '';
      while (this.compare_bignum(this.ZERO, bignum) === PLUS) {
        var offset = this.modulus_bignum(bignum, base);
        c = numset.substr(offset.toInteger(), 1) + c;
        bignum = this.divide_bignum(bignum, base);
      }
      return c;
    },
    base_to_bignum: function(based, numset) {
      var base = this.toBignum(numset.length);
      var bignum = this.toBignum(0);
      var c = 0;
      for (var i = based.length - 1, j = 0; i >= 0; i--, j++) {
        c = based.substr(i, 1);
        var pwr = this.power_bignum(base, j);
        var ioc = this.toBignum(numset.indexOf(c));
        var mul;
        if (this.compare_bignum(ioc, pwr) === PLUS) {
          mul = this.multiply_bignum(pwr, ioc);
        } else {
          mul = this.multiply_bignum(ioc, pwr);
        }
        bignum = this.add_bignum(bignum, mul);
      }
      return bignum;
    }
  };
};
if ('undefined' !== typeof(module)) {
  exports.BIGNUM = BIGNUM;
  exports.BIGNUMLIB = BIGNUMLIB;
}
