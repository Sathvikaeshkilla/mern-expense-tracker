const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Not required for OAuth users
  },
  githubId: {
    type: String,
    sparse: true,
    unique: true,
  },
  name: {
    type: String,
  },
  avatarUrl: {
    type: String,
  },
});

// ✅ Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  // Skip hashing if password is not modified or doesn't exist (OAuth users)
  if (!this.isModified('password') || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
