$( document ).ready(function() {
    // form colecting info
    $( "form" ).submit(function( event ) {
        let newArray = $( this ).serializeArray()
        newArray.reverse();
        filteringData(newArray)
        event.preventDefault();
    });
});

function filteringData(array){

    let jsonLinks = ["wimbledon-men.json", "wimbledon-women.json"]

    // variable and conditions
    let roundRequested = array[2].value;
    let conditionRound =  $('#sel-round').val();
    let playerRequested = array[1].value;
    let conditionPlayer =  $('#sel-player').val();
    let setRequested = array[0].value;
    let conditionSet =  $('#sel-set').val();
    let tournamentLink = [];

    // when needs to search in both files
    if (array.length === 3 || array.length == 5){
        tournamentLink = jsonLinks;
    }
    // when needs to search in only one file 
    if (array.length === 4){
        if(array[3].value == "men"){
            tournamentLink = [jsonLinks[0]];
        } else{
            tournamentLink = [jsonLinks[1]];
        }  
    }

    tournamentLink.forEach(link => {
        $.getJSON(link, function( data ) {
            data["match"].forEach(match => {
                let item = "";
                let setChecked = false;
                let playerChecked = false;
                // if round respect the rules:
                if(searchingRoundOrSet(roundRequested, conditionRound, match["round"])){
                    match["player"].forEach( player => {
                        if(searchingName(playerRequested, conditionPlayer, player["name"])){
                            playerChecked = true;
                        }
                        
                        item += "<tr>"
                        item += "<th>"+ match["round"] +"</th>"
                        
                        if (player["outcome"] == "won"){
                            item += "<td class='winner'>"+ player["name"] + "</td>";
                        } else{
                            item += "<td>"+ player["name"] + "</td>";
                        }
                        // console.log(player["sets-won"])             
                        player["set"].forEach(set =>{
                            if(searchingRoundOrSet(setRequested, conditionSet, set)){
                                setChecked = true; 
                            }
                            item += "<td>"+ set + "</td>";
                        });
                        item +="</tr>";                      
                    });
                    if(setChecked  && playerChecked){
                        if(link == jsonLinks[0]){
                            $('#men-table tbody').append(item);
                            $('#men-table tbody').append("<br/>");
                            $("#men-table").css("display", "contents");
                            $("#men-title").css("display", "contents");
                        }
                        else {
                            $('#women-table tbody').append(item);
                            $('#women-table tbody').append("<br/>");
                            $("#women-table").css("display", "contents");
                            $("#women-title").css("display", "contents");
                        }
                    } 
                    item = "";
                } 
            });
        });
    });
}
    
function searchingName(requested, condition, value){
    if(requested == null || requested === ""){
        return true;
        // It's not searching this information, so it will pass all its content
    } else {
        if(condition == "contains"){
            if(value.indexOf(requested) >= 0){
                return true;
            }
        }
        if(condition == "equals"){
            if(requested === value){
                return true
            }
        }
        if(condition == "none"){
            if(requested === value || value.indexOf(requested) >= 0){
                return true
            }
        }
        return false;
    }
}

function searchingRoundOrSet(requested, condition, value){
    if(requested === null || requested === ""){
        return true;
        // It's not searching this information, so it will pass all its content
    }else{
        if(condition === "equals"){
            if(requested === value){
                return true;
            }
        }
        if(condition === "greater than"){
            if(requested < value){
                return true;
            }
        }
        if(condition === "less than"){
            if(requested > value){
                return true;
            }
        }
        return false;
    }
}