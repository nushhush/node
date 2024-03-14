// middleware/authenticateUser.js

import User from '../models/user.js';

const authenticateUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are present in the request body
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required for authentication' });
    }

    // Find the user in the database
    const foundUser = await User.findOne({ username, password });

    // Check if the user exists
    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Set user information on the request object for future routes to access
    req.user = foundUser;

    // Continue to the next middleware or route
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default authenticateUser;
