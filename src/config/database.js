import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'extesys'
    });
    console.log("✅ Conectado ao MongoDB");
    console.log("🔍 Mongo URI:", process.env.MONGO_URI);

  } catch (err) {
    console.error("❌ Erro ao conectar no MongoDB:", err.message);
    process.exit(1);
  }
};

export { connectDB };
