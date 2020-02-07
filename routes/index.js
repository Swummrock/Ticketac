var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
var journeyModel = require('../models/journeys')
var cityModel = require('../models/cities')
var userModel = require('../models/users')

var city = ["Paris", "Marseille", "Nantes", "Lyon", "Rennes", "Melun", "Bordeaux", "Lille"]
var date = ["2018-11-20", "2018-11-21", "2018-11-22", "2018-11-23", "2018-11-24"]



// --------------------- BDD -----------------------------------------------------


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/sign-up', async function (req, res, next) {

  var searchUser = await userModel.findOne({
    email: req.body.email
  })
  console.log(searchUser)

  if (!searchUser) {
    var newUser = new userModel({
      name: req.body.name,
      firstname: req.body.firstname,
      email: req.body.email,
      password: req.body.password,
    })

    var newUserSave = await newUser.save();
    console.log(newUserSave)

    req.session.user = {
      name: newUserSave.name,
      id: newUserSave._id,
    }

    res.redirect('/ticetac')
  } else {
    res.redirect('/')
  }

})

router.get('/ticetac', async function (req, res, next) {
  // if (req.session.user == null) {
  //   res.redirect('/')
  // } else {
  //   var journeyList = await journeyModel.find();

  res.render('ticetac', )
  // }
})

router.post('/sign-in', async function (req, res, next) {

  var searchUser = await userModel.findOne({
    email: req.body.email,
    password: req.body.password
  })

  if (searchUser != null) {
    req.session.user = {
      email: searchUser.email,
      password: searchUser.password
    }
    res.redirect('/ticetac')
  } else {
    res.render('login')
  }
})


router.get('/available', async function (req, res, next) {
  var depart = req.body.departCity;
  console.log(depart)
  var arrival = req.body.arrivalCity;
  var date = req.body.chooseDate;
  console.log(arrival);
  console.log(date);

  var journeyList = await journeyModel.find({
    departure: req.body.departCity,
    arrival: req.body.arrivalCity
  })
  console.log(journeyList)

  for (var i = 0; i < journeyList.length; i++) {
    await journeyModel.updateOne({
      _id: journeyList[i].id
    }, {
      departure: journeyList[i].departure,
      arrival: journeyList[i].arrival,
      date: journeyList[i].date,
      departureTime: journeyList[i].departureTime,
      price: journeyList[i].price,
    })
  } 
  res.render('available', { journeyList })

  // else {
  //   res.redirect('/oops')
  // }

})

router.get('/oops', async function (req, res, next) {
  res.render('oops', )
  
})


// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
});

module.exports = router;
