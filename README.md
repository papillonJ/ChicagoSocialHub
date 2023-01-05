# Chicago Social Hub
### Real-time Web Application

This is a full-stack web application for user to search Chicago social places by category and location.


## Project Overview Statement

Design and implement a web-based real-time application for Divvy bikers that will allow users to search and chart Yelp reviewed Chicago social places (restaurants, bars, coffee shops, etc) and plot real-time available docks in near-by Divvy docking stations on Chicago downtown area map.


## Technologies and Platforms

1. Angular 7 or higher
2. Node.js/Express
3. D3.js
4. GoogleMaps(AGM)
5. PostgreSQL – to store Divvy stations real-time status
6. ElasticSearch – to store Yelp reviews for Chicago Businesses
7. ElasticSearch – to create and store Divvy real-time logs and store
Divvy trips anonymized data
8. Chrome browser that is compliant with ECMAScript 2015 scripting
2015, (ES6)


## Data Sources

- We will use Yelp business reviews to make recommendations for restaurants in Chicago downtown area that are highly reviewed and got at least 3-stars on Yelp.
  - Here is the URL for Yelp API:
  https://www.yelp.com/developers/documentation/v3/get_started
  - Here is the URL for businesses search:
  https://www.yelp.com/developers/documentation/v3/business_search
  - Here is the URL for the supported search categories:
  https://www.yelp.com/developers/documentation/v3/all_category_list

- We will use Divvy real-time data about the status of their docking stations.
  - Here is the URL for the real-time data they publish:
  https://gbfs.divvybikes.com/gbfs/gbfs.json
  - Here is the URL for the real-time status for the docking stations:
  https://gbfs.divvybikes.com/gbfs/en/station_status.json
  - Here is the URL for the information for the docking stations:
  https://gbfs.divvybikes.com/gbfs/en/station_information.json
  - Here is the URL for the anonymized data for Divvy trips:
  https://www.divvybikes.com/system-data


## Architecture and High-Level Design

Python scripts pulls data from Yelp and Divvy and store the data on PostgreSQL server and ElasticSearch server. Node/js/Express server receives requests from Angular clients and access the database servers to collect data and send the data back to Angular clients.


## Setup & Run

- Setup
  - Get the API
    - Yelp
    - Google map
  - Change the API in Code
  - frontend
    - src -> index.html -> google-map-API
    - app -> app.module.ts -> google-map-API
  - backend-build-yelp-reviews
    - ChicagpSocialHub-Yelp.ipynb -> yelp-API
  - Download 
    - Node
    - express
    - ElasticSearch (I used elasticsearch-7.17.6)
    - Angular
    - PostgreSQL
    - pgAdmin4(PostgreSQL Visualization)
  - pip install
    - pip install pprintpp (not in script)
    - pip install yelpapi(not in script)
    - Pandas
- Run
  - Run PostgreSQL server
  - Run ElasticSearch server
  - Run Node server
  - Run Angular server
  - Run scripts
    - ChicagpSocialHub-Yelp.ipynb
    - Divvy_real-time_status.ipynb
  - Open browser: https://localhost:4200 


## Use Cases

1. The app-user shall be able to specify the searchconditions using two fields to represent the pair (business-category, street-name), for example, Italian on Wabash, steak on Rush, pizza on Michigan, etc.
2. The search results for top rated Yelp-reviewed places based on the specified filter by the app-user shall be displayed on a web-page.
3. The app-user shall be provided with the capability to view the real- time status for the near-by Divvy docking stations of the selected place along with Google map for the current location, the selected place location, and the nearest 3 Divvy docking stations of the selected place.
4. The app-user shall be provided with the capability to view the bar- chart for yelp reviews.
5. The app-user shall be provided with the capability to view the real- time line-chart for the status of the selected Divvy docking station. The Line-chart shall provide the app-user with the capability to select the time-range: past hour, past 24 hours, past 7 days data.
5. The app-user shall be provided with the capability to view the Simple Moving Average (past hour and past 24 hours) in a real-time line- chart for the status of the selected docking station. The Line-chart shall provide the app-user with the capability to select the time- range: past hour, past 24 hours, past 7 days data.
6. The real-time line-chart for the status of the selected Divvy docking station shall be updated/refreshed automatically every 2 minutes without the app-user manual refresh. The line-chart shall provide the app-user with the capability to select the time-range: past hour, past 24 hours, past 7 days data.
7. Create real-time Heatmaps for Divvy docking stations. Divvy can utilize the HeatMap to decide at which stations to place a valet (https://www.chicagotribune.com/redeye/redeye-divvy-stations- locations-20140901-story.html ) to make sure riders have spots to dock at stations popular for drop-offs.
8. The app-user shall be provided with the capability to view the Heatmap in a real-time for the status of the docking stations for the entire city of Chicago. The Heatmap shall provide the app-user with the capability to select the time-range: past hour, past 24 hours, past 7 days data.
9. The app-user shall be provided with the capability to use Divvy anonymized log data to view the count of Divvy hourly trips for every day of the week in order to analyze the chart patterns: double tops bar-chart for morning rush-hours and evening rush-hours. And the bell-curve bar-chart for the weekends or holiday days.
