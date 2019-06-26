var express = require('express');
var router = express.Router();
var adventureDb = require('../utility/adventureDB');
var userDB = require('../utility/userDB');
var useradventuremodel = require('../models/useradventure');
var bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* GET home page. */
router.get('/', function(req, res) {
  res.render('homepage',{login: req.session.login});
  });


router.get('/adventures', async function(req, res) {
  try{
    var adventureModel = require('../utility/adventureDB.js');
    var categories = await adventureModel.getCategories();
    var adventureData = await adventureModel.getAdventures();
    var data= {
        categories: categories,
        adventures: adventureData
    }
    res.render('adventures', { data: data,login: req.session.login});
  }
  catch(err){
    console.log("in catalog controller: ",err);
  }
});

router.get('/contact', function(req, res) {
    res.render('contact',{login: req.session.login});
});

router.get('/about', function(req, res) {
  res.render('about',{login: req.session.login});
});

router.get('/item/:adventurecode',urlencodedParser,[check('adventurecode' ,'User ID is invalid').isAlphanumeric()],async function(req, res) {
    var adventureID = req.params.adventurecode;
    var adventure = await adventureDb.getAdventure(adventureID);
    if(adventure.length == 0){
    var adventureModel = require('../utility/adventureDB.js');
    var categories = await adventureModel.getCategories();
    var adventureData = await adventureModel.getAdventures();
    var data= {
        categories: categories,
        adventures: adventureData
    }
    res.render('adventures', { data: data,login: req.session.login })
  }
  else{
    var data= {
        adventure: adventure
    }

    if(req.session.theUser == undefined){
      var savedone = false;
    res.render('item', { data: adventure[0],sess: req.session.theUser,savedone: savedone,login: req.session.login});
  }else{
    var savedone = false;

    var useradventures = req.session.currentUserProfile.listadventures;
    res.render('item', { data: adventure[0],sess: req.session.theUser,sessuser: useradventures,savedone: savedone,login: req.session.login});
  }
}
});
router.post('/changes',urlencodedParser,[check('adventurecode','adventure code is invalid').isAlphanumeric(),
check('adventurecode','must be maximum 3 chars long').isLength({ max:3 })], async function(req,res){
  var action = req.body.action;
  if(action=='UpdateuserRating'){
      var id = req.body.adventurecode;
      var oldrating = req.body.rate;
      var oldflag = req.body.stat;
      if (req.body.rating == undefined) {
      var updaterating = oldrating;
      }else{
      var updaterating = req.body.rating;
      }
      if (req.body.flag == undefined) {
      var updatetriedit = oldflag;
      }else{
      var updatetriedit = req.body.flag;
      }
      req.session.currentUserProfile =await userDB.getUserProfile(req.session.theUser[0].userId);
      var adventure = await adventureDb.getAdventure(id);
      var adventure2update = useradventuremodel.UserAdventure(adventure,updaterating,updatetriedit);
      await userDB.updateAdventurerating(req.session.theUser[0].userId,adventure2update);
      res.redirect('/mytrips');
  }else if (action=='Updateuserflag') {
    var id = req.body.adventurecode;
    var oldrating = req.body.rate;
    var oldflag = req.body.stat;
    if (req.body.rating == undefined) {
    var updaterating = oldrating;
    }else{
    var updaterating = req.body.rating;
    }
    if (req.body.flag == undefined) {
    var updatetriedit = oldflag;
    }else{
    var updatetriedit = req.body.flag;
    }
    req.session.currentUserProfile =await userDB.getUserProfile(req.session.theUser[0].userId);
    var adventure = await adventureDb.getAdventure(id);
    var adventure2update = useradventuremodel.UserAdventure(adventure,updaterating,updatetriedit);
    await userDB.updateAdventuretriedflag(req.session.theUser[0].userId,adventure2update);
    res.redirect('/mytrips');

  }
});

router.post('/login',urlencodedParser,[check('usrid','User ID is invalid').isAlphanumeric(),
check('pass','must be at least 8 chars long').isLength({ min:8,max:32 }),
check('pass').matches(/\d/).withMessage('must contain a number').not().isIn(['password','pass']).withMessage('Do not use common passwords'),
sanitizeBody('notifyOnReply').toBoolean()], async function(req,res){
  var order = req.body.action;
  if (order =='Login'){
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('login', {errors: errors.array(),regerrors:undefined});
      errors = '';
    }
    else{
      var matchstat = await userDB.getUserbyUsername(req.body.usrid,req.body.pass);
      if(matchstat == 1){
        console.log('match success');
        req.session.theUser = await userDB.getUser(req.body.usrid);
        req.session.save;
        req.session.login = 1;
        res.redirect('/mytrips');
      }
      else{
        console.log('match not success');
        res.render('login', {errors: errors.array(),regerrors:undefined,matchresponse: false});
      }
    }
  }
});
router.post('/register',urlencodedParser,[check('fname','Firstname can be only alphabets').isAlpha(),
check('lname','Lastname can be only alphabets').isAlpha(),
check('uname','Username can be only alphabets').isAlpha(),
check('elecmail','Email format is invalid').isEmail(),
check('pwd','password must be at least 8 chars long').isLength({ min:8,max:12 }),
check('pwd').matches(/\d/).withMessage('password must contain a number').not().isIn(['password','pass']).withMessage('Do not use common passwords'),
check('pwd').isAlphanumeric().withMessage('No Special characters allowed in password'),
check('re-pwd').not().isEmpty().withMessage('Re Password cannot be left Null'),
check('re-pwd').isLength({ min:8,max:12 }).withMessage('Re password must be at least 8 chars long'),
check('re-pwd').matches(/\d/).withMessage('Re password must contain a number'),
check('re-pwd').not().isIn(['password','pass']).withMessage('Do not use common passwords'),
check('re-pwd').isAlphanumeric().withMessage('No Special characters allowed in Re password'),
check('re-pwd').custom((value, { req }) => {
    if(value.trim() !== req.body.pwd.trim()) {
      throw new Error ('Password confirmation does not match password');
    }
  }),
check('age').isNumeric().withMessage('Age can accept only number'),
check('zipcode').isNumeric().withMessage('Zipcode can only be number'),
check('country').isAlpha().withMessage('Country can be only take alphabets')], async function(req,res){
  var order = req.body.action;
if (order =='Register') {
  let regerrors = validationResult(req);
  //console.log(regerrors.array());
  if (!regerrors.isEmpty()) {
    res.render('login', {regerrors: regerrors.array(),errors:undefined});
    regerrors = '';
  }
}
});

module.exports = router;
