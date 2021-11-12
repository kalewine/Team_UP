// Display player pool
const displayPlayerPool = async(teamData) => {
    const getPlayerPool = await fetch('/getDatabase'); 
    const playerPool = await getPlayerPool.json();

    for(let player in playerPool){
        let playerObj = document.createElement('div');
        playerObj.setAttribute('class', 'player-obj');
        let playerName= document.createElement('div');
        let playerLastName = document.createElement('p');
        let playerFirstName = document.createElement('p');
        let playerRating = document.createElement('p');
        let editIcon = document.createElement('i');
        editIcon.setAttribute('class', "fas fa-pen");
        playerName.setAttribute('class', 'player-name')
        playerLastName.setAttribute('class', 'player-last-name');
        playerFirstName.setAttribute('class', 'player-first-name');
        playerRating.setAttribute('class', 'player-rating');
        playerFirstName.innerText = playerPool[player].firstName;
        playerLastName.innerText = playerPool[player].lastName; 
        playerRating.innerText = playerPool[player].rating;
        playerName.appendChild(playerFirstName);
        playerName.appendChild(playerLastName);
        playerObj.appendChild(editIcon);
        playerObj.appendChild(playerName);
        playerObj.appendChild(playerRating);
        let playerDisplay = document.getElementById('player-pool'); 
        playerDisplay.appendChild(playerObj);
    }
}

displayPlayerPool();
// Add player to the database
let addPlayerForm = document.getElementById('new-player');
addPlayerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    let firstName = document.getElementById('first-name');
    let lastName = document.getElementById('last-name');
    let gender = document.querySelector('input[name="gender"]:checked');
    let rating = document.querySelector('input[name="rating"]:checked');
    let newPlayer = {firstName: firstName.value, lastName: lastName.value, gender: gender.value, rating: rating.value}
    
    const options = {
        method: 'Post', 
        body: JSON.stringify(newPlayer),
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await fetch('/addToDatabase', options);
    addPlayerForm.reset();
}); 

let lastNameField = document.getElementById('last-name');
let firstNameField = document.getElementById('first-name');

const duplicateCheck = async (e) => {
    let lastName = lastNameField.value;
    let firstName = firstNameField.value; 
    if(lastName !== null && firstName !== null){
        const getDatabase = await fetch('/getDatabase'); 
        const playerData = await getDatabase.json();
        for(players in playerData){
           if(lastName.toLowerCase() == playerData[players].lastName.toLowerCase() && firstName.toLowerCase() == playerData[players].firstName.toLowerCase()) {
               alert('A player with this name already exists. Would you like to edit this player instead?')
               return
            }
        }
    }
}

lastNameField.addEventListener('input', duplicateCheck); 
firstNameField.addEventListener('input', duplicateCheck);


let displayedData = [];
// Display player list
const displayPlayers = async () => {
    let playerTable = document.getElementById('player-table');
    
    const getDatabase = await fetch('/getDatabase'); 
    const storedData = await getDatabase.json();
   

    if(displayedData.length == 0){
        storedData.forEach(player => displayedData.push(player))
    }else if(displayedData.length !== storedData.length){
        displayedData.push(storedData[storedData.length-1])
    }
    for(players in storedData){ 
        let storedValues = Object.values(storedData[players])
        let displayedValues = Object.values(displayedData[players])
        for(let values in storedValues){
            if(storedValues[values] !== displayedValues[values]){
                displayedValues.splice(values, 1, storedValues[values])
            }
        }
        
    }
    
    displayedData.forEach(playerData => {
            let row = playerTable.insertRow();
            let selectionCell = row.insertCell();
            let checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.value = displayedData.indexOf(playerData);
            checkbox.name = "players";
            selectionCell.appendChild(checkbox);
            let firstName = row.insertCell();
            firstName.innerHTML = playerData.firstName;
            let lastName = row.insertCell();
            lastName.innerHTML = playerData.lastName;
            let genderCell = row.insertCell();
            genderCell.innerHTML = playerData.gender;
            let ratingCell = row.insertCell();
            ratingCell.innerHTML = playerData.rating;
    })
    console.log(displayedData)
}

displayPlayers();
// Player pool
let playerPool = [];


// Select players
let selectPlayersForm = document.getElementById('player-data');
selectPlayersForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    let selectPlayers = ()  => {
        let markedBoxes = document.getElementsByName('players'); 
        for(let checkbox of markedBoxes) {
            if(checkbox.checked){    
                let participant = checkbox.value;
                playerPool.push(displayedData[participant])
            }  
        }
    };
    
    selectPlayers();

    sortPlayers();
    calcTeams();
});

