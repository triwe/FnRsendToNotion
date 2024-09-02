const { Client } = require('@notionhq/client');

// Initialize the Notion client with the API key from the environment variable
const notion = new Client({ auth: process.env.NOTION_API_KEY });

exports.sendToNotion = async (req, res) => {
    try {
        // Parse the incoming data from the Chrome extension
        const { memberProfile, feedback, category, tags } = req.body;

        // Check if the necessary data is present
        if (!memberProfile || !feedback || !category) {
            return res.status(400).send('Missing required fields: memberProfile, feedback, or category');
        }

        // Create a new page in the specified Notion database
        const response = await notion.pages.create({
            parent: { database_id: 'your-actual-database-id' }, // Replace with your actual database ID
            properties: {
                title: {
                    title: [
                        {
                            text: {
                                content: `Feedback for ${memberProfile}`  // Use the member profile in the title
                            }
                        }
                    ]
                },
                Category: {
                    select: {
                        name: category  // Set the category
                    }
                },
                Tags: {
                    multi_select: tags.split(',').map(tag => ({ name: tag.trim() }))  // Split and trim tags
                },
                Feedback: {
                    rich_text: [
                        {
                            text: {
                                content: feedback  // Add the feedback content
                            }
                        }
                    ]
                }
                // Add more properties if necessary
            }
        });

        // Respond with the ID of the created Notion page
        res.status(200).send(`Page created with ID: ${response.id}`);
    } catch (error) {
        console.error('Error sending to Notion:', error);
        res.status(500).send('Failed to send data to Notion.');
    }
};