// handler.js
const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const InputError = require('../exceptions/InputError');
const fetchPredictHistories = require('../services/fetchPredictHistories');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    // Check image size
    if (image._data.length > 1000000) {
        throw new InputError("Payload content length greater than maximum allowed: 1000000", 413);
    }

    try {
        const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            "id": id,
            "result": label,
            "explanation": explanation,
            "suggestion": suggestion,
            "confidenceScore": confidenceScore,
            "createdAt": createdAt
        }

        await storeData(id, data);

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data
        }).code(201);
    } catch (error) {
        if (error instanceof InputError) {
            throw error;
        } else {
            throw new InputError("Terjadi kesalahan dalam melakukan prediksi", 400);
        }
    }
}

async function getPredictHistoriesHandler(request, h) {
    try {
        const histories = await fetchPredictHistories();
        return h.response({
            status: 'success',
            data: histories
        });
    } catch (error) {
        throw new Error("Failed to fetch prediction histories");
    }
}

module.exports = {
    postPredictHandler,
    getPredictHistoriesHandler
};
