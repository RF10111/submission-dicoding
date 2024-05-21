// services/fetchPredictHistories.js
const { Firestore } = require('@google-cloud/firestore');

async function fetchPredictHistories() {
    const db = new Firestore();
    const snapshot = await db.collection('prediction').get();

    if (snapshot.empty) {
        return [];
    }

    const histories = snapshot.docs.map(doc => ({
        id: doc.id,
        history: doc.data()
    }));

    return histories;
}

module.exports = fetchPredictHistories;
