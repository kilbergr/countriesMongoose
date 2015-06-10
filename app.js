var express = require("express"),
methodOverride = require("method-override"),
bodyParser = require("body-parser"),
app = express(),
db = require("./models");

//middleware
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true}));

//routes
//homepage
app.get("/", function(req, res){
	res.redirect("/countries");
});

app.get("/countries", function(req, res){
	db.Country.find({}, function(err, countries){
		if(err){
			res.render('404')
		}
		else{
			res.render("pages/index", {countries: countries})
		}
	})
})

//new form
app.get("/countries/new", function(req, res){
	res.render('pages/new');
})
//create new
app.post("/countries", function(req, res){
	db.Country.create(req.body.country, function(err, countries){
		if(err){
			res.render('pages/404');
		}
		else(res.redirect('/countries'))
	})
})

//individual show page

app.get("/countries/:id", function(req, res){
	 db.Country.findById(req.params.id, function(err, foundCountry){
	 	if(err){
	 		res.render('pages/404')
	 	}
	 	else{res.render("pages/show", {country:foundCountry});
	 };
	})
})

//edit form
app.get("/countries/:id/edit", function(req, res){
	db.Country.findById(req.params.id, function(err, foundCountry){
		if(err){
			res.render('404')
		}
		else{
			res.render('pages/edit', {country:foundCountry})
		}
	})
})
//update edits
app.put("/countries/:id", function(req, res){
	db.Country.findByIdAndUpdate(req.params.id, req.body.country, function(err, foundCountry){
		if(err){
			res.render('404')
		}
		else{
			res.redirect('/countries')
		}
	})
})

//remove country
app.delete("/countries/:id", function(req, res){
	db.Country.findByIdAndRemove(req.params.id, function(err, foundCountry){
		if(err){
			res.render('404');
		}
		else{
			res.redirect('/countries');
		}
	})
})

app.listen(3000, function(){
	console.log("server running");
});