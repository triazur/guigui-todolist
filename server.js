var express = require('express');
var Cloudant = require('cloudant');
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

// Définition de l'hôte et du port
var host        = process.env.VCAP_APP_HOST || process.env.HOST || 'localhost';
var port        = process.env.VCAP_APP_PORT || process.env.PORT || 8080;

// Connection à la bdd
var cloudant = Cloudant({account:'489b3031-dbe9-4b24-bb10-fdf08d768cf2-bluemix', password:'78fb090140704fb178dc6755e4d381a9cf73891f6cd06935df9c14d468c5edf7'}, function(err, cloudant) {
    if (err) {
        return console.log('Failed to initialize Cloudant: ' + err.message);
    }
    var db = cloudant.db.use('todolist');

    app.get('/',function(red, res){
        db.list({include_docs: true}, function(err, body){
            if(!err){
                res.render('todo.ejs', {todolist:body.rows});
            }
        })
    })

        /* On ajoute un élément à la todolist */
    .post('/ajouter/', urlencodedParser, function(req, res) {
        if (req.body.newtodo != '') {
            var newdata = {'todo': req.body.newtodo};
            db.insert(newdata, function(err, result) {
                res.redirect('/');
            });
        }
    })

    /* Supprime un élément de la todolist */
    .get('/supprimer/:id', function(req, res) {
        if (req.params.id != '') {
            db.get(req.params.id, { revs_info: true }, function(err, body) {
                if (!err) {
                    db.destroy(req.params.id, body._rev, function(err, body) {
                        res.redirect('/');
                    });
                }
            });
        }
    })

    .listen(port, host);
});


