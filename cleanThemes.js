const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "palm_oil_data";

(async () => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("data_sources");

    // Find all documents that contain the theme field
    const cursor = collection.find({ theme: { $exists: true } });

    let updated = 0;
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      const cleanedThemes = doc.theme.map(t => t.replace(/^[-–]\s*/, "").trim());
      
      // Only update if anything actually changed
      if (JSON.stringify(cleanedThemes) !== JSON.stringify(doc.theme)) {
        await collection.updateOne(
          { _id: doc._id },
          { $set: { theme: cleanedThemes } }
        );
        updated++;
      }
    }

    console.log(`✅ Cleaned theme field in ${updated} document(s).`);
  } catch (error) {
    console.error("❌ Error cleaning theme data:", error);
  } finally {
    await client.close();
  }
})();
