import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const projectSchema = new mongoose.Schema(
  {
    project_id: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },
    project_theme: {
      type: String,
      required: false,
    },
    project_area: {
      type: String,
      required: false,
    },
    target_audience: {
      type: String,
      required: false,
    },
    responsible_teacher: {
      type: String,
      required: false,
    },
    responsibleTeacherEmail: {
      type: String,
      required: false,
    },
    periodicity: {
      type: String,
      required: false,
    },
    available_vacancies: {
      type: Number,
      required: false,
    },
    workload: {
      type: Number,
      required: false,
    },
    createdBy: {
      type: String,
      required: true,
    },
    approvedBy: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["proposta", "disponível", "finalizado", "rejeitado"],
      required: true,
    },
    creatorName: {
      type: String,
      required: false,
    },
    creatorEmail: {
      type: String,
      required: false,
    },
    rejectionReason: {
      type: String,
      required: false,
    },
    description: {
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
);

// Middleware para definir status padrão com base em createdBy
projectSchema.pre("validate", function (next) {
  if (!this.status) {
    this.status = this.createdBy === "professor" ? "disponível" : "proposta";
  }
  next();
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
