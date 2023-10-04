const express = require('express');
const Joi = require("joi");
const router = express.Router();

const issues = [
    {id: 1, title: 'title 1', description: 'description 1'},
    {id: 2, title: 'title 2', description: 'description 2'},
    {id: 3, title: 'title 3', description: 'description 3'},
];

router.get('/', (req, res) => {
    res.send(issues);
});

router.post('/', (req, res) => { // POST request
    const {error} = validateIssue(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const issue = {
        id: issues.length + 1,
        title: req.body.title,
        description: req.body.description
    };
    issues.push(issue);
    res.status(201).send(issue);
});

router.put('/:id', (req, res) => { // PUT request
    const issue = issues.find(c => c.id === parseInt(req.params.id));
    if (!issue) {
        res.status(404).send('The issue with the given ID was not found');
    } else {
        const {error} = validateIssue(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        issue.description = req.body.description;
        issue.title = req.body.title;
        res.send(issue);
    }
});

router.get('/:id', (req, res) => { // :id is a route parameter
    const issue = issues.find(c => c.id === parseInt(req.params.id));
    if (!issue) {
        res.status(404).send('The issue with the given ID was not found');
    } else {
        res.send(issue);
    }
});

router.delete('/:id', (req, res) => { // DELETE request
    const issue = issues.find(c => c.id === parseInt(req.params.id));
    if (!issue) {
        res.status(404).send('The issue with the given ID was not found');
    } else {
        const index = issues.indexOf(issue);
        issues.splice(index, 1);
        res.send(issue);
    }
});

function validateIssue(data) {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        description: Joi.string().min(10).required()
    });
    return schema.validate(data);
}

module.exports = router;
