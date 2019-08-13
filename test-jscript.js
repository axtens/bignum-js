var TWO_TO_POWER = 100;
var library = './js-bignum.js';
eval(function (sFile) {
  var forReading = 1;
  var asUnicode = -1;
  var asANSI = 0;
  var data = '';
  var oFSO = new ActiveXObject('Scripting.FileSystemObject');
  if (oFSO.FileExists(sFile) && (oFSO.GetFile(sFile).size > 0)) {
    var handle = oFSO.OpenTextFile(sFile, forReading, false, asANSI);
    var BOM = handle.Read(2);
    handle.Close();
    if (BOM.charCodeAt(0) === 0xFF && BOM.charCodeAt(1) === 0xFE) {
      handle = oFSO.OpenTextFile(sFile, forReading, false, asUnicode);
    } else {
      handle = oFSO.OpenTextFile(sFile, forReading, false, asANSI);
    }
    data = handle.ReadAll();
    handle.Close();
    return data;
  } else {
    return data;
  }
}
  (library));

var core = new BIGNUMLIB(200);

var lcd1 = core.toBignum("11");
var lcd2 = core.toBignum("22");
reveal(lcd(lcd1, lcd2).toString());
reveal(gcd(lcd1, lcd2).toString());
reveal(fdiv("-11.0", "22.0"));
reveal(fdiv("11.11", "-23.0323423423"));
reveal(fdiv("-23.0", "-2.01010101"));

function fadd(a, b) { // returns c
  var aa = a; // a is a string
  var bb = b; // b is a string
  var aaDotToEnd = 0;
  var bbDotToEnd = 0;
  var ccDotToEnd = 0;
  var aaDot = aa.indexOf(".");
  if (aaDot !== -1) {
    aaDotToEnd = aa.substr(aaDot + 1).length;
  }
  var bbDot = bb.indexOf(".");
  if (bbDot !== -1) {
    bbDotToEnd = bb.substr(bbDot + 1).length;
  }
  ccDotToEnd = Math.max(aaDotToEnd, bbDotToEnd);
  var d = 0;
  while (d++ < ccDotToEnd - aaDotToEnd && (aa += "0") !== "") {}
  d = 0;
  while (d++ < ccDotToEnd - bbDotToEnd && (bb += "0") !== "") {}
  var cb = core.add_bignum(core.toBignum(aa.replace(".", "")), core.toBignum(bb.replace(".", "")));
  var cc = cb.toString();
  cc = cc.substr(0, cc.length - ccDotToEnd) + "." + cc.substring(cc.length, cc.length - ccDotToEnd);
  while (cc.substr(cc.length - 1, 1) === "0" && cc.substr(cc.length - 2, 1) !== "." && cc.length >= 0) {
    cc = cc.substr(0, cc.length - 1);
  }
  if (cc.substr(cc.length - 1) === ".") {
    cc += "0";
  }
  if (cc.substr(0, 1) === ".") {
    cc = "0" + cc;
  }
  if (cb.signbit === -1) {
    cc = "-" + cc;
  }
  return cc;
}

function fsub(a, b) { // returns c
  var aa = a; // a is a string
  var bb = b; // b is a string
  var aaDotToEnd = 0;
  var bbDotToEnd = 0;
  var ccDotToEnd = 0;
  var aaDot = aa.indexOf(".");
  if (aaDot !== -1) {
    aaDotToEnd = aa.substr(aaDot + 1).length;
  }
  var bbDot = bb.indexOf(".");
  if (bbDot !== -1) {
    bbDotToEnd = bb.substr(bbDot + 1).length;
  }
  ccDotToEnd = Math.max(aaDotToEnd, bbDotToEnd);
  var d = 0;
  while (d++ < ccDotToEnd - aaDotToEnd && (aa += "0") !== "") {}
  d = 0;
  while (d++ < ccDotToEnd - bbDotToEnd && (bb += "0") !== "") {}
  var cb = core.subtract_bignum(core.toBignum(aa.replace(".", "")), core.toBignum(bb.replace(".", "")));
  var cc = cb.toString();
  cc = cc.substr(0, cc.length - ccDotToEnd) + "." + cc.substring(cc.length, cc.length - ccDotToEnd);
  while (cc.substr(cc.length - 1, 1) === "0" && cc.substr(cc.length - 2, 1) !== "." && cc.length >= 0) {
    cc = cc.substr(0, cc.length - 1);
  }
  if (cc.substr(cc.length - 1) === ".") {
    cc += "0";
  }
  if (cc.substr(0, 1) === ".") {
    cc = "0" + cc;
  }
  if (cb.signbit === -1) {
    cc = "-" + cc;
  }
  return cc;
}

