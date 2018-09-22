function Game(g){
    this.name=g.name;
    
    this.places=[];
    this.upgrades=[];
    
    g.places.forEach(function(p){
        this.places.push(new Place(p));
    });
    
    g.upgrades.forEach(function(u){
        this.upgrades.push(new Upgrade(u));
    });
    
    this.start=function(){
        //send data to teams
    }
    
     this.restore=function(){
         //load data from db
    }
    
    this.addCash=function(){
        this.places.forEach(function(p){
           p.addCash(); 
        });
        
        this.backup();
       
    }
    
     this.backup=function(){
        //save data to db
    }
}

function Place(p){
  this.name=p.name;
  this.icon=p.icon;
  this.respect=p.respect;
    this.owner=p.owner;
  this.log=p.log;
  this.resources=[];

    this.fight;
    this.fighter;
 
   p.resources.forEach(function(r){
        this.resources.push(new Resource(r));
    });
    
 this.takeOver=function(team){
     if(this.fighter!=null){
      clearTimeout(this.fight);
      //send information to the loser
      this.fighter=null;
     }
     
     
     if(this.owner!=team.name){
         this.fight=setTimeout(function(){this.owner=team.name}, 30000);
         this.fighter=team;
         //send file to the fighter
     }
     
    
    }
    
 this.collect=function(team){
       this.resources.filter((r)=>r.type=="flatCash").forEach(function(r){
           r.collect(team); 
        });
    }
    
 this.addCash=function(){
       this.resources.filter((r)=>r.type=="flatCash").forEach(function(r){
           r.addCash(); 
        });
    }
    
}

function Resource(r){
  this.type=r.type;
  this.amount=r.amount;
 
 
 this.collect=function(team){
       this.amount=0;
       team.cash+=this.amount;
    }
    
 this.addCash=function(){
      // 
        };
    }

function Upgrade(u){
  this.name=u.name;
  this.type=u.type;
  this.icon=u.icon;
  this.cost=u.cost;
  this.description=u.description;
  
 this.buy=function(team){
       team.cash-=this.cost;
       team.upgrades[this.name]=true;
    }
    
 this.use=function(){
      // 
        };
    }

function Team(t){
  this.name=t.name;
  this.playerss=t.playerss;
  this.icon=t.icon;
  this.cash=t.cash;
  this.respect=this.calcRespect();
  this.upgrades=t.upgrades;
  this.places=t.places;

this.addPlayer=function(name){
      this.players.push(name);
    } 

this.calcRespect=function(){
      var spots=game.places.filter(function(p){
       if(p.owner=this.name){
           return p.respect;
       }
      });
    
     var rsl=spots.reduce((a, b) => a + b, 0);
    
    return rsl;
    }  
    
 this.connect=function(){
       //calc and send
    }
   
 
 

    }
    
