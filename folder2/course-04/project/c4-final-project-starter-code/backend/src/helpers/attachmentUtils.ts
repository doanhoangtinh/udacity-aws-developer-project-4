import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import * as AWSXRay from 'aws-xray-sdk'
// import { DocumentClient } from 'aws-sdk/clients/dynamodb'


const XAWS = AWSXRay.captureAWS(AWS)

// const docClient = new XAWS.DynamoDB.DocumentClient()
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})


export class AttachmentUtils {

  constructor(
    // private readonly docClient: DocumentClient = createDynamoDBClient(),
    // private readonly todosTable = process.env.TODOS_TABLE,
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) {}


  async createAttachmentURL(){
    var attachmentId = uuid.v4()
    var imageUrl = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
    return imageUrl
  }

  getAttachmentUrl(attachmentId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: attachmentId,
      Expires: this.urlExpiration
    })
  }
}

