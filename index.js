const path = require ('path');
const os = require('os');
const fs = require('fs');
const sqlite = require('better-sqlite3');
const RapidAPI = require('rapidapi-connect');
const rapid = new RapidAPI(process.env.RAPID_PROJECT_ID, process.env.RAPID_API_KEY);

const userHomeDir = os.userInfo().homedir;
const pathToGroupContainers = path.resolve(userHomeDir, 'Library/Group Containers/')


function getEm() {
  fs.readdir(pathToGroupContainers, (err, files) => {
    const shazamPath = files.find(file => file.includes('shazam'));
    const pathToShazam = path.resolve(pathToGroupContainers, shazamPath);
    fs.readdir(pathToShazam, (err, files) => {
      const pathToShazamPackage = files.find(file => file.includes('shazam'));
      const pathToShazamDb = path.resolve(pathToShazam, pathToShazamPackage);
      fs.readdir(pathToShazamDb, (err, files) => {
        console.log(files)
      });
    });
  });
  // rapid.call('LastFm', 'searchTracks', { 
  //   'apiKey': process.env.LAST_FM_API_KEY,
  //   'artist': 'loud luxury',
  //   'track': 'body'
  
  // }).on('success', (payload)=>{
  //    /*YOUR CODE GOES HERE*/ 
  // }).on('error', (payload)=>{
  //    /*YOUR CODE GOES HERE*/ 
  // });
}

getEm();
