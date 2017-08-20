// we need to 'require in' the drivers model to at least one
// location in the project to make sure that it is executed
const Driver = require('../models/driver');

module.exports = {
    greeting(req,res) {
        res.send({hi:'there'})
    },

    create(req,res) {
        const driverProps = req.body;

        Driver.create(driverProps)
            .then(driver => res.send(driver));
    }
};
