// this object is to keep track of narrative beats and unlocks

// each "beat" has a test function, a function which unlocks elements, and a report function

const narrativeManager = class {

  constructor(parentObject) {
  this.data = parentObject;
    console.log(parentObject, this.data)

  
    
  this.beats = [
  {
    triggered: false,
    test: function(data){return data.rMoney >= 10}, 
    unlock:function(data){
      io.showElement("rStrawFarmsRow");
      
    }, 
    addreport: function(){
      io.report("You have discovered strawberry farms.");

      io.writeIntoElement ("A humble drink stand", "era");
      }
  },
  {
    triggered: false,
    test: function(data){return data.rStraws >= 1}, 
    unlock:function(data){
      data.unlockSlider("straw")
      io.showElement("stage2");
      io.showElement("rStrawsRow");
      io.showSlider("straw");
      
    }, 
    addreport: function(){
      io.report("You have unlocked resource maintenence.");
      io.report("MAINTENENCE: Ensure that each slider is within the designated range to maintain your resource gatherers. Designated ranges change over time. If they stray outside of the range for too long, they might fail.");

      io.report("You have discovered strawberries.");
      }
  },
  // {
  //   triggered: false,
  //   test: function(data){return data.rStraws >= 20}, 
  //   unlock:function(){io.showElement("showPanel2-1")},  
  //   addreport: function(){io.appendIntoElement("You unlocked resource management.", "reports");}
  // },
  {
    triggered: false,
    test: function(data){return data.rStraws >= 10}, 
    unlock:function(data){io.showElement("rRegularsRow")},  
    addreport: function(){ io.report("You have discovered strawberry lemonade. This will bring in regular customers.");  }
  },
  {
    triggered: false,
    test: function(data){return data.rMoney >= 100 && data.rRegulars > 0}, 
    unlock:function(data){
      io.showElement("rSugarFarmsRow");
      
    }, 
    addreport: function(){
      io.report("You have discovered sugar farms.");
      io.writeIntoElement ("A bustling drink stand and farm", "era");
      }
  },
  {
    triggered: false,
    test: function(data){return data.rSugar >= 1}, 
    unlock:function(data){
      io.showElement("rSugarRow"); 
      io.showSlider("sugar");
      data.unlockSlider("sugar")
    }, 
    addreport: function(){
      io.report("You have discovered sugar.");
      }
  },
  {
    triggered: false,
    test: function(data){return data.rMoney >= 200 && data.rSugarFarms > 0}, 
    unlock:function(data){io.showElement("rBreweriesRow")}, 
    addreport: function(){
      io.report("You have discovered breweries.");
      io.writeIntoElement ("A bustling bar and brewery", "era");
      }
  },
  {
    triggered: false,
    test: function(data){return data.rAlch >= 1}, 
    unlock:function(data){
      io.showElement("rAlchRow"); 
      io.showSlider("alch");
      data.unlockSlider("alch")
    }, 
    addreport: function(){
      io.report("You have discovered alchohol.");
      }
  },
  {
    triggered: false,
    test: function(data){return data.rAlch >= 10}, 
    unlock:function(data){
      io.showElement("rCriticsRow"); 

    }, 
    addreport: function(){
      io.report("You have discovered mixed drinks. These will bring in valuable critics to garner more customers (Final Resource).");
      io.report("Recording/Intended Game Loop ends at 10 critics.")
      }
  },
  {
    triggered: false,
    test: function(data){return data.rCritics >= 10}, 
    unlock:function(data){
        stopRecording();
    }, 
    addreport: function(){
      io.report("10 critics reached. Recording end.")
      }
  },
  

  ]
  }
  
  // report(string){
  //   io.appendIntoElement(string, "reports");
  // }

  setup(){
    io.hideElement("rStrawFarmsRow")
    io.hideElement("rStrawsRow")
    io.hideElement("rSugarFarmsRow")
    io.hideElement("rBreweriesRow")
    io.hideElement("rSugarRow")
    io.hideElement("rAlchRow")

    io.hideElement("rRegularsRow")
    io.hideElement("rCriticsRow")

    io.hideElement("showPanel2-1")
    io.report("You are selling drinks at a small lemonade stand. (Top messages are most recent).")
    io.hideSlider("straw");
    io.hideSlider("sugar");
    io.hideSlider("alch");


    io.hideElement("stage2")
    //io.hideElement("Strawberry Farms")
    //io.hideElement("Sugar Farms")
  }




// goes through all narrative events, checks if they activate, runs activation code, and runs code that delivers a message about the story event
  assess(){
    for (let b = 0; b < this.beats.length; b++){
      let beat = this.beats[b]
      if (!beat.triggered){
        if (beat.test(this.data)){
          beat.triggered = true;
          beat.unlock(this.data);
          beat.addreport();
        }
      }
    }
  }

}