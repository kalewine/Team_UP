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
         let letters = document.createElement('a');
         letters.setAttribute('class', 'letters');
         letters.insertAdjacentText('afterbegin', element.toLowerCase());
         alphaMenu.appendChild(letters);  
     })
     
    playerSection.appendChild(alphaMenu);

    // Generate player objects
    for(let player in playerPool){
        let playerId = player; 
        let playerObj = document.createElement('div');
        playerObj.setAttribute('class', `player-obj ${playerPool[player].gender}`);
        playerObj.setAttribute('id', playerPool[player]._id);
        playerObj.setAttribute('onclick', 'editPlayer(this)')
        let playerName= document.createElement('div');
        let playerLastName = document.createElement('p');
        let playerFirstName = document.createElement('p');
        let playerRating = document.createElement('p');
        let editIcon = document.createElement('i');
        editIcon.setAttribute('class', "fas fa-pen edit-player-icon");
       
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
let sortFirst = document.getElementById('sort-first-manage');
let sortLast = document.getElementById('sort-last-manage');
let firstNameSort = (data) => {
    data.sort((a, b) => a.firstName.localeCompare(b.firstName))
    firstName = true;
    sortFirst.checked = true;
    return data
} 

let lastNameSort = (data) => {
    data.sort((a, b) => a.lastName.localeCompare(b.lastName))
    firstName = false;
    sortLast.checked = true;
    return data
} 

// let ratingSort = (data) => {
//     data.sort((a, b) => a.rating.localeCompare(b.rating
//         ))
//     return data
// } 
// Sort toggle switch 
sortFirst.addEventListener('click', async(e) => {
    displayPlayerPool(firstNameSort)
})

sortLast.addEventListener('click', async(e) => {
    displayPlayerPool(lastNameSort)
})

// Initial display
displayPlayerPool(firstNameSort);

// Toggle edit player modal
let toggleEditModal = () => {
    let body = document.querySelector('body');
    let modalBackground = document.getElementById('manage-modals');
    let editPlayerForm = document.getElementById('edit-player-form');
    let playerPool = document.getElementById('player-pool')
    if(modalBackground.style.display == ('flex')){
        modalBackground.style.display = ('none')
        editPlayerForm.style.display = ('none');
        playerPool.classList.remove("hide-background");
        body.style.display = 'initial';
    }else {
        window.scrollTo(0,0);
        modalBackground.style.display = ('flex')
        editPlayerForm.style.display = ('flex');
        playerPool.classList.add('hide-background');
        body.style.display = 'fixed';
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
    let body = document.querySelector('body');
    let modalBackground = document.getElementById('manage-modals');
    let addPlayer = document.getElementById('add-player-form');
    let playerPool = document.getElementById('player-pool')
    if(modalBackground.style.display == ('flex')){
        modalBackground.style.display = ('none');
        addPlayer.style.display = ('none');
        playerPool.classList.remove("hide-background");
        body.style.display = 'initial';
    }else {
        window.scrollTo(0,0);
        modalBackground.style.display = ('flex');
        addPlayer.style.display = ('flex');
        playerPool.classList.add('hide-background');
        body.style.display = 'fixed';
    }
}


// Add player to the database
let addPlayerForm = document.getElementById('new-player');
let lastNameField = document.getElementById('last-name');
let firstNameField = document.getElementById('first-name');
let duplicate; 
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
            }else {
            (duplicate = false)
            }
        }
    }
}

lastNameField.addEventListener('input', duplicateCheck); 
firstNameField.addEventListener('input', duplicateCheck);

// Show duplicate message 
const duplicateMsg = (firstName, lastName, id) => {
    let message = document.getElementById('duplicate-msg');
    message.style.display = "flex"
    let duplicateName = document.getElementById('duplicate-name');
    duplicateName.innerText =  `'${firstName} ${lastName}'`;
    // dismiss duplicate message
    let ok = document.getElementById('ok');
    ok.addEventListener('click', e => {
        message.style.display = "none";
        addPlayerForm.reset();
        toggleAddModal();
    })
}


// Cancel add player 

let cancelAddPlayer = () => {
    addPlayerForm.reset();
    toggleAddModal();
}

// Cancel edit player 
let cancelEditPlayer = () => {
    toggleEditModal();
}

// Delete player
let modal = document.getElementById('delete-modal');
let deleteBtn = document.getElementById('delete-section');
deleteBtn.addEventListener('click', async (e) => {
    e.preventDefault(); 
    // Alert user of action
   
    modal.style.display = "flex";
   
})

 // Handle deletion
 let confirmDelete = document.getElementById('confirm-delete');
 confirmDelete.addEventListener('click', async(e) => {
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