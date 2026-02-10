const User = require('../models/user.model');
const Enrollment = require('../models/enrollment.model');

exports.addToWishlist = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { wishlist: req.params.courseId } },
    { new: true }
  ).populate('wishlist');

  return res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
};

exports.getStudentDashboard = async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user.id }).populate('course', 'title thumbnailUrl');
  return res.json({ enrollments });
};

exports.getInstructorDashboard = async (req, res) => {
  const data = await Enrollment.aggregate([
    { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'courseDoc' } },
    { $unwind: '$courseDoc' },
    { $match: { 'courseDoc.instructor': req.user._id } },
    {
      $group: {
        _id: '$courseDoc._id',
        title: { $first: '$courseDoc.title' },
        enrollments: { $sum: 1 },
        avgCompletion: { $avg: '$completionPercent' }
      }
    }
  ]);

  return res.json({ courses: data });
};
