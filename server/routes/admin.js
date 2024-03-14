import express from 'express';
import blog from '../models/blog.js';
import upload from '../middleware/upload.js'

const router = express.Router();




router.get('/dashboard', async (req, res) => {
    try {
        const data = await blog.find();
        res.render('dashboard', { data });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/addpost', (req, res) => {
    res.render('addpost');
});

router.get('/post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await blog.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.render('post', { post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/addpost', upload.single('image'), async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        // Access uploaded image data: req.file.buffer
        // Access uploaded image metadata: req.file.mimetype, req.file.originalname

        // Example: Save image data to the database along with other post data
        const newBlog = new blog({
            title: req.body.title,
            body: req.body.body,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });
        await newBlog.save();

        res.redirect('/dashboard'); // Redirect to the dashboard or any other appropriate route
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/delete/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const deletedPost = await blog.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/edit/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await blog.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.render('edit', { post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/edit/:id', upload.single('image'), async (req, res) => {
    try {
        const postId = req.params.id;
        let updateData = {
            title: req.body.title,
            body: req.body.body,
            updatedat: Date.now()
        };

        // Check if a new image was uploaded
        if (req.file) {
            updateData.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        const updatedPost = await blog.findByIdAndUpdate(postId, updateData, { new: true });

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.post('/addcomment/:postId/:commentId?', async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await blog.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const commentId = req.params.commentId;
        const parentComment = commentId ? findCommentById(post.comments, commentId) : null;

        const newComment = {
            text: req.body.commentText,
            replies: [], // Initialize replies array for nested comments
        };

        if (parentComment) {
            // Add a reply to an existing comment
            parentComment.replies.push(newComment);
        } else {
            // Add a top-level comment to the post
            post.comments.push(newComment);
        }

        // Save the updated post with the new comment or reply
        await post.save();

        res.redirect(`/post/${postId}`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Helper function to find a comment by ID in the nested structure
function findCommentById(comments, commentId) {
    for (const comment of comments) {
        if (comment._id.toString() === commentId) {
            return comment;
        }
        const nestedComment = findCommentById(comment.replies, commentId);
        if (nestedComment) {
            return nestedComment;
        }
    }
    return null;
}



export default router;
