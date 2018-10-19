const express = require('express');

const router = express.Router();

// Le body Parser permet d'acceder aux variable envoyés dans le body
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(express.urlencoded({ extended: false }));

const Meuble = require('../model/index');

router.get('/all', (req, res, next) => {
    Meuble.findAll()
        .then((meubles) => {
            // Nouvelle liste qui contient les données des meubles
            var meublesArray = [];
            meubles.forEach((meuble) => {
                meublesArray.push(meuble.dataValues)
            })
            res.json(meublesArray);
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


// Read avec id
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

// Update avec ref
router.post('/update', (req, res, next) => {
    console.log("req body :", req.body);
    try{
        Meuble.update(
            req.body.data,
        {
            where: { ref: req.body.ref }
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
})


module.exports = router;