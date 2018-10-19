const Sequelize = require('sequelize');

const meubleConstructor = (sequelize) => {
    const Meuble = sequelize.define('meuble', {
        ref: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        nom: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        description: {
            type: Sequelize.TEXT,
        },

        prix: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }

    });

    Meuble.ajouter = (ref, nom, description, prix) => {
        return new Promise( (resolve) => {
            Meuble.sync().then(() => {
                Meuble.create({
                    ref: ref,
                    nom: nom,
                    description: description,
                    prix: prix,
                }).then((meuble) => {
                    resolve(meuble);
                });
            });
        });
    };

    
    return Meuble;
}

module.exports = meubleConstructor;