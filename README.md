#  Exclusive E-Commerce Platform

A full-stack e-commerce web application designed to deliver a seamless online shopping experience. The platform supports both user and admin functionalities, including product management, order processing, and invoice generation.

---

##  Overview

**Exclusive E-Commerce** is a modern web application built using the MERN stack. It allows users to browse products, add items to a cart, place orders, and download invoices. An integrated admin panel provides complete control over products and orders.

---

##  Key Features

###  User Features

* User registration and login
* Browse and search products
* Add products to cart
* Secure checkout process
* Order history tracking
* Downloadable invoice (PDF)

###  Admin Features

* Add, edit, delete products
* Manage product inventory
* View and manage all orders
* Update order status (Placed → Shipped → Delivered → Cancelled)
* Dashboard-ready structure for future analytics

---

##  Invoice System

* Generate invoice for each order
* Download invoice as PDF
* Print invoice directly
* Displays product details, quantity, price, and total

---

##  Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### Other Tools

* jsPDF (for invoice generation)
* html2canvas

---

##  Project Structure

```
Exclusive-ECommerce/
│
├── frontend/        # React Frontend
│   ├── src/
│   ├── components/
│   ├── pages/
│
├── backend/         # Node + Express Backend
│   ├── models/
│   ├── routes/
│   ├── server.js
│
├── .gitignore
├── README.md
```

---

##  Installation & Setup

###  1. Clone Repository

```bash
git clone https://github.com/abiswal430/Exclusive-ECommerce.git
cd Exclusive-ECommerce
```

---

###  2. Setup Backend

```bash
cd backend
npm install
npm start
```

---

###  3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

##  Running the Application

* Frontend: http://localhost:5173
* Backend API: http://localhost:5000

---

##  Future Enhancements

* Payment gateway integration (Razorpay / Stripe)
* Image upload with cloud storage
* Advanced filtering & categories
* Admin analytics dashboard
* Email invoice system

---

##  Author

**Arjya Biswal**
GitHub: https://github.com/abiswal430

---

##  License

This project is created for educational purposes and academic submission.

---

##  Acknowledgement

This project was developed as part of a learning journey in full-stack web development, focusing on real-world application design and implementation.

---
