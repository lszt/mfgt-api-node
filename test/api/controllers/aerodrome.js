var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

  describe('aerodrome', function() {

    describe('GET /aerodromestatus', function() {

      it('should return current ad status', function(done) {

        request(server)
          .get('/api/v1/aerodromestatus')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(function(res) {
            res.body.webcam.cams.east.low = 'http://webcam.mfgt.ch/em.jpg';
          })
          .end(function(err, res) {
            should.not.exist(err);

            done();
          });
      });

    });

  });

});
