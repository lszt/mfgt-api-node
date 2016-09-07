var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

  describe('firebase', function() {

    describe('POST /firebaseauth/ip', function() {

      it('should return unauthorized', function(done) {

        request(server)
          .post('/api/v1/firebaseauth/ip')
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

    describe('POST /firebaseauth/ip-test', function() {

      it('should return unauthorized', function(done) {

        request(server)
          .post('/api/v1/firebaseauth/ip-test')
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

    describe('POST /firebaseauth/mfgt', function() {

      it('should return unauthorized', function(done) {

        request(server)
          .post('/api/v1/firebaseauth/mfgt')
          .set('Accept', 'application/json')
          .query({username: 'username'})
          .query({password: 'password'})
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

    describe('POST /firebaseauth/mfgt-test', function() {

      it('should return unauthorized', function(done) {

        request(server)
          .post('/api/v1/firebaseauth/mfgt-test')
          .set('Accept', 'application/json')
          .query({username: 'username'})
          .query({password: 'password'})
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
