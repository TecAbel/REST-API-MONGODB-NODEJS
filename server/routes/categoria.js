
const express = require('express');
const { verifyToken, verifyAdminRole } = require('./../middlewares/auth');
const app = express();
const Categoria = require('../models/categoria-model');

app.get('/categoria', verifyToken, (req, res) => {
    Categoria.find({})
        .sort('description')
        .populate('usuario', 'nombre email')
        .exec((error, categorias) =>{
            if(error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
            res.json({
                ok: true,
                categorias
            });
        });
});

app.get('/categoria/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (error, categoria) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }
        if(!categoria){
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'La categoría no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        })
    });
});

app.post('/categoria', verifyToken, (req, res) =>  {
    let body = req.body;

    let categoria = new Categoria({
        description: body.description,
        usuario: req.usuario._id
    });

    categoria.save( (error, categoriaDB) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });


});

app.put('/categoria/:id', verifyToken, (req,res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        description: body.description
    };
    

    Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true}, (error, categoriaDB) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

app.delete('/categoria/:id', [verifyToken, verifyAdminRole], (req,res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (error, categoriaDB) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }
        if(!categoriaDB){
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'La categoría no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoría eliminada'
        })
    });
});

module.exports = app;