$( document ).ready(function() {
  
    // form colecting info

    $( "form" ).submit(function( event ) {
        let newArray = $( this ).serializeArray()
        newArray.reverse();
        console.log(  newArray);
        filteringData(newArray)
        event.preventDefault();
    });
});

function filteringData(array){
    // console.log(array[0])
    // console.log(array[0].name)
    // console.log(array[0].value)

    let jsonLinks = ["wimbledon-men.json", "wimbledon-women.json"]

    // variable and conditions
    let round = array[2].value;
    console.log(round)
    let conditionRound =  $('#sel-round').val();
    let player = array[1].value;
    let conditionPlayer =  $('#sel-player').val();
    let set = array[0].value;
    let conditionSet =  $('#sel-set').val();
    let tournamentLink = [];

    console.log("len" + array.length)
    // when needs to search in both files
    if (array.length === 3 || array.length == 5){
        tournamentLink = jsonLinks;
    }
    // when needs to search in only one file 
    if (array.length === 4){
        let tournament = array[3].value;
        
        if(tournament == "men"){
            tournamentLink = [jsonLinks[0]];

        } else{
            tournamentLink = [jsonLinks[1]];
        }  
    }
    tournamentLink.forEach(link => {
        $.getJSON(link, function( data ) {
            data["match"].forEach(match => {
                let item = "";
                let counter = 0;
                // if round respect the rules:
                if(searchingRoundOrSet(round, conditionRound, match["round"])){
                    match["player"].forEach( player => {
                        item += "<tr>"
                        item += "<th>"+ match["round"] +"</th>"
                        
                        if (player["outcome"] == "won"){
                            item += "<td class='winner'>"+ player["name"] + "</td>";
                        } else{
                            item += "<td>"+ player["name"] + "</td>";
                        }
                        counter +=1;
                        // console.log(player["sets-won"])
                        player["set"].forEach(set =>{
                            item += "<td>"+ set + "</td>";
                        });
                        item +="</tr>";
                        if(link == jsonLinks[0]){
                            $('#men-table tbody').append(item);
                            if (counter == 2){
                                $('#men-table tbody').append("<br/>");
                                counter = 0;
                            }
                        }
                        else{
                            $('#women-table tbody').append(item);
                            if (counter == 2){
                                $('#women-table tbody').append("<br/>");
                                counter = 0;
                            }

                        }
                        item = "";
                    });

                } 
            });
        });
    });
}
    
function searchinName(requested, condition, value){
    if(requested == null){
        return true;
        // It's not searching this information, so it will pass all its content

    }else{
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
    if(requested == null){
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

