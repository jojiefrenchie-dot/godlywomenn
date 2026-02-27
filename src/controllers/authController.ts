import { Response } from 'express';
import { generateTokens, verifyRefreshToken } from '../config/auth';
import { AuthRequest } from '../config/auth';

// In-memory user storage for testing (no DB required)
const mockUsers: Map<string, any> = new Map();

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    if (mockUsers.has(email)) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    const userId = 'user_' + Date.now();
    mockUsers.set(email, {
      id: userId,
      email,
      password,
      name: name || 'Test User'
    });

    const { accessToken, refreshToken } = generateTokens(userId, email);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userId,
        email: email,
        name: name || 'Test User'
      },
      access: accessToken,
      refresh: refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = mockUsers.get(email);

    if (!user || user.password !== password) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const { accessToken,refreshToken } = generateTokens(user.id, email);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      access: accessToken,
      refresh: refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const refresh = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }

    const user = Array.from(mockUsers.values()).find((u: any) => u.id === decoded.id);

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.email);

    res.json({
      access: accessToken,
      refresh: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ message: 'Token refresh failed' });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ message: 'Logout successful' });
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    if (!userId || !userEmail) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = mockUsers.get(userEmail);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    const { name } = req.body;

    if (!userId || !userEmail) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = mockUsers.get(userEmail);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (name) {
      user.name = name;
    }

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

export const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = Array.from(mockUsers.values()).find((u: any) => u.id === id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'User not found' });
  }
};
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    if (mockUsers.has(email)) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    const userId = 'user_' + Date.now();
    mockUsers.set(email, {
      id: userId,
      email,
      password,
      name: name || 'Test User'
    });

    const { accessToken, refreshToken } = generateTokens(userId, email);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userId,
        email: email,
        name: name || 'Test User'
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // For testing: create user on first login
    let user = mockUsers.get(email);
    if (!user) {
      const userId = 'user_' + Date.now();
      user = {
        id: userId,
        email,
        password,
        name: 'Test User'
      };
      mockUsers.set(email, user);
    }

    const { accessToken, refreshToken } = generateTokens(user.id, email);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const refresh = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token required' });
      return;
    }

    // Mock refresh - just issue new tokens
    const { accessToken: newAccessToken } = generateTokens('mock_user', 'test@example.com');
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ message: 'Token refresh failed' });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ message: 'Logout successful' });
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get user from token
    const userId = req.user?.id || 'mock_user';
    const userEmail = req.user?.email || 'test@example.com';

    res.json({
      id: userId,
      email: userEmail,
      name: 'Test User'
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

export const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({
      id: 'user_123',
      email: 'test@example.com',
      name: 'Test User'
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'User not found' });
  }
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    if (!validatePassword(password)) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const user = new User({
      email,
      password,
      name: name || ''
    });

    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.email);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // For testing without MongoDB: accept any email/password combo
    // In production, this would query the database
    console.log('[AUTH] Login attempt:', email);

    // Mock user data for testing
    const mockUserId = 'test-user-123';
    const { accessToken, refreshToken } = generateTokens(mockUserId, email);

    res.json({
      message: 'Login successful',
      user: {
        id: mockUserId,
        email: email,
        name: 'Test User',
        image: null
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refresh = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token required' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || !user.is_active) {
      res.status(401).json({ error: 'User not found or inactive' });
      return;
    }

    const tokens = generateTokens(user._id.toString(), user.email);

    res.json({ tokens });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ message: 'Logged out successfully' });
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      image: user.image,
      location: user.location,
      website: user.website,
      facebook: user.facebook,
      twitter: user.twitter,
      instagram: user.instagram,
      created_at: user.created_at
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { name, bio, location, website, facebook, twitter, instagram } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (facebook !== undefined) user.facebook = facebook;
    if (twitter !== undefined) user.twitter = twitter;
    if (instagram !== undefined) user.instagram = instagram;

    // Handle image upload
    if (req.file) {
      user.image = `/media/${req.file.filename}`;
    }

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        image: user.image,
        location: user.location,
        website: user.website,
        facebook: user.facebook,
        twitter: user.twitter,
        instagram: user.instagram
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      image: user.image,
      location: user.location,
      website: user.website,
      facebook: user.facebook,
      twitter: user.twitter,
      instagram: user.instagram,
      created_at: user.created_at
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};
