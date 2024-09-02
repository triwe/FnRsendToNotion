# SendToNotion Function

This is the backend function for the Chrome extension that submits user feedback to a Notion database. The function is written in Node.js and deployed on Google Cloud Functions.

## Features

- Receives feedback data from the Chrome extension.
- Creates a new page in a specified Notion database with the feedback details.
- Supports fields such as `memberProfile`, `feedback`, `category`, and `tags`.

## Prerequisites

- **Google Cloud Account**: Ensure you have access to Google Cloud and a project set up.
- **Notion API Integration**: You need a Notion API key and a database in Notion where the feedback will be stored.
- **Chrome Extension**: The extension should be configured to send data to this function.

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/triwe/fnr-ofchat-ext-back.git
cd fnr-ofchat-ext-back
```

### 2. Install Dependencies

Ensure you have Node.js installed. Then, install the required dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of your project and add your Notion API key:

```bash
NOTION_API_KEY=your_notion_api_key
```

### 4. Deploy the Function

Deploy the function to Google Cloud:

```bash
gcloud functions deploy sendToNotion \
    --runtime nodejs18 \
    --trigger-http \
    --allow-unauthenticated \
    --service-account=your-service-account@your-project.iam.gserviceaccount.com \
    --set-env-vars NOTION_API_KEY=your_notion_api_key \
    --region=us-central1
```

### 5. Configure Chrome Extension

Ensure your Chrome extension is configured to send a POST request to the deployed function's URL with the necessary data:

- **Endpoint URL**: `https://us-central1-your-project.cloudfunctions.net/sendToNotion`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Payload Example**:
  ```json
  {
    "memberProfile": "onlyfans.com/u12345678",
    "feedback": "This is the feedback text.",
    "category": "Positive",
    "tags": "tag1,tag2,tag3"
  }
  ```

## Usage

Once deployed, the function will listen for HTTP POST requests and create a new page in your Notion database based on the data provided by the Chrome extension.

## Logs & Monitoring

To view logs for the function:

```bash
gcloud functions logs read sendToNotion --region=us-central1
```

## Troubleshooting

- **500 Internal Server Error**: Ensure the `NOTION_API_KEY` is correct and has the necessary permissions for the database.
- **Validation Error**: Check that the data sent by the Chrome extension matches the expected structure.
- **Permission Issues**: Make sure the function has the correct IAM roles assigned.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
