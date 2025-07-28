import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { registerSchema, loginSchema } from '../middlewares/auth.js';
import * as authService from '../services/auth.js';
import { generateTokens, saveSession, deleteSessionByUserId, findSessionByRefreshToken, deleteSessionById } from '../services/session.js';

export async function registerController(req, res, next) {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.details[0].message);
    }

    const { name, email, password } = value;

    const userExists = await authService.getUserByEmail(email);
    if (userExists) {
      throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await authService.createUser({ name, email, password: hashedPassword });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: userResponse,
    });
  } catch (err) {
    next(err);
  }
}

export async function loginController(req, res, next) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.details[0].message);
    }

    const { email, password } = value;

    const user = await authService.getUserByEmail(email);
    if (!user) {
      throw createHttpError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, 'Invalid email or password');
    }

  
    await deleteSessionByUserId(user._id);

    const { accessToken, refreshToken: newRefreshToken, accessTokenExp, refreshTokenExp } = generateTokens(user._id);

   
    await saveSession({
      userId: user._id,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: accessTokenExp,
      refreshTokenValidUntil: refreshTokenExp,
    });

    
    res.cookie('refreshToken', newRefreshToken,{
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, 
      sameSite: 'strict',
    });
    
res.status(200).json({
  status: 200,
  message: 'Successfully logged in an user!',
  data: {
    accessToken,
    refreshToken: newRefreshToken,
  },
});

  } catch (err) {
    next(err);
  }
}


export async function refreshController(req, res, next) {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token missing');
    }

 
    const session = await findSessionByRefreshToken(refreshToken);
    if (!session) {
      throw createHttpError(401, 'Invalid refresh token');
    }


    await deleteSessionById(session._id);

    const userId = session.userId;

 
    const { accessToken, refreshToken: newRefreshToken, accessTokenExp, refreshTokenExp } = generateTokens(userId);

    
    await saveSession({
      userId,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: accessTokenExp,
      refreshTokenValidUntil: refreshTokenExp,
    });


    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
}


export async function logoutController(req, res, next) {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(204).send();
    }

    
    const session = await findSessionByRefreshToken(refreshToken);
    if (session) {
      await deleteSessionById(session._id);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
