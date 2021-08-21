// Player database
let playerDatabase = [
    ['Kayla Alewine', 'female', '2'],
    ['Peter Alewine', 'male', '3'],
    ['Jamie Cone', 'female', '1'],
    ['Donald Cone', 'male', '2'],
    ['Maggie Smith', 'female', '2'],
    ['Fish Smith', 'male', '4'],
    ['Emory Cash', 'male', '4'],
    ['Hannah Cash', 'female', '1'],
    ['KC Olds', 'female', '1'],
    ['Melissa Seward', 'female', '2'],
    ['Jeff Katz', 'male', '4'],
    ['Katie Folkner', 'female', '1'],
    ['Davey Folkner', 'male', '2'],
    ['Brian', 'male', '1'],
    ['Katie Krones', 'female', '3']
];
// Display player list
const displayPlayers = () => {
    let playerTable = document.getElementById('player-table');
    for(players in playerDatabase){
        let row = playerTable.insertRow();
        let selectionCell = row.insertCell();
        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.value = playerDatabase[players];
        checkbox.name = "check";
        selectionCell.appendChild(checkbox);
        let nameCell = row.insertCell();
        nameCell.innerHTML = playerDatabase[players][0];
        let genderCell = row.insertCell();
        genderCell.innerHTML = playerDatabase[players][1];
        let strengthCell = row.insertCell();
        strengthCell.innerHTML = playerDatabase[players][2];
    }
}

displayPlayers();
// Select players
let selectedPlayers = document.getElementById('player-data');
selectedPlayers.addEventListener('submit', async function(e) {
    e.preventDefault();
    const selectPlayers = () => {
        let markedBoxes = document.getElementsByName('check'); 
        for(let checkbox of markedBoxes) {
            if(checkbox.checked){    
                let participant = checkbox.value;
                let participantArray = participant.split(','); 
                playerPool.push(participantArray)
            }  
        }
    }
    
    selectPlayers();
    sortPlayers(playerPool);
    calcTeams();
});

// Player pool
let playerPool = [];

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
    
    buildTeams(sorted);
}


// Generate team
let playerIndex = 0;
let selectedTeam = 0;
let positive = true;

const buildTeams = (playerData) => {
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
        
    };
    displayTeams(teams);
};

let sorted = []; 
// Sort by gender then strength
const sortPlayers = () => {
    let males = [];
    let females = [];
   
    for(players in playerPool){
        let matches = playerPool[players][1];
        console.log(matches)
        let data = playerPool[players];
        if(matches === 'male'){
            males.push(data);
        }else if (matches === 'female'){
            females.push(data);
        }
    }

    males.sort(function(a,b){return a[2]-b[2]});
    females.sort(function(a,b){return a[2]-b[2]});
    
    sorted = males.concat(females);
    
}



// Display teams
const displayTeams = (teamData) => {
    let table = document.getElementById('team-table');
    
    for(players in teamData){
        let row = table.insertRow();
        let team1= row.insertCell(0);
        team1.innerHTML = teamData[0][players];
        let team2= row.insertCell(1);
        team2.innerHTML = teamData[1][players];
    }
   
   }