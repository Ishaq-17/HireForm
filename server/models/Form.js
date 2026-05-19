import mongoose from 'mongoose';

const FieldSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Short Text', 'Long Text', 'Dropdown', 'File Upload'],
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  options: [
    {
      type: String,
    },
  ],
});

const FormSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    fields: [FieldSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Form', FormSchema);
