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
  d3.csv('data/deathsByCounty/Ohio_Resident_Deaths_2008_cty.csv'),
  d3.csv('data/demographics/countyHealthRatings2015.csv')])
  .then(([data1,data2,data3]) => {
    dataInFcn(data1,data2,data3);
  });

function dataInFcn(deaths2007,deaths2008,demog) {
  //clean up all-Ohio dataset on deaths.
  //1. transform string type into numerical type
  //and we are serious programmers, we don't need SORT column
  //2. remove non-ohio counties of death
  //3. select only cause of death of interest
  //Return: deaths and counties
  deaths2007 = cleanOHctyDeaths(deaths2007);
  deaths2008 = cleanOHctyDeaths(deaths2008);
  //console.log(data2007);

  //get total number of deaths
  //let totalDeaths = data.map(d=>d.Deaths).reduce((a,c)=>a+c);

  //Now, process demographics data. It's got a lot of columns!!!! Also for all US.
  //most of cols we don't want.
  //Rename cols of use, and turn numbers into numbers.
  //Return: rural, medIncome, uninsured, seniors.
  //starts with 2015, use that for Deaths 2007-2015.
  const demogData = cleanDemogOH(demog);

  //create object of each array so can graph it
  const output2007 = {
    rural : demogData.rural,
    medIncome: demogData.medIncome,
    uninsured: demogData.uninsured,
    seniors: demogData.seniors,
    deaths: deaths2007.deaths,
    counties: deaths2007.counties
  }

  //console.log(demogOhCty);
  console.log(output2007);

  //function to actually make the graphs
  drawData(output2007);
}

function drawData(data2007){

}

function cleanOHctyDeaths(data){
  //turn string columns into numbers
  data.forEach(function (d) { 
    d.Deaths = +d.Deaths;
    d.Population = +d.Population;
    delete d.SORT;
  });


  //remove non-ohio counties of death
  data = data.filter(d=> d.DeathCountyCountyName !="Unknown" && d.DeathCountyCountyName !="NonOH");
  //select only cause of death of interest
  data = data.filter(d=>d.DeathCOD39ICDCode39Desc=="Influenza and pneumonia (J09-J18)");

 return {
    //get counties, going to use this for graphing
    counties: data.map(d=>d.DeathCountyCountyName),
    //get deaths per 100,000 people, in each county, to account for population
    //do for each year
    deaths: data.map(d=>Math.round(d.Deaths/d.Population *100000))
  }
}

function cleanDemogOH(demog){
  demog.forEach(function(d) {
    //rename key columns, turn into 
    d.rural = +d['% Rural raw value'];
    d.medIncome = +d['Median household income raw value'];
    d.uninsured = +d['Uninsured adults raw value'];
    d.seniors = +d['% 65 and older raw value'];
  });
  
  //Get ohio counties only
  demog = demog.filter(d=>d['State Abbreviation']=='OH' && d.Name != 'Ohio');

  return {
    rural: demog.map(d=>Math.round(d.rural*100)),
    medIncome:  demog.map(d=>Math.round(d.medIncome)),
    uninsured: demog.map(d=>Math.round(d.uninsured*100)),
    seniors: demog.map(d=>Math.round(d.seniors*100))
  }
}