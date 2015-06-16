var express = require("express"),
methodOverride = require("method-override"),
bodyParser = require("body-parser"),
app = express(),
db = require("./models"),
session = require("cookie-session"),
morgan = require('morgan'),
loginMiddleware = require("./middleware/loginHelper"),
routeMiddleware = require("./middleware/routeHelper");

//middleware
app.set("view engine", "ejs");
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
	maxAge: 3600000,
	secret: 'arenofun',
	name: 'sugar'
}));

app.use(loginMiddleware);

app.get('/', routeMiddleware.ensureLoggedIn, function(req, res){
	res.render('users/index');
});

app.get('/signup', routeMiddleware.preventLoginSignup, function(req, res){
	res.render('users/signup');
})

//routes
app.post("/signup", function (req, res) {
  db.User.create(req.body.user, function (err, user) {
    if (user) {
      req.login(user);
      res.redirect("/countries");
    } else {
      console.log(err);
      res.render("users/signup");
    }
  });
});

app.get('/login', routeMiddleware.preventLoginSignup, function(req, res){
	res.render('users/login');
});

app.post('/login', function(req, res){
	db.User.authenticate(req.body.user,
		function(err, user){
			if(!err && user !== null){
				req.login(user);
				res.redirect('/countries');
			}
			else{
				res.render('users/login');
			}
		});
});


//homepage
app.get("/", function(req, res){
	res.redirect("/countries");
});

app.get("/countries", routeMiddleware.ensureLoggedIn, function(req, res){
	db.Country.find({}, function(err, countries){
		if(err){
			//handle errors in development
			console.log("ERROR", err);
			//could instead do res.status(500).send(err);
			res.render('errors/500');
		}
		else{
			res.render("countries/index", {countries: countries})
		}
	})
})

//new form
app.get("/countries/new", function(req, res){
	res.render('countries/new');
})
//create new
app.post("/countries", routeMiddleware.ensureLoggedIn, function(req, res){
	var country = new db.Country(req.body.country);
	country.ownerId=req.session.id;
	country.save(function(err, puppy){
		res.redirect('/countries');
	});
});

//individual show page

app.get("/countries/:id", routeMiddleware.ensureLoggedIn, function(req, res){
	 db.Country.findById(req.params.id, function(err, foundCountry){
	 	if(err){
	 		res.render('errors/404')
	 	}
	 	else{res.render("countries/show", {country:foundCountry});
	 };
	})
})

//edit form
app.get("/countries/:id/edit", routeMiddleware.ensureLoggedIn, function(req, res){
	db.Country.findById(req.params.id, function(err, foundCountry){
		if(err){
			res.render('errors/404')
		}
		else{
			res.render('countries/edit', {country:foundCountry})
		}
	});
});
//update edits
app.put("/countries/:id", routeMiddleware.ensureLoggedIn, function(req, res){
	db.Country.findByIdAndUpdate(req.params.id, req.body.country, function(err, foundCountry){
		if(err){
			res.render('errors/404')
		}
		else{
			res.redirect('/countries')
		}
	});
});

//remove country
app.delete("/countries/:id", routeMiddleware.ensureLoggedIn, function(req, res){
	db.Country.findByIdAndRemove(req.params.id, function(err, foundCountry){
		if(err){
			res.render('errors/404');
		}
		else{
			res.redirect('/countries');
		}
	});
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.get("*", function(req, res){
	res.render('errors/404');
})

app.listen(8000, function(){
	console.log("server running on 8000");
});