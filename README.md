# Real basic node based HTTP API server

## About

This is a very basic template for a Node based HTTP API microservice. It includes:
* Web server
* JWT based authentication
* Validation
* Logging

## Quick start

1. Copy `.env.example` to `.env`
2. Edit `.env` to modify configuration - review `src/config/config.js` for available configuration options
3. Run using `node index.js`

## Authentication

To do authenticated requests you can boot the service with `LOG_LEVEL=debug`. This will log a valid access token in the boot process.

Authentication is done using a authorization bearer header, example: `Authorization: Bearer $ACCESSTOKEN`