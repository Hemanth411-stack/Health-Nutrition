import UserInfo from '../models/Userinformation.js';

// 📌 Create or Update User Info
export const upsertUserInfo = async (req, res) => {
  try {
    const { fullName, phone, email, address, slot } = req.body;
    console.log("body details",req.body)
    const userInfo = await UserInfo.findOneAndUpdate(
      { user: req.user.id },
      { fullName, phone, email, address, slot },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(userInfo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save user info', error: error.message });
  }
};



// 📌 Get Current User Info
export const getUserInfo = async (req, res) => {
  try {
    const userInfo = await UserInfo.findOne({ user: req.user.id });

    if (!userInfo) {
      return res.status(404).json({ message: 'User information not found' });
    }

    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user info', error: error.message });
  }
};
