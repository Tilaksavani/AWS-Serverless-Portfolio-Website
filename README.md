# ☁️ AWS Serverless Portfolio Website

A fully serverless personal portfolio website built and deployed on AWS. The website is hosted using **Amazon S3** and **Amazon CloudFront**, and the contact form uses **API Gateway → Lambda → DynamoDB** to save messages without managing any server.

> This project was built to practice AWS Cloud Practitioner concepts such as cloud services, security, monitoring, serverless architecture, and cost management.

---

## 🔗 Live Demo

Add your deployed CloudFront URL here:

```text
https://d303g9auns1wab.cloudfront.net/
```

---

## 📌 Project Overview

This project demonstrates how multiple AWS services work together in a real cloud application:

- Static portfolio files are stored in **Amazon S3**
- **CloudFront** delivers the website globally using HTTPS
- The contact form sends data to **Amazon API Gateway**
- API Gateway triggers an **AWS Lambda** function written in Python
- Lambda stores contact messages in **Amazon DynamoDB**
- **CloudWatch** captures logs for debugging and monitoring
- **AWS Budgets** helps prevent unexpected billing
- **IAM** controls service permissions securely

---

## 🏗️ Architecture

```text
Browser
   │
   ▼
CloudFront (HTTPS + Global CDN)
   │
   ├── Static Files ───────────► S3 Bucket
   │                             index.html, style.css, script.js
   │
   └── POST /contact ─────────► API Gateway
                                  │
                                  ▼
                              Lambda Function
                              Python 3.12
                                  │
                                  ▼
                              DynamoDB Table
                              portfolio-contacts
                                  │
                                  ▼
                              CloudWatch Logs
```

---

## 🛠️ AWS Services Used

| Service | Purpose |
|---|---|
| **Amazon S3** | Stores and hosts static website files |
| **Amazon CloudFront** | Delivers the website globally with HTTPS |
| **Amazon API Gateway** | Provides the REST API endpoint for the contact form |
| **AWS Lambda** | Runs backend code without managing servers |
| **Amazon DynamoDB** | Stores contact form submissions |
| **AWS IAM** | Manages roles, policies, and service permissions |
| **Amazon CloudWatch** | Stores Lambda logs and helps debug errors |
| **AWS Budgets** | Sends alerts to control AWS spending |

---

## 📁 Project Structure

```text
portfolio/
├── website/
│   ├── index.html              # Portfolio frontend
│   ├── style.css               # Website styling
│   └── script.js               # Contact form logic and API call
├── lambda/
│   └── lambda_function.py      # Lambda handler that saves messages to DynamoDB
└── docs/
    └── DEPLOYMENT_GUIDE.md     # Step-by-step AWS Console setup
```

---

## ✨ Features

- Static portfolio website hosted on AWS
- Contact form connected to a serverless backend
- Messages stored in DynamoDB with unique ID and timestamp
- CloudFront CDN for faster global delivery
- HTTPS support through CloudFront
- CloudWatch logs for debugging form submissions
- IAM-based service permissions
- AWS Budget alert for cost control
- No server maintenance required

---

## 🚀 How the Contact Form Works

1. User fills out name, email, and message.
2. `script.js` sends a `POST` request to the API Gateway endpoint.
3. API Gateway triggers the Lambda function.
4. Lambda validates the input fields.
5. Lambda writes the message into DynamoDB.
6. DynamoDB stores the message with a unique ID and timestamp.
7. Lambda returns a success response.
8. The website displays a confirmation message to the user.
9. CloudWatch stores the Lambda execution logs.

---

## 🗄️ DynamoDB Item Structure

Each contact form submission is stored like this:

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "timestamp": "2026-06-08T15:08:03.000Z",
  "name": "Arun",
  "email": "arun78@gmail.com",
  "message": "Hi, I saw your portfolio!",
  "status": "new"
}
```

---

## ✅ Prerequisites

Before deploying this project, you need:

- AWS account
- Basic knowledge of S3, Lambda, API Gateway, DynamoDB, IAM, and CloudWatch
- Website files: `index.html`, `style.css`, and `script.js`
- Lambda function file: `lambda_function.py`
- AWS Budget alert enabled for safety

---

## ⚙️ Deployment Summary

Full step-by-step deployment instructions are available in:

```text
docs/DEPLOYMENT_GUIDE.md
```

### Quick Steps

1. **Create DynamoDB table**
   - Table name: `portfolio-contacts`
   - Partition key: `id`
   - Type: String

2. **Create IAM role for Lambda**
   - Attach `AWSLambdaBasicExecutionRole`
   - Add permission for Lambda to write to the `portfolio-contacts` table

3. **Create Lambda function**
   - Runtime: Python 3.12
   - Add code from `lambda/lambda_function.py`
   - Attach the Lambda IAM role

4. **Create API Gateway endpoint**
   - Create `POST /contact`
   - Connect it to the Lambda function
   - Enable CORS
   - Deploy the API

5. **Update frontend API endpoint**
   - Add your API Gateway invoke URL inside `website/script.js`

6. **Upload website files to S3**
   - Upload `index.html`, `style.css`, and `script.js`
   - Configure static website hosting or use CloudFront origin setup

7. **Create CloudFront distribution**
   - Set S3 as the origin
   - Enable HTTPS
   - Use the CloudFront domain as the public website URL

8. **Create AWS Budget**
   - Set a small monthly budget such as `$1`, `$5`, or `$10`
   - Enable email alerts

---

## 🔐 IAM Security Note

For learning, broad permissions like `AmazonDynamoDBFullAccess` may work, but the better practice is to use **least privilege**.

A safer Lambda policy should allow only the actions needed for this project, such as writing to the specific DynamoDB table.

Example policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem"
      ],
      "Resource": "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/portfolio-contacts"
    }
  ]
}
```

