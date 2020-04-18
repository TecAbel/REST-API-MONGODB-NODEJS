const jwt = require('jsonwebtoken');

/*
VERIFY TOKEN
*/

let verifyToken = ( req, res, next ) => {
    // get header
    let token = req.get('auth');

    jwt.verify(token, process.env.SEED, (error, decoded) => {
        if(error){
            return res.status(401).json({
                ok: false,
                error
            });
        }

        // console.log(decoded);
        req.usuario = decoded.usuario
        next(); // if not, it stops here
    });

    
};

/*
VERIFY ADMIN ROLE
*/

let verifyAdminRole = (req, res, next) => {
    if ( req.usuario.role === 'ADMIN_ROLE' ) {
        next();
    } else {
        res.status(401).json({
            ok: false,
            message: 'No tiene permiso para completar esta acción'
        })
    }

    
}

module.exports = {
    verifyToken,
    verifyAdminRole
}