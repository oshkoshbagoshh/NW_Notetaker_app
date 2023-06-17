// import 
const path = require("path");
const express = require('express');
const fs = require("fs");
// uuid for unique user id 
const { v4: uuidv4 } = require ('uuid');
const { error } = require("console");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static("db"));


//routing for index file 
app.get("/index", (req,res) => {
    res.sendFile(path.join(__dirname,"/public/index.html"));
})


//path to notes html
app.get('/notes',(req,res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

//index.html 
app.get("/api/notes",(req,res) => {
    res.sendFile(path.join(__dirname,"./public/index.html"));
});


// setting up the get api route for notes 
app.get('/api/notes', (req,res) => {
    fs.readFile('./db/db.json', 'utf-8',(err,file) => {
        if(err) throw err;
        const parseFile = JSON.parse(file);
        return res.send(parseFile);
    })
})

//setting up post api route 
app.post('/api/notes',(req,res) => {
    let newNote = req.body;
    newNote["id"] = uuidv4(); //unique ID identifier
    newNote["title"] = req.body.title;
    newNote["text"] = req.body.text;


    fs.readfile('./db/db.json','utf-8'),(err, data) => {
        const parseFile = JSON.parse(file);
        parseFile.push(note);

        const modifiedFile = JSON.stringify(parseFile);

        //write the file  with fs
        fs.writeFile('./db/db.json',modifiedFile,'utf-8',(err) => {
            if (err) throw err;
            console.log("...Note Created!")
        });

        return res.send(JSON.parse(modifiedFile));
    };
})


// set up API for delete functionality 

app.delete("/api/notes/:id", (req,res) => {
    fs.readFile("./db/db.json",'utf-8',(error, file) => {
        if( error) throw error;

        let deleteNoteID = req.params.id;
        const parseFile = JSON.parse(file);
        const modifiedFile = parseFile.filter(elem => elem.id != deleteNoteID);

        const stringifiedFile = JSON.stringify(modifiedFile);

        //write to the file
        fs.writeFile('./db/db.json', stringifiedFile,'utf-8', (error) => {
            if (error) throw error ;
            console.log("...Note Deleted!");
        });

        return res.send(JSON.parse(stringifiedFile));
    })
});





//path back to homepage  with wildcard 
app.get("*",(req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))

})

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));