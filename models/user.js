const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true // this is not considered a validation, it sets up an index 
  }
});

// this will implicitly add on to the 'UserSchema' a username and password
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

// unique: true is added for a schema field if we want to prevent a query that wants to save a field with the same value that already exists in the database in a different document (by using those unique index values).