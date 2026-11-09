
import jwt from "jsonwebtoken";

export const facultyAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check whether the token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Ensure the user is a faculty member
    if (decoded.role !== "faculty" || !decoded.branch) {
      return res.status(403).json({
        message: "Faculty access required",
      });
    }

    // Attach authenticated faculty details to the request
    req.faculty = {
      branch: decoded.branch,
      role: decoded.role,
    };

    // Continue to the route
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
