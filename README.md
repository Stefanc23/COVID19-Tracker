# COVID-19 Tracker

DEMO: https://covid-19-tracker-c19t.web.app/

## Tech stack

1. React JS
2. Firebase hosting

## APIs used

1. Disease.sh API for covid-19 statistics
2. Rapidapi.com API for covid-19 news

## How to run the web app locally

1. Make sure to have the latest version of node installed. You can download it from here https://nodejs.org/en/download/
2. Download and install git if you haven't already. You can download it from here https://git-scm.com/downloads
3. Clone or download the project.
4. Get the API key from rapid api (see here for how to get started on rapid api: https://docs.rapidapi.com/docs/basics-creating-a-project)
5. Create a .env file on the root of the project directory and put the API key from rapid api into the file with this format: REACT_APP_RAPIDAPI_KEY="your API key"
6. From the project directory in your local machine, using git bash run:

    ### `npm install`
    to install all required dependencies, then run

    ### `npm start`
    to start a local development server on localhost:3000, or use

    ### `npm run build`
    to compile the code for production
