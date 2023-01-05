import { AfterViewInit, Component, Input, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as heatmap from 'heatmap.js'
import { google } from 'google-maps';

import { Station } from '../../station';
import { PlacesService } from '../../places.service';
import { Observable } from "rxjs";
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

interface Location {
  lat: number;
  lng: number;
  zoom: number;
  address_level_1?: string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  label: string;
}

@Component({
  selector: 'app-divvy-heat-map-valet',
  templateUrl: './divvy-heat-map-valet.component.html',
  styleUrls: ['./divvy-heat-map-valet.component.css']
})
export class DivvyHeatMapValetComponent implements OnInit {

  FRAMES_PER_HOUR = 5;
  newTimeRangeSelection = true;
  notNewTimeRangeSelection = false;

  time_slots = ["12:00am - 1:00am", "1:00am - 2:00am", "2:00am - 3:00am", "3:00am - 4:00am"
    , "4:00am - 5:00am", "5:00am - 6:00am", "6:00am - 7:00am", "7:00am - 8:00am"
    , "8:00am - 9:00am", "9:00am - 10:00am", "10:00am - 11:00am", "11:00am - 12:00pm"
    , "12:00pm - 1:00pm", "1:00pm - 2:00pm", "2:00pm - 3:00pm", "3:00pm - 4:00pm"
    , "4:00pm - 5:00pm", "5:00pm - 6:00pm", "6:00pm - 7:00pm", "7:00pm - 8:00pm", "8:00pm - 9:00pm", "9:00pm - 10:00pm"
    , "10:00pm - 11:00pm", "11:00pm - 12:00am"];

  timeRangeSelected = this.time_slots[0];

  google: google;
  gradient;
  gradientStep = -1;
  newGradient;
  distinct = [];
  stations: Station[];
  heatMapData: any[];
  timeArray: any;
  timeOffset = 0;
  timer;

  noOfDivvyDataSamplesRequested: number;
  noOfDivvyDataSamplesProcessed: number;

  currentChicagoTime;

  timeStamp;
  currentTime;

  timeValues = [
    { id: this.time_slots[0], value: this.time_slots[0] },
    { id: this.time_slots[1], value: this.time_slots[1] },
    { id: this.time_slots[2], value: this.time_slots[2] },
    { id: this.time_slots[3], value: this.time_slots[3] },
    { id: this.time_slots[4], value: this.time_slots[4] },
    { id: this.time_slots[5], value: this.time_slots[5] },
    { id: this.time_slots[6], value: this.time_slots[6] },
    { id: this.time_slots[7], value: this.time_slots[7] },
    { id: this.time_slots[8], value: this.time_slots[8] },
    { id: this.time_slots[9], value: this.time_slots[9] },
    { id: this.time_slots[10], value: this.time_slots[10] },
    { id: this.time_slots[11], value: this.time_slots[11] },
    { id: this.time_slots[12], value: this.time_slots[12] },
    { id: this.time_slots[13], value: this.time_slots[13] },
    { id: this.time_slots[14], value: this.time_slots[14] },
    { id: this.time_slots[15], value: this.time_slots[15] },
    { id: this.time_slots[16], value: this.time_slots[16] },
    { id: this.time_slots[17], value: this.time_slots[17] },
    { id: this.time_slots[18], value: this.time_slots[18] },
    { id: this.time_slots[19], value: this.time_slots[19] },
    { id: this.time_slots[20], value: this.time_slots[20] },
    { id: this.time_slots[21], value: this.time_slots[21] },
    { id: this.time_slots[22], value: this.time_slots[22] },
    { id: this.time_slots[23], value: this.time_slots[23] },
  ];

  private map: google.maps.Map = null;
  heatmap: google.maps.visualization.HeatmapLayer = null;


  constructor(private placesService: PlacesService) {

  }


  ngOnInit() {
    this.timeRangeSelected = this.time_slots[0];
    this.noOfDivvyDataSamplesProcessed = 2;
  }
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  ////////////////   Angular Callback for TimeRangeSelection
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  changeTimeRangeSelected(data) {
    console.log('this.timeRangeSelected', this.timeRangeSelected);
    this.clearHeatMap();
    this.markers = [];
    this.noOfDivvyDataSamplesProcessed = 0;
    clearTimeout(this.timer);
    this.getDivvyStationsStatus(this.newTimeRangeSelection);
  }
  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  // A function used to prefix a single digit with a ZERO

  checkForSingleDigitAndPrefixZeroIfNeeded(digitValue) {
    if (digitValue < 10)
      digitValue = "0" + digitValue;
    return digitValue;
  }

  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  getDivvyStationsStatus(timeRangeSelection) {
    // this is the time used to be displayed as label on the map
    var simulatedClockTime;
    var currentTime = new Date();

    var startTimeForDataCollection;
    var currentTimeForDataCollection;

    for (let i = 0; i < this.time_slots.length; i++) {
      if (this.timeRangeSelected == this.time_slots[i]) {
        if (currentTime.getHours() > i) {//18:20pm: 18
          var diff = currentTime.getHours() - i; //i = 1: 1am-2am -> diff = 18 - 1 = 17 hours
          this.noOfDivvyDataSamplesRequested = this.FRAMES_PER_HOUR;
          startTimeForDataCollection = new Date(currentTime.getTime() - diff * 60 * 60 * 1000 - currentTime.getMinutes() * 60 * 1000 - currentTime.getSeconds() * 1000 - currentTime.getMilliseconds());
          currentTimeForDataCollection = new Date(startTimeForDataCollection.getTime() + this.timeOffset);
        } else if (i >= currentTime.getHours()) {
          var diff = i - currentTime.getHours(); //i = 1: 1am-2am -> diff = 18 - 1 = 17 hours
          this.noOfDivvyDataSamplesRequested = this.FRAMES_PER_HOUR;
          startTimeForDataCollection = new Date(currentTime.getTime() - (24 - diff) * 60 * 60 * 1000 - currentTime.getMinutes() * 60 * 1000 - currentTime.getSeconds() * 1000 - currentTime.getMilliseconds());
          currentTimeForDataCollection = new Date(startTimeForDataCollection.getTime() + this.timeOffset);
        }
      }
    }

    if (this.noOfDivvyDataSamplesProcessed < this.noOfDivvyDataSamplesRequested) {
      this.placesService.get_all_divvy_stations_data(this.timeRangeSelected, timeRangeSelection).subscribe((data: Station[]) => {
        //console.log('getDivvyStationsStatus -- noOfDivvyDataSamplesProcessed=', this.noOfDivvyDataSamplesProcessed);
        this.noOfDivvyDataSamplesProcessed = this.noOfDivvyDataSamplesProcessed + 1;


        // Adjust time Offset for the next cycle by 2 minutes
        // for example: 2, 4, 6, 8, 10, ...
        // So, current time is 

        this.timeOffset = (this.noOfDivvyDataSamplesProcessed) * (60 * 1000 * 10);


        // Create digital clock as label on the heatmap
        // The convention is to prefix with ZERO the single digit for month, day, jour, minute, second
        // in the digital clock/time

        //The value returned by getMonth() is an integer between 0 and 11. 
        // 0 corresponds to January, 1 to February
        currentTimeForDataCollection = new Date(startTimeForDataCollection.getTime() + this.timeOffset);
        let monthNumber = this.checkForSingleDigitAndPrefixZeroIfNeeded(currentTimeForDataCollection.getMonth() + 1);
        simulatedClockTime = currentTimeForDataCollection.getFullYear() + '-' +
          monthNumber + '-' +
          this.checkForSingleDigitAndPrefixZeroIfNeeded(currentTimeForDataCollection.getDate()) + '\t' +
          this.checkForSingleDigitAndPrefixZeroIfNeeded(currentTimeForDataCollection.getHours()) + ':' +
          this.checkForSingleDigitAndPrefixZeroIfNeeded(currentTimeForDataCollection.getMinutes()) + ':' +
          this.checkForSingleDigitAndPrefixZeroIfNeeded(currentTimeForDataCollection.getSeconds());

        this.timeStamp = simulatedClockTime;



        // Now clear the HeatMap and then plot the data on the heatmap
        this.markers = [];
        this.clearHeatMap();
        this.plot_availableDocksInDivvyStations_on_heatMap(data);


        // Not a new time-range selection, so continue calling the same method but 
        // with new time offset increment
        this.timer = setTimeout(() => this.getDivvyStationsStatus(this.notNewTimeRangeSelection), 300);
      });
    }

    // we are done ... reset time offset to zero
    this.timeOffset = 0;
  }

  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  markers: Station[];

  plot_availableDocksInDivvyStations_on_heatMap(availableDocksInDivvyStations) {

    let locationsOfAvailableDocksInDivvyStations = [];

    this.stations = availableDocksInDivvyStations;
    //console.log("data",this.stations.length);

    for (let i = 0; i < this.stations.length; i++) {
      if ((this.stations[i].totalDocks > 10 && this.stations[i].totalDocks - this.stations[i].availableDocks) / this.stations[i].totalDocks >= 0.5) {
        this.markers.push(this.stations[i]);
      }
      let divvy_dock_station_location = {
        location: new google.maps.LatLng(this.stations[i].latitude, this.stations[i].longitude),
        weight: this.stations[i].availableDocks //busy dock station, less availabledock more busy
      }
      locationsOfAvailableDocksInDivvyStations.push(divvy_dock_station_location);
    }

    this.heatMapData = locationsOfAvailableDocksInDivvyStations;

    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.heatMapData
    });

    this.heatmap.setMap(this.map);
  }





  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  public location: Location = {
    lat: 41.882607,
    lng: -87.643548,
    label: 'You are Here',
    zoom: 10
  };

  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////

  onMapLoad(mapInstance: google.maps.Map) {
    // default display is Past Hour data
    this.timeRangeSelected = this.time_slots[0];

    this.map = mapInstance;

    this.getDivvyStationsStatus(true);

  }

  clickedMarker(label: string, index: number) {

    console.log(`clicked the marker: ${label || index}`)

  }
  clearHeatMap() {
    if (this.heatmap) {
      this.heatmap.setMap(null);
      this.heatMapData = [];
    }

  }



  ngOnDestroy() {

    this.map = null;
    this.heatmap = null;

  }


}