const { Show, RSVP, User } = require('../sequelize');

// Create show
const createShow = async (req, res) => {
    const { name, date, id_venue } = req.body;
    try {
        await Show.create({
            name: name,
            date: date,
            id_venue: id_venue
        })
        res.send(201);
    }
    catch (err) {
        console.log(err);
        res.send(400);
    }
}

// Get all upcoming shows

// Allow fan to rsvp to a show
const rsvpFanToShow = async (req, res) => {
    try {
        const { id_show, id_fan } = req.body;
        await RSVP.create({
            id_show: id_show,
            id_fan: id_fan
        })
        res.sendStatus(201);
    }
    catch(err) {
        console.log(err);
        res.send(400);
    }
}

// Get all fans who have rsvpd to a show
const getRSVPs = async (req, res) => {
    try {
        const { id } = req.params;
        const rsvps = await RSVP.findAll({
            where: {
                id_show: id
            }
        })
        Promise.all(rsvps.map(async(rsvp) => {
                console.log(rsvp);
             const fan = await User.findOne({
                 where: {
                     id: rsvp.id_fan
                 }
             })
             return fan;
         })).then((data) => {
             res.send(data)
         })
    }
    catch(err) {
        console.log(err);
        res.send(400);
    }
}

// Update show

// Delete show

module.exports = {
    createShow,
    getRSVPs,
    rsvpFanToShow
}