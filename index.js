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
    ['Brian', 'male', '1']
];

// Select players
let selectedPlayers = document.getElementById('player-data');
selectedPlayers.addEventListener('submit', async function(e) {
    e.preventDefault();
    const selectPlayers = () => {
        let markedBoxes = document.getElementsByName('check'); 
        for(let checkbox of markedBoxes) {
            if(checkbox.checked){    
            let participant = checkbox.value;;
            playerPool.push(participant)
            
            }  
        }
        console.log(playerPool)
    }
    
    selectPlayers();
    calcTeams();
});

// Player pool
let playerPool = [];

// Calculate teams
let calcTeams = () => {
    let twoTeams = Math.floor(playerPool.length/2);
    let fourTeams = Math.floor(playerPool.length/4);

    let displayTwo = document.getElementById('two-teams');
    let displayFour = document.getElementById('four-teams');
    displayTwo.insertAdjacentHTML('beforeend', twoTeams);
    displayFour.insertAdjacentHTML('beforeend', fourTeams);
}



// Teams
let teams = [];

// Generate number of teams
let generateTeams = () => {
    let numberOfTeams= 4;
    for(let i=1; i <= numberOfTeams; i++){
        teams.push([]);
    }
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
};

// console.log(teams)

// Sort by gender then strength
const sortPlayers = () => {
    let males = [];
    let females = [];
    let sorted = []; 
    for(players in playerPool){
        let matches = playerPool[players][1];
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
    buildTeams(sorted);
}

sortPlayers();

// Display teams
const displayTeams = () => {
    let table = document.getElementById('table');
    let teamRow = table.insertRow(1);
    let team1= teamRow.insertCell(0);
    let team2= teamRow.insertCell(1);

    team1.innerHTML = teams[0];
    team2.innerHTML = teams[1];
}