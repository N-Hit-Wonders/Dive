const { Venue } = require('../sequelize');

// Create venue
const createVenue = async (req, res) => {
    try {
        const { name, address1, address2, city, state, zip_code } = req.body;
        Venue.create({
            name,
            address1,
            address2,
            city,
            state,
            zip_code
        })
        res.send(201);
    }
    catch (err) {
        console.log(err);
        res.send(400);
    }
}


// Get all venues
// const getAllVenues = ()

// Get shows at a given venue

// Update venue

// Delete venue

module.exports = {
    createVenue,
}