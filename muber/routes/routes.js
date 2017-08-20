const DriversController = require('../controllers/drivers_controller');

module.exports = (app) => {
    // Define route handlers for HTTP requests:
    // Watch for incoming request of method GET to the routte http://localhost:3050/api
    app.get('/api', DriversController.greeting);

    app.post('/api/drivers', DriversController.create);
};