var express = require("express");
var path = require("path");
var fs = require("fs");

// Set up express app/server port
var app = express();
var PORT = process.env.PORT || 3000;

// set up express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// set up variables/arrays for holding data? 
// to save new notes
var combinedNotes = [];


// Set up routes =======================
// basic route, send user first (root) "/" pg
app.get("/,", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});
// route sends user to notes page (/notes) and displays notes?
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});
// route to display all notes (api route)
app.get("/api/notes", function(req,res) {
  let readNotes = fs.readFileSync(path.join('./db/db.json'), "utf8");  
  // READ THE DB FILE IN ORDER TO USE IT IN THE CODE FOLLOWING
  res.json(JSON.parse(readNotes));
});

app.post("/api/notes", function (req, res) {
  var newNote = req.body;
  let noteData = fs.readFileSync(path.join('./db/db.json'), "utf8"); 
  // READ THE DB FILE IN ORDER TO USE IT IN THE CODE FOLLOWING
  combinedNotes = JSON.parse(noteData);
  combinedNotes.push(newNote);
  
  combinedNotes.forEach(assignId);
  // This works because the second parameter of argument in a for each refers to the index of the array--for each item that is in noteData, the index number is added to by one and assigned as the item id (item.id)
  function assignId(item, index){
      item.id = index + 1;
  };
  // need to stringify because data has to be parsed into a string in order to transmit data from server to web app/browser
  let stringifyData = JSON.stringify(combinedNotes)
  fs.writeFileSync(path.join('./db/db.json'), stringifyData, (err) => {
      if (err) throw err;
  });
  // request needs response
  res.json(combinedNotes); // MOVED OUTSIDE OF THE writeFileSync function so that it applies to the post function
  
});
  
// route to delete notes
app.delete("/api/notes/:id", function(req, res) { 
  // res.send("DELETE request.");
  // when you push the delete button, req.params.id tells the app which note you want to delete because of the if statement in handleNoteDelete (index.js)
var needToDelete = req.params.id;
// remove note with given id
// filter creates a new array ("remove" in this case) with the items that return true. In this case--note.id's that do not equal needToDelete 
let noteData = fs.readFileSync(path.join('./db/db.json'), "utf8");
let remove = JSON.parse(noteData).filter(note => note.id !== parseInt(needToDelete));
let stringifyData2 = JSON.stringify(remove);
// display remove array when you click the trash can (res.send--send to front end) every time you click trash can
fs.writeFileSync(path.join('./db/db.json'), stringifyData2, (err) => {
  if (err) throw err;
})
res.json(stringifyData2);
});

// end routes===================================

// start server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});



