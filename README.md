# RouteThisRavaConnect

Steps:

- Copy aws-connect-trigger.js to a new lambda function
  - Give the lambda function the permissions shown here:
  ![alt text](https://github.com/videostream/RouteThisRavaConnect/blob/main/docImages/lambdaPermission.png?raw=true)
  ![alt text](https://github.com/videostream/RouteThisRavaConnect/blob/main/docImages/lambdaPermission2.png?raw=true)
- Create a kinesis video stream
  - Add it to your AWS Connect configuration as shown:
  ![alt text](https://github.com/videostream/RouteThisRavaConnect/blob/main/docImages/connectFlows.png?raw=true)
- Update your aws connect flow to start the stream and trigger the lambda function
  ![alt text](https://github.com/videostream/RouteThisRavaConnect/blob/main/docImages/connectFlows.png?raw=true)

- Update your IAM permissions to support cross account access : https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/how-iam.html#how-iam-crossaccount
  - When Updating the permissions set the role's `Maximum session duration` to `12 hours` as seen here 
  ![alt text](https://github.com/videostream/RouteThisRavaConnect/blob/main/docImages/sessionDuration.png?raw=true)

- Send us the ARN created in the previous step


