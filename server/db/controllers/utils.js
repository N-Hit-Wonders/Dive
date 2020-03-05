const { User, Genre, Venue, Show, Sequelize } = require('../sequelize');

// import the Sequelize operators
const Op = Sequelize.Op;

/**
 * These are helper functions to grab all data from a single record 
 * when provided its name or id
 * We use this in the controllers to grab record info 
 * when we're passed a name or id from the front end
 * 
 * (call it with await in an async function)
 * 
 * @param {*} type (genre, venue, fan, band, or user)
 * @param {*} name (passed in through req.body)
 */
const getRecordByName = async (type, name) => {
    try {
        if (type === 'band' || type === 'fan' || type === 'user') {
            let userRecord = await User.findOne({
                where: {
                    [Op.or]: [
                        { nickname: name },
                        { name: name }
                    ]
                }
            });
            return userRecord;
        } 
        if (type === 'genre') {
            const genreRecord = await Genre.findOne({
                where: {
                    genreName: name
                }
            });
            return genreRecord;
        }
        if (type === 'venue') {
            const venueRecord = await Venue.findOne({
                where: {
                    name: name
                }
            });
            return venueRecord;
        }
        if (type === 'show') {
            const showRecord = await Show.findOne({
                where: {
                    name: name
                }
            });
            return showRecord;
        }
    }
    catch(err) {
        console.log(err);
    }
}

const getRecordByID = async (type, id) => {
    try {
        if (type === 'band' || type === 'fan' || type === 'user') {
            let userRecord = await User.findOne({
                where: {
                    id: id
                }
            });
            return userRecord;
        } 
        if (type === 'genre') {
            const genreRecord = await Genre.findOne({
                where: {
                    id: id
                }
            });
            return genreRecord;
        }
        if (type === 'venue') {
            const venueRecord = await Venue.findOne({
                where: {
                    id: id
                }
            });
            return venueRecord;
        }
        if (type === 'show') {
            const showRecord = await Show.findOne({
                where: {
                    id: id
                }
            });
            return showRecord;
        }
    }
    catch(err) {
        console.log(err);
    }
}

module.exports = {
    getRecordByName,
    getRecordByID,
}