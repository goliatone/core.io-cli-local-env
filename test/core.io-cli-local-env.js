'use strict';

const test = require('tape');
const sinon = require('sinon');

const Module = require('../lib')['core.io-cli-local-env'];

test('Module should be bootstraped OK', (t)=>{
    t.ok(Module());
    t.end();
});
