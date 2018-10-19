const Meuble = require('../model/index');


function lettresAleatoire(longeur, possible) {
    var nom = "";

    for (var i = 0; i < longeur; i++)
        nom += possible.charAt(Math.floor(Math.random() * possible.length));

    return nom;
}

const simulation = (nbr, next = () => {}) => {
    var promises = [];
    var nom;
    var prix;
    var description;

    const lettresNom = "aabcdeefghijklmnoopqrstuuvwxyz";
    const lettersDescription = "aa bcd ee fgh ijklmn oo pqrst uu v wxyz";

    for (var i = 0; i < nbr; i++) {

        // prix aléatoire entre 1 et 100
        prix = Math.random() * 99 + 1;

        nom = lettresAleatoire(Math.floor(Math.random() * 15 + 5), lettresNom);

        description = lettresAleatoire(Math.floor(Math.random() * 100 + 50), lettersDescription);
        promises.push(Meuble.ajouter(i.toString(), nom, description, prix));
    }
    Promise.all(promises).then(() => { 
        console.log("realed all promises");
        next();
    })
}

module.exports = simulation;