// // MANAGE PLAYER JS
let firstName;
// Display player pool
const displayPlayerPool = async(sortFunction) => {
    
    // Get player data from database
    const getPlayerPool = await fetch('/getDatabase'); 
    const playerPool = await getPlayerPool.json();
    // Sort the player data
    sortFunction(playerPool)
    // Check for existing player objects and remove if necessary
    let playerDisplay = document.getElementById('player-pool');
    let playerSection = document.getElementById('player-section');

    if(playerSection){
        playerSection.remove();
        playerSection = document.createElement('div');
        playerSection.setAttribute('id', 'player-section')
        playerDisplay.appendChild(playerSection);
    }else {
        playerSection = document.createElement('div');
        playerSection.setAttribute('id', 'player-section')
        playerDisplay.appendChild(playerSection);
    }
     // Create and Add alphabet menu
     const alpha = Array.from(Array(26)).map((e, i) => i + 65);
     const alphabet = alpha.map((x) => String.fromCharCode(x));
     let alphaMenu = document.createElement('div');
     alphaMenu.setAttribute('id' , 'alpha-menu');
     alphabet.forEach(element => {
         let letters = document.createElement('p');
         letters.insertAdjacentText('afterbegin', element);
         alphaMenu.appendChild(letters);  
     })
     
    playerSection.appendChild(alphaMenu);

    // Generate player objects
    for(let player in playerPool){
        let playerId = player; 
        let playerObj = document.createElement('div');
        playerObj.setAttribute('class', 'player-obj');
        let playerName= document.createElement('div');
        let playerLastName = document.createElement('p');
        let playerFirstName = document.createElement('p');
        let playerRating = document.createElement('p');
        let editIcon = document.createElement('i');
        editIcon.setAttribute('class', "fas fa-pen edit-player-icon");
        editIcon.setAttribute('id', playerPool[player]._id);
        editIcon.setAttribute('onclick', 'editPlayer(this)')
        playerName.setAttribute('class', 'player-name')
        playerLastName.setAttribute('class', 'player-last-name');
        playerLastName.setAttribute('id', playerId + "-last-name" )
        playerFirstName.setAttribute('class', 'player-first-name');
        playerFirstName.setAttribute('id', playerId + '-first-name');
        playerRating.setAttribute('class', 'player-rating');
        playerRating.setAttribute('id', playerId + '-rating');
        playerFirstName.innerText = playerPool[player].firstName;
        playerLastName.innerText = playerPool[player].lastName; 
        playerRating.innerText = playerPool[player].rating;
        if(firstName){
            playerName.appendChild(playerFirstName);
            playerFirstName.classList.add('make-bold')
            playerName.appendChild(playerLastName);
        }else {
            playerLastName.classList.add('make-bold')
            playerName.appendChild(playerLastName);
            playerName.appendChild(playerFirstName);
        }
        playerObj.appendChild(editIcon);
        playerObj.appendChild(playerName);
        playerObj.appendChild(playerRating); 
        playerSection.appendChild(playerObj);
    }
}


// Sorting functions
let firstNameSort = (data) => {
    data.sort((a, b) => a.firstName.localeCompare(b.firstName))
    firstName = true;
    return data
} 

let lastNameSort = (data) => {
    data.sort((a, b) => a.lastName.localeCompare(b.lastName))
    firstName = false;
    return data
} 

// let ratingSort = (data) => {
//     data.sort((a, b) => a.rating.localeCompare(b.rating
//         ))
//     return data
// } 

// Initial display
displayPlayerPool(firstNameSort);

// Toggle edit player modal
let toggleEditModal = () => {
    let modalBackground = document.getElementById('manage-modals');
    let editPlayerForm = document.getElementById('edit-player-form');
    if(modalBackground.style.display == ('flex')){
        modalBackground.style.display = ('none')
        editPlayerForm.style.display = ('none');
    }else {
        window.scrollTo(0,0);
        modalBackground.style.display = ('flex')
        editPlayerForm.style.display = ('flex');
    }
}

