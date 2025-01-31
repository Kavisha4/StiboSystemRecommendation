// Category mappings (grouping similar categories)
const categoryGroups = {
    "Kitchen": ["Kitchen Equipment LOVs", "Kitchen Merchandise", "Plumbing/Heating/Ventilation/Air Conditioning"],
    "Food": ["Vegetables", "Meat/Poultry", "Prepared/Preserved Foods", "Oils/Fats Edible"],
    "Garden": ["Lawn/Garden Supplies", "Shrubs/Trees", "Seeds/Spores", "Seedlings - Ready to Grow"],
    "Health": ["Medical Devices", "Skin Products", "Pharmaceutical Drugs", "Pet Care"],
    "Pet": ["Pet Care/Food", "Pet Care/Food Variety Packs", "Veterinary Healthcare"],
    "Hobbies": ["Music", "Musical Instruments/Accessories", "Toys/Games", "Photography/Optics"],
    "DIY": ["Safety/Protection - DIY", "Safety/Security/Surveillance", "Lubricants/Protective Compounds"],
    "Office": ["Stationery/Office Machinery", "Tool Storage/Workshop Aids", "Textual/Printed/Reference Materials"],
    "Tech": ["In-car Electronics", "SmartHomeLOVs", "Tablet LOVs", "VehicleLoVs"],
    "Personal": ["Personal Accessories", "Personal Hygiene Products", "Personal Safety/Security"],
    "Sports": ["Sports Equipment", "Fishing Gear", "Camping Accessories"],
    "Ingredients": ["Ingredient Smart Tracker", "Ingredient Smart Tracker LOV", "Seasonings/Preservatives/Extracts"],
    "Sustainability": ["Sustainability LOVs", "Life Cycle Assessments", "Insect/Pest/Allergen Control"],
    "Tools": ["Tools/Equipment - Hand", "Tools/Equipment - Power", "ScaffoldingLOVs"],
    "Intimacy": ["Toys/Games", "ToyLoVs", "Personal Intimacy"]
  };
  
  // Function to find category group based on user message
  const getCategoryGroup = (message) => {
    for (let group in categoryGroups) {
      for (let category of categoryGroups[group]) {
        if (message.toLowerCase().includes(category.toLowerCase())) {
          return categoryGroups[group];
        }
      }
    }
    return null;
  };
  
  // API for chatbot recommendation
  app.post("/api/chatbot", (req, res) => {
    const { message } = req.body;
    let response = "I'm not sure. Can you ask something else?";
  
    // Find category group based on the user's message
    const categoryGroup = getCategoryGroup(message);
  
    if (categoryGroup) {
      response = `I recommend checking out products in the following categories: ${categoryGroup.join(", ")}`;
    }
  
    res.json({ reply: response });
  });
  