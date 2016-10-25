# Hapijs RESTful Example
This is a Hapi.js project to build RESTful API's using ES6.

## What's inside
 - Hapi.js http://hapijs.com/
 - ES6 https://babeljs.io/docs/learn-es2015/
 - Lab https://github.com/hapijs/lab
 - Good https://github.com/hapijs/good
 - Boom https://github.com/hapijs/boom
 - Eslint http://eslint.org/
 - direnv http://direnv.net/

## Setup
Clone the repository and install the dependencies.

    $ git clone https://github.com/samsystems/hapi-restful-skeleton.git my-project
    $ cd my-project
    $ npm install
    Set up .envrc
    $ npm run migrate
    $ npm start

# Defintion of global variables
| Variable         | Value                       | Description                                    |
|------------------|-----------------------------|------------------------------------------------|
| NODE_ENV         | development                 | Api enviroment definition                      |
| DB_HOSTNAME      | locahost                    | Host where is develpment database hosted       |
| DB_NAME          | callermate                  | Name of database                               |
| DB_DIALECT       | mysql                       | Dialect use to engage sequelize with database  |
| DB_USER          | root                        | Database user                                  |
| DB_PASSWORD      | root                        | Database password                              |
| MIGRATIONS_PATH  | src/data/migrations         | Migrations files path                          |
| MODELS_PATH      | src/models                  | Models files path                              |
| SEEDERS_PATH     | src/data/seeders            | Location for data fixtures                     |
| SECRET_KEY       | your own secret key         | Secret key for json web token sign             |

## Testing
Two options exists to run tests, the first one is for development process and aims to practice Test Driven Development.

    $ npm run tdd

## The other option to just run tests once.

    $ npm test

## Linting
Ensure the quality of your code with eslint.

    $ npm run linter

## Contribution
If you have ideas or find an error feel free to submit a PR.

## License
Licensed under the MIT license.
