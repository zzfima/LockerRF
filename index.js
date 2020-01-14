"use strict"

let app = require("connect")()
let http = require("http")
let swaggerConfig = require('config').swagger
let swaggerTools = require("swagger-tools")
let serveStatic = require("serve-static")
let jsyaml = require("js-yaml")
let fs = require("fs")
let cors = require("cors")
let serviceName = require('./package.json').name

// Serve static files - readme.
app.use(serveStatic("."))

// Configure swagger router - this handles the routings specified in the swagger.yaml.
let options = {
    swaggerUi: "/swagger.json",
    controllers: "./controllers"
};

// Read swagger doc and load it to a js object.
let spec = fs.readFileSync("./api/swagger.yaml", "utf8")
let swaggerDoc = jsyaml.safeLoad(spec)

// Initialize swagger middlewares.
swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
    app.use(cors({
        origin: '*',
        allowMethods: ['GET'],
        exposeHeaders: ['X-Request-Id']
    }));

    // Configure swagger middlewares for exposing metadata and validations.
    app.use(middleware.swaggerMetadata());
    app.use(middleware.swaggerValidator());
    app.use(middleware.swaggerRouter(options));

    // Configure swagger UI.
    app.use(middleware.swaggerUi({
        apiDocs: '/' + serviceName + '/api-docs',
        swaggerUi: '/' + serviceName + '/docs'
    }));

    // Create http listener and run it on port.
    http.createServer(app).listen(swaggerConfig.port, () => {
        //logger.info(`service is up. listening on port: ${swaggerConfig.port}`);
    })
});