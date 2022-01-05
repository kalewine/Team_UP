// // ATTENDANCE 
// Keeping track of checked boxes
let selected = []; 
let storeChecks = (data) => {
    let selectedFirstName = data.parentElement.nextElementSibling;
    let selectedLastName = selectedFirstName.nextElementSibling;
    selectedFirstName.classList.toggle('selected')
    selectedLastName.classList.toggle('selected')
    // console.log(data.value)
    // console.log(data.checked)
    if(data.checked){
        selected.push(data.value)
    }else{
       let remove = selected.findIndex(item => item == data.value)
       selected.splice(remove, 1);
    }
    
    
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
        })
        selected.forEach(checked => {
            let checkedBox = document.getElementById(checked + "-check");
            let selectedFirstName = checkedBox.parentElement.nextElementSibling;
            let selectedLastName = selectedFirstName.nextElementSibling;
            selectedFirstName.classList.toggle('selected')
            selectedLastName.classList.toggle('selected')
            checkedBox.checked = true;
        })
    }else{
        playerList.forEach(playerData => {
                let row = playerTable.insertRow();
                row.setAttribute('class', 'table-row');
                let selectionCell = row.insertCell();
                let checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.setAttribute('class','attendance-check')
                checkbox.value = playerData._id;
                checkbox.name = "players";
                checkbox.setAttribute ('onclick', 'storeChecks(this)');
                selectionCell.appendChild(checkbox);
                let firstName = row.insertCell();
                firstName.innerHTML = playerData.firstName;
                let lastName = row.insertCell();
                lastName.innerHTML = playerData.lastName;
        })   
    }
}

// Sorting arrows
let firstArrow = document.getElementById("first-name-arrow");
let lastArrow = document.getElementById("last-name-arrow")

// Sorting functions
let firstNameSort = (data) => {
    data.sort((a, b) => a.firstName.localeCompare(b.firstName))
    firstName = true;
    firstArrow.style.visibility = "visible";
    lastArrow.style.visibility = "hidden";
    return data
} 

let lastNameSort = (data) => {
    data.sort((a, b) => a.lastName.localeCompare(b.lastName))
    firstName = false;
    firstArrow.style.visibility = "hidden";
    lastArrow.style.visibility = "visible";
    return data
} 



// Player pool
let playerArray = [];


// Select players
let selectPlayers = document.getElementById('player-data');
selectPlayers.addEventListener('submit', async (e) => {
    e.preventDefault();
   
    let getPlayers = ()  => {
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
   
    getPlayers();

    const playerOptions = {
        method: 'POST', 
        body: JSON.stringify(playerArray),
        headers: {
            "Content-Type": "application/json"
        }
    }

    const players = await fetch('/selectedPlayers', playerOptions).then(
       window.location.assign('how-many-teams.html') 
    )
    

});

// Select all function
// let selectAll = document.getElementById('select-all');
// selectAll.addEventListener('change',  () => {
    
//     if(selectAll.value === true){
//     }else {
        
//         let players = document.getElementsByName('players');
//         for(let player of players)
//             player.setAttribute('checked', 'checked');
//     }
// });











