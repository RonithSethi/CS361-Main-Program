const fs = require('fs');

async function generateFoodIndex() {
    try {
        // Load the food data JSON
        const rawData = fs.readFileSync('foundationDownload.json');
        const data = JSON.parse(rawData);

        // Create a mapping of food description -> { index, category }
        const foodIndex = [];
        data.FoundationFoods.forEach((item, index) => {
            foodIndex[index] = item.description
        });

        // Write the mapping to a new JSON file
        fs.writeFileSync('foodIndexMicro.json', JSON.stringify(foodIndex, null, 2));

        console.log('foodIndexMicro.json has been created successfully.');
    } catch (error) {
        console.error('Error generating food index:', error);
    }
}

// Run the function
generateFoodIndex();