// Edit player
let editPlayer = async(selection) => {
    
    // Send player Id to server to find player 
    let _id;
    typeof selection === "object" ? _id = selection.id : _id = selection;
    let playerId = {_id}; 
    const options = {
        method: 'Post', 
        body: JSON.stringify(playerId),
        headers: {
            "Content-Type": "application/json"
        }
    }
    
    const sendId = await fetch('/findPlayer', options); 
    // Retrieve player data by Id
    const playerData = await sendId.json();
    // Open edit modal
    toggleEditModal();
    // Input data into editting form fields
    let firstNameField = document.getElementById("edit-first-name");
    let lastNameField = document.getElementById("edit-last-name");
    let ratingField = document.getElementsByName("edit-rating");
    let genderField = document.getElementById('edit-' + playerData.gender);
    let identifier = document.getElementById('player-id');
    identifier.innerHTML =  playerData._id;
    firstNameField.value = playerData.firstName;
    lastNameField.value = playerData.lastName;
    ratingField[playerData.rating-1].checked = true;
    genderField.checked = true;

}



// Update editted player in database 
let editForm = document.getElementById('edit-player');
editForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    // Capture updated information
    let playerId = document.getElementById('player-id').innerHTML;
    let firstName = document.getElementById('edit-first-name');
    let lastName = document.getElementById('edit-last-name');
    let gender = document.querySelector('input[name="edit-gender"]:checked');
    let rating = document.querySelector('input[name="edit-rating"]:checked');
   
    let edittedPlayer = {playerId: playerId, firstName: firstName.value, lastName: lastName.value, gender: gender.value, rating: rating.value}
    // Send editted player information to the database
    const options = {
        method: 'POST', 
        body: JSON.stringify(edittedPlayer),
        headers: {
            "Content-Type": "application/json"
        }
    }
    const update = await fetch('/updatePlayer', options);
    editForm.reset();
    toggleEditModal();
    displayPlayerPool(firstNameSort);
})



// Toggle add player modal 
let toggleAddModal = () =>  {
    // Open add modal
    let modalBackground = document.getElementById('manage-modals');
    let addPlayerForm = document.getElementById('add-player-form');
    if(modalBackground.style.display == ('flex')){
        modalBackground.style.display = ('none')
        addPlayerForm.style.display = ('none');
    }else {
        window.scrollTo(0,0);
        modalBackground.style.display = ('flex')
        addPlayerForm.style.display = ('flex');
    }
}


// Add player to the database
let addPlayerForm = document.getElementById('new-player');
let lastNameField = document.getElementById('last-name');
let firstNameField = document.getElementById('first-name');
let duplicate = false; 
let playerId;

addPlayerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    let firstName = document.getElementById('first-name');
    let lastName = document.getElementById('last-name');
    let gender = document.querySelector('input[name="gender"]:checked');
    let rating = document.querySelector('input[name="rating"]:checked');
    if(duplicate === false){
        let newPlayer = {firstName: firstName.value, lastName: lastName.value, gender: gender.value, rating: rating.value}
    
        const options = {
            method: 'POST', 
            body: JSON.stringify(newPlayer),
            headers: {
                "Content-Type": "application/json"
            }
        }
        const response = await fetch('/addToDatabase', options);
        addPlayerForm.reset();
        toggleAddModal();
        displayPlayerPool(firstNameSort)
    }else {
        duplicateMsg(firstName.value, lastName.value, playerId);
    }
   
}); 



const duplicateCheck = async (e) => {
    let lastName = lastNameField.value;
    let firstName = firstNameField.value; 
    if(lastName !== null && firstName !== null){
        const getDatabase = await fetch('/getDatabase'); 
        const playerData = await getDatabase.json();
        
        for(players in playerData){
           if(lastName.toLowerCase().trim() == playerData[players].lastName.toLowerCase().trim() && firstName.toLowerCase().trim() == playerData[players].firstName.toLowerCase().trim()) {
            duplicate = true;
            playerId = playerData[players]._id;
            duplicateMsg(firstName, lastName, playerId)
            return
            }
        }
    }
}

lastNameField.addEventListener('input', duplicateCheck); 
firstNameField.addEventListener('input', duplicateCheck);

