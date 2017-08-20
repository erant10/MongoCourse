#Mongoose Schema notes
- In mongoose, *model*s correspont to a *collection* of records in mongo.
- handling relational data with mongo
    - __**single to many:**__ if a child object can ony have one parent, and a parent model can have many children objects it is best to use an array of children as a nested property inside the parent model (in mongo this is reffered to as sub-documents). 
    for example: 
        - a *user* has many blog *posts*, but a *post* is owned by only one user. Therefore, a good model schema would be an embedded collection of posts inside a user model: 
        ```{js}
            const PostSchema = new Schema({
                title: String,
                body: String
            });
            const UserSchema = new Schema({
                name: String,
                postCount: Number,
                posts: [PostSchema] // an array of posts
            });
        ```

- __**virtual types:**__
virtual type are properties in the db that are directly linked to other properties in the database (e.g. the length of an array).
Instead of saving both properties in the database and having to keep track of both, we can save a virtual type that will be computed in the server evvery time a document is pulled from the databse.
for example:
    - we want to keep track of a user's post count. And since we keep an array of posts for each user, we can define postCount as a virtual type.
    1. Create the DB schema:
    ```{js}
        const UserSchema = new Schema({
            name: String,
            posts: [PostSchema]
        });
    ```
    2. create the virtual post:
    ```{js}
    UserSchema.virtual('postCount').get(function() {
        return this.posts.length;
    });
    ```

- **Indexes:**
By default, every collection in mongo has an index on the _id property.
Having an index on a property allows to find records very fast (in O(1)).
In order to enable text search for a specific property, there must be an index on that property.
Mongo allows to add another index to a specific property.
How to add custom indexes:
    1. Start mongo shell and use the desired DB
    ```{js}
        mongo
        use upstar_music
    ```
    2. create the index for the desired collection
    ```{js}
        db.artists.createIndex({ name: "text" })
    ```


###Node\Express Application Basics
Node is an *engine* for running JS outside of a browser environment.

Express is a *framework* to simplify working with HTTP requests.
 
####Creating an application:
    
1. Create app:
    ```{js}
        npm init 'appname'
    ```
2. install dependencies:
    ```{js}
        npm install --save mongoose express mocha
    ```
3. Generate a new express app:
    - create app.js and index.js in the main directory:
        
        app.js:
        ```{js}
            const express = require('express');
            const app = express();
            module.exports = app;
        ```
        index.js:
        ```{js}
            const app = require('./app');
            app.listen(3050, () => {
                console.log('Running on port 3050')
            });
        ```
    - Define request route handlers:
        inside app.js add the following:
        ```{js}
            const express = require('express');
            const app = express();

            // Defing route handlers for HTTP requests:
            // Watch for incoming request of method GET to the routte http://localhost:3050/api
            app.get('/api', (req,res) => {
                res.send({ hi: 'there' });
            });

            module.exports = app;
        ```
    - run the server:
        ```{js}
            node index.jd
        ```

**Mongo DB Tips:**
- MongoDB has fantastic support of geo based queries
- helpful package to make fake HTTP requests:
  ```{js}
      npm install supertest
  ```