function fmul(a, b) { // returns c
  var aa = a; // a is a string
  var bb = b; // b is a string
  var aaDotToEnd = 0;
  var bbDotToEnd = 0;
  var ccDotToEnd = 0;
  var aaDot = aa.indexOf(".");
  if (aaDot !== -1) {
    aaDotToEnd = aa.substr(aaDot + 1).length;
  }
  var bbDot = bb.indexOf(".");
  if (bbDot !== -1) {
    bbDotToEnd = bb.substr(bbDot + 1).length;
  }
  ccDotToEnd = Math.max(aaDotToEnd, bbDotToEnd);
  var d = 0;
  while (d++ < ccDotToEnd - aaDotToEnd && (aa += "0") !== "") {}
  d = 0;
  while (d++ < ccDotToEnd - bbDotToEnd && (bb += "0") !== "") {}
  ccDotToEnd = ccDotToEnd + ccDotToEnd; // doubled because multiplication does that
  var cb = core.multiply_bignum(core.toBignum(aa.replace(".", "")), core.toBignum(bb.replace(".", "")));
  var cc = cb.toString();
  cc = cc.substr(0, cc.length - ccDotToEnd) + "." + cc.substring(cc.length, cc.length - ccDotToEnd);
  while (cc.substr(cc.length - 1, 1) === "0" && cc.substr(cc.length - 2, 1) !== "." && cc.length >= 0) {
    cc = cc.substr(0, cc.length - 1);
  }
  if (cc.substr(cc.length - 1) === ".") {
    cc += "0";
  }
  if (cc.substr(0, 1) === ".") {
    cc = "0" + cc;
  }
  if (cb.signbit === -1) {
    cc = "-" + cc;
  }
  return cc;
}

function fdiv(a, b) { // returns c
  var aa = a; // a is a string
  var bb = b; // b is a string
  var sign = "";
  if (aa.substr(0,1) === "-" ) {
    sign = "-";
    aa = aa.substr(1);
  }
  if (bb.substr(0,1) === "-" ) {
    sign += "-"
    bb = bb.substr(1);
  }
  if (sign === "--") {
    sign = "";
  }
  
  var ZERO = core.toBignum(0);
  var aaDotToEnd = 0;
  var bbDotToEnd = 0;
  var ccDotToEnd = 0;
  var aaDot = aa.indexOf(".");
  if (aaDot !== -1) {
    aaDotToEnd = aa.substr(aaDot + 1).length;
  }
  var bbDot = bb.indexOf(".");
  if (bbDot !== -1) {
    bbDotToEnd = bb.substr(bbDot + 1).length;
  }
  ccDotToEnd = Math.max(aaDotToEnd, bbDotToEnd);
  var d = 0;
  while (d++ < ccDotToEnd - aaDotToEnd && (aa += "0") !== "") {}
  d = 0;
  while (d++ < ccDotToEnd - bbDotToEnd && (bb += "0") !== "") {}

  var aaBig = core.toBignum(aa.replace(".", ""));
  var bbBig = core.toBignum(bb.replace(".", ""));
  if (core.compare_bignum(core.zero_justify(aaBig),ZERO) === 0) {
    return ZERO;
  }
  var div = core.divide_bignum(aaBig, bbBig);
  var mod = core.modulus_bignum(aaBig, bbBig);
  var gcf = gcd(mod, bbBig);
  var MODreduced = core.divide_bignum(mod, gcf);
  var BBreduced = core.divide_bignum(bbBig, gcf);
  var MODhundred = core.multiply_bignum(MODreduced, core.power_bignum(core.toBignum(10), ccDotToEnd * ccDotToEnd));

  var cc = div + "." + core.divide_bignum(MODhundred, BBreduced).toString();
  while (cc.substr(cc.length - 1, 1) === "0" && cc.substr(cc.length - 2, 1) !== "." && cc.length >= 0) {
    cc = cc.substr(0, cc.length - 1);
  }
  if (cc.substr(cc.length - 1) === ".") {
    cc += "0";
  }
  if (cc.substr(0, 1) === ".") {
    cc = "0" + cc;
  }
  cc = sign + cc;
  return cc;
}
function gcd(a, b) {
  //assuming bignums
  var ZERO = core.toBignum(0);
  if (core.compare_bignum(b, ZERO) === 0) {
    return a;
  } else {
    var aMODb = core.modulus_bignum(a, b);
    return gcd(b, aMODb);
  }
}

function lcd(x, y) {
  //assuming both a bignums
  var ZERO = core.toBignum(0);
  var ONE = core.toBignum(1);
  if (core.compare_bignum(x, y) === core.MINUS) {
    return lcd(y, x);
  } else if (core.compare_bignum(core.modulus_bignum(y, x), ZERO) === 0) {
    return y;
  } else {
    var limit = core.add_bignum(x, core.toBignum(1));
    var i = core.clone(ONE);
    while (core.compare_bignum(limit, i) !== core.PLUS) {
      var xMODi = core.modulus_bignum(x, i);
      var iTIMESyMODx = core.modulus_bignum(core.multiply_bignum(i, y), x);
      if ((core.compare_bignum(xMODi, ZERO) === 0) && (core.compare_bignum(iTIMESyMODx, ZERO) === 0)) {
        return core.multiply_bignum(i, y);
      }
      i = core.add_bignum(i, ONE);
    }
  }
}

