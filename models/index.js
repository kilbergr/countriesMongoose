//requiring it from default node_modules
		var mongoose = require("mongoose");
		//connecting mongoose to a database--will look for a db called dog_park, if it can't find, it will create one (like use)
		mongoose.connect("mongodb://localhost/country_data");
		//optional: will print out mongo request in console each time a mongoose action is taken
		mongoose.set('debug', true);

module.exports.Country = require("./country");
