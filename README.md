# RouteThisRavaConnect

Steps:

- Copy aws-connect-trigger.js to a new lambda function
  - Give the lambda function the permissions shown here:
- Create a kinesis video stream
  - Add it to your AWS Connect configuration as shown:
- Update your aws connect flow to start the stream and trigger the lambda function

- Update your IAM permissions to support cross account access : https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/how-iam.html#how-iam-crossaccount

- Send us the ARN created in the previous step
