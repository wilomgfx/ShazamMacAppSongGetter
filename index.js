const path = require ('path');
const os = require('os');
const fs = require('fs');
const Database = require('better-sqlite3');
const RapidAPI = require('rapidapi-connect');
const rapid = new RapidAPI(process.env.RAPID_PROJECT_ID, process.env.RAPID_API_KEY);

const userHomeDir = os.userInfo().homedir;
const pathToGroupContainers = path.resolve(userHomeDir, 'Library/Group Containers/');
const ARTIST_TABLE_NAME = "ZSHTAGRESULTMO";
const JSON_COLUMN = "ZTRACKJSON";

const getTheDb = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(pathToGroupContainers, (err, files) => {
      const shazamPath = files.find(file => file.includes('shazam'));
      const pathToShazam = path.resolve(pathToGroupContainers, shazamPath);
      fs.readdir(pathToShazam, (err, files) => {
        const pathToShazamPackage = files.find(file => file.includes('shazam'));
        const pathToShazamDb = path.resolve(pathToShazam, pathToShazamPackage);
        fs.readdir(pathToShazamDb, (err, files) => {
          const sqliteDb = files.find((file) => file === 'ShazamDataModel.sqlite');
          if(!sqliteDb){
            return reject('no access!');     
          }
          const fullDbPath = path.resolve(pathToShazamDb, sqliteDb);
            fs.access(fullDbPath, (err) => {
              if(err){
                return reject('no access!');                
              }
              return resolve(fullDbPath);          
            })
        });
      });
    });
  });
}

const queryDb = (dbPath) => {
  try{
    const db = new Database(dbPath, {
      fileMustExist:true,
    });
    const rows = db.prepare(`SELECT ${JSON_COLUMN} FROM ${ARTIST_TABLE_NAME}`).all();
    // console.dir(JSON.parse(rows[0][JSON_COLUMN]));
    const getTrack = (row) => JSON.parse(row[JSON_COLUMN]).track;
    const tracks = rows.map(getTrack);
    const headings = tracks.map(({heading : { title, subtitle }}) => { return { title, artist: subtitle }})
    console.dir(headings);

  } catch(e) {
    console.error(e);
  }

}

const getEm = () => {
  getTheDb().then(res => {
    queryDb(res);
  }).catch(err => {
    console.error(err);
  })
  
}

const lastFmCall = ({track, artist}) => {
   rapid.call('LastFm', 'searchTracks', { 
    'apiKey': process.env.LAST_FM_API_KEY,
    artist,
    track
  
  }).on('success', (payload)=>{ 
     console.log(payload);
  }).on('error', (payload)=>{ 
     console.log(payload);
  });
}

getEm();
