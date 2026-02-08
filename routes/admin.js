const {Router}= require('express');
const adminRouter = Router();

adminRouter.post('/create-course', (req, res) => {
    res.json({ message: "Course created successfully" });
});

adminRouter.get('/manage-courses', (req, res) => {
    res.json({ message: "Manage courses" });
});

adminRouter.post('/signup', (req, res) => {
    res.json({ message: "Admin signed up" });

});

adminRouter.get('/signin', (req, res) => {
    res.json({ message: "Admin signed in" });
});



module.exports = adminRouter; // ✅ export only the admin router
