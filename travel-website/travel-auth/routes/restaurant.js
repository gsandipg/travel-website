const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant"); // Correct usage of model

// ✅ POST /api/restaurants/seed — Insert or update
router.post("/seed", async (req, res) => {
  try {
    const data = req.body;

    for (const item of data) {
      await Restaurant.updateOne(
        { name: item.name },
        { $set: item },
        { upsert: true }
      );
    }

    res.send("Restaurants inserted or updated successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
    res.status(500).send("Error inserting data");
  }
});

// ✅ Search restaurants by name or city
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || "";
    const results = await Restaurant.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
      ],
    });
    res.json(results);
  } catch (error) {
    console.error("Error searching restaurants:", error);
    res.status(500).send("Search failed");
  }
});

// ✅ GET /api/restaurants?city=Kolkata
router.get("/", async (req, res) => {
  const { city } = req.query;
  try {
    const query = city ? { city: { $regex: new RegExp(city, "i") } } : {};
    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).send("Error fetching restaurants");
  }
});


// ✅ GET /api/restaurants/city/Kolkata
router.get("/city/:city", async (req, res) => {
  const cityParam = req.params.city;
  try {
    const restaurants = await Restaurant.find({
      city: { $regex: new RegExp(cityParam, "i") },
    });
    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching city places:", error);
    res.status(500).send("City fetch failed");
  }
});

// ✅ PUT /api/restaurants/:id — Update restaurant
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log("Updating ID:", id);
    console.log("With data:", updates);

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).send("Restaurant not found");
    }

    res.json(updatedRestaurant);
  } catch (error) {
    console.error("Error updating restaurant:", error.message);
    res.status(500).send("Update failed");
  }
});

module.exports = router;
