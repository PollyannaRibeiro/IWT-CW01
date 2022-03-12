$( document ).ready(function() {
    // loading data on submit
    $( "form" ).submit(function( event ) {
        clearingTables()
        let newArray = $( this ).serializeArray()
        newArray.reverse();
        filteringData(newArray)
        event.preventDefault();
    });

    // clearing data 
    $( "#fclear" ).on( "click", function() {
        $("form").trigger("reset");
        clearingTables()
    });
});

function filteringData(array){

    let jsonLinks = ["wimbledon-men.json", "wimbledon-women.json"]

    // variable and conditions for filtering
    let roundRequested = array[2].value;
    let conditionRound =  $('#sel-round').val();
    let playerRequested = array[1].value;
    let conditionPlayer =  $('#sel-player').val();
    let setRequested = array[0].value;
    let conditionSet =  $('#sel-set').val();
    let tournamentLink = [];

    // The case when it's needed to search in both files
    if (array.length === 3 || array.length == 5){
        tournamentLink = jsonLinks;
    }
    // The case when it's needed to search in only one file 
    if (array.length === 4){
        if(array[3].value == "men"){
            tournamentLink = [jsonLinks[0]];
        } else{
            tournamentLink = [jsonLinks[1]];
        }  
    }

    pendingSearches = tournamentLink.length;
    tournamentLink.forEach(link => {
        $.getJSON(link, function( data ) {
            data["match"].forEach(match => {
                
                let content = "";
                let playerChecked = false;

                // continue only if round respect the round's condition
                if(searchingRoundOrSet(roundRequested, conditionRound, match["round"])){
                    match["player"].forEach( player => {
                        // continue if set respect the set's condition:
                        if(searchingRoundOrSet(setRequested, conditionSet, player["set"].length)){
                            // continue if name respect the name's condition:
                            if(searchingName(playerRequested, conditionPlayer, player["name"])){
                                playerChecked = true;
                            }
                            // creating the table elements
                            content += "<tr>"
                            content += "<td>"+ match["round"] +"</td>"
                            
                            if (player["outcome"] == "won"){
                                content += "<td class='winner'>"+ player["name"] + "</td>";
                            } else{
                                content += "<td>"+ player["name"] + "</td>";
                            }
                            
                            player["set"].forEach(set =>{ 
                                content += "<td>"+ set + "</td>";
                            });
                            content +="</tr>"; 
                        }                        
                    });
                    if(playerChecked){
                        if(link == jsonLinks[0]){
                            $('#men-table tbody').append(content);
                            $('#men-table tbody').append("<br/>");
                            $("#men-table").fadeIn("fast");
                            $("#men-title").fadeIn("fast");
                        }
                        else {
                            $('#women-table tbody').append(content);
                            $('#women-table tbody').append("<br/>");
                            $("#women-table").fadeIn("fast");
                            $("#women-title").fadeIn("fast");
                        }
                    } 
                    content = "";    
                } 
            });
        }).fail(function(){
            // In error cases:
            let tournamentName;
            if(link === jsonLinks[0]){
                tournamentName = "men";
            } else{
                tournamentName = "women";
            }
            const error = "<div class='row error-info'><h1>"+ "Sorry, wasn't possible to access "+ tournamentName + " tournament file</h1></div>";
            $('body').append(error);
            console.log("Error in getting JSON link - " + link)
        }).always(function() {
            pendingSearches -= 1;
            if (pendingSearches == 0) {
                notFound();
            }
        })
    });
}
    
function notFound(){
    const notF = "<div class='row not-found'><h1> No results found</h1></div>" 
    if($('#men-table tbody').html() === "" && $('#women-table tbody').html() === "" && $(".error-info").length === 0){
        $('body').append(notF);
    }
}
// Return a boolean informing if the data respect the condition
function searchingName(requested, condition, value){
    
    if(requested == null || requested === "" || condition == "none"){
        // In the case where it's not searching for this information:
        return true;
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
        return false;
    }
}

// Return a boolean informing if the data respect the condition
function searchingRoundOrSet(requested, condition, value){
    value = value.toString();
    if(requested === null || requested === ""){
        // In the case where it's not searching for this information:
        return true;
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

function clearingTables(){
    // removing any previous data on the table
    $("#men-table").css("display", "none");
    $("#men-title").css("display", "none");
    $("#women-table").css("display", "none");
    $("#women-title").css("display", "none");
    $('#men-table tbody').empty();
    $('#women-table tbody').empty();

    $(".error-info").trigger("remove");
    $(".not-found").trigger("remove");
}