/**
 * We compile all of our models for exporting to sequelize.js here
 */

const BandGenreModel = require('./BandGenre');
const CommentModel = require('./Comment');
const FanBandModel = require('./FanBand');
const FanVenueModel = require('./FanVenue');
const GenreModel = require('./Genre');
const RSVPModel = require('./RSVP');
const ShowModel = require('./Show');
const ShowBandModel = require('./ShowBand');
const TypeModel = require('./Type');
const UserModel = require('./User');
const VenueModel = require('./Venue');


module.exports = {
    BandGenreModel, 
    CommentModel, 
    FanBandModel, 
    FanVenueModel, 
    GenreModel, 
    RSVPModel,
    ShowModel, 
    ShowBandModel,
    TypeModel, 
    UserModel, 
    VenueModel
}