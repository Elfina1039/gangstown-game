
// initialize server
var express=require('express');
const cookieParser = require('cookie-parser');
var socket = require('socket.io');
var app=express();
var server=app.listen(3000, function(){
    console.log('server listening on port 3000');
});


app.use(cookieParser());
app.use(express.static('.'));

var io=socket(server);

// hard data
var game={};
game.places={
    bar:{name:'Bar', icon:'local_bar', resources:[{type:'flatCash', amount:200}], owner:'Mafia',
        log:[{team:'Mafia', time:'20 m. ago'}, {team:'Svinuchy', time:'10 m. ago'} ]},
    casino:{name:'Casino', icon:'casino',resources:[{type:'flowingCash', amount:5}, {type:'respect', amount:5}], owner:'Nemo',gains:{},
           log:[{team:'Mafia', time:'20 m. ago'}, {team:'Svinuchy', time:'10 m. ago'} ]},
              
     pubWc:{name:'Public WC', icon:'wc',resources:[{type:'flowingCash', amount:1}, {type:'respect', amount:-5}], owner:'Mafia',
          log:[{team:'Mafia', time:'20 m. ago'}, {team:'Svinuchy', time:'10 m. ago'} ]}
};  


game.teams={
    Delfini:{name:'Delfini', cash:200, respect:10, members:[], upgrades:{Radar:true, Spying:true}},
    Svinuchy:{name:'Svinuchy', cash:100, respect:20, members:[], upgrades:{Dog:true}},
         Mafia:{name:'Mafia', cash:100, respect:20, members:[], upgrades:{Dog:true}}
   
};

game.upgrades=[{name:'Spying', cost:50, icon:'search'}, {name:'Radar', cost:500, icon:'track_changes'}, {name:'Dog', cost:300, icon:'pets'}];  
var upd;


// set routes
app.get('/login/:player/:team',function(req, res){
    res.cookie('player' , req.params.player);
     res.cookie('team' , req.params.team);
    game.teams[req.params.team].members.push(req.params.player);
    return res.send('Player name has been set: '+ req.params.player+ '/' + req.params.team);
});


app.get('/visit/:name', function (req, res) {
    
    console.log(req.cookies.player +' accessed '+ req.params.name);
    
    var messages=[];
   game.places[req.params.name].resources.forEach(function(r){
        switch(r.type){
            case 'flatCash': messages.push(gainCash(req.cookies, r.amount, game.places[req.params.name]));r.amount=0; break;
            case 'flowingCash': messages.push(flowCash(req.cookies, r.amount, game.places[req.params.name])); break;
            case 'respect':messages.push( gainRespect(req.cookies, r.amount, game.places[req.params.name]));break;
        }
    });
    
  res.send(req.cookies.player+'('+req.cookies.team+') '+messages.join(','));
    
    upd(game.places);
   
})

app.get('/master/:dataset', function (req, res) {
    
  res.send(JSON.stringify(game[req.params.dataset]));
           });
   

//sockets


var updInterval={};

io.on('connection',function(socket){
console.log('socket connection made');  
    
    upd=function(data)
    {
       io.sockets.emit('updInterval',data);   
    }
    
    
    io.sockets.emit('start',{places:game.places, upgrades:game.upgrades});
    
    updInterval=setInterval(updatePlaces, 5000);
    
    socket.on('purchase',function(data){
        
        console.log(data);
    });

});


// functions
function gainCash(who, howMuch, where){
    var gained=howMuch+game.teams[who.team].respect;
    game.teams[who.team].cash+=gained;
    
    return 'You have gained ' + gained + ' flat cash ' + game.teams[who.team].cash;
    
}

function flowCash(who, howMuch, where){
   
    var gained=howMuch+game.teams[who.team].respect;
    clearInterval(where.gains);
     where.gains=setInterval( function(){game.teams[who.team].cash+=gained;},2000);
    
    return 'You will receive ' + gained + ' flowing cash';
    
}

function gainRespect(who, howMuch, where){
    game.teams[who.team].respect+=howMuch;
    where.owner=who.team.name;
    
    return 'You have gained ' + howMuch + ' respect points';
    
}

function updatePlaces()
{
    for(p in game.places)
        {
            game.places[p].resources.forEach(function(r){
                r.amount=r.amount+10;
            });
            
        }
    
    io.sockets.emit('updInterval',game.places);
    
}