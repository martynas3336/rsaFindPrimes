const BigIntBuffer = require('bigint-buffer');
const bigInt = require('big-integer');

const bigIntBufferSize = 1000;

const findPrimes = ({d,e,n}) => {
    let factor = findFactor({d, e, n});

    let p = BigInt(0);
    let q = BigInt(0);

    if(p / factor > 1) {
        q = factor;
        p = n / q;
    } else {
        p = factor;
        q = n / p;
    }
    return { p, q };
}

const findFactor = ({d, e, n}) => {

    const ONE = BigInt(1);
    const TWO = BigInt(2);

    const edMinus1 = e * d - ONE;
    const s = bigIntGetLowestSetBit(edMinus1);
    const t = bigIntShiftRight(edMinus1, s);

    for(let aInt = TWO; true; aInt++) {

        let aPow = bigIntModPow(aInt, t, n);

        for(let i = ONE; i < s; i++) {
            if(aPow === ONE) {
                break;
            }
            if(aPow === n - ONE) {
                break;
            }

            if(aPow === n - ONE) {
                break;
            }

            const aPowSquared = (aPow * aPow) % n;

            if(aPowSquared === ONE) {
                return bigIntGCD(aPow - ONE, n);
            }

            aPow = aPowSquared;
        }
    }

    throw new Error('Primes not found');
}

const base64UrlDecodeToBigInt = (src) => {
    const buf = Buffer.from(src, 'base64');
    return BigIntBuffer.toBigIntBE(buf);
}

const base64UrlEncodeFromBigInt = (src) => {
    const buf = BigIntBuffer.toBufferBE(src, bigIntBufferSize);
    return buf.toString('base64');
}

const bigIntGCD = (a, b) => {
    const aString = a.toString();
    const bString = b.toString();
    return BigInt(bigInt.gcd(aString, bString).toString());
}

const bigIntGetLowestSetBit = (n) => {
    const ZERO = BigInt(0);
    const ONE = BigInt(1);

    if(n === ZERO) return ONE;

    const _n = BigIntBuffer.toBufferBE(n, bigIntBufferSize);

    let ans = 0;

    for(let i = _n.length -1; i >= 0; i--) {
        const bitsString = _n[i].toString(2);
        const bitsStringArr = bitsString.split('');
        const bits = bitsStringArr.map(b => +b);
        for(let j = bits.length -1; i >= 0; j--) {
            if(bits[j] === 1) return ans;
            if(bits[j] === 0) ans++;
        }
    }
    return ans;
}

const bigIntShiftRight = (a, n) => {
    const aString = a.toString();
    const nString = n.toString();
    return BigInt(bigInt(aString).shiftRight(nString).toString());
}

const bigIntModPow = (n, exp, mod) => {
    const nString = n.toString();
    const expString = exp.toString();
    const modString = mod.toString();

    return BigInt(bigInt(nString).modPow(expString, modString).toString());
}

const rsaFindPrimes = ({d, e, n}) => {
    const ONE = BigInt(1);

    const dDecoded = base64UrlDecodeToBigInt(d);
    const eDecoded = base64UrlDecodeToBigInt(e);
    const nDecoded = base64UrlDecodeToBigInt(n);

    const { p, q } = findPrimes({ d: dDecoded, e: eDecoded, n: nDecoded });

    const dp = dDecoded % ( p - ONE);
    const dq = dDecoded % ( q - ONE);
    const qi = (ONE % p) / q;

    const pEncoded = base64UrlEncodeFromBigInt(p);
    const qEncoded = base64UrlEncodeFromBigInt(q);

    const dpEncoded = base64UrlEncodeFromBigInt(dp);
    const dqEncoded = base64UrlEncodeFromBigInt(dq);
    const qiEncoded = base64UrlEncodeFromBigInt(qi);

    return { p: pEncoded, q: qEncoded, dp: dpEncoded, dq: dqEncoded, qi: qiEncoded };
}

module.exports = rsaFindPrimes;
