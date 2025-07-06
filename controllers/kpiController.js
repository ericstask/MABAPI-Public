const kpiModel = require("../models/kpiModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getEmployees = catchAsync(async(req, res, next) => {
    const criteria = req.query;
    kpiModel.getEmployeesByCriteria(criteria, (err, users) => {
        res.json(users);
    });
});

exports.getDesks = catchAsync(async(req, res, next) => {
    const criteria = req.query;
    kpiModel.getDesksByCriteria(criteria, (err, users) => {
        res.json(users);
    });
});

exports.getTrans = catchAsync(async(req, res, next) => {
    const criteria = req.query;
    kpiModel.getTransByCriteria(criteria, (err, users) => {
        res.json(users);
    });
});


exports.getPayForPerformance = catchAsync(async(req, res, next) => {
    const { startDate, endDate, employeeIds } = req.body;

    if (!employeeIds || !startDate || !endDate) {
        return next(new AppError('Missing required parameters', 404));
    }
    
    if (!Array.isArray(employeeIds) || !employeeIds.every(Number.isInteger)) {
        return next(new AppError('Invalid Employee IDs', 404));
    }

    kpiModel.getPayForPerformanceData(startDate, endDate, employeeIds, (err, records) => {
        if (err) {
            console.error('Error fetching records: ', err);
            return next(new AppError('Failed to retrieve records', 500));
        }

        res.json(records);
    });
});


exports.getCIAndBOAPostdates = catchAsync(async(req, res, next) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (!startDate || !endDate) {
        return next(new AppError('Missing required parameters', 404));
    }

    kpiModel.getCIAndBOAPostdatesData(startDate, endDate, (err, records) => {
        if (err) {
            console.error('Error fetching records: ', err);
            return next(new AppError('Failed to retrieve records', 500));
        }

        res.json(records);
    });
});

exports.getMABAndTUMPostdates = catchAsync(async(req, res, next) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (!startDate || !endDate) {
        return next(new AppError('Missing required parameters', 404));
    }

    kpiModel.getMABAndTUMPostdatesData(startDate, endDate, (err, records) => {
        if (err) {
            console.error('Error fetching records: ', err);
            return next(new AppError('Failed to retrieve records', 500));
        }

        res.json(records);
    });
});

exports.getDetailedPosted = catchAsync(async(req, res, next) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (!startDate || !endDate) {
        return next(new AppError('Missing required parameters', 404));
    }

    kpiModel.getDetailedPostedData(startDate, endDate, (err, records) => {
        if (err) {
            console.error('Error fetching records: ', err);
            return next(new AppError('Failed to retrieve records', 500));
        }

        res.json(records);
    });
});

exports.getDetailedEmployees = catchAsync(async(req, res, next) => {
    kpiModel.getDetailedEmployeeData((err, records) => {
        if (err) {
            console.error('Error fetching records: ', err);
            return next(new AppError('Failed to retrieve records', 500));
        }

        res.json(records);
    });
});
