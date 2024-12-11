import { HttpContext } from '@adonisjs/core/http'
import Twilio from 'twilio'
import { DateTime } from 'luxon'
import User from '#models/user'

// Twilio Configuration
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_VERIFICATION_SERVICE_SID = process.env.TWILIO_VERIFICATION_SERVICE_SID

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFICATION_SERVICE_SID) {
  throw new Error('Missing Twilio environment variables')
}

const twilioClient: any = new (Twilio as any)(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
export default class UsersController {
  /**
   * Send OTP for Registration
   */
  public async register({ request, response }: HttpContext) {
    const { phone, fullName } = request.only(['phone', 'fullName'])

    try {
      // Send OTP via Twilio
      await twilioClient.verify.services(TWILIO_VERIFICATION_SERVICE_SID).verifications.create({
        to: `+${phone}`,
        channel: 'sms',
      })

      return response.status(200).json({
        success: true,
        message: 'OTP sent to the provided phone number for registration',
        data: { phone, fullName },
      })
    } catch (error) {
      console.error('Error sending OTP:', error)
      return response.status(500).json({
        success: false,
        message: 'Failed to send OTP',
        error: error.message,
      })
    }
  }

  /**
   * Verify OTP and Create User
   */
  public async verifyRegistration({ request, response }: HttpContext) {
    const { phone, otp, fullName } = request.only(['phone', 'otp', 'fullName'])

    try {
      // Verify OTP using Twilio
      const verificationCheck = await twilioClient.verify
        .services(TWILIO_VERIFICATION_SERVICE_SID)
        .verificationChecks.create({
          to: `+${phone}`,
          code: otp,
        })

      if (verificationCheck.status !== 'approved') {
        return response.status(400).json({
          success: false,
          message: 'Invalid OTP',
        })
      }

      // Check if user already exists
      const existingUser = await User.findBy('phone', phone)
      if (existingUser) {
        return response.status(400).json({
          success: false,
          message: 'User already exists with this phone number',
        })
      }

      // Create new user
      const user = await User.create({
        phone,
        fullName,
        createdAt: DateTime.now(),
      })

      return response.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user,
      })
    } catch (error) {
      console.error('Error during registration verification:', error)
      return response.status(500).json({
        success: false,
        message: 'Failed to verify OTP or create user',
        error: error.message,
      })
    }
  }

  /**
   * Send OTP for Login
   */
  public async sendLoginOtp({ request, response }: HttpContext) {
    const { phone } = request.only(['phone'])

    try {
      // Check if user exists
      const user = await User.findBy('phone', phone)
      if (!user) {
        return response.status(404).json({
          success: false,
          message: 'User not found',
        })
      }

      // Send OTP via Twilio
      await twilioClient.verify.services(TWILIO_VERIFICATION_SERVICE_SID).verifications.create({
        to: `+${phone}`,
        channel: 'sms',
      })

      return response.status(200).json({
        success: true,
        message: 'OTP sent to the registered phone number',
      })
    } catch (error) {
      console.error('Error sending login OTP:', error)
      return response.status(500).json({
        success: false,
        message: 'Failed to send OTP',
        error: error.message,
      })
    }
  }

  /**
   * Verify OTP for Login and Generate Token
   */
  public async login({ request, response, auth }: HttpContext) {
    const { phone, otp } = request.only(['phone', 'otp'])

    try {
      // Verify OTP using Twilio
      const verificationCheck = await twilioClient.verify
        .services(TWILIO_VERIFICATION_SERVICE_SID)
        .verificationChecks.create({
          to: `+${phone}`,
          code: otp,
        })

      if (verificationCheck.status !== 'approved') {
        return response.status(400).json({
          success: false,
          message: 'Invalid OTP',
        })
      }

      // Find the user
      const user = await User.findBy('phone', phone)
      if (!user) {
        return response.status(404).json({
          success: false,
          message: 'User not found',
        })
      }

      // Generate a token
      const token = await User.accessTokens.create(user, ['*'], {
        name: request.input('token_name'),
        expiresIn: '2 hours',
      })
      return response.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user,
      })
    } catch (error) {
      console.error('Error during login:', error)
      return response.status(500).json({
        success: false,
        message: 'Failed to log in',
        error: error.message,
      })
    }
  }
}
