$.getJSON("wimbledon-men.json", function( data ) {
    let item = "";
    data["match"].forEach(match => {

        
        match["player"].forEach( player => {
            item += "<tr>"
            item += "<th>"+ match["round"] +"</th>"
            item += "<td>"+ player["name"] + "</td>";
            
            // console.log(player["outcome"])
            // console.log(player["sets-won"])
            player["set"].forEach(set =>{
                item += "<td>"+ set + "</td>";
            });
            item +="</tr>";
            $('tbody').append(item);
            item = "";
        });
    });
    
    
  });


