// Retrieve teams from database
const retrieveTeams = async () => {
    let response = await fetch('/sendTeams');
    let storedTeams = await response.json();
    retrieveNames(storedTeams)
}

// Retrieve names
 let retrieveNames = async (data) => {
        let response = await fetch('/sendNames');
        names = await response.json();
        displayTeams(data, names)
    }


// Display teams
const displayTeams = (teamData, names) => {
    console.log(teamData)
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
        column.setAttribute('id', 'team-' + teamNumber);
        column.setAttribute('class', "team-column")
        teamName.innerHTML = (names[0].teamNames[teamNumber-1]);
        
       
        nameContainer.appendChild(teamName);
        nameContainer.appendChild(editIcon);
        nameContainer.appendChild(nameInput);
        column.appendChild(nameContainer);
        columnPositioner.appendChild(column);
        teamData[team].team.forEach(player => {
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



retrieveTeams()