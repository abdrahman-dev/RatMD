import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../../model/userModel.js';
import refreshTokenModel from '../../model/refreshToken.js';
import {
    accessCookieOptions,
    refreshCookieOptions
} from '../../config/cookie.js';
import {
    generateAccessToken,
    generateRefreshToken
} from '../../utils/authTokens.js';
import { env } from '../../config/env.js';

// Returns basic API status to confirm the server is running
export const getApiStatus = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "API is working"
    });
};

export const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId).select('-password -openRouterApiKey');
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        return res.status(200).json({ success: true, data: user });
    } catch {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Verifies refresh token and issues a new access token if valid
export const refreshTokenController = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "No refresh token provided"
            });
        }
        // 1) Verify the refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token"
            });
        }
        // 2) Check DB for the refresh token isRevoked or expired
        const storedToken = await refreshTokenModel.findOne({ 
            token: refreshToken, 
            userId: decoded.userId,  
            expiresAt : { $gt: new Date() } 
        });

        if (!storedToken) {
            return res.status(401).json({ 
                success: false, 
                message: "Token not recognized or expired" 
            });
        }

        // Reuse detection — token exists but is revoked
        if (storedToken.isRevoked) {
            // Revoke all tokens for this user as a precaution
            await refreshTokenModel.updateMany(
                { userId: decoded.userId },
                { isRevoked: true }
            );

            console.warn(`[SECURITY] Refresh token reuse detected for userId: ${decoded.userId}. All sessions revoked.`);

            return res.status(401).json({
                success: false,
                message: "Session invalidated due to suspicious activity, please login again"
            });
        }

        // Check if user exists
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        // Revoke the old refresh token
        storedToken.isRevoked = true;
        await storedToken.save();

        // Generate both token
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Save the new refresh token in DB
        await refreshTokenModel.create({
            userId: user._id,
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        res.cookie('accessToken', newAccessToken, accessCookieOptions);
        res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error during token refresh"
        });
    }
};

// Registers a new user, hashes password, and sets auth cookies
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already in use"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await new userModel({
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken(user);

        await refreshTokenModel.create({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        res.cookie('accessToken', accessToken, accessCookieOptions);

        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};

// Authenticates user credentials and creates session with access/refresh tokens
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Save refresh token to database
        await refreshTokenModel.create({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        res.cookie('accessToken', accessToken, accessCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};

// Allows authenticated user to change their password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await userModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error during password change"
        });
    }
};

// Revokes refresh token in DB and clears auth cookies to end user session
export const logoutUser = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (token) {
            await refreshTokenModel.findOneAndUpdate(
                { token: token },
                { isRevoked: true }
            );
        }

        res.clearCookie('accessToken', accessCookieOptions);
        res.clearCookie('refreshToken', refreshCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error during logout"
        });
    }
};
