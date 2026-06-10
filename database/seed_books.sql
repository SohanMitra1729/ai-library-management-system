-- SQL Insert Statements for 30 Engineering Books across 10 categories
-- Schema: books (title, author, isbn, description, category, total_copies, available_copies)

-- Clear existing data if necessary (optional, usually not needed if fresh)
-- DELETE FROM books;
-- ALTER TABLE books AUTO_INCREMENT = 1;

INSERT INTO books (title, author, isbn, description, category, total_copies, available_copies) VALUES

-- 1. Database
('Database System Concepts', 'Abraham Silberschatz', '978-0073523323', 'A foundational text on the principles of database systems and architecture.', 'Database', 15, 10),
('Designing Data-Intensive Applications', 'Martin Kleppmann', '978-1449373320', 'The big ideas behind reliable, scalable, and maintainable systems.', 'Database', 20, 14),
('Seven Databases in Seven Weeks', 'Luc Perkins', '978-1680502527', 'A guide to modern databases and the NoSQL movement.', 'Database', 10, 8),

-- 2. Operating Systems
('Operating System Concepts', 'Abraham Silberschatz', '978-1118063330', 'The classic textbook on OS concepts, also known as the "Dinosaur Book".', 'Operating Systems', 20, 15),
('Modern Operating Systems', 'Andrew S. Tanenbaum', '978-0133591620', 'A comprehensive guide to modern operating systems and their internal workings.', 'Operating Systems', 15, 15),
('Linux Kernel Development', 'Robert Love', '978-0672329463', 'Details the design and implementation of the Linux kernel.', 'Operating Systems', 12, 9),

-- 3. Networking
('Computer Networks', 'Andrew S. Tanenbaum', '978-0132126953', 'A detailed, definitive book on computer networking and the Internet.', 'Networking', 18, 14),
('TCP/IP Illustrated, Volume 1', 'W. Richard Stevens', '978-0321336316', 'The protocols in detail, essential for network engineers.', 'Networking', 8, 6),
('Network Security Assessment', 'Chris McNab', '978-1491911051', 'Know your network: learn how to secure your networking environment.', 'Networking', 10, 10),

-- 4. Data Structures
('Data Structures and Algorithm Analysis in C++', 'Mark A. Weiss', '978-0132847377', 'Advanced data structures and algorithm analysis with C++ implementation.', 'Data Structures', 10, 10),
('Data Structures and Algorithms in Java', 'Robert Lafore', '978-0672324536', 'Clear explanations of complex data structures utilizing Java.', 'Data Structures', 12, 12),
('Grokking Algorithms', 'Aditya Bhargava', '978-1617292231', 'An illustrated, highly accessible guide to data structures and algorithms.', 'Data Structures', 25, 20),

-- 5. Algorithms
('Introduction to Algorithms', 'Thomas H. Cormen', '978-0262033848', 'A comprehensive textbook covering a broad range of algorithms in depth.', 'Algorithms', 15, 12),
('Algorithm Design', 'Jon Kleinberg, Éva Tardos', '978-0321295354', 'Focuses on the algorithmic design process and role in problem solving.', 'Algorithms', 10, 8),
('Algorithms', 'Robert Sedgewick', '978-0321573513', 'The leading textbook on algorithms today, widely used in colleges and universities.', 'Algorithms', 20, 18),

-- 6. Machine Learning
('Hands-On Machine Learning with Scikit-Learn', 'Aurélien Géron', '978-1492032649', 'Concepts, tools, and techniques to build intelligent systems.', 'Machine Learning', 25, 21),
('Pattern Recognition and Machine Learning', 'Christopher M. Bishop', '978-0387310732', 'A comprehensive introduction to the fields of pattern recognition and ML.', 'Machine Learning', 12, 8),
('Deep Learning', 'Ian Goodfellow', '978-0262035613', 'The definitive textbook on Deep Learning by leading experts.', 'Machine Learning', 15, 10),

-- 7. Artificial Intelligence
('Artificial Intelligence: A Modern Approach', 'Stuart Russell', '978-0134610993', 'The most widely used AI textbook, covering intelligent agents.', 'Artificial Intelligence', 22, 18),
('Life 3.0: Being Human in the Age of AI', 'Max Tegmark', '978-1101970317', 'Explores the future of AI and its impact on the fabric of human life.', 'Artificial Intelligence', 10, 10),
('Reinforcement Learning: An Introduction', 'Richard S. Sutton', '978-0262039246', 'A comprehensive introduction to reinforcement learning concepts.', 'Artificial Intelligence', 12, 8),

-- 8. Web Development
('Eloquent JavaScript', 'Marijn Haverbeke', '978-1593279509', 'A modern introduction to programming and JavaScript.', 'Web Development', 30, 25),
('Learning React', 'Alex Banks', '978-1492051220', 'Modern patterns for developing React applications.', 'Web Development', 20, 18),
('Fullstack React', 'Anthony Accomazzo', '978-0991344628', 'The complete guide to ReactJS and Friends.', 'Web Development', 15, 10),

-- 9. Cloud Computing
('Cloud Computing: Concepts, Technology & Architecture', 'Thomas Erl', '978-0133387520', 'A comprehensive guide to cloud computing technologies and business models.', 'Cloud Computing', 15, 12),
('Architecting for the Cloud', 'Jurg van Vliet', '978-1449336219', 'AWS best practices for designing high availability and scalable systems.', 'Cloud Computing', 10, 10),
('Kubernetes Up & Running', 'Kelsey Hightower', '978-1492046530', 'Dive into the future of infrastructure and deploying scalable applications.', 'Cloud Computing', 18, 14),

-- 10. Cyber Security
('The Web Application Hacker''s Handbook', 'Dafydd Stuttard', '978-1118026472', 'Finding and exploiting security flaws in web applications.', 'Cyber Security', 12, 9),
('Practical Malware Analysis', 'Michael Sikorski', '978-1593272906', 'The hands-on guide to dissecting malicious software.', 'Cyber Security', 8, 5),
('Ghost in the Wires', 'Kevin Mitnick', '978-0316037709', 'My adventures as the world''s most wanted hacker.', 'Cyber Security', 14, 12),

-- Bonus Software Engineering
('Clean Code', 'Robert C. Martin', '978-0132350884', 'A handbook of agile software craftsmanship and best practices.', 'Software Engineering', 30, 25),
('Design Patterns', 'Erich Gamma', '978-0201633610', 'Elements of reusable object-oriented software (The Gang of Four book).', 'Software Engineering', 20, 15),
('System Design Interview', 'Alex Xu', '978-1736049112', 'An insider''s guide to acing the system design interview.', 'Software Engineering', 25, 20);
