const State = require("../model/state");
const data = {};
data.states = require("../model/statesData.json");

const getAllStates = async (req, res) => {
  const { contig } = req.query;
  let states = data.states;

  if (contig === "true") {
    states = states.filter(
      (state) => state.code !== "AK" && state.code !== "HI"
    );
  } else if (contig === "false") {
    states = states.filter(
      (state) => state.code === "AK" || state.code === "HI"
    );
  }

  const mergedStates = [];

  for (const state of states) {
    const stateData = await State.findOne({ stateCode: state.code });
    if (stateData) {
      mergedStates.push({ ...state, funfacts: stateData.funfacts });
    } else {
      mergedStates.push(state);
    }
  }

  res.json(mergedStates);
};

const getState = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const stateData = data.states.find((state) => state.code === stateCode);

  if (!stateData) {
    res.status(400).json({ message: "Invalid state abbreviation parameter" });
  }

  const stateDataDB = await State.findOne({ stateCode });

  if (stateDataDB) {
    const mergedState = { ...stateData, funfacts: stateDataDB.funfacts };
    res.json(mergedState);
  } else {
    res.json(stateData);
  }
};

const getStateFunFact = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const stateData = await State.findOne({ stateCode });
  if (stateData) {
    const funfacts = stateData.funfacts;
    if (funfacts) {
      const randomFact = funfacts[Math.floor(Math.random() * funfacts.length)];
      res.json({ funfact: randomFact });
    } else {
      res.status(400).json({ message: "Sorry, No Fun Facts found for Arizona" });
    }
  } else {
    res.status(400).json({ message: "Invalid state abbreviation parameter" });
  }
};

const getStateCapital = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const stateData = data.states.find((state) => state.code === stateCode);
  if (stateData) {
    res.json({ state: stateData.state, capital: stateData.capital_city });
  } else {
    res.status(400).json({ message: "Invalid state abbreviation parameter" });
  }
};

const getStateNickname = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const stateData = data.states.find((state) => state.code === stateCode);
  if (stateData) {
    res.json({ state: stateData.state, nickname: stateData.nickname });
  } else {
    res.status(400).json({ message: "Invalid state abbreviation parameter" });
  }
};

const getStatePopulation = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const stateData = data.states.find((state) => state.code === stateCode);
  if (stateData) {
    const population = stateData.population.toLocaleString();
    res.json({ state: stateData.state, population: population });
  } else {
    res.status(400).json({ message: "Invalid state abbreviation parameter" });
  }
};

const getStateAdmission = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const stateData = data.states.find((state) => state.code === stateCode);
  if (stateData) {
    res.json({ state: stateData.state, admitted: stateData.admission_date });
  } else {
    res.status(400).json({ message: "Invalid state abbreviation parameter" });
  }
};

const postStateFunFact = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const newFunFacts = req.body.funfacts;

  if (!req.body.funfacts) {
    return res.status(400).json({ message: "State fun facts value required" });
  }

  if (!Array.isArray(newFunFacts)) {
    return res
      .status(400)
      .json({ message: "State fun facts value must be an array" });
  }

  const stateData = await State.findOne({ stateCode });

  if (!stateData) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }

  stateData.funfacts = stateData.funfacts.concat(newFunFacts);
  await stateData.save();
  res.json({
    _id: stateData._id,
    stateCode: stateData.stateCode,
    funfacts: stateData.funfacts,
    __v: stateData.__v,
  });
};

const updateStateFunFact = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const { index, funfact } = req.body;

  if (!funfact) {
    return res.status(400).json({ message: "State fun fact value required" });
  }
  if (!index) {
    return res
      .status(400)
      .json({ message: "State fun fact index value required" });
  }

  const stateData = await State.findOne({ stateCode });
  const stateFileData = data.states.find((state) => state.code === stateCode);

  if (!stateData) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }

  const funfactIndex = index - 1;

  if (funfactIndex < 0 || funfactIndex >= stateData.funfacts.length) {
    return res.status(400).json({
      message: `No Fun Fact found at that index for ${stateFileData.state}`,
    });
  }

  stateData.funfacts[funfactIndex] = funfact;

  await stateData.save();

  res.json({
    _id: stateData._id,
    stateCode: stateData.stateCode,
    funfacts: stateData.funfacts,
    __v: stateData.__v,
  });
};

const deleteStateFunFact = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const { index } = req.body;

  if (!index) {
    return res
      .status(400)
      .json({ message: "State fun fact index value required" });
  }

  const stateData = await State.findOne({ stateCode });
  const stateFileData = data.states.find((state) => state.code === stateCode);

  if (!stateData) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }

  const funfactIndex = index - 1;

  if (funfactIndex < 0 || funfactIndex >= stateData.funfacts.length) {
    return res.status(400).json({
      message: `No Fun Fact found at that index for ${stateFileData.state}`,
    });
  }

  stateData.funfacts.splice(funfactIndex, 1);

  await stateData.save();

  res.json({
    _id: stateData._id,
    stateCode: stateData.stateCode,
    funfacts: stateData.funfacts,
    __v: stateData.__v,
  });
};

module.exports = {
  getAllStates,
  getState,
  getStateCapital,
  getStateNickname,
  getStatePopulation,
  getStateAdmission,
  getStateFunFact,
  postStateFunFact,
  updateStateFunFact,
  deleteStateFunFact,
};
