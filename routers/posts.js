const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

//つぶやきポスト用API
router.post("/post", isAuthenticated, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "投稿内容がありません" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: req.userId,
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });

    return res.json(newPost); //ここ注目
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
});

// 最新つぶやき取得API
router.get("/get_latest_post", async (req, res) => {
  try {
    const latestPost = await prisma.post.findMany({
      take: 30,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });
    return res.json(latestPost);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "サーバーエラーです。" });
  }
});

// 個別ユーザーの投稿API
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userPosts = await prisma.post.findMany({
      where: {
        authorId: parseInt(userId),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
    });
    return res.status(200).json(userPosts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//投稿消去用API
router.delete("/delete/:postId", async (req, res) => {
  const postId = parseInt(req.params.postId);

  try {
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    return res.status(200).json({ message: "投稿が消去されました。" });
  } catch (err) {
    return res.status(500).json({ err: "err" });
  }
});

module.exports = router;
