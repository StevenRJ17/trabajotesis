const mongoose = require('mongoose');

const buildMatchStage = (filters) => {
    const matchConditions = {};

    // Filtro por psicólogo
    if (filters.psychologistId) {
        matchConditions.psychologist = new mongoose.Types.ObjectId(filters.psychologistId);
    }

    // Filtro por fechas
    // El frontend nos envía 'YYYY-MM-DD', necesitamos convertirlo a un rango UTC
    if (filters.startDate && filters.endDate) {
        const startDate = new Date(filters.startDate + 'T00:00:00.000Z');
        const endDate = new Date(filters.endDate + 'T23:59:59.999Z');

        // Comprobamos si las fechas son válidas
        if (!isNaN(startDate) && !isNaN(endDate)) {
            matchConditions.date = { $gte: startDate, $lte: endDate };
        } else {
            console.error('Error: Fechas de filtro no válidas.');
        }
    }

    if (filters.career) {
        matchConditions['studentInfo.career'] = filters.career;
    }

    if (filters.gender) {
        matchConditions['studentInfo.gender'] = filters.gender;
    }

    if (Object.keys(matchConditions).length > 0) {
        return { $match: matchConditions };
    }

    return null;
};

module.exports = {
    buildMatchStage,
};