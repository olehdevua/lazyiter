module.exports = iter;
module.exports.LazyIter = LazyIter;

function iter(o) {
    if (!o || typeof o[Symbol.iterator] !== 'function')
        throw new TypeError("argument should implement `@@iterator` method");

    return new LazyIter(o[Symbol.iterator]());
}

function LazyIter(i) {
    if (!(this instanceof LazyIter)) return new LazyIter(i);

    if (typeof i.next !== 'function') 
        throw new TypeError("an iterator should define the `next` function");

    this._iter = i;
}

LazyIter.prototype.next = function () {
    return this._iter.next()
}

LazyIter.prototype.map = function map(f) {
    var iter = this._iter;
    this._iter = (function* () {
        while(true) {
            var el = iter.next();
            if (!el.done) yield f(el.value);
            else break;
        }
    })();
    return this;
}

LazyIter.prototype.filter = function filter(f) {
    var iter = this._iter;
    this._iter = (function* () {
        while(true) {
            var el = iter.next();
            if (!el.done) {
                if (f(el.value)) yield el.value;
            }
            else break;
        }
    })();
    return this;
}

LazyIter.prototype.takewhile = function takewhile(f) {
    var iter = this._iter;
    this._iter = (function* () {
        while(true) {
            var el = iter.next();
            if (!el.done && f(el.value)) yield el.value;
            else break
        }
    })()
    return this;
}

LazyIter.prototype.take = function (n, f) {
    var iter = this._iter;
    this._iter = (function* () {
        while (n-- > 0) {
            var el = iter.next();
            if (!el.done) yield el.value;
        }
    })();
    return this;
}

LazyIter.prototype.collect = function collect() {
    var arr = [];
    while (true) {
        var el = this._iter.next();
        if (!el.done) arr.push(el.value);
        else return arr;
    }
}

LazyIter.prototype.find = function find(f) {
    while (true) {
        var el = this._iter.next();
        if (el.done) break;
        if (f(el.value)) return el.value;
    }
}

LazyIter.prototype.forEach = function forEach(f) {
    while (true) {
        var el = this._iter.next();
        if (el.done) break;
        f(el.value);
    }
}

LazyIter.prototype.reduce = function reduce(sum, f) {
    if (typeof sum === 'function') f = sum; sum = undefined;

    var el = this._iter.next();
    if (el.done) return sum;

    sum = sum || el.value;
    while (true) {
        el = this._iter.next();
        if (el.done) return sum;
        else sum = f(sum,  el.value);
    }
}
