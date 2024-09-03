require('dotenv').config(); // Add this line at the top to load environment variables from .env
console.log('NOTION_API_KEY:', process.env.NOTION_API_KEY);
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY);

// Continue with the rest of your code...

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
        return res.status(403).send('Forbidden: Invalid API Key');
    }

    const { databaseId, data } = req.body;

    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Title: {
                    title: [
                        {
                            text: {
                                content: data.title
                            }
                        }
                    ]
                },
                Feedback: {
                    rich_text: [
                        {
                            text: {
                                content: data.feedback
                            }
                        }
                    ]
                },
                Category: {
                    select: { name: data.category }
                },
                Tags: {
                    multi_select: data.tags.split(',').map(tag => ({ name: tag.trim() }))
                }
            }
        });
        res.status(200).send(response);
    } catch (error) {
        console.error('Error sending data to Notion:', error.message);
        res.status(500).send("Error sending data to Notion.");
    }
};