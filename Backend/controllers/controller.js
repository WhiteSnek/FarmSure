const User = require("../models/model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
dotenv.config();
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "1d" });
};

//Login User
const login = async (req, res) => {
  const { contact, password } = req.body;

  try {
    const user = await User.login(contact, password);

    const token = createToken(user._id);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Signup User
const signup = async (req, res) => {
  const { userName, email, contact, password, area, location } = req.body;

  try {
    const user = await User.signup(userName, email, contact, password, area, location);

    //Create Token
    const token = createToken(user._id);

    res.status(200).json({ contact, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCropPrices = async (req, res) => {
  const { state, district, market, commodity } = req.body;
  try {
    const baseUrl = process.env.MARKET_API_URL;
    const params = new URLSearchParams({
      "api-key": process.env.MARKET_API_KEY,
      format: "json",
      limit: "10",
      offset: "0",
      sort: "created_date",
      order: "desc",
    });

    if (state) params.append("filters[state.keyword]", state);
    if (district) params.append("filters[district]", district);
    if (market) params.append("filters[market]", market);
    if (commodity) params.append("filters[state.keyword]", commodity);

    const requestUrl = `${baseUrl}?${params.toString()}`;

    const response = await axios.get(requestUrl);
    const records = response.data.records;
    res.status(200).json(records);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getGovtSchemes = async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "constants", "schemes.json");
    const data = fs.readFileSync(filePath, "utf-8");
    const schemes = JSON.parse(data);

    res.status(200).json({
      success: true,
      total: schemes.length,
      data: schemes
    });
  } catch (error) {
    console.error("Error reading schemes file:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch government schemes",
      error: error.message
    });
  }
};

module.exports = {
  signup,
  login,
  getCropPrices,
  getGovtSchemes
};
