import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not defined in the environment variables.");
  process.exit(1);
}
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB Atlas:", err);
    process.exit(1);
  });

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

interface ITodo extends mongoose.Document {
  text: string;
  completed: boolean;
}

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model<ITodo>("Todo", todoSchema);

app.get("/api/todos", async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).send(error);
  }
});

app.post("/api/todos", async (req: Request, res: Response) => {
  try {
    const newTodo = new Todo({
      text: req.body.text,
      completed: false,
    });
    await newTodo.save();
    res.json(newTodo);
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).send(error);
  }
});

app.delete("/api/todos/:id", async (req: Request, res: Response) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).send(error);
  }
});

app.put("/api/todos/:id", async (req: Request, res: Response) => {
  try {
    const updatedFields: Partial<ITodo> = {};
    if (req.body.text !== undefined) {
      updatedFields.text = req.body.text;
    }
    if (req.body.completed !== undefined) {
      updatedFields.completed = req.body.completed;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "Aucun champ à mettre à jour" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).send(error);
  }
});
