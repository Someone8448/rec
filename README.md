# About
Open source bot for recording notes and playing back on Multiplayer Piano
# Configuration 
```js
{
	"uri": "wss://vps.8448.space:8443", // the server URI
	"client": "./Client.js", // the client file
	"token": "token here", // user token, no need to define if on old sites
	"room": "xd", // the channel
	"set": {
		"color": "#00ffff",
		"name": "[N]ote Recorder Bot"
	}, //you can figure this out
	"db": "db", // the path to the database
	"buffer": {
		"note": 1000, //how often it starts new note intervals
		"chat": 50, // how often it can chat
		"length": 511, //the longest chat length
		"size": 50000 //how many events per chunk
	},
	"max": 3000000, //longest a recording can be
	"prefix": "n", // bot prefix
	"segmented": "testint", //true to separate the notes by second, testint for it to do different way, testint has to be true tho
	"files": true, // true if file based, false for level db
	"convert": true, // false for JSON chunks
	"deviate": 10000, // how off a system clock can be
	"testint": true, 
	"filter": {
		"quota": "newquota", //which quota function
		"args": [{"allowance": 12000, "points": 48000, "interval": 2000}], //nq
		"check": true, //don't send note off it already has
		"deblack": true, //default variable for deblack, sustain exists too
		"multi": { // don't define if you don't want multiple bots
			"count": 2, // how many
      "tokens": ["token 1", "token 2", "token 3"], //tokens
      "names": ["meow", "meow"], //names, don't define if you want defaults, 
      "colors": ["#000000", "#ffffff"], //colors, don't define for defaults
			"userkey": true // each bot has a certain amount of keys it will play
		},
		"nps": 1000 // how often to log the NPS of all the bots, remove to disable
	},
	"console": true // console commands running
}
```
