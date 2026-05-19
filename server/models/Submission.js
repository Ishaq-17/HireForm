import mongoose from 'mongoose';

const ResponseSchema = new mongoose.Schema({
  fieldLabel: {
    type: String,
    required: true,
  },
  fieldType: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    default: '',
  },
});

const SubmissionSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
      required: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    responses: [ResponseSchema],
    status: {
      type: String,
      enum: ['New', 'Reviewed', 'Shortlisted', 'Rejected'],
      default: 'New',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Submission', SubmissionSchema);
