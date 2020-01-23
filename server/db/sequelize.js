const { Sequelize } = require('sequelize');
const dotenv = require('dotenv')
// we require our models here to be instantiated after sequelize connection is made
const { BandGenreModel,
        CommentModel, 
        FanVenueModel, 
        GenreModel, 
        RSVPModel,
        ShowModel, 
        ShowBandModel,
        TypeModel, 
        UserModel, 
        VenueModel } = require('./models/index');
dotenv.config();
const { DB_USER, DB_PASS, DB_NAME, DB_HOST, CLOUD_SQL_CONNECTION_NAME } = process.env;

// create a new sequelize instance
// // DEV
const sequelize = new Sequelize('dive', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

// PROD
// const sequelize = new Sequelize('dive', 'root', 'dive', {
//   dialect: 'mysql',
//   host: `/cloudsql/${CLOUD_SQL_CONNECTION_NAME}`,
//   timestamps: false,
//   dialectOptions: {
//     socketPath: `/cloudsql/${CLOUD_SQL_CONNECTION_NAME}`
// },
// });


// instanstiate the models here
const Type = TypeModel(sequelize, Sequelize);
const BandGenre = BandGenreModel(sequelize, Sequelize);
const ShowBand = ShowBandModel(sequelize, Sequelize);
const RSVP = RSVPModel(sequelize, Sequelize);
const FanVenue = FanVenueModel(sequelize, Sequelize);
const Genre = GenreModel(sequelize, Sequelize);
const Comment = CommentModel(sequelize, Sequelize);
const Show = ShowModel(sequelize, Sequelize);
const Venue = VenueModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);


/**
 * Below, we create the associations between tables.
 */

// each user has one type
User.Type = User.belongsTo(Type, { foreignKey: { name: 'id_type', allowNull: false } });

// each show has one venue
Show.belongsTo(Venue, { foreignKey: { name: 'id_venue', allowNull: false } });

// join table for shows and fans (RSVPs)
Show.hasMany(RSVP, { foreignKey: { name: 'id_show', allowNull: false } });
User.hasMany(RSVP, { foreignKey: { name: 'id_fan', allowNull: false } });

// join table for shows and bands
Show.hasMany(ShowBand, { foreignKey: { name: 'id_show', allowNull: false } });
User.hasMany(ShowBand, { foreignKey: { name: 'id_band', allowNull: false } });

// join table for fans and bands
// (this is the only join table that sequelize is automating for us)
User.belongsToMany(User, {
  as: 'fan',
  through: 'fans_bands',
  foreignKey: {
    name: 'id_band',
    allowNull: false
  },
  otherKey: {
    name: 'id_fan',
    allowNull: false
  }
});

// join table for venues and fans
User.hasMany(FanVenue, { foreignKey: 'id_fan' });
Venue.hasMany(FanVenue, { foreignKey: 'id_venue' });

// join table for bands and genres
User.hasMany(BandGenre, { foreignKey: 'id_band' });
Genre.hasMany(BandGenre, { foreignKey: 'id_genre' });

// each comment has one user
Comment.belongsTo(User, { foreignKey: { name: 'id_user', allowNull: false } });

// each comment has one show
Comment.belongsTo(Show, { foreignKey: { name: 'id_show', allowNull: false } });

// each show has many comments
Show.belongsToMany(Comment, { through: 'show_comments' })


/**
 * Next we create the database and tables, and prepopulate our type and genre tables.
 */
// TODO: should we prepopulate venues?

// Use line 99 instead of line 100 if you don't want the database to drop on server refresh
sequelize.sync()
// sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`)
  }).then(() => {
    Type.create({
      typeName: 'fan'
    });
    Type.create({
      typeName: 'band'
    });
    Genre.create({
      genreName: 'rock'
    });
    Genre.create({
      genreName: 'punk'
    });
    Genre.create({
      genreName: 'folk'
    });
    Genre.create({
      genreName: 'indie'
    });
    Genre.create({
      genreName: 'brass'
    });
    Genre.create({
      genreName: 'jazz'
    });
  })
  .catch((err) => {
    console.log(err);
  })


module.exports = {
  // export sequelize for the model creation
  sequelize, 
  // export model instances for controller functions
  BandGenre,
  Comment, 
  FanVenue, 
  Genre,
  RSVP, 
  Show, 
  ShowBand,
  Type, 
  User, 
  Venue
}