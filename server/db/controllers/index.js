// compile all controllers and export to router from here
const { addFanToVenue, 
        addFanToBand, 
        addGenreToBand, 
        createUser, 
        getAllBands,
        getBandFans,
        getBandGenres,
        getSingleUser 
    } = require('./User');
const { getTypes } = require('./Type');
const { createVenue } = require('./Venue');
const { 
        createShow,
        getRSVPs,
        rsvpFanToShow
    } = require('./Show');

module.exports = {
    addFanToBand,
    addFanToVenue,
    addGenreToBand,
    createUser,
    createShow,
    getAllBands,
    getBandFans,
    getBandGenres,
    getRSVPs,
    getSingleUser,
    getTypes,
    createVenue,
    rsvpFanToShow
}