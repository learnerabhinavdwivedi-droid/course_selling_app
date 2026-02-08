const express = require('express');
const app = express();

const {courseRouter} = require('./routes/course');
const {userRouter} = require('./routes/user');
const {adminRouter} = require('./routes/admin');

app.use(express.json());

// Mount routers
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);

app.use('/api/v1/course', courseRouter);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Course Selling API');
});

app.listen(3005, () => {
  console.log('Server running on port 3005');
});
