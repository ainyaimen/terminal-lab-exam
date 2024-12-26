# terminal-lab-exam
Features
Books: Add, update, delete, and list books.
Authors: Add, update, delete authors, and fetch authors linked to more than 5 books.
Borrowers: Manage borrowers and their borrowing activities.
Borrowing Rules:
Standard members can borrow up to 5 books.
Premium members can borrow up to 10 books.
Borrowing is restricted for overdue borrowers or when no copies are available.


Technologies Used
Backend: Node.js, Express.js
Database: MongoDB
Libraries: Mongoose


Project Structure
bash
Copy code
├── models
│   ├── Author.js       # Author schema and model
│   ├── Book.js         # Book schema and model
│   └── Borrower.js     # Borrower schema and model
├── routes
│   ├── authorRoutes.js # Author-related routes
│   ├── bookRoutes.js   # Book-related routes
│   └── borrowerRoutes.js # Borrower-related routes
├── controllers         # Contains controller logic
│   ├── authorController.js
│   ├── bookController.js
│   └── borrowerController.js
├── app.js              # Entry point for the server
└── README.md           # Project documentation