const express = require('express');

const router = express.Router();

// Le body Parser permet d'acceder aux variable envoyés dans le body
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(express.urlencoded({ extended: false }));

const Meuble = require('../model/index');
const simulation = require('../simulation/simulation');

router.get('/all', (req, res, next) => {
    Meuble.findAll()
        .then((meubles) => {
            if (meubles) {
                // Nouvelle liste qui contient les données des meubles
                var meublesArray = [];
                meubles.forEach((meuble) => {
                    meublesArray.push(meuble.dataValues);
                })
                res.json(meublesArray);
            } else {
                res.send("Aucun meuble dans la base de donnée");
            }
        });
});

// CRUD routes

// Create
router.post('/add', (req, res, next) => {
    Meuble.ajouter(req.body.ref, req.body.nom, req.body.description, req.body.prix)
    .then((meuble) => {
        res.json(meuble.dataValues);
    });
});


// Get avec id
router.get('/id/:id', (req, res, next) => {
    Meuble.findById(req.params.id)
        .then((meuble) => {
            if(meuble) {
                res.json(meuble.dataValues);
            } else {
                res.status(404).send("Meuble introuvable");
            }
        });
});

// Get avec ref
router.get('/ref/:ref', (req, res, next) => {
    Meuble.findAll({
        where: {
            ref: req.params.ref
        }
    })
    .then((meubles) => {
        if (meubles) {
            var meublesArray = [];
            meubles.forEach((meuble) => {
                meublesArray.push(meuble.dataValues);
            })
            res.json(meublesArray);
        } else {
            res.status(404).send("Meuble introuvable");
        }
    });
});

// Update avec id
router.post('/update', (req, res, next) => {


    try {
        Meuble.update(
            req.body.data,
        {
            where: { id: req.body.id }
        })
        .then(() => {
            res.send("mise à jour réussie");
        })

    } catch (error) {
        console.log("erreur au cours de la modification", error);
        res.send("erreur au cours de la modification");
    }
});

// Delete avec id
router.delete('/:id', (req, res, next) => {
    Meuble.findById(req.params.id)
        .then((meuble) => {
            if (meuble) {
                meuble.destroy();
                res.send("le meuble id: " + req.params.id + " a bien été supprimé");
            } else {
                res.status(404).send("Meuble non trouvé dans la base de donnée");
            }
        });
});


// Get avec pagination
router.get('/page/:page', (req,res, next) =>  {
    var page = req.params.page || 1;
    var parPage = 10;
    var total = 1;

    // Compte le nombre total d'entrées
    Meuble.findAndCountAll()
    .then(({count, result}) => {
        total = count;
    });


    Meuble.findAll(
        { offset: (page - 1) * parPage, limit: page * parPage }
    )
    .then((meubles) => {
        // Nouvelle liste qui contient les données des meubles
        var meublesArray = [];

        meubles.forEach((meuble) => {
            meublesArray.push(meuble.dataValues)
        })

        res.json({
            totalCount: total,
            result: meublesArray,
            next: (page * parPage < total)
        });
    });
});

router.get('/simulation/:nbr', (req, res) => {
    var nbr = req.params.nbr || 100;
    simulation(nbr, () => { 
        res.send("Simulation réussie");
     });
});


module.exports = router;