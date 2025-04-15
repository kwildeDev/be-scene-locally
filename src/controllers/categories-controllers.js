const { request, response } = require('express');
const { fetchCategories } = require('../models/categories-models');
const app = require('../app');

exports.getCategories = (request, response, next) => {
    fetchCategories()
        .then((categories) => {
            response.status(200).send({ categories });
        })
        .catch((err) => {
            next(err);
        });
};
