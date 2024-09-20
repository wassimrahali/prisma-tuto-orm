const express = require("express");
const app = express();
const port = 3000;
const { PrismaClient } = require("@prisma/client");
const { error } = require("console");
app.use(express.json());

const prisma = new PrismaClient();

app.post("/post-user", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "Email and name are required." });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.get("/get-users", async (req,res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error("error getting users", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});


app.get("/get-user/:id", async (req,res) => {
    const {id} = req.params
    try {
      const user = await prisma.user.findUnique({
        where: {
            id: parseInt(id), 
          },
      });
      if(!user){
          return res.status(404).json({error : "User not found "})
        }
        res.json(user);
      
    } catch (error) {
      console.error("error getting users", error);
      res.status(500).json({ error: "Something went wrong." });
    }
  });

app.delete("/delete-user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.json({ message: "User delete successfully ", deletedUser });
  } catch (error) {
    console.error("Somthin want Wrong !", error);
    res.status(500).json({ error: "Something went wrong." });

  }
});





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
