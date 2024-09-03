require('dotenv').config(); // Load environment variables

const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

exports.sendToNotion = async (req, res) => {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', 'https://onlyfans.com'); // Allow requests from onlyfans.com
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

    // Handle preflight (OPTIONS) request
    if (req.method === 'OPTIONS') {
        console.log('Handling preflight request');
        return res.status(204).send('');  // No content for OPTIONS request
    }

    // Retrieve the API key from headers and environment
    const apiKey = req.get('x-api-key');
    const validApiKey = process.env.GOOGLE_API_KEY;  // Use environment variable for the API key

    // Log the received API key and the expected API key
    console.log("Received API Key:", apiKey);
    console.log("Expected API Key:", validApiKey);

    // Validate the API key
    if (apiKey !== validApiKey) {
        console.log("Invalid API Key");
        return res.status(403).send('Forbidden: Invalid API Key');
    }

    const { data } = req.body;
    const type = data.type;

    console.log("Received type:", type);
    console.log("Received data:", data);

    if (!type) {
        console.log("Type is required but missing");
        return res.status(400).send("Type is required.");
    }

    let pageProperties;

    if (type === 'feedback') {
        // Properties for Feedback
        pageProperties = {
            Title: {
                title: [{ text: { content: data.title } }]
            },
            Feedback: {
                rich_text: [{ text: { content: data.feedback } }]
            },
            Category: {
                select: { name: data.category }
            },
            Tags: {
                multi_select: data.tags.split(',').map(tag => ({ name: tag.trim() }))
            },
            "Member URL": {
                url: data.memberProfileURL
            }
        };
    } else if (type === 'request') {
        // Properties for Request
        pageProperties = {
            Title: {
                title: [{ text: { content: data.title } }]
            },
            "Member URL": {
                url: data.memberProfileURL
            },
            "Member Request": {
                rich_text: [{ text: { content: data.requestDetails || '' } }]
            },
            Budget: {
                number: data.budget ? parseFloat(data.budget) : 0 // Budget as a number
            },
            "Manager Notes": {
                rich_text: [{ text: { content: data.notes || '' } }]
            }
        };
    } else {
        console.log("Invalid type provided:", type);
        return res.status(400).send("Invalid type provided.");
    }

    try {
        console.log("Sending data to Notion with properties:", pageProperties);

        const response = await notion.pages.create({
            parent: { database_id: req.body.databaseId },
            properties: pageProperties
        });
        res.status(200).send(response);
    } catch (error) {
        console.error('Error sending data to Notion:', error.message);
        res.status(500).send("Error sending data to Notion.");
    }
};