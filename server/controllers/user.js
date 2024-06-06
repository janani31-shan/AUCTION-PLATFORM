const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // Check for existing user
    const { username, email, password, phone, address } = req.body;
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      username: username,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    // Save user
    await user.save();

    // Return jwt
    const payload = {
      user: {
        id: user._id,
        email,
        username,
      },
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, async (err, token) => {
      if (err) {
        throw err;
      }
      res.status(200).json({ token });

      // Sending a welcome email to the registered user
      try {
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASS
          },
        });

        const mailOptions = {
          from:  process.env.AUTH_EMAIL, // Replace with your Gmail email
          to: email,
          subject: 'Welcome to Our Website',
          html: `
    <html>
      <head>
        <style>
          /* Add your CSS styles here */
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0px 0px 10px 0px #888888;
          }
          h1 {
            color: #ff5722;
          }
          p {
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hello ${username},</h1>
          <p>Welcome to the heart and soul of our online community! 🚀</p>
          <p>We're absolutely thrilled to have you join us. Your journey with us is about to get even more exciting!</p>
          <p>🎉 Let's dive into a world of endless possibilities and discoveries together! 🌐</p>
          <p>Thank you for entrusting us with your online adventure. If you ever need a guiding hand or have any questions, don't hesitate to reach out.</p>
          <p>Cheers to new beginnings!</p>
          <p>Warm regards,<br>[Your Company Name]</p>
        </div>
      </body>
    </html>
  `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent to', email);
      } catch (emailErr) {
        console.error('Error sending welcome email:', emailErr);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: 'User already exists' }] });
  }
};

exports.getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id, { password: 0 });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: 'User already exists' }] });
  }
};

exports.purchasedProducts = async (req, res) => {
  const { user } = req;
  try {
    const fetchedUser = await User.findById(user.id);
    await fetchedUser.populate('purchasedProducts');
    res.status(200).json(fetchedUser.purchasedProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

exports.postedProducts = async (req, res) => {
  const { user } = req;
  try {
    const fetchedUser = await User.findById(user.id);
    await fetchedUser.populate('postedAds');
    res.status(200).json(fetchedUser.postedAds);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};
