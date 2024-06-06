const express = require('express');
const moment = require('./middlewares/timezoneConfig');
require('dotenv').config();
const connectDb = require('./db/dbconnect');
const { createServer } = require('http');
const multer = require('multer');
const socketio = require('./socket');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./documentation/swaggerSetup');
const cron = require('node-cron');
const axios = require('axios');
const Ad = require('./models/Ad'); // Import your Ad model

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");

const app = express();
const server = createServer(app);
const io = socketio.init(server);
const adIo = socketio.initAdIo(server, '/socket/adpage');
const upload = multer({ dest: 'uploads/' });

// Body parser
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

// Documentation setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Default route
app.get('/', (req, res, next) => {
  res.send('Server running');
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/ad', require('./routes/ad'));
app.use('/bid', require('./routes/bid'));
app.use('/room', require('./routes/room'));
app.use('/auction', require('./routes/auction'));
app.use('/upload', require('./routes/uploads'));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
// Socket.io setup
const PORT = process.env.PORT || 3000;
io.on('connection', (socket) => {
  // console.log('### Socket IO client connected');
  socket.on('disconnect', (reason) => {
    // console.log('### Socket IO client disconnected');
  });
  socket.on('leaveHome', () => {
    socket.disconnect();
  });
});
adIo.on('connect', (socket) => {
  // socket.join('testroom')
  socket.on('joinAd', ({ ad }) => {
    socket.join(ad.toString());
    console.log(`User joined room ${ad}`);
  });
  socket.on('leaveAd', ({ ad }) => {
    socket.leave(ad.toString());
    console.log(`Left room ${ad}`);
  });
  socket.on('disconnect', () => {
    console.log('User has disconnect from ad');
  });
});
// Connect DB and Initialize server
connectDb();
server.listen(PORT, () => {
  console.log(`### Server running on port ${PORT}`);
});
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});


// cron.schedule('* * * * * *', async () => {
//   try {
//     const currentTime = moment().unix(); // Current time in Unix timestamp
//     // console.log("[INFO] currentTime", currentTime)
//     let data = { startTime: currentTime}
//     const adsToTrigger = await Ad.find(data);
//     for (const ad of adsToTrigger) {
//       const adId = ad._id; // Adjust this based on your data structure
//       const url = `${process.env.SERVER_BASE_URL}/auction/start/${adId}`; // Replace with your actual URL
//       let res = await axios.get(url);
//       console.log("[INFO] res", res);
//       console.log(`HTTP GET request triggered for ad ${adId}`);
//     }
//     // console.log('Scheduled task executed successfully.');
//   } catch (error) {
//     console.error('Error in scheduled task:', error);
//   }
// });
cron.schedule('* * * * * *', async () => {
  try {
    const currentTime = moment().unix(); // Current time in Unix timestamp
    // console.log("[INFO] Current Time:", moment.unix(currentTime).format("YYYY-MM-DD HH:mm:ss"));
    // Find ads where startTime is less than or equal to the current time
    let adsToTrigger = await Ad.find({ startTime: currentTime });
    
    // console.log("[INFO] [INFO] CRON Job Checking Time:", currentTime, adsToTrigger);
    for (const ad of adsToTrigger) {
      const adId = ad._id; // Adjust this based on your data structure
      const url = `${process.env.SERVER_BASE_URL}/auction/start/${adId}`; // Replace with your actual URL
      const response = await axios.get(url);

      if (response.status === 200) {
        console.log(`HTTP GET request triggered for ad ${adId}`);
      } else {
        console.error(`Error triggering HTTP GET request for ad ${adId}: ${response.status} - ${response.statusText}`);
      }
    }

    // console.log('Scheduled task executed successfully.');
  } catch (error) {
    console.error('Error in scheduled task:', error);
  }
});

