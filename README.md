# SendToNotion Cloud Function

The `SendToNotion` Cloud Function is designed to capture user feedback and requests from a frontend application and send the data to a Notion database. The function is triggered via an HTTP POST request and integrates seamlessly with both the OnlyFans platform and Notion API.

## Features

- **Capture Feedback and Requests:** Seamlessly capture feedback and requests from users on the OnlyFans platform and send them to a Notion database.
- **CORS Support:** Configured to handle CORS requests specifically from `onlyfans.com`.
- **Environment-Specific Configuration:** Easily configure environment variables for both local development and production deployment on Google Cloud.
- **Error Handling:** Robust error handling to ensure issues are logged and appropriate responses are sent back to the client.

## Setup

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/your-repo/send-to-notion.git
cd send-to-notion
```

### 2. Install Dependencies

Ensure that you have Node.js installed, then run:

```bash
npm install
```

### 3. Configure Environment Variables

#### Option 1: Using `.env` File (for Local Development)

Create a `.env` file in the root of your project directory. This file should contain the following environment variables:

```plaintext
NOTION_API_KEY=your_notion_api_key
GOOGLE_API_KEY=your_google_api_key
```

Replace `your_notion_api_key` and `your_google_api_key` with your actual API keys. The `.env` file allows you to manage these keys securely in your local development environment.

#### Option 2: Setting Environment Variables in Google Cloud (for Deployment)

When deploying to Google Cloud, you can set the environment variables directly in the deployment command:

```bash
gcloud functions deploy sendToNotion \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars NOTION_API_KEY=your_notion_api_key,GOOGLE_API_KEY=your_google_api_key \
  --region us-central1
```

This method is preferred for production deployment to ensure your function has access to the necessary API keys during execution.

### 4. Deploying the Function

Once your environment is configured, deploy the function to Google Cloud:

```bash
gcloud functions deploy sendToNotion \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars NOTION_API_KEY=your_notion_api_key,GOOGLE_API_KEY=your_google_api_key \
  --region us-central1
```

This command will deploy the function and make it accessible via an HTTPS endpoint.

## API Usage

### Request Structure

To send data to the `SendToNotion` function, make an HTTP POST request with the following structure:

- **Endpoint:** `https://us-central1-ofchat-ext-feedback.cloudfunctions.net/sendToNotion`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer your_google_api_key`
  - `x-api-key: your_google_api_key`
  - `Content-Type: application/json`
- **Body:**

```json
{
  "databaseId": "notion_database_id",
  "data": {
    "title": "Feedback from user",
    "feedback": "The feedback content...",
    "category": "Positive",
    "tags": "tag1, tag2",
    "memberURL": "https://onlyfans.com/u123456789"
  }
}
```

### Response Structure

Upon successful execution, the function returns:

```json
{
  "object": "page",
  "id": "notion_page_id",
  "request_id": "request_id"
}
```

In case of an error, you will receive an error message along with the corresponding status code.

## Logging and Monitoring

To monitor the logs of your function:

```bash
gcloud functions logs read sendToNotion --region=us-central1 --limit=50
```

This command retrieves the latest 50 logs for the `SendToNotion` function, which is helpful for debugging and ensuring everything is functioning correctly.

## Troubleshooting

### Common Issues

1. **CORS Errors:** Ensure that the `Access-Control-Allow-Origin` header in the function is correctly set to `https://onlyfans.com`.
2. **API Key Mismatch:** Double-check that the API keys provided in the request headers match the environment variables set in Google Cloud.
3. **Organization Policy Restrictions:** If your deployment fails due to organization policy restrictions, you may need to modify the policy to allow necessary permissions.

### Organization Policy Restrictions

In some cases, deployment might be blocked by restrictive organization policies, particularly if your Google Cloud organization has set strict rules about which services can be used or what permissions can be granted.

#### Solution

We encountered an issue where the function deployment was blocked due to a policy that restricted certain permissions. The solution involved temporarily modifying the organization policy to allow all necessary permissions for deploying the function.

**Steps:**

1. **Identify the Policy Rule:**

   - Check the deployment logs to identify which specific policy rule is causing the issue.

2. **Modify the Policy:**

   - Navigate to the **IAM & Admin > Organization Policies** section in the Google Cloud Console.
   - Locate the specific rule and modify it to allow the necessary permissions. You may need to allow all permissions temporarily for the deployment to succeed.

3. **Re-deploy the Function:**

   - After modifying the policy, try deploying the function again using the deployment command provided in the [Deploying the Function](#deploying-the-function) section.

4. **Revert the Policy Change:**
   - Once the deployment is successful, it's advisable to revert the policy to its original state to maintain security.

### Debugging Tips

- **Check Logs:** Use the `gcloud functions logs read` command to identify and debug issues in the function.
- **Test Locally:** If you encounter issues, consider testing the function locally using a tool like Postman or cURL to simulate requests.
- **Review Organization Policies:** Ensure that your Google Cloud organization's policies are not overly restrictive, preventing necessary permissions for deployment.

## Contributing

We welcome contributions! If you’d like to contribute to this project, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
