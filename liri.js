// code to read and set any environment variables with the dotenv package
require("dotenv").config();
// code required to import the key.js file and store it in a variable
var keys = require("./keys.js");
// access keys information
// var spotify = new spotify(keys.spotify);

var Spotify = require('node-spotify-api');
var Axios = require("axios");
var Moment = require("moment");
// Includes the FS package for reading and writing packages
var fs = require("fs");
// var Dotenv = require("dotenv");
// var requests = require('requests');

var operation = process.argv[2];
var value = process.argv.slice(3);


switch (operation){
  case "concert-this":
    concertThis(value);
    break;
  case "spotify-this-song":
    spotifyThisSong(value);
    break;
  case "movie-this":
    movieThis(value);
    break;
  case "do-what-it-says":
    doWhatItSays(value);
    break;
}
// ===========================================================================
// if the "concert-this" function is called...

function concertThis(x) {
  // set value to artist for search
  var bitSearch = x;
  // bit search variable
  var bitURL = "https://rest.bandsintown.com/artists/" + bitSearch + "/events?app_id=codingbootcamp";
  // performing an AJAX request with the bitURL
  Axios.get(bitURL)
    // after data comes back from the request
    .then(function(response){
      // console.log(bitURL);
      
      // console.log(response.data);
      // storing the data from the AJAX request in the results variable
      var results = response.data;
      function resultData(){

        // results sent to console
        console.log("==============================================");
        console.log("");
        console.log("Venue:  " + results[i].venue.name);
        console.log("Location:  " + results[i].venue.city);
        console.log("Date:   " + Moment(results[i].datetime).format('MM/DD/YYYY'));
        console.log("");
        console.log("==============================================");

        // results sent to log.txt
        fs.appendFile("log.txt", "\n==============================================concert-this Results\n\nArtist(s):  "+bitSearch+"\nVenue:  "+results[i].venue.name+"\nLocation:  "+results[i].venue.city+"\nDate:  "+Moment(response.datetime).format('MM/DD/YYYY')+"\n\n", function(err) {
          if (err) {
            return console.log(err);
          }
          console.log("log.txt was updated!");
        });      
      }

      // looping through each result item
      for (var i = 0; i < results.length; i++) {
        resultData();
        }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
}

// ===========================================================================
// if the "spotify-this-song" function is called...

function spotifyThisSong(x) {
  // set the value to song for search
  var spotifyThis = x;
  console.log(value)
  // pick up spotify key info from .env via keys.js
  var spotify = new Spotify(keys.spotify);
 
  spotify.search({ type: 'track', query: spotifyThis }, function(err, data) {
   
    var spotifyResults = data.tracks.items;
    function showResults() {
      // results sent to console
      console.log("==============================================");
      console.log("");
      console.log("Artist(s):  " + spotifyResults[i].album.artists[0].name);
      console.log("Song:  " + spotifyResults[i].name);
      console.log("URL:  " + spotifyResults[i].album.external_urls.spotify);
      console.log("Album:  " + spotifyResults[i].album.name);
      console.log("");
      console.log("----------------------------------------------");

      // results sent to log.txt
      fs.appendFile("log.txt", "\n==============================================spotify-this-song Results\n\nArtist(s):  "+spotifyResults[i].album.artists[0].name+"\nSong:  "+spotifyResults[i].name+"\nURL:  "+spotifyResults[i].album.external_urls.spotify+"\nAlbum:  "+spotifyResults[i].album.name+"\n\n", function(err) {
        if (err) {
          return console.log(err);
        }
        console.log("log.txt was updated!");
      });      
    }

    // looping through each result item
    for (var i = 0; i < spotifyResults.length; i++) {
      showResults();
      }
  })
}

// ===========================================================================
// if the "movie-this" function is called...

function movieThis(x) {
  // set value to movie for search and format with "+" for spaces
  var movieName = x.join("+");
  
  console.log("Searching for " + movieName);
 
  // Then run a request with axios to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=264929f7";

  // This line is just to help us debug against the actual URL.
  console.log(queryUrl);

  Axios.get(queryUrl).then(
    function(response) {
      // results sent to console
      console.log("==============================================");
      console.log("");
      // console.log(response.data);      
      console.log("Title:  " + response.data.Title);
      console.log("Release Year:  " + response.data.Year);
      console.log("IMDB Rating:  " + response.data.imdbRating);
      console.log("Rotten Tomatoes Rating:  " + response.data.Ratings);
      console.log("Country:  " + response.data.Country);
      console.log("Language:  " + response.data.Language);
      console.log("\nPlot:  " + response.data.Plot);
      console.log("\nActors:  " + response.data.Actors);
      console.log("");
      console.log("----------------------------------------------");

      // results sent to log.txt
      fs.appendFile("log.txt", "\n==============================================movie-this Results\n\nTitle:  "+response.data.Title+"\nRelease Year:  "+response.data.Year+"\nIMDB Rating:  "+response.data.imdbRating+"\nRotten Tomatoes Rating:  "+response.data.Ratings+"\nCountry:  "+response.data.Country+"\nLanguage:  "+response.data.Language+"\n\nPlot:  "+response.data.Plot+"\n\nActors:  "+response.data.Actors+"\n\n", function(err) {
        if (err) {
          return console.log(err);
        }
        console.log("log.txt was updated!");
      });
    }
  )
  .catch(function(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("---------------Data---------------");
      console.log(error.response.data);
      console.log("---------------Status---------------");
      console.log(error.response.status);
      console.log("---------------Status---------------");
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  });

}


// ===========================================================================
// if the "do-what-it-says" function is called...

function doWhatItSays(value) {
  //var argument = value;
  // Running the readFile module that's inside of fs.
  // Stores the read information into the variable "data"
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
  
    // Break the string down by comma separation and store the contents into the output array.
    var output = data.split(",");

    // Loop Through the newly created output array
    for (var i = 0; i < output.length; i++) {
  
      // Print each element (item) of the array/
      console.log(output.length);
      console.log(output[0]);
      console.log(output[1]);
      // var doThis = output[0];
      // var doThisValue = output[1];
 
      if (output[i] === "concert-this") {
        // bitSearch = ;
        concertThis(output[i+1]);
      }
      else if (output[i] === "movie-this") {
        // movieName = ;
        movieThis(output[i+1]);
      }
      
      else if (output[i] === "spotify-this-song"){
        // spotifyThis = ;
        spotifyThisSong(output[i+1])
      }
    }
  });

}






