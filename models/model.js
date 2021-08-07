const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');


const kittySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmpassword: {
        type: String,
        required: true,
    }
});

kittySchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        // let hash = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, 10)
        this.confirmpassword = await bcrypt.hash(this.password, 10)
    }
    next();
})

const User = mongoose.model('User', kittySchema);

module.exports = User;