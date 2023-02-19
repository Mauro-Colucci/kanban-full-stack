import Board from "../models/Board.js";
import Section from "../models/Section.js";
import Task from "../models/Task.js";

export const create = async (req, res) => {
  try {
    const boardsCount = await Board.find().count();
    const board = await Board.create({
      user: req.user._id,
      position: boardsCount > 0 ? boardsCount : 0,
    });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getAll = async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user._id }).sort("-position");
    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updatePosition = async (req, res) => {
  const { boards } = req.body;
  try {
    for (const key in boards.reverse()) {
      const board = boards[key];
      await Board.findByIdAndUpdate(board.id, { position: key });
    }
    res.status(200).json("updated");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getOne = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findOne({ user: req.user._id, _id: boardId });
    if (!board) return res.status(404).json("Board not found");
    const sections = await Section.find({ board: boardId });
    for (const section of sections) {
      const tasks = await Task.find({ section: section.id })
        .populate("section")
        .sort("-position");
      section._doc.tasks = tasks;
    }
    board._doc.sections = sections;
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const update = async (req, res) => {
  const { boardId } = req.params;
  const { title, description, favorite } = req.body;
  try {
    if (title === "") req.body.title = "Untitled";
    if (description === "") req.body.description = "Add description here";
    const currentBoard = await Board.findById(boardId);
    if (!currentBoard) return res.status(404).json("Board not found");
    if (favorite !== undefined && currentBoard.favorite !== favorite) {
      const favorites = await Board.find({
        user: currentBoard.user,
        favorite: true,
        _id: { $ne: boardId },
      }).sort("favoritePosition");
      if (favorite) {
        req.body.favoritePosition = favorites.length || 0;
      } else {
        for (const key in favorites) {
          const element = favorites[key];
          await Board.findByIdAndUpdate(element.id, { favoritePosition: key });
        }
      }
    }
    const board = await Board.findByIdAndUpdate(boardId, { ...req.body });
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Board.find({
      user: req.user._id,
      favorite: true,
    }).sort("-favoritePosition");
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateFavoritePosition = async (req, res) => {
  const { boards } = req.body;
  try {
    for (const key in boards.reverse()) {
      const board = boards[key];
      await Board.findByIdAndUpdate(board.id, { favoritePosition: key });
    }
    res.status(200).json("updated");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteBoard = async (req, res) => {
  const { boardId } = req.params;
  try {
    const sections = await Section.find({ board: boardId });
    for (const section of sections) {
      await Task.deleteMany({ section: section.id });
    }
    await Section.deleteMany({ board: boardId });

    const currentBoard = await Board.findById(boardId);

    if (currentBoard.favorite) {
      const favorites = await Board.find({
        user: currentBoard.user,
        favorite: true,
        _id: { $ne: boardId },
      }).sort("favoritePosition");

      for (const key in favorites) {
        const element = favorites[key];
        await Board.findByIdAndUpdate(element.id, { favoritePosition: key });
      }
    }

    await Board.findByIdAndDelete(boardId);

    const boards = await Board.find().sort("position");
    for (const key in boards) {
      const board = boards[key];
      await Board.findByIdAndUpdate(board.id, { position: key });
    }

    res.status(200).json("deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};