// Show duplicate message 
const duplicateMsg = (firstName, lastName, playerId) => {
    let message = document.getElementById('duplicate-msg');
    message.style.display = "flex"
    let duplicateName = document.getElementById('duplicate-name');
    duplicateName.innerText =  `'${firstName} ${lastName}'`;
    let no = document.getElementById('no-thanks');
    no.addEventListener('click', e => {
      message.style.display = "none";
    })
    let edit = document.getElementById('yes-edit');
    edit.addEventListener('click', e => {
        message.style.display = "none";
        addPlayerForm.reset();
        toggleAddModal();
        editPlayer(playerId);
    })

}

// Cancel add player 
let cancelAddPlayer = () => {
    addPlayerForm.reset();
    toggleAddModal();
}

// Delete player
let deleteBtn = document.getElementById('delete-section');
deleteBtn.addEventListener('click', async (e) => {
    e.preventDefault(); 
    // Alert user of action
    let modal = document.getElementById('delete-modal');
    modal.style.display = "flex";
    // Handle deletion
    let yes = document.getElementById('yes');
    yes.addEventListener('click', async(e) => {
         // Capture player Id
        let playerId = document.getElementById('player-id').innerHTML;
        let removePlayer = {playerId: playerId};
        
        // Send player information to the database
        const options = {
            method: 'Post', 
            body: JSON.stringify(removePlayer),
            headers: {
                "Content-Type": "application/json"
            }
        }
        await fetch('/removePlayer', options);
        displayPlayerPool(firstNameSort)
        editForm.reset();
        modal.style.display = "none";
        toggleEditModal();
    })
    // Handle cancelation
    let no = document.getElementById('no');
    no.addEventListener('click', async(e) => {
        modal.style.display = "none";
    })
})

// Keeping track of checked boxes
let selected = []; 
let storeChecks = (data) => {
    selected.push(data.value)
}

// Display player list
let playerList = []; 


const displayPlayers =  async(sortFunction) => {
    // Get player data from database
    const getDatabase = await fetch('/getDatabase'); 
    const playerData = await getDatabase.json();
    for(let players in playerData){
        let playerTotal = playerData.length;
        playerList.push(playerData[players])
        if(playerList.length > playerTotal){
            playerList.splice(0, playerTotal)
        }
    }
    
    // Sort player data 
    sortFunction(playerList);
    let playerTable = document.getElementById('player-table');
    let rows = [...document.getElementsByClassName('table-row')];
    if(rows.length !== 0){
        rows.forEach(element => element.remove());
        playerList.forEach(playerData => {
            let row = playerTable.insertRow();
            row.setAttribute('class', 'table-row');
            let selectionCell = row.insertCell();
            let checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.setAttribute ('onclick', 'storeChecks(this)');
            checkbox.id = playerData._id + "-check";
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
        selected.forEach(checked => {
            let checkedBox = document.getElementById(checked + "-check");
            checkedBox.checked = true;
        })
    }else{
        playerList.forEach(playerData => {
                let row = playerTable.insertRow();
                row.setAttribute('class', 'table-row');
                let selectionCell = row.insertCell();
                let checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.value = playerData._id;
                checkbox.name = "players";
                checkbox.setAttribute ('onclick', 'storeChecks(this)');
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
    }
}


displayPlayers(firstNameSort);

// Player pool
let playerArray = [];

// Select players
let selectPlayersForm = document.getElementById('player-data');

selectPlayersForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    let selectPlayers = ()  => {
        let markedBoxes = document.querySelectorAll("input[name='players']"); 
        
        let match;
        for(let checkbox in markedBoxes) {
            if(markedBoxes[checkbox].checked){   
                let participant = markedBoxes[checkbox].value;
                for(let player in playerList){
                    if(participant == playerList[player]._id){
                        match = playerList[player]
                        playerArray.push(match) 
                    }
                }
            }

        
        }
    
    }
    
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
    let twoTeams = Math.floor(playerArray.length/2);
    let fourTeams = Math.floor(playerArray.length/4);

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
                
            }
            
            return teams;
       }; 
        
        snakeSelection(maleData, "male", true);
        snakeSelection(femaleData, "female", false);
        // teams.forEach(team => team.sort((a, b) => {
        //     return a.rating-b.rating
        // }))
        displayTeams(teams);
};


let males = [];
let females = [];

// Sort by gender then strength
const sortPlayers = () => {
    
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