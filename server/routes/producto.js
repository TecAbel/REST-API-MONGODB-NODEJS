const express = require('express');
const { verifyToken } = require('../middlewares/auth');

let app = express();
let Producto = require('../models/producto');

// get product by flexible search
app.get('/productos/buscar/:termino', verifyToken, (req, res) => {
    let termino = req.params.termino;

    let regex = RegExp(termino, 'i');

    Producto.find({name: regex})
        .exec((error, productos) => {
            if(error){
                res.status(500).json({
                    ok: false,
                    error
                })
            }
            if(!productos){
                res.status(403).json({
                    ok: false,
                    message: 'No se encontraron resultados'
                })
            }

            res.json({
                ok: true,
                productos
            })
        });
});


// Get all products
app.get('/productos', verifyToken, (req, res) => {
    // trae todos los usuarios
    // populate usuario categoria
    // paginado
    let from  = req.query.from || 0;
    let size = req.query.size || 5;
    from = Number(from);
    size = Number(size);

    Producto.find({})
        .populate('usuario category', 'nombre email description')
        .limit(size)
        .skip(from)
        .exec(( error, productos ) => {
            if(error){
                res.status(500).json({
                    ok: false,
                    error
                })
            }
            Producto.estimatedDocumentCount((error, count) => {
                if(error) throw(error);
                res.json({
                    ok: true,
                    numProducts: count,
                    productos
                })
            })
            
           
        })
});

// Un producto por ID
app.get('/productos/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario category', 'nombre email description')
        .exec((error, productoDB) => {
        if(error){
            res.status(500).json({
                ok: false,
                error
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    });
});

// Create a product
app.post('/productos', verifyToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        name: body.name,
        price: body.price,
        description: body.description,
        category: body.category,
        usuario: req.usuario._id,
    });

    producto.save((error, productoDB) => {
        if(error){
            res.status(500).json({
                ok: false,
                error
            })
        }

        res.json({
            ok: true,
            productoDB
        })
    });
});

// update a products
app.put('/productos/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let productTo = {
        name: body.name,
        price: body.price,
        description: body.description,
        category: body.category,
        usuario: req.usuario._id,
    }

    Producto.findByIdAndUpdate(id, productTo, {new: true, runValidators: true}, (error, producto)=>{
        if(error){
            res.status(500).json({
                ok: false,
                error
            })
        }
        if(!producto){
            res.status(404).json({
                ok: false,
                error
            })
        }

        res.json({
            ok: true,
            message: 'Producto actualizado'
        })
    })
});

// delete a products
app.delete('/productos/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    let productTo = {
        avialable: false
    };

    Producto.findByIdAndUpdate(id, productTo, (error, producto) => {
        if(error){
            res.status(500).json({
                ok: false,
                error
            })
        }
        if(!producto){
            res.status(404).json({
                ok: false,
                error
            })
        }
        res.json({
            ok: true,
            message: 'se actualizo el estado de este producto'
        })
    })
});

module.exports = app;