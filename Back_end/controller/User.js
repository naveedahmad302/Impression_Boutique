import User from "../model/User.js";
import bcryptjs from "bcryptjs";



export const SignUp = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists." })
        }
        const hashPassword = await bcryptjs.hash(password, 10);
        const CreatedUser = new User({
            fullname: fullname,
            email: email,
            password: hashPassword,
        });

        await CreatedUser.save();
        res.status(201).json({ message: "User created successfully." });

    } catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json({ message: "Internal server error " });
    }
};
export const LogIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!user || !isMatch) {
            res.status(400).json({ message: "Invalid credentials" })
        }
        else {
            res.status(200).json({
                message: "Log In successfull.",
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                }
            }
            )

        }

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
export default { SignUp, LogIn };