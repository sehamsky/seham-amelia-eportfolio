 
# Seham & Amelia — E-Portfolio

A full-stack e-portfolio website developed as an academic project at the Catholic University in Erbil.

The project provides two personal portfolio websites where users can showcase their profiles, skills, and projects. It also includes user authentication, portfolio management, contact forms, and job application functionality.

##  Features

- Personal portfolio pages for Seham and Amelia
- Responsive website interface
- User registration and login
- Session-based authentication
- Add, update, and delete portfolio information
- Contact form
- Job application form
- MySQL database integration
- PHP backend APIs

##  Technologies

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive design |
| JavaScript | Interactive functionality |
| PHP | Backend development and API endpoints |
| MySQL | Database management |
| XAMPP | Local development environment |

## 🗂️ Project Structure

```text
seham-amelia-eportfolio/
├── index.html
├── seham.html
├── amelia.html
├── style.css
├── seham.css
├── amelia.css
├── script.js
├── main.js
├── api_login.php
├── api_register.php
├── api_check_auth.php
├── api_add_portfolio.php
├── api_update_portfolio.php
├── api_delete_portfolio.php
├── api_get_portfolios.php
├── api_get_user_portfolios.php
├── api_contact.php
├── api_submit_job.php
├── db_connect.php
├── setup-db.php
└── README.md
```



##  Getting Started

### Prerequisites

- XAMPP
- Apache
- MySQL
- A web browser

### Installation

1. Clone or download this repository.
2. Move the project folder into the XAMPP `htdocs` directory.
3. Start Apache and MySQL from the XAMPP Control Panel.
4. Open phpMyAdmin and create the database using the provided database setup script.
5. Configure the database connection in `db_connect.php`.
6. Open the project in your browser:

```text
http://localhost/seham-amelia-eportfolio/
```

##  Database

The project uses a MySQL database named `portfolio_db`.

The database includes tables for:

- Users
- Portfolios
- Applications
- Contact messages

The database setup script creates the database and required tables.

##  Contributors

- **Seham Elias Qasim** — Backend Development and Database Integration
- **Amelia** — Frontend Development

##  Academic Project

Computer Science Department  
Catholic University in Erbil  
2026

---

This project was developed for educational purposes to practice full-stack web development, database integration, and user authentication.
