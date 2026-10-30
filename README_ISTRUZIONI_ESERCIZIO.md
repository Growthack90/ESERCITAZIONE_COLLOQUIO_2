# Backend Test App

## Purpose of the Exercise

This exercise evaluates:

- Code organization and style
- Knowledge of backend principles
- Ability to follow requirements and identify implicit requirements

## Request

Develop a backend application using the following technologies and specifications:

- **Web framework:** Express
- **Database:** MongoDB
- **Language:** ECMAScript 6 or TypeScript
- **API:** REST

The backend should expose REST API endpoints for the following applications:

- A blog
- A content management system

## Requirements

Both applications communicate with the backend using HTTP calls. The API must allow client developers to:

- Show a list of public posts
- Create a post with:
  - A title
  - A body
  - A list of hashtags
  - A status (the default status is `draft`)
  - An author name (always `Brian Fox`)
- Publish a post
- Delete a post
- Filter posts by hashtags

## Notes

1. You do not have to create an authentication system. If you choose to implement an authenticated endpoint, use a hardcoded token and include it in the documentation.
