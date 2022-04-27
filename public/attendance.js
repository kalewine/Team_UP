// // ATTENDANCE 
// Keeping track of checked boxes
let selected = []; 

let selectPlayer = (selectedRow) => {
    let checkbox = selectedRow.firstChild.firstChild;
    checkbox.checked == false ? checkbox.checked = true : checkbox.checked = false;
    selectedRow.classList.toggle('selected');
    if(checkbox.checked){
        selected.push(checkbox.value)
    }else{
       let remove = selected.findIndex(item => item == checkbox.value)
       selected.splice(remove, 1);
    }
   
}


let selectedByCheck = (data) => {
    data.checked == true ? data.checked = false : data.checked = true;
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
    let playerTable = document.getElementById('table-body');
    let rows = [...document.getElementsByClassName('table-row')];
    if(rows.length !== 0){
        rows.forEach(element => element.remove());
        playerList.forEach(playerData => {
            buildRows(playerTable, playerData)
        })
        selected.forEach(checked => {
            let checkedBox = document.getElementById(checked + "-check");
            let selectedRow = checkedBox.parentElement.parentElement;
            selectedRow.classList.add('selected');
            checkedBox.checked = true;
        })
    }else{
        playerList.forEach(playerData => {
            buildRows(playerTable,playerData)
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

// Build player rows
let buildRows = (playerTable, playerData) => {
    let row = playerTable.insertRow();
    row.setAttribute('class', 'table-row');
    row.setAttribute('onclick', 'selectPlayer(this)')
    let selectionCell = row.insertCell();
    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.setAttribute('class','attendance-check')
    checkbox.setAttribute('id',playerData._id + "-check")
    checkbox.value = playerData._id;
    checkbox.name = "players";
    checkbox.setAttribute ('onclick', 'selectedByCheck(this)');
    selectionCell.appendChild(checkbox);
    let firstName = row.insertCell();
    firstName.innerHTML = playerData.firstName;
    let lastName = row.insertCell();
    lastName.innerHTML = playerData.lastName;
}


// Player pool
let playerArray = [];


// Select players
let selectedPlayers = document.getElementById('player-data');
selectedPlayers.addEventListener('submit', async (e) => {
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

    const players = await fetch('/createPlayersArray', playerOptions).then(
       window.location.assign('how-many-teams.html') 
    )
    

});

// Observer functions
const submit = document.querySelector('.submit-positioner');
const attendanceBtn = document.getElementById('attendance-btn');
const attendanceText = document.getElementById('btn-text');
const options = {
    threshold: 1
}

const bottomOfPageObserver = new IntersectionObserver((entries, bottomOfPageObserver) => {
    entries.forEach(entry => {
        if(!entry.isIntersecting){
            attendanceBtn.classList.remove("large-btn");
            attendanceText.classList.remove("large")
        }else {
            attendanceBtn.classList.add('large-btn')
            attendanceText.classList.add("large")

        }
    })
}, options ) 


bottomOfPageObserver.observe(submit)

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







