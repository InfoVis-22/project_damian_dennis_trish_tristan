//Get data in from file. 
//Note that must do all script inside .then(), because it is a "promise"
//that data from file is incoming.
//Data (initially all string type):
//DeathCOD39ICDCode39Desc: cause of death, 39 possible
//DeathCountyCountyName: county of death
//Deaths:
//Population:

Promise.all([
  d3.csv('data/deathsByCounty/Ohio_Resident_Deaths_2007_cty.csv'),
  d3.csv('data/demographics/countyHealthRatings2010.csv')])
  .then(([data1,data2]) => {
    dataInFcn(data1,data2);
  })

function dataInFcn(data,demog) {
  //transform string type into numerical type
  //and we are serious programmers, we don't need SORT
  data.forEach(function (d) { 
    d.Deaths = +d.Deaths;
    d.Population = +d.Population;
    delete d.SORT;
  });

  //remove non-ohio counties of death???
  data = data.filter(d=> d.DeathCountyCountyName !="Unknown" && d.DeathCountyCountyName !="NonOH");

  //get cause of death of interest
  var data2007 = data.filter(function(d){
    return d.DeathCOD39ICDCode39Desc=="Influenza and pneumonia (J09-J18)";
  });
  //console.log(data2007);

  //get total number of deaths
  let totalDeaths = data.map(d=>d.Deaths).reduce((a,c)=>a+c);

  //get counties, going to use this for graphing
  let countiesGraphArray = data2007.map(d=>d.DeathCountyCountyName);
  //console.log(countiesGraphArray);
  
  //get deaths per 100,000 people, in each county, to account for population
  let deathsRespiratoryGraphArray = data2007.map(d=>Math.round(d.Deaths/d.Population *100000));
  console.log(deathsRespiratoryGraphArray);

  //function to actually make the graphs
  drawData(countiesGraphArray, deathsRespiratoryGraphArray);
}

function drawData(counties, deaths){

}

