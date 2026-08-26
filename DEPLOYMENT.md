# ☁️ LOST IN THE CLOUD — Deployment & Operations Guide

**LOST IN THE CLOUD** is a cinematic, narrative-driven AWS cloud engineering simulation game built for college AWS Cloud Clubs.

---

## 🛠️ 1. Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Getting Started
```bash
# 1. Clone repository
git clone https://github.com/aws-cloud-club/lost-in-the-cloud.git
cd lost-in-the-cloud

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
The game will start locally at **`http://localhost:5173/`**.

---

## 📦 2. Production Build

To test and compile the production bundle:
```bash
npm run build
```
This generates the optimized production bundle in the `dist/` directory (compressed gzip JavaScript and CSS assets, pre-rendered HTML, and zero unnecessary runtime dependencies).

To preview the production bundle locally:
```bash
npm run preview
```

---

## 🚀 3. AWS Amplify Hosting Deployment (Recommended)

### Method A: AWS Amplify Console (Continuous Git Deployment)
1. Push the repository to GitHub / GitLab / AWS CodeCommit.
2. Sign in to the **AWS Management Console** and navigate to **AWS Amplify**.
3. Click **Host web app** $\rightarrow$ select your Git provider $\rightarrow$ select the `main` branch.
4. Amplify will automatically detect the build settings from [`amplify.yml`](./amplify.yml):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
5. Click **Save and Deploy**. Your web app will be live on a custom `.amplifyapp.com` domain with global CDN edge distribution and automated SSL/TLS certificates.

### Single Page App (SPA) Rewrites on Amplify
Add this redirect rule in **Amplify Console $\rightarrow$ Rewrites and redirects**:
- **Source address**: `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>`
- **Target address**: `/index.html`
- **Type**: `200 (Rewrite)`

---

## 🌐 4. Alternative AWS Hosting (Amazon S3 + Amazon CloudFront)

1. Build the production files: `npm run build`
2. Create an Amazon S3 Bucket: `aws s3 mb s3://lost-in-the-cloud-prod`
3. Upload the `dist/` folder:
   ```bash
   aws s3 sync dist/ s3://lost-in-the-cloud-prod --delete
   ```
4. Create an **Amazon CloudFront Distribution** pointing to the S3 bucket with OAC (Origin Access Control).
5. Set the CloudFront Custom Error Response:
   - **HTTP Error Code**: `403` and `404`
   - **Response Page Path**: `/index.html`
   - **HTTP Response Code**: `200`

---

## 🔒 5. Security & Credentials Policy

- **Zero Client-Side AWS Secrets**: The client code executes a high-fidelity local simulator and does **NOT** require or embed root/IAM AWS credentials.
- Any future backend connections (e.g. AWS Cognito, Amazon DynamoDB, AWS Lambda) should interface strictly through secure Amazon API Gateway REST endpoints with least-privilege IAM roles.

---

## 🎮 6. Demo Mode for College Club Events & Workshops

To demonstrate the game at club presentations or hackathons without playing through the prologue:
1. Open the landing page.
2. Click **`⚡ DEMO LAUNCHER`**.
3. Select any mission (e.g., **Mission 02 Outage**, **Mission 06 Traffic Surge**, **Mission 09 Night Shift Intrusion**).
4. The game will immediately fast-seed the infrastructure and open the operations workspace.
