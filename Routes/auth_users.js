import express from 'express'
const router = express.Router();

export let reviews = [
    {
        "id": 1,
        "bookISBN": "0385737955",
        "review": "Totally recommended",
        "createdBy": 1,
        "createdByName": "Joe",
        "createdAt": "2025-02-17T14:01:51.618Z",
        "updatedAt": null,
        "isDeleted": false
    }
]

router.get("/", (req, res) => {
    res.send(JSON.stringify(reviews, null, 4));
})

// ADD a new review for a book
router.post('/:isbn', (req, res) => {
    reviews.push({
        id: reviews.length + 1,
        bookISBN: req.params.isbn,
        comment: req.body.comment,
        createdBy: req.user.data.id,
        createdByName: req.user.data.username,
        createdAt: new Date(),
        updatedAt: null,
        isDeleted: false
    })

    res.send({message: "The review has been added"});
})

// Modify a book review
router.put('/:isbn', (req, res) => {
    let review = reviews.find(review => review.bookISBN === req.params.isbn);
    if (review) {
        if (review.createdBy === parseInt(req.user.data.id)) {
            review.comment = req.body.comment;
            review.updatedAt = new Date();

            reviews = reviews.filter(review => review.bookISBN != req.params.isbn);
            reviews.push(review);
        }
        else {
            res.send({message: "Cannot update this review"});
        }
    }
    else {
        res.send({message: "Invalid request"});
    }

    res.send({message: "The review has been updated"});
})

// Delete a book review
router.delete('/:isbn', (req, res) => {
    let review = reviews.find(review => review.bookISBN === req.params.isbn);
    if (review) {
        if (review.createdBy === parseInt(req.user.data.id)) {
            review.isDeleted = true;
            review.updatedAt = new Date();

            reviews = reviews.filter(review => review.bookISBN != req.params.isbn);
            reviews.push(review);
        }
        else {
            res.send({message: "Cannot delete this review"});
        }
    }
    else {
        res.send({message: "Invalid request"});
    }

    res.send({message: "The review has been deleted"});
})

export default router;