d3.csv('data/deathsByCounty/Ohio_Resident_Deaths_2007_cty.csv')
    .then(data2007 => {
      dataInFcn(data2007);
    })
    .catch(error => {
        console.log("error loading the data right???");
    })

function dataInFcn(data) {
  var data2007 = data.filter(function(d){
    return d.DeathCOD39ICDCode39Desc=="Influenza and pneumonia (J09-J18)";
  });
  
  //data2007.Deaths = parseFloat(data2007.Deaths);
  //data2007.Population = parseFloat(data2007.Population);  
  
  data2007.forEach(function (d) { 
    d.Deaths = +d.Deaths;
    d.Population = +d.Population;
    d.pctDeaths = d.Deaths/d.Population * 100;
    delete d.SORT;

    //data2007.sort = data2007.Deaths/data2007.Population *100;
    //data2007.add(pctDeaths: data2007.Deaths/data2007.Population *100);
  });


 /*
  data2007.defineProperty(data2007,'pctDeaths', {
   value: data2007.Deaths/data2007.Population
 });
 */
 

  console.log(data2007);

  drawData(data2007);
}

function drawData(data){

}

