const express = require("express");

const routeurMeubles = require('./routes/meuble');
const app = express();


// Routage 
app.use('/meuble', routeurMeubles);


app.listen(3500, function () {
    console.log('Démarrage du serveur - port 3500');
  });
