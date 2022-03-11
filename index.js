$.getJSON("wimbledon-men.json", function( data ) {
    let item = "";
    let counter = 0;
    data["match"].forEach(match => {

        
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
            $('tbody').append(item);
            if (counter == 2){
                $('tbody').append("<br/>");
                counter = 0;
            }
            item = "";
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
            if(requested > value){
                return true;
            }
        }
        if(condition === "less than"){
            if(requested < value){
                return true;
            }
        }
        return false;
    }
}

