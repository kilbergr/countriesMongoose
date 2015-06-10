	var mongoose = require("mongoose");
	var countrySchema = new mongoose.Schema({
   			name: {type: String, required: true},
    		capital: String,
    		flag: String,
    		pop: Number,
    		cities: Array
			});

	var Country = mongoose.model("Country", countrySchema);

	module.exports = Country;