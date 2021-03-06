# Pipedrive Challenge

# Project setup

Assuming that Postgres is up and running and that two table "organizations" and "daughters" are created, the file db_connection.json should be setup in order to allow access from the project to the DB. The information required is:
    
    "DB_USER" : [user],
    "DB_PASSWORD" : [password],
    "DB_HOST" : "localhost",
    "DB_PORT" : [port], //usually 5432 
    "DB_NAME" : [name of the database]

After the DB is set and the connection is made possible, run:

    npm install 

In order to install the dependecies for the project. After this, the project should be ready to run.

## Unit testing
In the terminal with the location on the root folder, run:

    npm test

## API Endpoints
In the terminal with the location on the root folder, run:

    npm start

If using nodemon, run:

    nodemon start

The API will be available here [http://locahost:3000/](http://locahost:3000/)

### Adding organizations and relations

To add organizations, the HTTP method is **POST** with a body such as the example given in the challenge:

![Postman request example](./assets/post_example.png "Postman request example")


### Getting organizations and relations

To get the relations of an organization, the HTTP method is **GET** and the query parameters _search_ and _page_. The _search_ parameter is the name of the organization to search, such as "Yellow Banana" or "Big Banana Tree", and the _page_ parameter states the page that the user wants to see. The limit of items per page is 100. An example follows:

![Postman get example](./assets/get_example.png "Postman get example")

The expected result is:

![Postman response example](./assets/response_example.png "Postman response example")


