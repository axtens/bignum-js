var library = "./js-bignum-cc.js", Bignums = require(library), TWO_TO_POWER = 100, core = new Bignums.BIGNUMLIB(500), lcd1 = core.toBignum("11"), lcd2 = core.toBignum("22");
reveal(lcd(lcd1, lcd2).toString());
reveal(gcd(lcd1, lcd2).toString());
reveal(fdiv("11.0", "22.0"));
reveal(fdiv("11.11", "23.0323423423"));
reveal(fdiv("23.0", "2.01010101"));
function fadd(n, l) {
  var g = n, f = l, q = 0, p = 0, h = 0, h = g.indexOf(".");
  -1 !== h && (q = g.substr(h + 1).length);
  h = f.indexOf(".");
  -1 !== h && (p = f.substr(h + 1).length);
  for(var h = Math.max(q, p), r = 0;r++ < h - q && "" !== (g += "0");) {
  }
  for(r = 0;r++ < h - p && "" !== (f += "0");) {
  }
  g = core.add_bignum(core.toBignum(g.replace(".", "")), core.toBignum(f.replace(".", "")));
  f = g.toString();
  for(f = f.substr(0, f.length - h) + "." + f.substring(f.length, f.length - h);"0" === f.substr(f.length - 1, 1) && "." !== f.substr(f.length - 2, 1) && 0 <= f.length;) {
    f = f.substr(0, f.length - 1)
  }
  "." === f.substr(f.length - 1) && (f += "0");
  "." === f.substr(0, 1) && (f = "0" + f);
  -1 === g.signbit && (f = "-" + f);
  return f
}
function fsub(n, l) {
  var g = n, f = l, q = 0, p = 0, h = 0, h = g.indexOf(".");
  -1 !== h && (q = g.substr(h + 1).length);
  h = f.indexOf(".");
  -1 !== h && (p = f.substr(h + 1).length);
  for(var h = Math.max(q, p), r = 0;r++ < h - q && "" !== (g += "0");) {
  }
  for(r = 0;r++ < h - p && "" !== (f += "0");) {
  }
  g = core.subtract_bignum(core.toBignum(g.replace(".", "")), core.toBignum(f.replace(".", "")));
  f = g.toString();
  for(f = f.substr(0, f.length - h) + "." + f.substring(f.length, f.length - h);"0" === f.substr(f.length - 1, 1) && "." !== f.substr(f.length - 2, 1) && 0 <= f.length;) {
    f = f.substr(0, f.length - 1)
  }
  "." === f.substr(f.length - 1) && (f += "0");
  "." === f.substr(0, 1) && (f = "0" + f);
  -1 === g.signbit && (f = "-" + f);
  return f
}
function fmul(n, l) {
  var g = n, f = l, q = 0, p = 0, h = 0, h = g.indexOf(".");
  -1 !== h && (q = g.substr(h + 1).length);
  h = f.indexOf(".");
  -1 !== h && (p = f.substr(h + 1).length);
  for(var h = Math.max(q, p), r = 0;r++ < h - q && "" !== (g += "0");) {
  }
  for(r = 0;r++ < h - p && "" !== (f += "0");) {
  }
  h += h;
  g = core.multiply_bignum(core.toBignum(g.replace(".", "")), core.toBignum(f.replace(".", "")));
  f = g.toString();
  for(f = f.substr(0, f.length - h) + "." + f.substring(f.length, f.length - h);"0" === f.substr(f.length - 1, 1) && "." !== f.substr(f.length - 2, 1) && 0 <= f.length;) {
    f = f.substr(0, f.length - 1)
  }
  "." === f.substr(f.length - 1) && (f += "0");
  "." === f.substr(0, 1) && (f = "0" + f);
  -1 === g.signbit && (f = "-" + f);
  return f
}
function fdiv(n, l) {
  var g = n, f = l, q = "";
  "-" === g.substr(0, 1) && (q = "-", g = g.substr(1));
  "-" === f.substr(0, 1) && (q += "-", f = f.substr(1));
  "--" === q && (q = "");
  var p = core.toBignum(0), h = 0, r = 0, k = 0, k = g.indexOf(".");
  -1 !== k && (h = g.substr(k + 1).length);
  k = f.indexOf(".");
  -1 !== k && (r = f.substr(k + 1).length);
  for(var k = Math.max(h, r), s = 0;s++ < k - h && "" !== (g += "0");) {
  }
  for(s = 0;s++ < k - r && "" !== (f += "0");) {
  }
  g = core.toBignum(g.replace(".", ""));
  f = core.toBignum(f.replace(".", ""));
  if(0 === core.compare_bignum(core.zero_justify(g), p)) {
    return p
  }
  p = core.divide_bignum(g, f);
  h = core.modulus_bignum(g, f);
  g = gcd(h, f);
  h = core.divide_bignum(h, g);
  f = core.divide_bignum(f, g);
  k = core.multiply_bignum(h, core.power_bignum(core.toBignum(10), k * k));
  for(k = p + "." + core.divide_bignum(k, f).toString();"0" === k.substr(k.length - 1, 1) && "." !== k.substr(k.length - 2, 1) && 0 <= k.length;) {
    k = k.substr(0, k.length - 1)
  }
  "." === k.substr(k.length - 1) && (k += "0");
  "." === k.substr(0, 1) && (k = "0" + k);
  return q + k
}
function gcd(n, l) {
  var g = core.toBignum(0);
  if(0 === core.compare_bignum(l, g)) {
    return n
  }
  g = core.modulus_bignum(n, l);
  return gcd(l, g)
}
function lcd(n, l) {
  var g = core.toBignum(0), f = core.toBignum(1);
  if(core.compare_bignum(n, l) === core.MINUS) {
    return lcd(l, n)
  }
  if(0 === core.compare_bignum(core.modulus_bignum(l, n), g)) {
    return l
  }
  for(var q = core.add_bignum(n, core.toBignum(1)), p = core.clone(f);core.compare_bignum(q, p) !== core.PLUS;) {
    var h = core.modulus_bignum(n, p), r = core.modulus_bignum(core.multiply_bignum(p, l), n);
    if(0 === core.compare_bignum(h, g) && 0 === core.compare_bignum(r, g)) {
      return core.multiply_bignum(p, l)
    }
    p = core.add_bignum(p, f)
  }
}
var n1, n2;
n1 = "123123123123123123123123123123.456456456456456456456456456456456456456456";
n2 = "2345.675";
reveal(n1, "+", n2, "=", fadd(n1, n2));
n1 = "0.3";
n2 = "2.987654321";
reveal(n1, "+", n2, "=", fadd(n1, n2));
n1 = "0.0";
n2 = "2";
reveal(n1, "+", n2, "=", fadd(n1, n2));
n1 = "1";
n2 = "10";
reveal(n1, "+", n2, "=", fadd(n1, n2));
n1 = "123123123123123123123123123123.456456456456456456456456456456456456456456";
n2 = "2345.675";
reveal(n1, "-", n2, "=", fsub(n1, n2));
n1 = "0.3";
n2 = "2.987654321";
reveal(n1, "-", n2, "=", fsub(n1, n2));
n1 = "0.0";
n2 = "2";
reveal(n1, "-", n2, "=", fsub(n1, n2));
n1 = "1";
n2 = "10";
reveal(n1, "-", n2, "=", fsub(n1, n2));
n1 = "123123123123123123123123123123.456456456456456456456456456456456456456456";
n2 = "2345.675";
reveal(n1, "*", n2, "=", fmul(n1, n2));
n1 = "0.3";
n2 = "2.987654321";
reveal(n1, "*", n2, "=", fmul(n1, n2));
n1 = "0.0";
n2 = "2";
reveal(n1, "*", n2, "=", fmul(n1, n2));
n1 = "1";
n2 = "10";
reveal(n1, "*", n2, "=", fmul(n1, n2));
n1 = "123123123123123123123123123123.45";
n2 = "2345.675";
reveal(n1, "/", n2, "=", fdiv(n1, n2));
n1 = "1.3";
n2 = "2.987654321";
reveal(n1, "/", n2, "=", fdiv(n1, n2));
n1 = "0.0";
n2 = "2";
reveal(n1, "/", n2, "=", fdiv(n1, n2));
n1 = "1";
n2 = "10";
reveal(n1, "/", n2, "=", fdiv(n1, n2));
var ff = core.base_to_bignum("1CAFEBABE2C1DEADBEEF2B", "0123456789ABCDEF");
reveal("1CAFEBABE2C1DEADBEEF2B", ff);
var gg = core.bignum_to_base(ff, "0123456789ABCDEFG");
reveal(ff, gg);
gg = core.bignum_to_base(ff, "01");
reveal(ff, gg);
gg = core.bignum_to_base(ff, "0123456789ABCDEF");
reveal(ff, gg);
var a = core.toBignum(1234567890), b = core.toBignum("2");
reveal("a " + a);
reveal("b " + b);
reveal(core.power_bignum(b, "2"));
reveal(core.power_bignum(b, "1"));
reveal(core.power_bignum(b, "10"));
reveal(core.power_bignum(b, 99));
var aa = core.divide_bignum(a, b);
reveal(aa);
aa = core.multiply_bignum(a, b);
reveal(a + " mul " + b + " equ " + aa);
var d = core.toBignum(2), e = core.toBignum(2);
reveal("e " + e);
reveal("d " + d);
reveal(core.multiply_bignum(core.multiply_bignum(core.multiply_bignum(d, e), e), e));
function squared(n) {
  var l = new Bignums.BIGNUMLIB, g = l.toBignum(n);
  return l.multiply_bignum(g, n)
}
var z = core.toBignum(16);
reveal(squared(z));
reveal(squared(squared(z)));
reveal(squared(squared(squared(z))));
var c = core.toBignum("1000"), b = core.toBignum("97"), m = core.modulus_bignum(c, b);
reveal(c + " modulus " + b + " equ " + m);
a = core.toBignum(123456789);
b = core.toBignum(987654321);
reveal(a, "+", b, "equals", core.add_bignum(a, b));
reveal(a, "-", b, "equals", core.subtract_bignum(a, b));
reveal(a, "*", b, "equals", core.multiply_bignum(a, b));
reveal(a, "\\", b, "equals", core.divide_bignum(a, b));
reveal(a, "%", b, "equals", core.modulus_bignum(a, b));
reveal(a, "^", 10, "equals", core.power_bignum(a, 10));
b = core.toBignum(123456789);
a = core.toBignum(987654321);
reveal(a, "+", b, "equals", core.add_bignum(a, b));
reveal(a, "-", b, "equals", core.subtract_bignum(a, b));
reveal(a, "*", b, "equals", core.multiply_bignum(a, b));
reveal(a, "\\", b, "equals", core.divide_bignum(a, b));
reveal(a, "%", b, "equals", core.modulus_bignum(a, b));
reveal(a, "^", 10, "equals", core.power_bignum(a, 10));
for(var TWO = core.toBignum(2), x = 0;x <= TWO_TO_POWER;x++) {
  reveal(2, "^", x.toString(), core.power_bignum(TWO, x))
}
for(x = 0;x <= TWO_TO_POWER;x++) {
  (prev = core.memorecall("2^" + (x - 1).toString())) ? reveal(2, "**", x.toString(), core.multiply_bignum(TWO, prev)) : reveal(2, "^", x.toString(), core.power_bignum(TWO, x))
}
core.memoclear();
function reveal() {
  for(var n = "", l = 0;l < arguments.length;l++) {
    arguments[l] && (n += arguments[l].toString(), l < arguments.length - 1 && (n += " "))
  }
  console.log(n)
}
var core = new Bignums.BIGNUMLIB, a1 = new Bignums.BIGNUM, b2 = core.clone(a1);
a1.signbit = 2;
reveal(b2.signbit);
reveal(a1.signbit);
var c3 = core.clone(b2), c4 = new Bignums.BIGNUM;
core.clear(c4);
a1 = core.toBignum(100);
b2 = core.toBignum(3);
reveal("a1", a1);
reveal("b2", b2);
c4 = core.add_bignum(a1, b2);
reveal("     added", c4.toString());
c4 = core.subtract_bignum(a1, b2);
reveal("subtracted", c4.toString());
c4 = core.multiply_bignum(a1, b2);
reveal("multiplied", c4.toString());
c4 = core.divide_bignum(a1, b2);
reveal("   divided", c4.toString());
c4 = core.modulus_bignum(a1, b2);
reveal("   modulus", c4.toString());
c4 = core.power_bignum(a1, 10);
reveal("a1 ^ 10", c4);
var EIK = new Bignums.BIGNUM, EIK = core.toBignum(1), SIFR = new Bignums.BIGNUM;
reveal(SIFR, core.isZero(SIFR) ? "zero" : "not zero");
reveal(EIK, core.isZero(EIK) ? "zero" : "not zero");
var B = new Bignums.BIGNUM, B = core.toBignum(1), x = core.subtract_bignum(core.ZERO(), B), y = core.subtract_bignum(B, core.ZERO());
reveal(x);
reveal(y);

