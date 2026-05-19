import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { mockDb } from '../utils/mockDb.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Google Token is required' });
  }

  if (global.useMockDb) {
    try {
      const payload = jwt.decode(token);
      if (!payload) {
        throw new Error('Failed to decode Google Token');
      }
      const { name, email, picture: profilePicture } = payload;

      let user = mockDb.users.find(u => u.email === email);
      if (!user) {
        user = {
          _id: `mock-user-${Date.now()}`,
          name,
          email,
          profilePicture,
          createdAt: new Date(),
        };
        mockDb.users.push(user);
      }

      const jwtToken = jwt.sign(
        { id: user._id, email: user.email, name: user.name, profilePicture: user.profilePicture },
        process.env.JWT_SECRET || 'super_secret_jwt_key_hireform_12345',
        { expiresIn: '7d' }
      );
      return res.json({ token: jwtToken, user });
    } catch (e) {
      console.error('Mock Google Token Parsing Error', e);
      return res.status(500).json({ message: `Google Token Parsing Error: ${e.message}` });
    }
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, name, email, picture: profilePicture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        googleId,
        name,
        email,
        profilePicture,
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'super_secret_jwt_key_hireform_12345',
      { expiresIn: '7d' }
    );

    return res.json({ token: jwtToken, user });
  } catch (error) {
    console.error('Google Sign-in Error', error);
    return res.status(401).json({ message: 'Invalid Google OAuth Token' });
  }
};

export const devLogin = async (req, res) => {
  if (global.useMockDb) {
    const user = mockDb.users[0];
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'super_secret_jwt_key_hireform_12345',
      { expiresIn: '7d' }
    );
    return res.json({ token: jwtToken, user });
  }

  try {
    let user = await User.findOne({ email: 'guest.recruiter@hireform.io' });
    if (!user) {
      user = new User({
        name: 'Guest Recruiter',
        email: 'guest.recruiter@hireform.io',
        profilePicture: 'https://api.dicebear.com/7.x/initials/svg?seed=Guest%20Recruiter',
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'super_secret_jwt_key_hireform_12345',
      { expiresIn: '7d' }
    );

    return res.json({ token: jwtToken, user });
  } catch (error) {
    console.error('Guest Sign-in Error', error);
    return res.status(500).json({ message: 'Mock authentication failed' });
  }
};

export const getProfile = async (req, res) => {
  if (global.useMockDb) {
    let user = mockDb.users.find(u => u._id === req.user.id);
    if (!user && req.user.name) {
      user = {
        _id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
        createdAt: new Date(),
      };
      mockDb.users.push(user);
    }
    user = user || mockDb.users[0];
    return res.json({ user });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};
