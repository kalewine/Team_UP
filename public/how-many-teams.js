const teamNumber =  async() => {
    // Get playersArray from server
    const getPlayersArray = await fetch('/getPlayersArray'); 
    const playerData = await getPlayersArray.json();
    let twoTeams = Math.floor(playerData.length/2);
    let fourTeams = Math.floor(playerData.length/4);
    displayOptions(twoTeams, fourTeams)
}

teamNumber();

const displayOptions = (twoTeams, fourTeams) => {
    let displayTwo = document.getElementById('two-teams');
    let displayFour = document.getElementById('four-teams');
    displayTwo.insertAdjacentHTML('beforeend', twoTeams);
    displayFour.insertAdjacentHTML('beforeend', fourTeams);
}

// Select number of teams 
const selectTeamsNumber = async(number) => {
    let numberArray = [];
    numberArray.push(number)
    const teamsNumberOptions = {
        method: 'POST', 
        body: JSON.stringify(numberArray),
        headers: {
            "Content-Type": "application/json"
        }
    }

    await fetch('/storeTeamsNumber', teamsNumberOptions).then(
       window.location.assign('teams.html') 
    )
    
}