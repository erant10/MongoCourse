const DriversController = require('../controllers/drivers_controller');

module.exports = (app) => {
    // Define route handlers for HTTP requests:

    // Watch for incoming request of method GET to the routte http://localhost:3050/api
    app.get('/api', DriversController.greeting);

    // create a driver
    app.post('/api/drivers', DriversController.create);

    // modify a driver
    app.put('/api/drivers/:id', DriversController.edit);

    // delete a driver
    app.delete('/api/drivers/:id', DriversController.delete);

    // find nearby drivers
    app.get('/api/drivers', DriversController.index);
};