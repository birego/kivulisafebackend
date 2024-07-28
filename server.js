import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createReport, getReports } from './controllers/reportController.js';
import { createUser, loginUser, getUser } from './controllers/userController.js';
import { authenticateToken } from './middleware/authMiddleware.js';
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/report',createReport);
app.get('/reports', getReports);
app.post('/register', createUser);
app.post('/login', loginUser)
app.get('/user', authenticateToken, getUser);
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
