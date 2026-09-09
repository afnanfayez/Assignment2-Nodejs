const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const usersFile = path.join(__dirname, "users.json");

function readUsers() {
  const data = fs.readFileSync(usersFile, "utf8");
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(data));
}

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;
  const parts = pathname.split("/").filter(Boolean);
  const isUserByIdRoute = parts.length === 2 && parts[0] === "user";
  const id = Number(parts[1]);

  // 1. Add a new user
  if (req.method === "POST" && pathname === "/user") {
    try {
      const newUser = await getRequestBody(req);
      const users = readUsers();
      const emailExists = users.some((user) => user.email === newUser.email);

      if (emailExists) {
        return sendResponse(res, 400, { message: "Email already exists." });
      }

      const newId =
        users.length > 0
          ? Math.max(...users.map((user) => user.id)) + 1
          : 1;

      users.push({
        id: newId,
        name: newUser.name,
        age: newUser.age,
        email: newUser.email,
      });

      writeUsers(users);
      return sendResponse(res, 201, {
        message: "User added successfully.",
      });
    } catch (error) {
      return sendResponse(res, 400, { message: "Invalid data." });
    }
  }

  // 2. Update a user
  if (req.method === "PATCH" && isUserByIdRoute) {
    try {
      const updatedData = await getRequestBody(req);
      const users = readUsers();
      const user = users.find((currentUser) => currentUser.id === id);

      if (!user) {
        return sendResponse(res, 404, { message: "User ID not found." });
      }

      if (updatedData.email !== undefined) {
        const emailExists = users.some(
          (otherUser) =>
            otherUser.email === updatedData.email && otherUser.id !== id
        );

        if (emailExists) {
          return sendResponse(res, 400, {
            message: "Email already exists.",
          });
        }
      }

      const allowedFields = ["name", "age", "email"];
      const updatedFields = allowedFields.filter(
        (field) => updatedData[field] !== undefined
      );

      for (const field of updatedFields) {
        user[field] = updatedData[field];
      }

      writeUsers(users);

      if (updatedFields.length === 1) {
        return sendResponse(res, 200, {
          message: `User ${updatedFields[0]} updated successfully.`,
        });
      }

      return sendResponse(res, 200, {
        message: "User updated successfully.",
      });
    } catch (error) {
      return sendResponse(res, 400, { message: "Invalid data." });
    }
  }

  // 3. Delete a user
  if (req.method === "DELETE" && isUserByIdRoute) {
    const users = readUsers();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return sendResponse(res, 404, { message: "User ID not found." });
    }

    users.splice(userIndex, 1);
    writeUsers(users);

    return sendResponse(res, 200, {
      message: "User deleted successfully.",
    });
  }

  // 4. Get all users
  if (req.method === "GET" && pathname === "/user") {
    return sendResponse(res, 200, readUsers());
  }

  // 5. Get a user by ID
  if (req.method === "GET" && isUserByIdRoute) {
    const users = readUsers();
    const user = users.find((currentUser) => currentUser.id === id);

    if (!user) {
      return sendResponse(res, 404, { message: "User not found." });
    }

    return sendResponse(res, 200, user);
  }

  return sendResponse(res, 404, { message: "Route not found." });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
