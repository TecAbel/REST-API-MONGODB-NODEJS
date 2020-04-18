// =============
// Port
// =============

process.env.PORT = process.env.PORT || 3000;

// =============
// environment
// =============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


// =================
// expiration token
// =================
// 60 seconds, 60 minutes, 24hours, 30 days

process.env.EXP_TOKEN = 60 * 60 * 24 * 30;


// ====================================
// seed authentication
// heroku config:set SEED=something
// heroku config:unset SEED for remove
// ====================================

process.env.SEED = process.env.SEED || 'for-develop-secret';

// =============
// Data base
// =============

let urlDB;

if( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;