require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var moment = require('moment');
moment().format();

var spotify = new Spotify(keys.spotify);


var main = {
  command: process.argv[2],   //liri command
  movieName: "",
  RTfound: false,
  IMDBfound: false,
  songName: "",
  songArtists: [],
  artistName: "",

  createLog: function (log) {
    fs.appendFileSync("log.txt", log + "\r\n", function (err) {
      // If an error was experienced we will log it.
      if (err) {
        console.log(err);
      }
      else {
        console.log(log);
      }
    });
  },

  concert: function (queryTerm) {
    //input validation must hav input


    var queryUrl = "https://rest.bandsintown.com/artists/" + queryTerm + "/events?app_id=codingbootcamp"

    axios.get(queryUrl).then(function (response) {
      // console.log(response.data);
      // console.log(JSON.stringify(response.data, null, 2));


      for (var i = 0; i < response.data.length; i++) {
        console.log("Event " + parseInt(i + 1));
        main.createLog("Event " + parseInt(i + 1));
        console.log("Venue name: " + response.data[i].venue.name);
        main.createLog("Venue name: " + response.data[i].venue.name);
        console.log("Venue location: " + response.data[i].venue.city + ", " + response.data[i].venue.country)
        main.createLog("Venue location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
        console.log("Event Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
        main.createLog("Event Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
        console.log("----------------------")
        main.createLog("----------------------");
      }
    });

  },

  movie: function (queryTerm) {
    //input validation must hav input

    //axios url generation
    var queryUrl = "http://www.omdbapi.com/?t=" + queryTerm + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
      function (response) {
        // console.log(response.data)
        // console log relevant responses
        // console.log(JSON.stringify(response.data, null, 2));

        console.log(response.data.Title);
        main.createLog(response.data.Title);
        console.log("The movie came out: " + response.data.Year)
        main.createLog("The movie came out: " + response.data.Year);
        console.log("Rated: " + response.data.Rated)
        main.createLog("Rated: " + response.data.Rated);
        //making sure there is an IMDB rating Internet Movie Database
        for (var i = 0; i < response.data.Ratings.length; i++) {
          if (response.data.Ratings[i].Source === 'Internet Movie Database') {
            console.log("IMDB rating: " + response.data.Ratings[i].Value);
            main.createLog("IMDB rating: " + response.data.Ratings[i].Value);
            main.IMDBfound = true;
          }
          if (!main.IMDBfound) {
            console.log("IMDB Rating: N/A");
            main.createLog("IMDB rating: N/A");
          }
        }

        //making sure there is a Rotten tomatoes rating
        for (var i = 0; i < response.data.Ratings.length; i++) {
          if (response.data.Ratings[i].Source === 'Rotten Tomatoes') {
            console.log(response.data.Ratings[1].Source + " rating: " + response.data.Ratings[1].Value);
            main.createLog(response.data.Ratings[1].Source + " rating: " + response.data.Ratings[1].Value);
            main.RTfound = true;
          }
        }
        //else no rating
        if (!main.RTfound) {
          console.log("Rotten Tomatoes Rating: N/A")
          main.createLog("Rotten Tomatoes Rating: N/A");
        }
        console.log("The movie was made in: " + response.data.Country)
        main.createLog("The movie was made in: " + response.data.Country);
        console.log("Summary of Plot: " + response.data.Plot);
        main.createLog("Summary of Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
        main.createLog("Actors: " + response.data.Actors);
        console.log("----------------------")
        main.createLog("----------------------");
      }
    );
  },

  spotify: function (queryTerm) {
    //input validation must hav input

    spotify.search({ type: 'track', query: queryTerm, limit: 1 }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }

      // console.log(JSON.stringify(data, null, 2));

      console.log("Song Name:" + data.tracks.items[0].name)
      main.createLog("Song Name:" + data.tracks.items[0].name);

      for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
        main.songArtists.push(data.tracks.items[0].artists[i].name);
      }
      console.log("Artists: " + main.songArtists.join(", "))
      main.createLog("Artists: " + main.songArtists.join(", "));


      console.log("From Album: " + data.tracks.items[0].album.name)
      main.createLog("From Album: " + data.tracks.items[0].album.name);

      console.log("Preview on Spotify: " + data.tracks.items[0].external_urls.spotify)
      main.createLog("Preview on Spotify: " + data.tracks.items[0].external_urls.spotify);

      console.log("----------------------")
      main.createLog("----------------------");

    });
  },

  doWhatItSays: function () {

    fs.readFile("random.txt", "utf8", function (error, data) {

      if (error) {
        return console.log(error);
      }
      var randomCommand = [];
      randomCommand = data.split(",")

      switch (randomCommand[0]) {
        case "concert-this":
          main.concert(randomCommand[1])
          break;

        case "movie-this":
          main.movie(randomCommand[1])
          break;

        case "spotify-this-song":
          main.spotify(randomCommand[1])
          break;

        default:
          console.log("error with random.txt");
          main.createLog("error with random.txt");
          console.log("----------------------")
          main.createLog("----------------------");

      }
    })
  },

  liri: function (command) {
    command = command.toLowerCase()
    switch (command) {

      case undefined:
        console.log("enter a command")
        main.createLog("enter a command");
        break;
      //concert coomand
      case "concert-this":
        if (process.argv[3] === undefined) {
          console.log("please enter an artist or band name")
          main.createLog("please enter an artist or band name");
          console.log("----------------------")
          main.createLog("----------------------");
        } else {
          main.artistName = process.argv[3];
          for (var i = 4; i < process.argv.length; i++) {
            main.artistName += " " + process.argv[i];
          }
          console.log(main.artistName)
          main.concert(main.artistName);
        }
        break;

      //movie this command
      case "movie-this":
        if (process.argv[3] === undefined) {
          console.log("please enter a movie name")
          main.createLog("please enter a movie name");
          console.log("For example: node liri.js movie-this Mr.Nobody  -> will return")
          main.createLog("For example: node liri.js movie-this Mr.Nobody  -> will return");
          main.movie("Mr.Nobody")
        } else {
          // grabbing the movie name from user input
          main.movieName = process.argv[3]
          for (var i = 4; i < process.argv.length; i++) {
            main.movieName += "_" + process.argv[i];
          }
          main.movie(main.movieName);
        }
        break;

      // spotify command
      case "spotify-this-song":
        if (process.argv[3] === undefined) {
          console.log("please enter a song name")
          main.createLog("please enter a song name");
          console.log("Example: node liri.js spotify-this-song the sign Ace of base  -> will return")
          main.createLog("Example: node liri.js spotify-this-song the sign Ace of base   -> will return");
          main.spotify("The Sign Ace of Base")
        } else {
          main.songName = process.argv[3]
          for (var i = 4; i < process.argv.length; i++) {
            main.songName += " " + process.argv[i];
          }
          main.spotify(main.songName)
        }
        break;
      //do what it says

      case "do-what-it-says":
        main.doWhatItSays();
        break;

      default:
        console.log("I dont know that command")
        main.createLog("I dont know that command");
        console.log("----------------------")
        main.createLog("----------------------");


    }
  }
}



var userinput = "node liri.js"
for (var i = 2; i < process.argv.length; i++) {
  userinput += " " + process.argv[i]
}
main.createLog(userinput)



// function testlog(log){
//   fs.appendFileSync("log.txt", log + "\r\n", function (err) {
//     // If an error was experienced we will log it.
//     if (err) {
//       console.log(err);
//     }
//     else {
//       console.log("ran fs");
//       console.log(log);
//     }
//   });
// }


if (process.argv[2] !== undefined) {
  main.liri(main.command);
} else {
  console.log("What would you like me to do?")
  main.createLog("What would you like me to do?")
  // testlog("What would you like me to do?")
}








