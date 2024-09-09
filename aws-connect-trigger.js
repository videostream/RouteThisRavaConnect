import { ConnectClient, DescribeUserCommand } from "@aws-sdk/client-connect"; // ES Modules import
import { KinesisVideoClient, DescribeStreamCommand, GetDataEndpointCommand } from "@aws-sdk/client-kinesis-video"; // ES Modules import
import https from 'https';

export const handler = async (event) => {
  const agentARN = event.Details.Parameters.AgentARN;
  const instanceARN = event.Details.ContactData.InstanceARN;
  const region = process.env('AWS_REGION');
  
  let agentDetails;
  
  if (agentARN && instanceARN) {
    const client = new ConnectClient({ region });
    const command = new DescribeUserCommand( {
      InstanceId  : instanceARN.split('/')[1],
      UserId      : agentARN.split('/')[3],
    });
    agentDetails = await client.send(command);
  }
  const streamARN = event.Details.ContactData.MediaStreams.Customer.Audio.StreamARN;
  let streamDetails, endPoint;
  if (agentDetails && streamARN) {
    const client = new KinesisVideoClient({ region });
    const command = new DescribeStreamCommand({
      StreamARN : streamARN
    });
    streamDetails = await client.send(command);
    
    const getDataEndpointCommand = new GetDataEndpointCommand({
      StreamARN : streamARN,
      APIName : 'GET_MEDIA'
    });
    endPoint = await client.send(getDataEndpointCommand);
  }
  
  if (streamDetails) {    
    const postData = {
        agentEmail : agentDetails,
        streamARN: streamARN,
        streamURL : endPoint.DataEndpoint
    };
    
    const res  = post("https://bxoyjubtpd.execute-api.us-east-1.amazonaws.com/main/transcribe", postData); // TODO: Update this to produrl
    
    await Promise.all([res]);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify('Success'),
  };
  return response;
};


function post(url, data) {
  const dataString = JSON.stringify(data)

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length,
    },
    timeout: 3500, // in ms
  }

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      if (res.statusCode < 200 || res.statusCode > 299) {
        return reject(new Error(`HTTP status code ${res.statusCode}`))
      }

      const body = []
      res.on('data', (chunk) => body.push(chunk))
      res.on('end', () => {
        const resString = Buffer.concat(body).toString()
        resolve(resString)
      })
    })

    req.on('error', (err) => {
      reject(err)
    })

    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request time out'))
    })

    req.write(dataString)
    req.end()
  })
}
