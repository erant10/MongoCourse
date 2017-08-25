// we need to 'require in' the drivers model to at least one
// location in the project to make sure that it is executed
const Driver = require('../models/driver');

module.exports = {
    greeting(req, res) {
        res.send({hi: 'there'})
    },

    index(req, res, next) {
        const { lng, lat } = req.query;
        // make a geo based query to the drivers collection
        Driver.geoNear(
            { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            // the maxDistance is measured in meters so 200000m equals 200km
            { spherical: true, maxDistance: 200000}
        )
            .then(drivers => res.send(drivers))
            .catch(next)
    },

    create(req, res, next) {
        // the data in the body of the request npm
        const driverProps = req.body;

        Driver.create(driverProps)
            .then(driver => res.send(driver))
            // if an error occured call the next middleware in the flowchain
            .catch(next);
    },

    edit(req, res, next) {
        const driverId = req.params.id;
        const driverProps = req.body;
        Driver.findByIdAndUpdate({_id: driverId}, driverProps)
        // findByIdAndUpdate returns a promise,
        // however it doesn't return the new created record inside it
            .then(() => Driver.findById({_id: driverId}))
            .then(driver => res.sent(driver))
            .catch(next);
    },

    delete(req, res, next) {
        const driverId = req.params.id;
        Driver.findByIdAndRemove({ _id: driverId })
            // send the response with a status of 204 (successflly deleted)
            // and with the driver record that was deleted
            .then(driver => res.status(204).sent(driver))
            .catch(next);
    }
};