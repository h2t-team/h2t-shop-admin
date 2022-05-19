const Sequelize = require('sequelize');
const initModels = require("./init-models");

// const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
//     timezone: '+07:00',
//     dialectOptions: {
//         useUTC: false, //for reading from database
//         dateStrings: true,
//         typeCast: function(field, next) { // for reading from database
//             if (field.type === 'DATETIME') {
//                 return field.string()
//             }
//             return next()
//         },
//     }
// });

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: '+07:00',
    dialectOptions: {
        useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: function(field, next) { // for reading from database
            if (field.type === 'DATETIME') {
                return field.string()
            }
            return next()
        },
    }
});

module.exports = {
    sequelize,
    models: initModels(sequelize)
};