Replace:

```text
REGION     → your AWS region, for example us-east-1
ACCOUNT_ID → your AWS account ID
```

This is more secure because Lambda can write only to the required table instead of accessing every DynamoDB resource.

---

## 🧪 Testing

### Test the API

After deploying API Gateway, test the contact endpoint with a sample request:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "message": "Testing contact form from AWS portfolio project"
}
```

Expected result:

```json
{
  "message": "Message sent successfully"
}
```

### Verify the result

Check these places:

- DynamoDB table should contain the new message
- CloudWatch should show Lambda execution logs
- Website should show a success message after form submission

---

## 🔧 Local Development

The website files are plain HTML, CSS, and JavaScript. No build step is required.

### macOS

```bash
open website/index.html
```

### Windows

```bash
start website/index.html
```

To test the contact form locally, temporarily set `API_ENDPOINT` in `script.js` to your API Gateway URL.

---

## 🧯 Common Issues and Fixes

| Issue | Possible Reason | Fix |
|---|---|---|
| Contact form fails | Wrong API Gateway URL | Check `API_ENDPOINT` in `script.js` |
| CORS error | CORS not enabled in API Gateway | Enable CORS and redeploy the API |
| Lambda error | Missing IAM permission | Allow Lambda to write to DynamoDB |
| No data in DynamoDB | Lambda code/table name mismatch | Check table name in Lambda code |
| Website not updating | CloudFront cache | Create a CloudFront invalidation |
| Access denied on website | S3/CloudFront permission issue | Check bucket policy or origin access settings |

---

## 💰 Cost Management

This project is designed to stay low-cost for personal use.

Recommended cost controls:

- Enable AWS Free Tier alerts
- Create an AWS Budget alert
- Delete unused resources after testing
- Monitor usage in the Billing dashboard
- Check CloudWatch logs if Lambda is being triggered unexpectedly

Expected monthly cost is usually close to `$0` for low-traffic personal usage, but actual cost depends on AWS region, usage, and current AWS pricing.

---

## 🧹 Cleanup

To avoid future charges, delete unused resources when you no longer need the project:

1. Delete CloudFront distribution
2. Delete S3 bucket contents and bucket
3. Delete API Gateway API
4. Delete Lambda function
5. Delete DynamoDB table
6. Delete unused IAM roles and policies
7. Delete or update AWS Budget alerts

---

## 📋 What I Learned

- How AWS services connect together in a real serverless application
- How S3 stores static website files
- How CloudFront improves delivery using a CDN
- How API Gateway exposes a backend endpoint
- How Lambda runs backend code without server management
- How DynamoDB stores NoSQL data
- How IAM roles control access between AWS services
- How CloudWatch helps with logs and debugging
- How AWS Budgets helps with cost control
- How to think about AWS architecture from frontend to backend

---

## 📸 Screenshots

Add screenshots here before uploading to GitHub:

```text
1. Portfolio homepage
2. Contact form
3. API Gateway endpoint
4. Lambda function
5. DynamoDB saved message
6. CloudWatch logs
7. AWS Budget alert
```

---

## 📚 AWS Cloud Practitioner Concepts Covered

| CLF-C02 Domain | Project Component |
|---|---|
| Cloud Concepts | Serverless architecture, scalability, pay-per-use model |
| Security and Compliance | IAM roles, least-privilege access, HTTPS |
| Cloud Technology and Services | S3, CloudFront, API Gateway, Lambda, DynamoDB, CloudWatch |
| Billing, Pricing, and Support | AWS Free Tier awareness, AWS Budgets, cost monitoring |

---

## 📄 Resume Description

Built and deployed a serverless portfolio website on AWS using S3, CloudFront, API Gateway, Lambda, and DynamoDB. Configured IAM roles for secure service-to-service access, implemented a contact form backend with Python Lambda, monitored logs using CloudWatch, and created AWS Budgets for cost control.

---

## 🚀 Future Improvements

- Add a custom domain using Route 53
- Add AWS Certificate Manager for a custom HTTPS certificate
- Add email notifications using Amazon SES
- Add CAPTCHA/spam protection for the contact form
- Add CI/CD deployment using GitHub Actions
- Add Infrastructure as Code using AWS SAM, CloudFormation, or Terraform

---

## 🧠 Final Takeaway

This project is not just a portfolio website. It is a beginner-friendly AWS cloud architecture that connects storage, CDN, API, compute, database, security, monitoring, and billing concepts in one practical project.

---

Built with AWS Free Tier awareness — Hosted on S3 · Delivered by CloudFront · Powered by Lambda
