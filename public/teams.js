const teamNumber = async() => {
    const response = await fetch('/sendTeamsNumber'); 
    const teamsNumber = await response.json();
    let number = teamsNumber[0]
    sortPlayers(number);
}

teamNumber()

// Teams
let teams = [];

// Generate number of teams
let generateTeams = (maleData, femaleData, number) => {
    
    let numberOfTeams= number;
    for(let i=1; i <= numberOfTeams; i++){
        teams.push([]);
    }
    buildTeams(maleData, femaleData);
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
    
        playerData.forEach(pick =>{
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
        })
        
        return teams;

    }; 
     
     snakeSelection(maleData, "male", true);
     snakeSelection(femaleData, "female", false);
    //  teams.forEach(team => team.sort((a, b) => {
    //      return a.rating-b.rating
    //  }))
     
     displayTeams(teams);
};




// Sort by gender then strength
const sortPlayers = async(number) => {
    let males = [];
    let females = [];
    const getPlayersArray = await fetch('/getPlayersArray'); 
    const playerArray = await getPlayersArray.json();
 for(players in playerArray){
     let matches = playerArray[players].gender;
     let data = playerArray[players];
     if(matches === 'male'){
         males.push(data);
     }else if (matches === 'female'){
         females.push(data);
     }
 }
 males.sort(function(a,b){return a.rating-b.rating});
 females.sort(function(a,b){return a.rating-b.rating});

 generateTeams(males, females, number);
}

// Display teams
const displayTeams = (teamData) => {
    let teamNumber = 1;
    let columnPositioner = document.getElementById('column-positioner');
    
    // Create header row
    for(let team in teamData){
        let nameContainer = document.createElement('div');
        let teamName = document.createElement('h1');
        let nameInput = document.createElement('input');
        let column = document.createElement('div');
        let editIcon = document.createElement('i');
        
        nameContainer.setAttribute('class', 'name-container team-' + teamNumber + '-color')
        
        teamName.setAttribute('class', 'team-name');
        teamName.setAttribute('id', 'team-' + teamNumber + '-name')
        nameInput.setAttribute('class', 'name-input');
        nameInput.setAttribute('id', 'name-input-' + teamNumber)
        nameInput.setAttribute('value', 'Team ' + teamNumber)
        editIcon.setAttribute('class', 'fas fa-pen edit-name-pen');
        editIcon.setAttribute('onclick', `editTeamName(${teamNumber})`);
        column.setAttribute('id', 'team-' + teamNumber);
        column.setAttribute('class', "team-column")
        teamName.innerHTML = ("Team " + teamNumber);
        
       
        nameContainer.appendChild(teamName);
        nameContainer.appendChild(editIcon);
        nameContainer.appendChild(nameInput);
        column.appendChild(nameContainer);
        columnPositioner.appendChild(column);
       
        teamData[team].forEach(player => {
            let teamPlayer = document.createElement('div');
            teamPlayer.setAttribute('class', 'team-player team-' + teamNumber + '-player rating-' + player.rating);
            teamPlayer.setAttribute('onclick', 'selectPlayer(this)');
            teamPlayer.setAttribute('id', player._id);
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
            playerName.appendChild(playerFirstName);
            playerName.appendChild(playerLastName);
            teamPlayer.appendChild(playerName);
            teamPlayer.appendChild(playerRating);
            let teams = document.getElementById('team-' + teamNumber); 
            teams.appendChild(teamPlayer);
            
        })
        
        teamNumber++
        
    }
}

// Edit team names
let swappingPlayers = [];

let editTeamName = (teamNumber) => {
    let input = document.getElementById(`name-input-${teamNumber}`);
    input.style.display = 'block';
    let name = document.getElementById(`team-${teamNumber}-name`);
    let updateName = (e) => {
        e.preventDefault;
        
        name.innerText = e.target.value; 
        input.style.display = 'none';
    }
    input.addEventListener('change', updateName);
    
}

// Edit teams
let swapping = false;
// Select player to swap
let selectPlayer = (selected) => {
    // Boolean check of swapping
    swapping == false ? queuePlayer(selected) : confirmSwap(selected);

}

let queuePlayer = (playerData) => {
    // Style first selected player
    while(playerData.firstChild){
        playerData.removeChild(playerData.firstChild)
    }
    playerData.classList.add('swapping') 

    // Create queue
    let teamDisplay = document.getElementById('team-display');
    let swapQueue = document.createElement('div');
    swapQueue.setAttribute('id', 'queue');
    
    let queueText = document.createElement('p');
    queueText.setAttribute('class', 'queue-text')
    queueText.insertAdjacentHTML('afterbegin', 'Queued for swapping:');
    
    let swapPlayer = document.createElement('div');
    swapPlayer.setAttribute('class', `${playerData.classList[0]} ${playerData.classList[1]}` );
    swapPlayer.setAttribute('id', "queued-player" )
    
    let playerName= document.createElement('div');
    let playerLastName = document.createElement('p');
    let playerFirstName = document.createElement('p');
    let playerRating = document.createElement('p');
    let cancel = document.createElement('p');
    playerName.setAttribute('class', 'player-name')
    playerLastName.setAttribute('class', 'player-last-name');
    playerFirstName.setAttribute('class', 'player-first-name');
    playerRating.setAttribute('class', 'player-rating');
    cancel.setAttribute('class', 'cancel');
    cancel.insertAdjacentHTML('afterbegin', 'X');

    
    playerName.appendChild(playerFirstName);
    playerName.appendChild(playerLastName);
    swapPlayer.appendChild(playerName);
    swapPlayer.appendChild(playerRating);
   
    swapQueue.appendChild(queueText);
    swapQueue.appendChild(swapPlayer);
    swapQueue.appendChild(cancel);
    teamDisplay.appendChild(swapQueue);

    // Collect selected player data
    let selectedData;
    teams.forEach(team => team.find(player => {
       if(player._id == playerData.id){
           selectedData = player
           return selectedData
       }
    }))
   
    playerFirstName.innerText = selectedData.firstName;
    playerLastName.innerText = selectedData.lastName; 
    playerRating.innerText = selectedData.rating;

    // Update swappingPlayers array
    let teamNum = playerData.classList[1].slice(5,6);
    let playerOne = {team: teamNum, id: selectedData._id}
    swappingPlayers.push(playerOne);

    // Update boolean swapping status
    swapping = true;
}

