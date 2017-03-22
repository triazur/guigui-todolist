var express = require('express');

var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

// Définition de l'hôte et du port
var host        = process.env.VCAP_APP_HOST || process.env.HOST || 'localhost';
var port        = process.env.VCAP_APP_PORT || process.env.PORT || 8080;

/* On utilise les sessions */
app.get('/', function(req, res) {
    res.render('todo.ejs', {etage: req.params.etagenum});
})

.listen(port, host);
