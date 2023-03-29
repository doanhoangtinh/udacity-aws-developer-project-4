
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJRmX1DQCfEYmLMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi11NWcyamp0ZGF3eHoyeWJrLnVzLmF1dGgwLmNvbTAeFw0yMzAzMTQw
NjM2MDhaFw0zNjExMjAwNjM2MDhaMCwxKjAoBgNVBAMTIWRldi11NWcyamp0ZGF3
eHoyeWJrLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAKbHSFsqmkJdEB0inAGewgxtGnsn64E0yga6q2K9xnyVzx6IXRWO5RI9zq9/
UTheeBa+ZXG6sWL6tUKXKCxjVkDMhLcxaqRkqpMRLfumDrL7nS3pZgewbuSni2A3
g525qTjO7CX38iO63s0/5mtvAf21jXBk4xtzhGTlhv1lcaJh1LuBtP/L/0CKv5bN
gcxtFTCQJRbTEmsQNAbkQj9EdOImeIGAT+ClId9OCU4hGNdYl8MuazkZyNvyruDE
xTnvdyF1ugQCNsHrcvPq6b1qbEURwXQnWJhhZvgSfE+C1h2MU8vT7qhf2MkhqTuo
j4RP61UGcl8J/JjLnl0T8yBPhJ0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUVyaAkH9C2NsGgIzwFivzTcONNiIwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBQkR2UIpQJRrKuY1khzyNQMW6Ke77BP7P5zESX9Hjq
BVnE5ujF5KhSDGeaOdC7Z6n6jebBIpWffo+kYPVLNPiFG3UWoHXyZUQQUN5GTMhF
9tpd1Ir7wQCi/+nELVHrFYUmZVwBxBpPwyIdSYGHV4riSRmoTBR4TXXRPEqsygd2
fmJifWL0fxClYtjg90/BU7RFBbfs9/jG/gwmijJS/5lDlnJrH6z6Als3gaVib379
+fBjvq5T15+gPhz3pZgRQD/YlegfWRVqt/qw1un3FSloRF/fnD08y8RNrDvRHGok
9Ga/Nbyp70vGSczgAmyv6+exCGWci1TmfX3BcilJotJL
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    console.log(event.authorizationToken)
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
