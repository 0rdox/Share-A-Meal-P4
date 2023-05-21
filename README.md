# Share-A-Meal-P4

This project is made for the course *Programmeren 4* (Programming 4) for Avans Hogeschool. The assignment was that we made a server running on NodeJS. The functionalities within this project are the ability to create, read, update, delete (CRUD) users and meals contained within the share-a-meal.sql script. It's also possible to see user registrations to specific meals.

## Installation

1. On GitHub, clone this repository 
2. Once you've cloned the repository, navigate to the project's directory using the 'cd' command in a CMD-tool. After you have reached the correct directory, use the **'npm install'** command to install all the dependencies.
3. After the dependencies have been installed, use the command **'npm start'** to start the server and have it run locally. The server is reachable on **localhost:3000** in your web browser of choice.

## Usage

Once you have the server running locally, you can start up your webbrowser and navigate to **localhost:3000**, there you will find the homepage of this project. Afterwards you can simply edit the url to *for example* localhost:3000/api/meal to see all the existing meals. The routes within this project are url/api/meal, url/api/user, url/api/login and url/api/info. Some of these routes aren't reachable without the proper authorization. To get this authorization you need to use **Postman**, in Postman you can send a POST request to url/api/login with a valid emailaddress and password to get a token. This token is to be used for authorization by copy and pasting it in the Authorization tab under the type Bearer token. Once you've obtained a valid token all the CRUD functionalities are accesible using postman.

It's also possible to run the tests in this project using the command **'npm run test'**, here you will be able to see possible errors.

## Authors and acknowledgment

Janko Seremak - 2191216

## Project status

Project is on hold since 21/05/2023