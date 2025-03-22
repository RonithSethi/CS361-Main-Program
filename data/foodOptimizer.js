const fs = require("fs");

function mapFoodNutrients(inputFile, outputFile) {
  // Read the input JSON file
  fs.readFile(inputFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the input file:", err);
      return;
    }

    // Parse the input JSON data
    const jsonData = JSON.parse(data);
    const mappedFoodItems = [];

    // Iterate through the FoundationFoods array
    jsonData.FoundationFoods.forEach((foodItem) => {
      const mappedFood = {
        fdcId: foodItem.fdcId, // Add the fdcId to each food item
        name: foodItem.description,
      };

      // Iterate through the food nutrients of each food item
      foodItem.foodNutrients.forEach((nutrient) => {
        var nutrientName = nutrient.nutrient.name;
        const nutrientAmount = nutrient.amount;
        const nutrientUnit = nutrient.nutrient.unitName;
        if (nutrientUnit === "kJ") {
          nutrientName = "Energy (kJ)";
        }

        // Map each nutrient by its number
        mappedFood[nutrientName] = nutrientAmount;
      });

      // Add the mapped food item to the array
      mappedFoodItems.push(mappedFood);
    });

    // Write the mapped food items array to the output JSON file
    fs.writeFile(
      outputFile,
      JSON.stringify(mappedFoodItems, null, 4),
      (err) => {
        if (err) {
          console.error("Error writing the output file:", err);
          return;
        }
        console.log(`Mapped food items written to ${outputFile}`);
      }
    );
  });
}

// Define the input and output file paths
const inputFile = "foundationDownload.json"; // Your FoundationFoods JSON file path
const outputFile = "foodOptimized.json"; // The output file for the mapped food items

// Call the function to map the nutrients and write the result to the output file
mapFoodNutrients(inputFile, outputFile);
