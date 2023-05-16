# Logging Platform
Creating an interface to log error messages via API routes to a mongodb backend.


## Table of Contents
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Screenshots](#screenshots)
* [Room for Improvement](#room-for-improvement)
* [Acknowledgements](#acknowledgements)


## Technologies Used
- express 4.18.2
- typescript 5.0.4
- bcryptjs 2.4.3
- chalk 4.1.2
- joi 17.9.2
- jsonwebtoken 9.0.0
- mongodb 5.5.0


## Features
- Tag messages for filtering and reporting purposes
- Search messages by the body rather than only date range and To/From information
- Dashboard to immediately recieve an overview on recent utilization
- Data from API call stored in database to improve performance and prevent making unnecessary calls
- Sentiment analysis for messages


## Screenshots


## Room for Improvement
To do:
- Finish routes and controllers for user interface
- Create additional models once specs and requirements are received
- Begin configuration for relational database (Postgres)
- Create health check tests
- Cors implementation
- CSRF token implementation



## Acknowledgements

