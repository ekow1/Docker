import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted date
ItemSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Pre-save middleware to update updatedAt
ItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Item = mongoose.model('Item', ItemSchema);

export default Item;
