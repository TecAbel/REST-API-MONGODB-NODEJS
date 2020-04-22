const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('./../models/usuario');
const { verifyToken, verifyAdminRole } = require('./../middlewares/auth');
const app = express();


app.get('/usuario', verifyToken , (req, res) => {



    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.items || 5;
    limit = Number(limit);

    Usuario.find({estado: true}, 'nombre email role estado google img')
        .skip(from)
        .limit(limit)
        .exec( (error, usuarios) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({estado: true}, (error, count) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        error
                    });
                }

                res.json({
                    ok: true,
                    totalUsuarios: count,
                    usuarios
                });
            });

            
        });
  });

  app.get('/usuario/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Usuario.findById(id, (error, usuario) => {
        if(error) {
            return res.json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            usuario
        })
    });
  })
  
  app.post('/usuario', [verifyToken, verifyAdminRole], (req, res) => {
      let body = req.body;

      let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        
      });

      usuario.save((err, usuarioDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
      });
  });
  
  app.put('/usuario/:id', [verifyToken, verifyAdminRole], (req, res) => {
      let id = req.params.id;
      let body = _.pick(req.body, ['nombre',
        'email',
        'img',
        'role',
        'estado']); 

      Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true} , (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
      });
      
  });
  
  app.delete('/usuario/:id', [verifyToken, verifyAdminRole], (req, res) => {
      
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id,{ estado: false }, {new: true},(error, usuarioDeleted) => {
        if(error){
            return res.json({
                ok: false,
                error
            });
        }

        if(!usuarioDeleted){
            return res.json({
                ok: false,
                error: {
                    message: 'No se encontró el usuario'
                }
            })
        }

        res.json({
            ok: true,
            usuarioDeleted
        });
    });

    /*
    delete completelly
    Usuario.findByIdAndRemove(id, (error, usuarioDeleted) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        if(!usuarioDeleted) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encontró este usuario'
                }
            })
        }

        res.json({
            ok:true,
            usuario: usuarioDeleted
        })
    });*/

  });


  module.exports = app;