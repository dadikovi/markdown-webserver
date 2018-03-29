'use strict';

var expect = require('chai').expect;
var ResponseBuilder = require('../ResponseBuilder');

describe('#ResponseBuilder', function() {
    it('should convert single digits', function() {
        var result = numFormatter(1);
        expect(result).to.equal('1');
    });

    it('should convert double digits', function() {
        var result = numFormatter(12);
        expect(result).to.equal('12');
    });
});