const { request, response } = require('express');
const { fetchSubcategories } = require('../models/subcategories-models');
const app = require('../app');

exports.getSubcategories = (request, response, next) => {
    fetchSubcategories()
        .then((subcategories) => {
            response.status(200).send({ subcategories });
        })
        .catch((err) => {
            next(err);
        });
};
