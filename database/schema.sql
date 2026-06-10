-- Create the database
CREATE DATABASE IF NOT EXISTS library_management_db;
USE library_management_db;

-- 1. users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty', 'librarian') DEFAULT 'student' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. books Table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    description TEXT,
    category VARCHAR(100),
    total_copies INT NOT NULL DEFAULT 1,
    available_copies INT NOT NULL DEFAULT 1,
    ai_summary TEXT, -- Optional: Generated and cached by Gemini AI
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_copies CHECK (available_copies <= total_copies)
);

-- 3. issued_books Table
CREATE TABLE IF NOT EXISTS issued_books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    status ENUM('issued', 'returned', 'overdue') DEFAULT 'issued' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    CONSTRAINT chk_dates CHECK (due_date >= issue_date)
);

-- 4. fines Table
-- Note: Fine amount is calculated at ₹50 per day after the due date.
CREATE TABLE IF NOT EXISTS fines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issued_book_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('unpaid', 'paid') DEFAULT 'unpaid' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (issued_book_id) REFERENCES issued_books(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_amount CHECK (amount >= 0)
);

-- Example Trigger (Optional): Automatically calculate fine on return if overdue
-- DELIMITER //
-- CREATE TRIGGER calculate_fine_before_update
-- BEFORE UPDATE ON issued_books
-- FOR EACH ROW
-- BEGIN
--     IF NEW.status = 'returned' AND NEW.return_date > OLD.due_date THEN
--         SET @days_late = DATEDIFF(NEW.return_date, OLD.due_date);
--         SET @fine_amount = @days_late * 50.00;
--         
--         INSERT INTO fines (issued_book_id, user_id, amount, status)
--         VALUES (OLD.id, OLD.user_id, @fine_amount, 'unpaid');
--     END IF;
-- END;
-- //
-- DELIMITER ;
