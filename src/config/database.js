import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conectado ao MongoDB");
  } catch (err) {
    console.error("❌ Erro ao conectar no MongoDB:", err.message);
    process.exit(1);
  }
};

export { connectDB };
