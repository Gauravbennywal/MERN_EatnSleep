const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://eatnsleep:EatnSleep@cluster0.abi1dr6.mongodb.net/eatnsleepmern?retryWrites=true&w=majority';

async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    const fetched_data = await mongoose.connection.db.collection("food_items");
    const data = await fetched_data.find({}).toArray();
    const foodCategory = await mongoose.connection.db.collection("foodCategory");
    const catData = await foodCategory.find({}).toArray();
    
    global.food_items = data;
    global.foodCategory = catData;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = connectDB;