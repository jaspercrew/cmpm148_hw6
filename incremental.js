let sliders = ["straw", "sugar", "alch"];
let sliderUnlocked = {}
let sliderTargets = {};
let sliderVelocities = {}
let sliderFailCount = {}


const GameInstance = class {
  constructor() {
    this.narrativeManager = new narrativeManager(this)
    
    this.stages = ["stage1", "stage2"];
    this.currentStage = "stage1"; 
    this.panels = {
      "stage1": ["panel1"],
      "stage2": ["panel2-1"],
    }
    this.currentPanel = "panel1";



    this.rMoney = 0;
    this.rStrawFarms = 0;
    this.rStraws = 0;
    this.rSugarFarms = 0;
    this.rSugar = 0;
    this.rRegulars = 0;
    this.rBreweries = 0;
    this.rCritics = 0;
    this.rAlch = 0;
      
    this.unlockSlider = function(name){
      sliderUnlocked[name] = true;
    }
      
    // this.collectorsProtected = 0;
    // this.findersProtected = 0;
    // this.gardenCollectors = 0;
    
  }
  


  
  

  
  // the following functions are to be called from buttons in the index.html
  gainrMoney(){ this.rMoney +=5; this.updateDisplay();}
  //gainrMoney(){ this.rMoney +=5; this.updateDisplay();}

  gainrStrawFarms(){ 
    if (this.rMoney < 50){
      io.report("Not enough money.");
    }
    else {
      io.report("You purchase a strawberry farm.")

      this.rStrawFarms +=1; this.rMoney -=50;this.updateDisplay();
    }
    
  }
  gainrSugarFarms(){ 
    if (this.rMoney < 100){
      io.report("Not enough money.");

    }
    else {
      io.report("You purchase a sugar farm.")
      this.rSugarFarms +=1; this.rMoney -=100;this.updateDisplay();
    }
    
  }
  gainrRegulars(){
    if (this.rStraws < 30){
      io.report("Not enough strawberries.");

    }
    else{
      io.report("You sell a strawberry lemonade, earning a regular customer.")

      this.rRegulars +=1; this.rStraws -=30;this.updateDisplay();
    }
  }
  gainrBreweries(){
    if (this.rMoney < 200){
      io.report("Not enough money.");
    }
    else {
      io.report("You purchase a brewery.")

      this.rBreweries +=1; this.rMoney -=200;this.updateDisplay();
    }
  }
  gainrCritics(){
    if (this.rAlch < 3){
      io.report("Not enough alcohol.");

    }
    else {
      io.report("You sell a mixed drink, earning a critic.")

      this.rCritics +=1; this.rAlch -=3;this.updateDisplay();
    }
  }
  // gainrAlch(){
  //   if (this.rSugar < 30){
  //     io.appendIntoElement("Not enough sugar.", "reports");
  //   }
  //   else{
  //     this.rAlchs +=3; this.rSugar -=30;this.updateDisplay();
  //   }
  // }

  
  runResourceWork(){
      this.rStraws += this.rStrawFarms;
      this.rSugar += this.rSugarFarms;
      this.rMoney += this.rRegulars;
      this.rSugar -= this.rBreweries;
      this.rAlch += this.rBreweries;
      this.rRegulars += this.rCritics;

      
      this.randomEvents();
  }

  randomEvents(){
    let prob = .04;

    if (this.rStrawFarms > 4 && Math.random() < prob){
        io.report("One of your strawberry farms was overrun by insects and other pests. (-1)");
        this.rStrawFarms -= 1;
    }

    if (this.rSugarFarms > 4 && Math.random() < prob){
      io.report("One of your sugar farms was overrun by insects and other pests. (-1)");
      this.rSugarFarms -= 1;
    }

    if (this.rBreweries > 4 && Math.random() < prob){
      io.report("One of your breweries was overrun by insects and other pests. (-1)");
      this.rBreweries  -= 1;
    } 

    if (this.rStraws > 30 && Math.random() < prob){
      io.report("Some of your strawberries become moldy and you are forced to dispose of them. (-5)");
      this.rStraws -= 5;
    }

    if (this.rSugar > 30 && Math.random() < prob){
      io.report("Some of your sugar becomes moldy and you are forced to dispose of it. (-5)");
      this.rSugar -= 5;
    }

    if (this.rAlch > 30 && Math.random() < prob){
      io.report("Some of your alchohol becomes moldy (don't ask me how) and you are forced to dispose of it. (-5)");
      this.rAlch -= 5;
    }
    
  }


  
    
  // this function takes in a panel 
  swichPanels() {
    //console.log(game.currentPanel)
    if (game.currentPanel == "panel1"){
      game.currentStage = "stage2";
      game.currentPanel = "panel2-1";
    }
    else {
      game.currentStage = "stage1";
      game.currentPanel = "panel1";
    }

    io.showStage(game);    
  }
  
  updateDisplay(){
    //io.report(this.rRegulars)
    io.writeValueIntoClass(this.rMoney, "rMoneyNumber")
    io.writeValueIntoClass(this.rStrawFarms, "rStrawFarmsNumber")
    io.writeValueIntoClass(this.rStraws, "rStrawsNumber")
    io.writeValueIntoClass(this.rSugarFarms, "rSugarFarmsNumber")
    io.writeValueIntoClass(this.rSugar, "rSugarNumber")
    io.writeValueIntoClass(this.rRegulars, "rRegularsNumber")
    io.writeValueIntoClass(this.rBreweries, "rBreweriesNumber")
    io.writeValueIntoClass(this.rAlch, "rAlchNumber")
    io.writeValueIntoClass(this.rCritics, "rCriticsNumber")



  }

  

  
  
};


