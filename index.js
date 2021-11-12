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
        status: 'success'
    })
});