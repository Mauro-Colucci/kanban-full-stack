import Section from "../models/Section.js";
import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const { sectionId } = req.body;
  try {
    const section = await Section.findById(sectionId);
    const tasksCount = await Task.find({ section: sectionId }).count();
    const task = await Task.create({
      section: sectionId,
      position: tasksCount || 0,
    });
    task._doc.section = section;
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findByIdAndUpdate(taskId, { ...req.body });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateTaskPosition = async (req, res) => {
  const {
    sourceTasks,
    destinationTasks,
    sourceSectionId,
    destinationSectionId,
  } = req.body;
  const sourceTasksReverse = sourceTasks.reverse();
  const destinationTasksReverse = destinationTasks.reverse();
  try {
    if (sourceSectionId !== destinationSectionId) {
      for (const key in sourceTasksReverse) {
        await Task.findByIdAndUpdate(sourceTasksReverse[key].id, {
          section: sourceSectionId,
          position: key,
        });
      }
    }
    for (const key in destinationTasksReverse) {
      await Task.findByIdAndUpdate(destinationTasksReverse[key].id, {
        section: destinationSectionId,
        position: key,
      });
    }
    res.status(200).json("updated");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const currentTask = await Task.findById(taskId);
    await Task.findByIdAndDelete(taskId);
    const tasks = await Task.find({ section: currentTask.section }).sort(
      "postition"
    );
    for (const key in tasks) {
      await Task.findByIdAndUpdate(tasks[key].id, { position: key });
    }
    res.status(200).json("deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};
