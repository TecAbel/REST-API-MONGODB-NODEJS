// =============
// Port
// =============

process.env.PORT = process.env.PORT || 3000;

// =============
// environment
// =============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


// =============
// Data base
// =============

let urlDB;

if( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://abel_admin:WNT5LN70R6Jhm3Es@cluster0-nxjqn.mongodb.net/cafe?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;