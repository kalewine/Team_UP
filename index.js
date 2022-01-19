const express = require('express');
const Datastore = require('nedb');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening at ${port}`));
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));

const playerDatabase = new Datastore('database.db');
const playerArray = new Datastore('playerarray.db');
const storedNum = new Datastore('storedNum.db');
const storedTeams= new Datastore('storedTeams.db');
const storedNames= new Datastore('storedNames.db');

playerDatabase.loadDatabase();
playerArray.loadDatabase();
storedNum.loadDatabase();
storedTeams.loadDatabase();
storedNames.loadDatabase();


// Use for PCS blog?
// playerDatabase.find({}, (err, data) => {
//     console.log(data)
//     data.forEach(player => 
//         app.get(`/${player._id}`, async (req, res) => {
//             res.send("request made at " + player.firstName + " " + player.lastName)
//             console.log("request made at " + player.firstName + " " + player.lastName)
           
//         }))
    
// })


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


app.post('/createPlayersArray', (req, res) => {
    console.log('Create players array' )
    playerArray.remove({}, { multi: true});
    let players = req.body;
    players.forEach(player => playerArray.insert(player))
    
})

app.get('/getPlayersArray', (req, res) => {
    console.log('Get Players Array requested' )
    
    playerArray.find({}, (err, data) => {
        if(err){
            console.log(err)
            res.end();
            return;
        }
        res.json(data);
    })
})



app.post('/storeTeamsNumber', (req, res) => {
    storedNum.remove({}, { multi: true});
    let number = req.body
    storedNum.insert(number)
    res.json({
        status: 'success', 
    })
})

app.get('/sendTeamsNumber', (req, res) => {
    storedNum.find({}, (err, data) => {
        if(err){
            console.log(err)
            res.end();
            return;
        }
        res.send(data);
    })
})

app.post('/storeTeams', (req, res) => {
    storedTeams.remove({}, { multi: true});
    console.log("storing teams")
    let teamsArray = req.body;
    for(let teams in teamsArray){
        storedTeams.insert([{team: teamsArray[teams], _id: teams}])
     }
})

app.get('/sendTeams', (req, res) => {
    console.log("sending stored teams")
    storedTeams.find({}, (err, data) => {
        if(err){
            console.log(err)
            res.end();
            return;
        }
        console.log(data)
        res.json(data);
    })
})

app.post('/storeNames', (req, res) => {
    console.log('storing team name')
    console.log(req.body)
    storedNames.remove({}, { multi: true});
    let newName = req.body;
    storedNames.insert(newName)
    res.json({
        status: 'success', 
    })
})

app.get('/sendNames', (req, res) => {
    console.log("sending stored team names")
    storedNames.find({}, (err, data) => {
        if(err){
            console.log(err)
            res.end();
            return;
        }
       
        res.json(data);
    })
})