var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

  describe('flightnet', function() {

    describe('GET /reservations', function() {

      it('should return current reservations', function(done) {

        request(server)
          .get('/api/v1/reservations')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(function(res) {
          })
          .end(function(err, res) {
            should.not.exist(err);
            done();
          });
      });

    });

    describe('GET /reservations/date', function() {

      it('should return current reservations', function(done) {

        request(server)
          .get('/api/v1/reservations/2016-01-01')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(function(res) {
          })
          .end(function(err, res) {
            should.not.exist(err);
            done();
          });
      });

    });

  });

});
