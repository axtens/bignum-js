# bignum-js
Steven S. Skiena's bignum.c in JavaScript.

Implements large integer arithmetic: addition, subtraction, multiplication, and division.

The original C program appears in Steve's book: ["Programming Challenges: The Programming Contest Training Manual"](http://www.amazon.com/exec/obidos/ASIN/0387001638/thealgorithmrepo/)
by Steven Skiena and Miguel Revilla, Springer-Verlag, New York 2003.

See Steve and Miguel's [website](http://www.programming-challenges.com) for additional information.

Bruce's release contains:

 * README.md - this file
 * js-bignum.js - bignum object
 * js-bignum-cc.js - bignum object pushed through closure compiler
 * test-jscript.js - tester (works with CScript).
 * test-jscript-cc.js - tester for -cc code (works with CScript).
 * timed.cmd - rough timer for tests
 * LICENSE

Better testing and better documentation may follow.

MIT license.

New News
--------

 * added GCD and LCM
 * added floating point support: FADD, FSUB, FMUL and FDIV (only in the test files at this point)

Old News
--------

 * Added memoclear function
 * Number of digits can be specified when BIGNUMLIB and BIGNUM are instantiated.
 * js-bignum.js can be called from JScript or from Node.js
 * extra functions:
 - power_bignum
 - modulus_bignum
 - base_to_bignum
 - bignum_to_base