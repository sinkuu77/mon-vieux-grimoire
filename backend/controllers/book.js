const Book = require('../models/Book');
const fs = require('fs');
const sharp = require('sharp');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const convertImg = async(file) => {
    const { buffer, originalname } = file;
    const timestamp = Date.now();
    const newOriginalname = originalname.split(MIME_TYPES[file.mimetype])[0]
    const filename = `${timestamp}-${newOriginalname}webp`

    await sharp(buffer)
    .webp({ quality: 20 })
    .toFile('./images/' + filename);

    return filename;
}


exports.createBook = async(req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    
    const filename = await convertImg(req.file);
    
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${filename}`
    });
    book.save()
    .then(() =>{ res.status(201).json({ message: 'Livre enregistré !'})})
    .catch(error => {res.status(400).json( { error } )});
};

exports.modifyBook = async(req, res, next) => {
    let filename;
    if(req.file) {
        await convertImg(req.file);
    };
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${filename}`
    } : { ...req.body };
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
    .then((book) => {
        if(book.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non-autorisé' });
        } else {
            Book.updateOne({ _id: req.params.id }, {...bookObject, _id: req.params.id})
                .then(() => { 
                    const filenameToRemove = book.imageUrl.split('/images/')[1];
                    fs.unlink(`./images/${filenameToRemove}`, () => 
                    res.status(201).json({message: 'Livre modifié !'}))
                    })
                .catch(error => {res.status(401).json({ error })})
        };
    } )
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
    .then(book => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`./images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.getBestratingBooks = (req, res, next) => {
    Book.aggregate([
        {
            $sort: {
                "ratings.grade": -1
            }
        },
        {
            $limit: 3
        }
    ])
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
}

exports.createRating = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => {
        if(book.ratings.some((rating) => rating.userId) == req.auth.userId) {
            res.status(400).json({ message: 'Rating déjà ajouté !' });
        } else {
            book.update(
                { $push: {"ratings": {
                    "userId": req.auth.userId,
                    "grade": req.body.rating,
                    "_id": Date.now()
                }}}
            )
            .then(() =>{ res.status(201).json({ message: 'Rating enregistré !'})})
            .catch(error => {res.status(400).json( { error } )});
        }
    })
}