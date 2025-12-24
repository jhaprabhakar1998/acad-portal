const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        default: 0,
    },
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
        validate: {
            validator: function (value: any) {
                //To include country code for all countries along with + sign
                if (value.length > 14) {
                    return false;
                }
                // Define the phone number regex pattern
                const phoneRegex = /^(\+\d{1,3})?\s?(\(\d{1,4}\)|\d{1,4})\s?\d{1,9}[-\s]?\d{1,9}([-]\d{1,9})?$/;
                // Test the value against the regex pattern
                return phoneRegex.test(value);
            },
            message: (props: any) => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    }
},
    { timestamps: true });

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;