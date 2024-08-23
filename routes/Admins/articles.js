const express = require("express")
const router = express.Router()
const { Article } = require('../../models')
const { Op } = require("sequelize")

/**
 * 查询文章列表
 * GET /admin/articles
 */
router.get('/', async (req, res) => {

    try {
        // 查询数据
        // 读取数据库是异步操作
        const condition = {
            order: [["id", "DESC"]]
        }
        const articles = await Article.findAll(condition)
        // res.json({ message: "article get" })
        // 返回查询结果
        res.json({
            status: true,
            message: '查询文章列表成功。',
            data: {
                articles
            }
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: '查询文章列表失败。',
            errors: [error.message]
        })

    }

})

/**
 * 查询文章详情
 * GET /admin/articles
 */
router.get("/:id(\\d+)", async (req, res) => {
    try {

        const { id } = req.params
        const article = await Article.findByPk(id)
        if (article) {
            res.json({
                status: true,
                message: "查询文章成功",
                data: article
            })
        } else {
            res.status(404).json({
                status: false,
                message: "没有该文章"
            })
        }


    } catch (error) {
        res.status(500).json({
            status: false,
            message: '查询文章详情失败。',
            errors: [error.message]
        })

    }
})

/**
 * 创建文章内容
 * GET /admin/articles
 */
router.post("/create", async (req, res) => {
    try {
        const { title, content } = req.body
        const article = await Article.create({
            title, content
        })
        //成功且写入数据
        res.status(201).json({
            status: true,
            message: "写入成功",
            data: article
        })



    } catch (error) {
        res.status(500).json({
            status: false,
            message: '写入文章详情失败。',
            errors: [error.message]
        })
    }

})

// 删除文章
router.delete("/delete/:id", async (req, res) => {

    try {
        const { id } = req.params
        const article = await Article.findByPk(id);
        if (article) {
            // 删除文章
            await article.destroy();
            res.json({
                status: true,
                message: "删除成功"
            })
        } else {
            res.status(404).json({
                status: false,
                message: "找不到这条数据"
            })

        }

    } catch (error) {
        res.status(500).json({
            status: false,
            message: '删除文章详情失败。',
            errors: [error.message]
        })
    }
})

//修改文章

router.put("/:id(\\d+)", async (req, res) => {
    try {
        const { id } = req.params
        const { title, content } = req.body
        const article = await Article.findByPk(id)
        if (article) {
            await article.update({
                title, content
            })
            res.status(200).json({
                status: true,
                message: "更新成功",
                data: article
            })
        } else {
            res.status(404).json({
                status: false,
                message: "找不到这条数据"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '更新文章详情失败。',
            errors: [error.message]
        })

    }
})


router.get("/search", async (req, res) => {
    try {
        const condition = {
            order: [["id", "DESC"]],
        }
        const query = req.query
        if (query.title) {
            //排序方法
            condition.where = {
                title: { [Op.like]: `%${query.title}%` }
            }
        }
        const article = await Article.findAll(condition)
        res.json({
            message: "查询成功",
            data: article
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '搜索文章失败。',
            errors: [error.message]
        })
    }
})


/**
 * 查询文章列表
 * GET /admin/articles
 */
router.get('/', async function (req, res) {
    try {
        // 获取查询参数
        const query = req.query;

        // 获取分页所需要的两个参数，currentPage 和 pageSize
        // 如果没有传递这两个参数，就使用默认值
        // 默认是第1页
        // 默认每页显示 10 条数据
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;

        // 计算offset
        const offset = (currentPage - 1) * pageSize;

        // 定义查询条件
        const condition = {
            order: [['id', 'DESC']],

            // 在查询条件中添加 limit 和 offset
            limit: pageSize,
            offset: offset
        };

        // 如果有 title 查询参数，就添加到 where 条件中
        if (query.title) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
            };
        }

        // 查询数据
        // 将 findAll 方法改为 findAndCountAll 方法
        // findAndCountAll 方法会返回一个对象，对象中有两个属性，一个是 count，一个是 rows，
        // count 是查询到的数据的总数，rows 中才是查询到的数据
        const { count, rows } = await Article.findAndCountAll(condition);

        // 返回查询结果
        res.json({
            status: true,
            message: '查询文章列表成功。',
            data: {
                articles: rows,
                pagination: {
                    total: count,
                    currentPage,
                    pageSize,
                },
            }
        });
    } catch (error) {
        // 返回错误信息
        res.status(500).json({
            status: false,
            message: '查询文章列表失败。',
            errors: [error.message]
        });
    }
});


/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{title, content: (string|string|DocumentFragment|*)}}
 */
function filterBody(req) {
    return {
      title: req.body.title,
      content: req.body.content
    };
  }

//TODO: 公共的错误处理方法


module.exports = router