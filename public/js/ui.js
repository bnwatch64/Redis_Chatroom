class UI {
    constructor() {
      this.uiContainer = document.getElementById("content");
      this.city;
      this.defaultCity = "Stuttgart";
    }

    populate(data) {

      var temp = [];
      var x = 0;
      //init temperature array
      for ( var i = 0; i < 6; i++ ) {
        temp[i] = [];

      }


      //fill temperature array
      var i=  0;
      var j = 0;

      for(let x = 0; x < 39; x++){
          var timestamp1 = new Date((data.list[x].dt - 60*60) * 1000);
          var timestamp2 = new Date((data.list[x].dt + 2*60*60) * 1000); //+3h

          if(timestamp1.getDay() == timestamp2.getDay()){
            temp[i][j] = data.list[x].main.temp;
            j++;
        }
        else{
        temp[i][j] = data.list[x].main.temp;
        i++;
        j = 0;}

      }

      var x = 0;
      var y = 0;

      //max temp: [day][max]
      var max = [];

      for(let i = 0; i<6; i++){
        max[i] = Math.max.apply(Math, temp[i]);
      }

      y = 0;

      //min temp: [day][min]
      var min = [];

      for(let i = 0; i<6; i++){
        min[i] = Math.min.apply(Math, temp[i]);
      }

      y = 0;


      var k = 0;
      var day0 = new Date((data.list[k].dt - 60*60) * 1000);
      day0 = day0.toString();
      day0 = day0.slice(0, 15);
      k = k + temp[0].length;
      var day1 = new Date((data.list[k].dt - 60*60) * 1000);
      day1 = day1.toString();
      day1 = day1.slice(0, 15);
      k = k + temp[1].length;
      var day2 = new Date((data.list[k].dt - 60*60) * 1000);
      day2 = day2.toString();
      day2 = day2.slice(0, 15);
      k = k + temp[2].length;
      var day3 = new Date((data.list[k].dt - 60*60) * 1000);
      day3 = day3.toString();
      day3 = day3.slice(0, 15);
      k = k + temp[2].length;
      var day4 = new Date((data.list[k].dt - 60*60) * 1000);
      day4 = day4.toString();
      day4 = day4.slice(0, 15);
      k = k + temp[3].length;
      var day5 = '';
      if(k<39){
        day5 = new Date((data.list[k].dt - 60*60) * 1000);
        day5 = day5.toString();
        day5 = day5.slice(0, 15);
        k = k + temp[4].length;
      }

      //init of arrays for rain, humidity, description and icon
      var rain = [];
      for ( var i = 0; i < 6; i++ ) {
        rain[i] = [];
    }
      var hum = [];
      for ( var i = 0; i < 6; i++ ) {
        hum[i] = [];
    }
      var desc = [];
      for ( var i = 0; i < 6; i++ ) {
        desc[i] = [];
    }
    var icon = [];
    for ( var i = 0; i < 6; i++ ) {
      icon[i] = [];
    }


      //calculation of remaining datas for today
      var z = temp[0].length;

      //calculation if first data morning, noon or evening

      var p = (24-(z*3));


    //morning, noon and evening
      if(p < 12){

          var u = 0;
          if(p < 3){u = 2;}
          if(p > 0 && p < 6){u = 1;}

            for(var s = 0; s<5; s++){
                for(var t = 0; t < 3; t++){


                try{
                    rain[s][t] = data.list[u].rain["3h"];

                }
                catch{rain[s][t] = 0;}

                hum[s][t] = data.list[u].main.humidity;
                desc[s][t] = data.list[u].weather["0"].description;
                icon[s][t] = "http://openweathermap.org/img/wn/"+data.list[u].weather["0"].icon+"@2x.png"
                u = u +2;

            }
            u = u +2;
        }
        this.uiContainer.innerHTML = `

        <div class="pop-close-btn" onclick="displayPopup()">&times;</div>

        <div class="card mx-auto mt-5" style="position: relative;">
            <div class="card-body justify-content-center">
                <h5 class="card-title">${data.city.name} Today ${day0}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Highs of ${max[0]}°C Lows of ${min[0]}°C</h6>
                <p class="card-text ">In the morning: <img src = "${icon[0][0]}"> <br/>${desc[0][0]} <br/>${rain[0][0]}mm rain ${hum[0][0]}% of humidity</p>
                <br/>
                <p class="card-text ">In the noon: <img src = "${icon[0][1]}"> <br/>${desc[0][1]} <br/>${rain[0][1]}mm rain ${hum[0][1]}% of humidity</p>
                <br/>
                <p class="card-text ">In the evening: <img src = "${icon[0][2]}"> <br/>${desc[0][2]} <br/>${rain[0][2]}mm rain ${hum[0][2]}% of humidity</p>

            </div>
        </div>`;

        //not really neccessary but values of [5]][] would be undefined
        for(var i = 0; i<3; i++){
        rain[5][i] = "-";
        hum[5][i] = "-";
        desc[5][i] = "-";
        icon[5][i] = "-";

        }

      }
      //noon and evening
      if(p > 9 && p < 18){

          console.log("only noon and evening data for first day");

          var c = 0;
          rain[0][0] = "-";
          hum[0][0] = "-";
            for(var j = 1; j <3; j++){

                if(p < 12){
                    try{
                    rain[0][j] = data.list[c + 1].rain["3h"];}

                    catch{rain[0][j] = 0;}

                    hum[0][j] = data.list[c + 1].main.humidity;
                    desc[0][j] = data.list[c + 1].weather["0"].description;
                    icon[0][j] = "http://openweathermap.org/img/wn/"+data.list[c + 1].weather["0"].icon+"@2x.png"
                    c = c +2;

                }
                else{

                  try{
                    rain[0][j] = data.list[c].rain["3h"];}

                  catch{rain[0][j] = 0;}

                  hum[0][j] = data.list[c].main.humidity;
                  desc[0][j] = data.list[c].weather["0"].description;
                  icon[0][j] = "http://openweathermap.org/img/wn/"+data.list[c].weather["0"].icon+"@2x.png"
                  c = c +2;
                  var w = 1;
                }

            }
            var u;
            if(w){u = c +2;}else{u = c +3;}
            for(var s = 1; s<5; s++){
                for(var t = 0; t < 3; t++){


                try{
                    rain[s][t] = data.list[u].rain["3h"];

                }
                catch{rain[s][t] = 0;}

                hum[s][t] = data.list[u].main.humidity;
                desc[s][t] = data.list[u].weather["0"].description;
                icon[s][t] = "http://openweathermap.org/img/wn/"+data.list[u].weather["0"].icon+"@2x.png"
                u = u +2;

            }
            u = u +2;
            }

            try{rain[5][0] = data.list[38].rain["3h"];}
            catch{rain[5][0] = 0;}
            hum[5][0] = data.list[38].main.humidity;
            desc[5][0] = data.list[38].weather["0"].description;
            icon[5][0] = "http://openweathermap.org/img/wn/"+data.list[38].weather["0"].icon+"@2x.png"
            rain[5][1] = "-";
            rain[5][2] = "-";
            hum[5][1] = "-";
            hum[5][2] = "-";
            desc[5][1] = "-";
            desc[5][2] = "-";
            icon[5][1] = "-";
            icon[5][2] = "-";
            c = 0; //not really neccessary

            this.uiContainer.innerHTML = `

            <div class="pop-close-btn" onclick="displayPopup()">&times;</div>

            <div class="card mx-auto mt-5" style="position: relative;">
                <div class="card-body justify-content-center">
                    <h5 class="card-title">${data.city.name} Today ${day0}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Highs of ${max[0]}°C Lows of ${min[0]}°C</h6>
                    <p class="card-text ">In the morning: -</p>
                    <br/>
                    <p class="card-text ">In the noon: <img src = "${icon[0][1]}"> <br/>${desc[0][1]} <br/>${rain[0][1]}mm rain ${hum[0][1]}% of humidity</p>
                    <br/>
                    <p class="card-text ">In the evening: <img src = "${icon[0][2]}"> <br/>${desc[0][2]} <br/>${rain[0][2]}mm rain ${hum[0][2]}% of humidity</p>

                </div>
            </div>`;

      }
      //evening
      if(p > 15){
        rain[0][0] = "-";
        rain[0][1] = "-";
        hum[0][0] = "-";
        hum[0][1] = "-";
          console.log("only evening data for first day");

              if(p < 18){
                  try{
                  rain[0][2] = data.list[1].rain["3h"];}

                  catch{rain[0][2] = 0;}
                  hum[0][2] = data.list[1].main.humidity;
                  desc[0][2] = data.list[1].weather["0"].description;
                  icon[0][2] = "http://openweathermap.org/img/wn/"+data.list[1].weather["0"].icon+"@2x.png"
              }
              else{

                try{
                  rain[0][2] = data.list[0].rain["3h"];}

                catch{rain[0][2] = 0;}

                hum[0][2] = data.list[0].main.humidity;
                desc[0][2] = data.list[0].weather["0"].description;
                icon[0][2] = "http://openweathermap.org/img/wn/"+data.list[0].weather["0"].icon+"@2x.png"
                var w = 1;
              }


              var u;
              if(w){u = 4;}else{u = 5;}
              console.log("first u:"+u);
              for(var s = 1; s<5; s++){
                  for(var t = 0; t < 3; t++){


                  try{
                      rain[s][t] = data.list[u].rain["3h"];

                  }
                  catch{rain[s][t] = 0;}

                  hum[s][t] = data.list[u].main.humidity;
                  desc[s][t] = data.list[u].weather["0"].description;
                  icon[s][t] = "http://openweathermap.org/img/wn/"+data.list[u].weather["0"].icon+"@2x.png"
                  u = u +2;

              }
              u = u +2;
          }

          try{rain[5][0] = data.list[36].rain["3h"];}
          catch{ rain[5][0] = 0;}

          hum[5][0] = data.list[36].main.humidity;
          desc[5][0] = data.list[36].weather["0"].description;
          icon[5][0] = "http://openweathermap.org/img/wn/"+data.list[36].weather["0"].icon+"@2x.png"

          try{rain[5][1] = data.list[38].rain["3h"];}
          catch{ rain[5][1] = 0;}

          hum[5][1] = data.list[38].main.humidity;
          desc[5][1] = data.list[38].weather["0"].description;
          icon[5][1] = "http://openweathermap.org/img/wn/"+data.list[38].weather["0"].icon+"@2x.png"
          rain[5][2] = "-";
          hum[5][2] = "-";
          desc[5][2] = "-";
          icon[5][2] = "-";

      c = 0; // not really neccessary

      this.uiContainer.innerHTML = `

      <div class="pop-close-btn" onclick="displayPopup()">&times;</div>

      <div class="card mx-auto mt-5" style="position: relative;">
          <div class="card-body justify-content-center">
              <h5 class="card-title">${data.city.name} Today ${day0}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Highs of ${max[0]}°C Lows of ${min[0]}°C</h6>
              <p class="card-text ">In the morning: -</p>
              <br/>
              <p class="card-text ">In the noon: -</p>
              <br/>
              <p class="card-text ">In the evening: <img src = "${icon[0][2]}"> <br/> ${desc[0][2]} <br/>${rain[0][2]}mm rain ${hum[0][2]}% of humidity</p>


          </div>
      </div>`;

      }


      this.uiContainer.innerHTML += `


          <div class="card mx-auto mt-5" style="position: relative;">
             <div class="card-body justify-content-center">
                 <h5 class="card-title">${data.city.name} Tomorrow ${day1}</h5>
                 <h6 class="card-subtitle mb-2 text-muted">Highs of ${max[1]}°C Lows of ${min[1]}°C</h6>
                 <p class="card-text ">In the morning: <img src = "${icon[1][0]}"> <br/>${desc[1][0]} <br/>${rain[1][0]}mm rain ${hum[1][0]}% of humidity</p>
                 <br/>
                 <p class="card-text ">In the noon: <img src = "${icon[1][1]}"> <br/>${desc[1][1]} <br/>${rain[1][1]}mm rain ${hum[1][1]}% of humidity</p>
                 <br/>
                 <p class="card-text ">In the evening: <img src = "${icon[1][2]}"> <br/>${desc[1][2]} <br/>${rain[1][2]}mm rain ${hum[1][2]}% of humidity</p>

             </div>
          </div>

          <div class="card mx-auto mt-5" style="position: relative;">
             <div class="card-body justify-content-center">
                 <h5 class="card-title">${data.city.name} ${day2}</h5>
                 <h6 class="card-subtitle mb-2 text-muted">Highs of ${max[2]}°C Lows of ${min[2]}°C</h6>
                 <p class="card-text ">In the morning: <img src = "${icon[2][0]}"> <br/>${desc[2][0]} <br/>${rain[2][0]}mm rain ${hum[2][0]}% of humidity</p>
                <br/>
                <p class="card-text ">In the noon:<img src = "${icon[2][1]}"> <br/>${desc[2][1]} <br/>${rain[2][1]}mm rain ${hum[2][1]}% of humidity</p>
                <br/>
                <p class="card-text ">In the evening: <img src = "${icon[2][2]}"> <br/>${desc[2][2]} <br/>${rain[2][2]}mm rain ${hum[2][2]}% of humidity</p>

              </div>
         </div>

       <div class="card mx-auto mt-5" style="position: relative;">
            <div class="card-body justify-content-center">
                <h5 class="card-title">${data.city.name} ${day3}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Highs of ${max[3]}°C Lows of ${min[3]}°C</h6>
                <p class="card-text ">In the morning: <img src = "${icon[3][0]}"> <br/>${desc[3][0]} <br/>${rain[3][0]}mm rain ${hum[3][0]}% of humidity</p>
                <br/>
                <p class="card-text ">In the noon: <img src = "${icon[3][1]}"> <br/>${desc[3][1]} <br/>${rain[3][1]}mm rain ${hum[3][1]}% of humidity</p>
                <br/>
                <p class="card-text ">In the evening: <img src = "${icon[3][2]}"> <br/>${desc[3][2]} <br/>${rain[3][2]}mm rain ${hum[3][2]}% of humidity</p>

            </div>
        </div>

        <div class="card mx-auto mt-5" style="position: relative;">
             <div class="card-body justify-content-center">
                 <h5 class="card-title">${data.city.name} ${day4}</h5>
                 <h6 class="card-subtitle mb-2 text-muted">Highs of ${max[4]}°C Lows of ${min[4]}°C</h6>
                 <p class="card-text ">In the morning: <img src = "${icon[4][0]}"> <br/>${desc[4][0]} <br/>${rain[4][0]}mm rain ${hum[4][0]}% of humidity</p>
                 <br/>
                 <p class="card-text ">In the noon: <img src = "${icon[4][1]}"> <br/>${desc[4][1]} <br/>${rain[4][1]}mm rain ${hum[4][1]}% of humidity</p>
                 <br/>
                 <p class="card-text ">In the evening: <img src = "${icon[4][2]}"> <br/>${desc[4][2]} <br/>${rain[4][2]}mm rain ${hum[4][2]}% of humidity</p>

             </div>
        </div>

          `;

      if(day5 != ''){ 

         if(p > 15){

            this.uiContainer.innerHTML +=`
                <div class="card mx-auto mt-5" style="position: relative;">
                <div class="card-body justify-content-center">
                    <h5 class="card-title">${data.city.name} ${day5}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Highs of ${max[5]}°C Lows of ${min[5]}°C</h6>
                    <p class="card-text ">In the morning: <img src = "${icon[5][0]}"> <br/>${desc[5][0]} <br/>${rain[5][0]}mm rain ${hum[5][0]}% of humidity</p>
                    <br/>
                    <p class="card-text ">In the noon: <img src = "${icon[5][1]}"> <br/>${desc[5][1]} <br/>${rain[5][1]}mm rain ${hum[5][1]}% of humidity</p>
                    <br/>
                    <p class="card-text ">In the evening: -</p>

                </div>
                </div>`;
             }
        if(p > 9 && p < 18){

            this.uiContainer.innerHTML +=`
                <div class="card mx-auto mt-5" style="position: relative;">
                <div class="card-body justify-content-center">
                    <h5 class="card-title">${data.city.name} ${day5}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Highs of ${max[5]}°C Lows of ${min[5]}°C</h6>
                    <p class="card-text ">In the morning: <img src = "${icon[5][0]}"> <br/>${desc[5][0]} <br/>${rain[5][0]}mm rain ${hum[5][0]}% of humidity</p>
                    <br/>
                    <p class="card-text ">In the noon: -</p>
                    <br/>
                    <p class="card-text ">In the evening: -</p>

                </div>
                </div>`;
            }
        }

    }

    clearUI() {
      uiContainer.innerHTML = "";
    }


    getFromLS() {
      if (localStorage.getItem("city" == null)) {
        return this.defaultCity;
      } else {
        this.city = JSON.parse(localStorage.getItem("city"));
      }

      return this.city;
    }

    clearLS() {
      localStorage.clear();
    }
  }
