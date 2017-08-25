const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const Driver = mongoose.model('driver');

describe('Drivers controller', () => {
   it('POST to /api/drivers create a new driver', done => {
       Driver.count()
           .then(count => {
               request(app)
                   .post('/api/drivers')
                   .send({ email: 'test@test.com' })
                   .end(() => {
                       Driver.count().then(newCount => {
                           assert(count + 1 === newCount);
                           done();
                       });
                   });
           });
   });

   it('PUT to /api/drivers/:id edits an existing driver', done => {
       // create a driver and save it
       const driver = new Driver({ email: 't@t.com', driving: false });
       driver.save().then(() => {
           request(app)
               // update the new record with put request
               .put(`/api/drivers/${driver._id}`)
               .send({ driving: true })
               .end(() => {
                   // pull that driver and assert that driving === true
                   Driver.findOne({ email: 't@t.com' })
                       .then( driver => {
                           assert(driver.driving === true);
                           done();
                       })

               })
       });
   });

   it('DELETE to /api/drivers/:id can delete a driver', done => {
       // create a driver and save it
       const driver = new Driver({ email: 'test@test.com' });
       driver.save().then(() => {
           request(app)
               .delete(`/api/drivers/${driver._id}`)
               .end(() => {
                   // assert that the driver does not exist
                   Driver.findOne({ email: 'test@test.com' })
                       .then( (driver) => {
                           assert(driver === null);
                           done();
                       })

               })
       });
   });

   it('GET to /api/drivers finds drivers near a location', done => {
       const seattleDriver =  new Driver({
           email: 'seattle@test.com',
           geometry: { type: 'Point', coordinates: [-122.4759902, 47.6147628] }
       });

       const miamiDriver =  new Driver({
           email: 'miami@test.com',
           geometry: { type: 'Point', coordinates: [-80.253, 25.791] }
       });

       Promise.all([ seattleDriver.save(), miamiDriver.save() ])
           .then(() => {
                request(app)
                    .get('/api/drivers?lng=-80&lat=25')
                    .end((err, response) => {
                        // assert that only 1 driver was found
                        assert(response.body.length === 1);
                        // assert that the driver that was found is from miami
                        assert(response.body[0].obj.email === 'miami@test.com');
                        done();
                    });
           });
   });
});