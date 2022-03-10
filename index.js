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


