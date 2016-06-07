var assert  = require('assert');
var sinon   = require('sinon');
var iter    = require('./index');

describe("Lazy iterator", function () {
    describe('iter.LazyIter', function () {
        it("passed object should have 'next' method", function () {
            assert.throws(() => {
                iter.LazyIter({})
            }, TypeError, "an iterator should define the `next` function")
        })

        describe('instance', function () {
            var iter_inst, fn;

            beforeEach(function () {
                iter_inst = iter([1,2,3,4,5]);
                fn        = sinon.spy();
            });

            it("list operations is lazy", function () {
                iter_inst.map(fn).filter(fn).takewhile(fn).take(3);
                assert(!fn.called);
            })

            it('#next draws elems from iterator(stream) lazily', function () {
                var iter = iter_inst.map(fn);
                iter.next();
                assert(fn.callCount == 1);
            });

            it('collect elems that is not drawn out into array', function () {
                iter_inst.map(e => e + e);
                iter_inst.next();
                iter_inst.next();
                assert.deepEqual(iter_inst.collect(), [6,8,10]);
            });

            it('reduce elems that is not drawn out', function () {
                iter_inst.map(e => e + e).next();
                assert.equal(iter_inst.reduce((sum, e) => sum + e), 28);
            });
        })
    });

    describe('iter', function () {
        it('passed object should be iterable', function () {
            assert.throws(() => {
                iter({})
            }, TypeError, "argument should implement `@@iterator` method");
        });

        it("create new lazy iter", function () {
            assert(iter([]) instanceof iter.LazyIter);
        });
    })

})
