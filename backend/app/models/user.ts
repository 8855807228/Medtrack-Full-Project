import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

// Add authentication capabilities to the model
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['phone'], // Use 'phone' as the unique identifier
  passwordColumnName: 'password', // Add password column
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare phone: number // Reflect 'phone' as a required and unique field

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Attach access token functionality to this model
  static accessTokens = DbAccessTokensProvider.forModel(User)
}
