import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Para gerar UUIDs

// Definição do schema do usuário
const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String, // ou UUID, ou outro tipo que você preferir
      required: true,
      unique: true,
      default: uuidv4, // se você quiser um UUID como identificador
    },
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.id;
        return ret;
      },
    },
  }
); // timestamps para createdAt e updatedAt

// Criação do modelo
const User = mongoose.model("User", userSchema);

export default User;