let confirmSwap = (playerData) => {
    
    playerData.removeAttribute('onclick');
    // Update swappingPlayers array
    let teamNum = playerData.classList[1].slice(5,6);
    let playerId = playerData.id;
    let playerTwo = {team: teamNum, id: playerId}
    swappingPlayers.push(playerTwo);
    playerData.setAttribute('id', 'second-queue')
    let queue = document.getElementById('queue');
    queue.style.display = "none";
    
    let teamDisplay = document.getElementById('team-display');
    let confirmSwap = document.createElement('div');
    teamDisplay.insertAdjacentElement('afterbegin', confirmSwap);
    confirmSwap.setAttribute('id', 'confirm-swap');
    let queuedPlayer = document.getElementById('queued-player');

    let arrows = document.createElement('div');
    arrows.setAttribute('id', 'arrow-positioner' )
    let upArrow = document.createElement('i');
    upArrow.setAttribute('class', 'arrows fas fa-arrow-up');
    let downArrow = document.createElement('i');
    downArrow.setAttribute('class', 'arrows fas fa-arrow-down');
    arrows.appendChild(upArrow);
    arrows.appendChild(downArrow);

    let question = document.createElement('p');
    question.setAttribute('class', 'swap-text')
    question.setAttribute('id', 'swap-question')
    question.innerHTML = 'Swap these Players?';
    confirmSwap.appendChild(question);
    confirmSwap.appendChild(queuedPlayer);
    confirmSwap.appendChild(arrows);
    confirmSwap.appendChild(playerData);
   
    let addParagraph = (player) => {
        let teamNum = player.classList[1].slice(5,6);
        let paragraph = document.createElement('p');
        paragraph.setAttribute('class', 'swap-text');
        paragraph.innerHTML = 'Currently on Team ' + teamNum;
        player.insertAdjacentElement('beforebegin', paragraph)
    }
    
    addParagraph(playerData)
    addParagraph(queuedPlayer)
    
    let cancelBtn = document.createElement('button');
    let swapBtn = document.createElement('button');
    let positionBtn = document.createElement('div');
    positionBtn.setAttribute('id', 'position-btn');
    cancelBtn.setAttribute('class', 'swap-btns');
    swapBtn.setAttribute('class', 'swap-btns');
    cancelBtn.setAttribute('id', 'cancel-swap');
    cancelBtn.setAttribute('onclick', 'cancelSwap()')
    swapBtn.setAttribute('id', 'swap');
    swapBtn.setAttribute('onclick', 'swapPlayers()')
    cancelBtn.innerHTML = "Cancel";
    swapBtn.innerHTML = "Swap!";
    positionBtn.appendChild(cancelBtn);
    positionBtn.appendChild(swapBtn);

    confirmSwap.appendChild(positionBtn);
}

let cancelSwap = () => {
    resetDisplay();
    displayTeams(teams);
}


let swapPlayers = () => { 
    let p1Index;
    let p2Index;
    let p1Data; 
    let p2Data; 
    let p1OrigTeam;
    let p2OrigTeam;

    swappingPlayers.forEach(player => {
     const playerIndex = swappingPlayers.indexOf(player);
     const teamArrayPosition = player.team-1;
     const match = (player) => player._id == swappingPlayers[playerIndex].id;
     
    //  let currentTeam = swappingPlayers[playerIndex].team;
     let index = teams[teamArrayPosition].findIndex(match);
        if(playerIndex == 0){
            p1Index = index;
            p1Data = teams[teamArrayPosition][p1Index];
            p1OrigTeam = teamArrayPosition;
        }else{
            p2Index = index;
            p2Data = teams[teamArrayPosition][p2Index];
            p2OrigTeam = teamArrayPosition;
        }  
    })

    teams[p1OrigTeam].splice(p1Index, 1, p2Data);
    teams[p2OrigTeam].splice(p2Index, 1, p1Data);
    resetDisplay();
    displayTeams(teams);
    swappingPlayers = [];
}



let resetDisplay= () => {
    let swapScreen = document.getElementById('confirm-swap');
    swapScreen.remove();
    let queue = document.getElementById('queue');
    queue.remove();
    let columnPositioner = document.getElementById('column-positioner');
    while (columnPositioner.firstChild){
        columnPositioner.removeChild(columnPositioner.firstChild);
    }
    swappingPlayers = [];
    swapping = false;
}