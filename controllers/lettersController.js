const lettersModel = require("../models/lettersModel");
const catchAsync = require("../utils/catchAsync");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

exports.getLetters = catchAsync(async(req, res, next) => {
    const { page = 1, limit = 25, ...criteria } = req.query;
    lettersModel.getLetterByCriteria(criteria, parseInt(page), parseInt(limit), (err, letters) => {
        res.json(letters);
    });
});


exports.getLettersStream = catchAsync(async(req, res, next) => {
    const { ...criteria } = req.query;

    const filename = `letters_${uuidv4()}.jsonl`;

    res.setHeader('Content-Type', 'application/jsonl');
    res.setHeader('Transfer-Encoding', 'chunked');

    lettersModel.getAllLettersByCriteria(criteria, res, (err, result) => {
        if (err) return next(err);
        res.end();
    });
});

