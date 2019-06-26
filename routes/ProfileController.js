var express = require('express');
var app = module.exports = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var validator=require('express-validator');
var adventureDB = require('../utility/adventureDB');
var userDB = require('../utility/userDB');
var useradventure = require('../models/useradventure.js');

var urlencodedParser= bodyParser.urlencoded({extended:false});


app.get('/mytrips', async function(req, res) {

  try{

      var currentUser = req.session.theUser;
      if(currentUser == undefined){
        console.log('No user is assigned');
}else{
        var userId = req.session.theUser[0].userId;
        var currentUserProfile = await userDB.getUserProfile(userId);
        req.session.currentUserProfile = currentUserProfile;
        var useradventures = req.session.currentUserProfile.listadventures;

     var action = req.query.action;
        if(action == undefined){
       res.render('mytrips',{data: useradventures});
     }

   else if(action=='Saveadventure'){
      var id = req.query.adventureCode;
      var isaddeditem = false;
      for(var i=0;i<req.session.currentUserProfile.listadventures.length;i++){
        if(req.session.currentUserProfile.listadventures[i].adventurecode == id){
          isaddeditem = true;
          break;
        }
      }


     if(isaddeditem==false){
       var newitem = await adventureDB.getAdventure(id);
       var newadventure = await useradventure.UserAdventure(newitem,newitem[0].rating,newitem[0].triedit);

       var userId = req.session.theUser[0].userId
       await userDB.addAdventure(userId,newadventure)
     }

     res.redirect('/mytrips');


   }else if(action=='delete'){
           var id = req.query.adventureCode;
           await userDB.removeAdventure(req.session.theUser[0].userId,id);

           res.redirect('/mytrips');

   }else if(action == 'update'){
            var adventureCode = req.query.adventureCode;
            var userId = req.session.theUser[0].userId;
            var currentUserProfile = await userDB.getUserProfile(userId);
            var useradventures = req.session.currentUserProfile.listadventures;
            useradventures.forEach(function(item){
            if(item.adventure.adventureCode === adventureCode){
              adventure4update = item;
            }
          });
            res.render('feedback',{data: adventure4update});
   }

}
}
catch(err){
    console.log("in items error: ");
    console.log(err);
  }
});

app.get('/logout',function(req,res){
  req.session.login = 0;
  req.session.destroy();
  console.log('session has ended');
  res.render('homepage',{login: 0});

});

app.get('/login',function(req,res){
  console.log('Login is rendering');
  console.log(req.session.theUser);
  console.log('check in login get');
  if(req.session.theUser == undefined){
  res.render('login',{errors:undefined,regerrors:undefined});
  }
  else{
    res.render('/mytrips');
  }
});