// Select all function
let selectAll = document.getElementById('select-all');
selectAll.addEventListener('change',  () => {
    
    if(selectAll.value === true){
    }else {
        
        let players = document.getElementsByName('players');
        for(let player of players)
            player.setAttribute('checked', 'checked');
    }
});


// Calculate teams
const calcTeams = () => {
    let twoTeams = Math.floor(playerPool.length/2);
    let fourTeams = Math.floor(playerPool.length/4);

    let displayTwo = document.getElementById('two-teams');
    let displayFour = document.getElementById('four-teams');
    displayTwo.insertAdjacentHTML('beforeend', twoTeams);
    displayFour.insertAdjacentHTML('beforeend', fourTeams);
}

// Select number of teams 
const selectTeamNumber = (number) => {
    generateTeams(number);
}



// Teams
let teams = [];

// Generate number of teams
let generateTeams = (selection) => {
    let numberOfTeams= selection;
    for(let i=1; i <= numberOfTeams; i++){
        teams.push([]);
    }
    
    buildTeams(males, females);
}


// Generate team
const buildTeams = (maleData, femaleData) => {
    
       let snakeSelection = (playerData, gender, direction) => {
            let playerIndex = 0;
            let selectedTeam;
            if(gender == 'female'){
                selectedTeam = teams.length-1;
            }else {
                selectedTeam = 0
            }
            let positive = direction;
           for(player in playerData){
               
                let pick = (playerData[playerIndex]);
                playerIndex++

                let currentTeam = teams[selectedTeam];
                
                if(positive == true){
                    currentTeam.push(pick);
                    selectedTeam++
                }else if(positive == false){
                    currentTeam.push(pick);
                    selectedTeam--
                }

                if(selectedTeam == teams.length){
                    positive = false;
                    selectedTeam--
                }else if(selectedTeam == -1){
                    positive = true;  
                    selectedTeam++
                }
                console.log(positive, playerIndex, selectedTeam) 
            }
            return teams;
            
       }; 
       
        snakeSelection(maleData, "male", true);
        snakeSelection(femaleData, "female", false);
        displayTeams(teams);
};

let sorted = []; 
let males = [];
let females = [];

// Sort by gender then strength
const sortPlayers = () => {

    for(players in playerPool){
        let matches = playerPool[players].gender;
        let data = playerPool[players];
        if(matches === 'male'){
            males.push(data);
        }else if (matches === 'female'){
            females.push(data);
        }
    }
    males.sort(function(a,b){return a.rating-b.rating});
    females.sort(function(a,b){return a.rating-b.rating});
    // sorted = males.concat(females);
}



// Display teams
const displayTeams = (teamData) => {
    let teamNumber = 1;
    let teamNames = document.getElementById('team-name-positioner');
    // Create header row
    for(let team in teamData){
        let teamName = document.createElement('h1');
        let column = document.createElement('div');
        teamName.setAttribute('class', 'team-name');
        column.setAttribute('id', 'team-' + teamNumber);
        teamName.innerHTML = "Team " + (teamNumber);
        column.appendChild(teamName)
        teamNames.appendChild(column);
        
        teamData[team].forEach(player => {
            let playerObj = document.createElement('div');
            playerObj.setAttribute('class', 'player-obj');
            let playerName= document.createElement('div');
            let playerLastName = document.createElement('p');
            let playerFirstName = document.createElement('p');
            let playerRating = document.createElement('p');
            playerName.setAttribute('class', 'player-name')
            playerLastName.setAttribute('class', 'player-last-name');
            playerFirstName.setAttribute('class', 'player-first-name');
            playerRating.setAttribute('class', 'player-rating');
            playerFirstName.innerText = player.firstName;
            playerLastName.innerText = player.lastName; 
            playerRating.innerText = player.rating;
            // if(player.gender == 'female'){
            //     playerObj.setAttribute('id', 'female')
            // }else {playerObj.setAttribute('id', 'male')}
            playerName.appendChild(playerFirstName);
            playerName.appendChild(playerLastName);
            playerObj.appendChild(playerName);
            playerObj.appendChild(playerRating);
            let teamDisplay = document.getElementById('team-' + teamNumber); 
            teamDisplay.appendChild(playerObj);
        })
        teamNumber++
    }
   
}