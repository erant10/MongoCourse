const mongoose = require('mongoose');

// Connect to a test collection in the test environment
before(done => {
    mongoose.connect('mongodb://localhost/muber_test');
    mongoose.connection
        .once('open', () => done())
        .on('error', err => {
            console.warn('Warning', error);
        });
});

// Clear the test collection when before each test
beforeEach(done => {
    const { drivers} = mongoose.connection.collections;
    drivers.drop()
        // dropping a collection also drops all of the indices in that collection
        // use drivers.ensureIndex to drop the collection without the geometry.coordinates index
        .then(() => drivers.ensureIndex({ 'geometry.coordinates': '2dsphere' }))
        .then(()=> done())
        .catch(() => done());
});