/* def lcd(x, y):
if x < y:
return lcd(y, x)
if y % x == 0:
return y
for i in range(1,x+1):
if x % i == 0 and (i * y) % x == 0:
return i * y
 */
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


var ff = core.base_to_bignum('1CAFEBABE2C1DEADBEEF2B', '0123456789ABCDEF');
reveal('1CAFEBABE2C1DEADBEEF2B', ff);
var gg = core.bignum_to_base(ff, '0123456789ABCDEFG');
reveal(ff, gg);
var gg = core.bignum_to_base(ff, '01');
reveal(ff, gg);
var gg = core.bignum_to_base(ff, '0123456789ABCDEF');
reveal(ff, gg);

var a = core.toBignum(1234567890);
var b = core.toBignum('2');
reveal('a ' + a);
reveal('b ' + b);

reveal(core.power_bignum(b, '2'));
reveal(core.power_bignum(b, '1'));
reveal(core.power_bignum(b, '10'));
reveal(core.power_bignum(b, 99));

var aa = core.divide_bignum(a, b);
reveal(aa);

var aa = core.multiply_bignum(a, b);
reveal(a + ' mul ' + b + ' equ ' + aa);

var d = core.toBignum(2);
var e = core.toBignum(2);
reveal('e ' + e);
reveal('d ' + d);
reveal(core.multiply_bignum(core.multiply_bignum(core.multiply_bignum(d, e), e), e));

function squared(n) {
  var core = new BIGNUMLIB();
  var m = core.toBignum(n);
  return core.multiply_bignum(m, n);
}

var z = core.toBignum(16);
reveal(squared(z));
reveal(squared(squared(z)));
reveal(squared(squared(squared(z))));

var c = core.toBignum('1000');
var b = core.toBignum('97');
var m = core.modulus_bignum(c, b);
reveal(c + ' modulus ' + b + ' equ ' + m);

a = core.toBignum(123456789);
b = core.toBignum(987654321);
reveal(a, '+', b, 'equals', core.add_bignum(a, b));
reveal(a, '-', b, 'equals', core.subtract_bignum(a, b));
reveal(a, '*', b, 'equals', core.multiply_bignum(a, b));
reveal(a, '\\', b, 'equals', core.divide_bignum(a, b));
reveal(a, '%', b, 'equals', core.modulus_bignum(a, b));
reveal(a, '^', 10, 'equals', core.power_bignum(a, 10));

b = core.toBignum(123456789);
a = core.toBignum(987654321);
reveal(a, '+', b, 'equals', core.add_bignum(a, b));
reveal(a, '-', b, 'equals', core.subtract_bignum(a, b));
reveal(a, '*', b, 'equals', core.multiply_bignum(a, b));
reveal(a, '\\', b, 'equals', core.divide_bignum(a, b));
reveal(a, '%', b, 'equals', core.modulus_bignum(a, b));
reveal(a, '^', 10, 'equals', core.power_bignum(a, 10));
// reveal(core.memodump());
var TWO = core.toBignum(2);
for (var x = 0; x <= TWO_TO_POWER; x++) {
  reveal(2, '^', x, core.power_bignum(TWO, x));
}

for (var x = 0; x <= TWO_TO_POWER; x++) {
  prev = core.memorecall("2^" + (x-1).toString());
  if (prev) {
    reveal(2,"**",x, core.multiply_bignum(TWO,prev));
  } else {
    reveal(2, '^', x, core.power_bignum(TWO, x));
  }
}

core.memoclear();
// reveal('and again from the memo');
// for (var x = 0; x <= TWO_TO_POWER; x++) reveal(2, '^', x, core.power_bignum(TWO, x));

function reveal() {
  var res = '';
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i]) {
      res += arguments[i].toString();
      if (i < (arguments.length - 1)) {
        res += ' ';
      }
    }
  }
  WScript.Echo(res);
}

var core = new BIGNUMLIB();
var a1 = new BIGNUM();
var b2 = core.clone(a1);
a1.signbit = 2;
reveal(b2.signbit);
reveal(a1.signbit);

var c4 = new BIGNUM();
core.clear(c4);
a1 = core.toBignum(100);
b2 = core.toBignum(3);
reveal('a1', a1);
reveal('b2', b2);
c4 = core.add_bignum(a1, b2);
reveal('     added', c4.toString());
c4 = core.subtract_bignum(a1, b2);
reveal('subtracted', c4.toString());
c4 = core.multiply_bignum(a1, b2);
reveal('multiplied', c4.toString());
c4 = core.divide_bignum(a1, b2);
reveal('   divided', c4.toString());
c4 = core.modulus_bignum(a1, b2);
reveal('   modulus', c4.toString());
c4 = core.power_bignum(a1, 10);
reveal('a1 ^ 10', c4);

var EIK = new BIGNUM();
EIK = core.toBignum(1);
var SIFR = new BIGNUM();
reveal(SIFR, core.isZero(SIFR) ? "zero" : "not zero");
reveal(EIK, core.isZero(EIK) ? "zero" : "not zero");