// this function forom JQuery waits until the web page is fully loaded before triggering the start of the game
$( document ).ready(function() {
  game = new GameInstance();
  game.narrativeManager.setup();
  
  io.showStage(game); 
  game.updateDisplay()

  startRecording(game);

  // Run the Loop
  gameTimer = setInterval(function(){
    game.runResourceWork();
    game.narrativeManager.assess()
    game.updateDisplay()
    sliders.forEach(sliderValueCheck.bind(null, game))

}, 1500)




sliders.forEach(sliderInit)



function sliderInit(name){
  //console.log(name)
  sliderTargets[name] = 50;
  sliderVelocities[name] = 0;
  sliderFailCount[name] = 0;
  sliderUnlocked[name] = false;

  sliderUpdate(name)
  let slider = document.getElementById(name + "SliderIn");
  let value = document.getElementById(name + "SliderOut");
  slider.oninput = function() {
    //console.log(value)
    value.innerHTML = slider.value;
  }
}

function sliderUpdate(name){
  if (!sliderUnlocked[name]){
    return;
  }
  let slider = document.getElementById(name + "SliderIn");
  let value = document.getElementById(name + "SliderOut");
  value.innerHTML = slider.value;
}

let valRange = 7.5;
let failPercent = .20;
let velocityMultiplier = 0.15;

function sliderValueCheck(game, name){
    //console.log(game)
    if (!sliderUnlocked[name]){
      return;
    }
    sliderVelocities[name] += Math.random() * velocityMultiplier * (Math.round(Math.random()) ? 1 : -1);
    sliderVelocities[name] = Math.max(-1, Math.min(sliderVelocities[name], 1));     

    sliderTargets[name] += sliderVelocities[name];
    sliderTargets[name] = (Math.max(0, Math.min(sliderTargets[name], 100)));

    let slider = document.getElementById(name + "SliderIn");
    let range = document.getElementById(name + "SliderRange");

    range.innerHTML = (Math.floor(sliderTargets[name] - valRange)) + " - " + (Math.floor(sliderTargets[name] + valRange));

    let val = slider.value;
    //console.log(name + ":   vel: " + sliderVelocities[name] + ":   taget: " + sliderTargets[name] + ",  value: " + val)
    if (Math.abs(val - sliderTargets[name]) >= valRange){
      sliderFailCount[name] += 1;
    }
    else {
      sliderFailCount[name] = 0;
    }
    
    if (sliderFailCount[name] >= 10){
      slider.value = sliderTargets[name];
      sliderFailCount[name] = 0;
      let loseNum = 0;
      switch(name){
        case "straw":
          io.report("You have failed to maintain some of your strawberry farms.");
          loseNum = Math.ceil(game.rStrawFarms * failPercent);
          io.report("You lose " + loseNum + " strawberry farms.");
          game.rStrawFarms -= loseNum;
          break;
        case "sugar":
          io.report("You have failed to maintain some of your sugar farms.");
          loseNum = Math.ceil(game.rSugarFarms * failPercent);
          io.report("You lose " + loseNum + " sugar farms.");
          game.rSugarFarms -= loseNum;
          break;
        case "alch":
          io.report("You have failed to maintain some of your breweries.");
          loseNum = Math.ceil(game.rBreweries * failPercent);
          io.report("You lose " + loseNum + " breweries.");
          game.rBreweries -= loseNum;
          break;
      }
      sliderUpdate(name);
      //updateDisplay();
      
    }
    else if (sliderFailCount[name] == 4){
      switch(name){
        case "straw":
          io.report("Some of your strawberry farms will require some adjustments soon.")
          break;
        case "sugar":
          io.report("Some of your sugar farms will require some adjustments soon.")
          break;
        case "alch":
          io.report("Some of your breweries will require some adjustments soon.")
          break;
      }
    }
    
    else if (sliderFailCount[name] == 7){
      switch(name){
        case "straw":
          io.report("Some of your strawberry farms require IMMEDIATE management attention.")
          break;
        case "sugar":
          io.report("Some of your sugar farms require IMMEDIATE management attention.")
          break;
        case "alch":
          io.report("Some of your breweries require IMMEDIATE management attention.")
          break;
      }
    }
  sliderUpdate(name);
}

  

})
