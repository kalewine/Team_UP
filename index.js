const express = require('express');
const Datastore = require('nedb');
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));

const playerDatabase = new Datastore('database.db');

playerDatabase.loadDatabase();

app.get('/getDatabase', (req, res) => {
    console.log('getDatabase request')
    
    playerDatabase.find({}, (err, data) => {
        if(err){
            console.log(err)
            res.end();
            return;
        }
        res.json(data);
    })
});

app.post('/addToDatabase', (req, res) =>{
    console.log('addToDatabase request')
    console.log(req.body);
    let newPlayer = req.body;
    playerDatabase.insert(newPlayer);
    res.json({
        status: 'success', 
        
    })
});
 
app.post('/findPlayer', (req, res) => {
    console.log("get player request made")
    let playerId = req.body;
    
    playerDatabase.findOne(playerId, function (err, doc) {
        if(err){
            console.log(err)
            res.end();
            return;
        }else {
            console.log(doc)
            res.json(doc)
        }
    })
});

app.post('/updatePlayer', (req, res) => {
    console.log("received editted player information")
    let data = req.body;
    console.log(data)
    playerDatabase.update({_id: data.playerId}, { $set: { lastName: data.lastName, firstName: data.firstName, rating: data.rating, gender: data.gender }}, function(err, numReplaced){

    })
    res.json({
        success: 'success'
    })
    
});

app.post('/removePlayer', (req, res) => {
    console.log("receive request to remove player")
    let data = req.body;
    playerDatabase.remove({_id: data.playerId}, {}, function(err, numReplaced){

    })
    res.json({
        success: 'success'
    })
    
});

