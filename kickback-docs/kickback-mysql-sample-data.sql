-- KickBack sample data
-- Purpose: populate the current KickBack schema with realistic data for API/frontend testing.
-- Notes:
--   * Seeded login password for all USER/OWNER/ADMIN accounts: password123


-- Run below line before starting springboot application
create database kickback;

-- Run below lines after starting springboot application
use kickback;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM resource_images;
DELETE FROM cafe_images;
DELETE FROM reviews;
DELETE FROM payments;
DELETE FROM bookings;
DELETE FROM offers;
DELETE FROM resource_games;
DELETE FROM resources;
DELETE FROM operating_days;
DELETE FROM cafe_amenities;
DELETE FROM amenities;
DELETE FROM games;
DELETE FROM resource_types;
DELETE FROM cafe_address;
DELETE FROM cafes;
DELETE FROM users;

ALTER TABLE users AUTO_INCREMENT = 1001;
ALTER TABLE cafes AUTO_INCREMENT = 101;
ALTER TABLE cafe_address AUTO_INCREMENT = 201;
ALTER TABLE amenities AUTO_INCREMENT = 1;
ALTER TABLE operating_days AUTO_INCREMENT = 1;
ALTER TABLE resource_types AUTO_INCREMENT = 1;
ALTER TABLE resources AUTO_INCREMENT = 301;
ALTER TABLE games AUTO_INCREMENT = 401;
ALTER TABLE bookings AUTO_INCREMENT = 501;
ALTER TABLE payments AUTO_INCREMENT = 701;
ALTER TABLE reviews AUTO_INCREMENT = 801;
ALTER TABLE offers AUTO_INCREMENT = 601;
ALTER TABLE cafe_images AUTO_INCREMENT = 901;
ALTER TABLE resource_images AUTO_INCREMENT = 1001;

-- =========================================================
-- USERS
-- BCrypt password for every seeded account: password123
-- =========================================================
INSERT INTO users
(user_id, first_name, last_name, email, phone, username, password_hash, role, created_at, updated_at)
VALUES
(1001, 'Rajesh', 'Kumar', 'rajesh.owner@example.com', '8765432109', 'rajesh_cafes',
 '$2y$10$mSzkv7YDSiIEXjKpMzOBEOli/BI/Q43f/B6vbqvY/EJI5gbDUQ6mG',
 'OWNER', '2026-02-01 11:15:00', '2026-08-20 10:00:00'),

(1002, 'Amit', 'Sharma', 'amit.sharma@example.com', '7654321098', 'amit_gamer',
 '$2y$10$mSzkv7YDSiIEXjKpMzOBEOli/BI/Q43f/B6vbqvY/EJI5gbDUQ6mG',
 'USER', '2026-03-15 14:30:00', '2026-08-25 09:45:00'),

(1003, 'Priya', 'Verma', 'priya.verma@example.com', '9876543210', 'priya_admin',
 '$2y$10$mSzkv7YDSiIEXjKpMzOBEOli/BI/Q43f/B6vbqvY/EJI5gbDUQ6mG',
 'ADMIN', '2026-04-10 10:00:00', '2026-08-30 12:00:00'),

(1004, 'Neha', 'Patel', 'neha.patel@example.com', '9123456780', 'neha_gamer',
 '$2y$10$mSzkv7YDSiIEXjKpMzOBEOli/BI/Q43f/B6vbqvY/EJI5gbDUQ6mG',
 'USER', '2026-05-12 16:20:00', '2026-08-29 18:10:00');

-- =========================================================
-- CAFES
-- =========================================================
INSERT INTO cafes
(cafe_id, owner_id, name, slug, email, phone, description, average_rating, total_reviews, created_at, updated_at)
VALUES
(101, 1001, 'The Nexus Esports Cafe', 'the-nexus-esports-cafe',
 'contact@nexuscafe.com', '9112345678',
 'Premium gaming cafe with high-end gaming PCs, next-generation consoles, fast internet and competitive gaming zones.',
 4.8, 3, '2026-02-05 09:00:00', '2026-08-28 18:20:00'),

(102, 1001, 'Pixel Arena Gaming Lounge', 'pixel-arena-gaming-lounge',
 'hello@pixelarena.com', '9112345679',
 'Modern gaming lounge featuring gaming PCs, PlayStation booths and a dedicated racing simulator.',
 4.6, 2, '2026-03-10 10:30:00', '2026-08-26 15:00:00'),

(103, 1001, 'GameGrid Bhopal', 'gamegrid-bhopal',
 'support@gamegrid.com', '9112345680',
 'Casual and competitive gaming space with console booths, PCs and a snooker zone.',
 4.4, 1, '2026-04-15 11:00:00', '2026-08-22 13:30:00'),

(104, 1001, 'Indore GameHub', 'indore-gamehub',
 'hello@indoregamehub.com', '9112345681',
 'Large gaming cafe in Indore with PC stations, console booths and multiplayer entertainment.',
 4.7, 2, '2026-05-01 12:00:00', '2026-08-24 17:00:00');

-- =========================================================
-- CAFE ADDRESS
-- =========================================================
INSERT INTO cafe_address
(address_id, cafe_id, address_line1, address_line2, city, state, country, pincode, created_at, updated_at)
VALUES
(201, 101, '122, MP Nagar Zone II', 'Near Jyoti Cinema Complex',
 'Bhopal', 'Madhya Pradesh', 'India', '462011',
 '2026-02-05 09:00:00', '2026-08-28 18:20:00'),

(202, 102, '45, Arera Colony', 'Near 10 No. Market',
 'Bhopal', 'Madhya Pradesh', 'India', '462016',
 '2026-03-10 10:30:00', '2026-08-26 15:00:00'),

(203, 103, '18, Maharana Pratap Nagar', 'Opposite City Mall',
 'Bhopal', 'Madhya Pradesh', 'India', '462023',
 '2026-04-15 11:00:00', '2026-08-22 13:30:00'),

(204, 104, '12, Vijay Nagar', 'Near C21 Mall',
 'Indore', 'Madhya Pradesh', 'India', '452010',
 '2026-05-01 12:00:00', '2026-08-24 17:00:00');

-- =========================================================
-- AMENITIES
-- =========================================================
INSERT INTO amenities
(amenity_id, amenity_name, icon_name)
VALUES
(1, 'High-Speed Fiber Internet', 'wifi-bolt'),
(2, 'Air Conditioned Lounge', 'snowflake'),
(3, 'In-house Cafeteria', 'coffee'),
(4, 'Free Parking', 'parking'),
(5, 'Gaming Headsets', 'headset'),
(6, 'Power Backup', 'battery'),
(7, 'Tournament Zone', 'trophy');

INSERT INTO cafe_amenities (cafe_id, amenity_id) VALUES
(101, 1), (101, 2), (101, 3), (101, 5), (101, 7),
(102, 1), (102, 2), (102, 4), (102, 5),
(103, 1), (103, 2), (103, 3), (103, 6),
(104, 1), (104, 2), (104, 4), (104, 5), (104, 7);

-- =========================================================
-- OPERATING DAYS
-- =========================================================
INSERT INTO operating_days
(operating_day_id, cafe_id, days_of_week, opening_time, closing_time, is_closed)
VALUES
-- Cafe 101
(1, 101, 'MON', '09:00:00', '23:00:00', FALSE),
(2, 101, 'TUE', '09:00:00', '23:00:00', FALSE),
(3, 101, 'WED', '09:00:00', '23:00:00', FALSE),
(4, 101, 'THU', '09:00:00', '23:00:00', FALSE),
(5, 101, 'FRI', '09:00:00', '23:59:00', FALSE),
(6, 101, 'SAT', '10:00:00', '01:00:00', FALSE),
(7, 101, 'SUN', '00:00:00', '00:00:00', TRUE),

-- Cafe 102
(8, 102, 'MON', '10:00:00', '22:00:00', FALSE),
(9, 102, 'TUE', '10:00:00', '22:00:00', FALSE),
(10, 102, 'WED', '10:00:00', '22:00:00', FALSE),
(11, 102, 'THU', '10:00:00', '22:00:00', FALSE),
(12, 102, 'FRI', '10:00:00', '23:30:00', FALSE),
(13, 102, 'SAT', '10:00:00', '23:30:00', FALSE),
(14, 102, 'SUN', '11:00:00', '21:00:00', FALSE),

-- Cafe 103
(15, 103, 'MON', '11:00:00', '22:00:00', FALSE),
(16, 103, 'TUE', '11:00:00', '22:00:00', FALSE),
(17, 103, 'WED', '11:00:00', '22:00:00', FALSE),
(18, 103, 'THU', '11:00:00', '22:00:00', FALSE),
(19, 103, 'FRI', '11:00:00', '23:00:00', FALSE),
(20, 103, 'SAT', '10:00:00', '23:00:00', FALSE),
(21, 103, 'SUN', '12:00:00', '20:00:00', FALSE),

-- Cafe 104
(22, 104, 'MON', '09:00:00', '22:00:00', FALSE),
(23, 104, 'TUE', '09:00:00', '22:00:00', FALSE),
(24, 104, 'WED', '09:00:00', '22:00:00', FALSE),
(25, 104, 'THU', '09:00:00', '22:00:00', FALSE),
(26, 104, 'FRI', '09:00:00', '23:00:00', FALSE),
(27, 104, 'SAT', '10:00:00', '23:00:00', FALSE),
(28, 104, 'SUN', '10:00:00', '20:00:00', FALSE);

-- =========================================================
-- RESOURCE TYPES
-- =========================================================
INSERT INTO resource_types
(resource_type_id, resource_name, supports_games, resource_image_url)
VALUES
(1, 'Gaming PC', TRUE, 'https://images.example.com/resource-types/gaming-pc.jpg'),
(2, 'PlayStation 5', TRUE, 'https://images.example.com/resource-types/playstation-5.jpg'),
(3, 'Snooker', FALSE, 'https://images.example.com/resource-types/snooker.jpg'),
(4, 'Racing Simulator', TRUE, 'https://images.example.com/resource-types/racing-simulator.jpg');

-- =========================================================
-- RESOURCES
-- =========================================================
INSERT INTO resources
(resource_id, cafe_id, resource_type_id, resource_name, brand, max_players, status, hourly_rate, specifications, created_at, updated_at)
VALUES
-- Cafe 101
(301, 101, 1, 'PC-1', 'ASUS ROG RTX 5080 Setup', 1, 'AVAILABLE', 150.00,
 'Intel i9, 32GB RAM, RTX 5080, 360Hz gaming monitor.',
 '2026-02-06 12:00:00', '2026-08-20 10:00:00'),

(302, 101, 2, 'Console Booth 1', 'Sony PlayStation 5 Pro', 4, 'AVAILABLE', 200.00,
 '55-inch 4K OLED TV with four controllers.',
 '2026-02-06 12:00:00', '2026-08-20 10:00:00'),

(303, 101, 1, 'PC-2', 'Alienware Aurora', 1, 'AVAILABLE', 140.00,
 'Intel i7, 32GB RAM, RTX 5070, 240Hz monitor.',
 '2026-02-07 12:00:00', '2026-08-21 09:00:00'),

-- Cafe 102
(304, 102, 1, 'Arena PC-1', 'Lenovo Legion Tower', 1, 'AVAILABLE', 130.00,
 'Intel i7, 32GB RAM, RTX 5070, 240Hz display.',
 '2026-03-11 11:00:00', '2026-08-18 14:00:00'),

(305, 102, 2, 'PS5 Booth A', 'Sony PlayStation 5', 4, 'AVAILABLE', 180.00,
 '4K display, four controllers and surround audio.',
 '2026-03-11 11:00:00', '2026-08-18 14:00:00'),

(306, 102, 4, 'Racing Pod 1', 'Logitech G Pro Racing', 2, 'AVAILABLE', 250.00,
 'Steering wheel, pedals, racing seat and 49-inch ultrawide display.',
 '2026-03-12 11:00:00', '2026-08-18 14:00:00'),

-- Cafe 103
(307, 103, 2, 'Console Booth 1', 'Sony PlayStation 5', 4, 'AVAILABLE', 170.00,
 '4K TV with four controllers.',
 '2026-04-16 11:00:00', '2026-08-19 12:00:00'),

(308, 103, 3, 'Snooker Table 1', 'Riley', 4, 'AVAILABLE', 300.00,
 'Full-size tournament snooker table with overhead lighting.',
 '2026-04-16 11:00:00', '2026-08-19 12:00:00'),

-- Cafe 104
(309, 104, 1, 'GameHub PC-1', 'MSI Aegis', 1, 'AVAILABLE', 125.00,
 'Intel i7, 32GB RAM, RTX 5070 and 240Hz monitor.',
 '2026-05-02 11:00:00', '2026-08-20 16:00:00'),

(310, 104, 2, 'PS5 Booth 1', 'Sony PlayStation 5 Pro', 4, 'AVAILABLE', 190.00,
 '4K OLED display with four controllers.',
 '2026-05-02 11:00:00', '2026-08-20 16:00:00');

-- =========================================================
-- GAMES
-- =========================================================
INSERT INTO games
(game_id, game_name, thumbnail_url, multiplayer, min_players, max_players, is_active)
VALUES
(401, 'Valorant', 'https://images.example.com/games/valorant.jpg', TRUE, 1, 10, TRUE),
(402, 'EA Sports FC 26', 'https://images.example.com/games/fc26.jpg', TRUE, 1, 4, TRUE),
(403, 'Counter-Strike 2', 'https://images.example.com/games/cs2.jpg', TRUE, 1, 10, TRUE),
(404, 'Forza Horizon 5', 'https://images.example.com/games/forza-horizon-5.jpg', TRUE, 1, 12, TRUE),
(405, 'Call of Duty: Warzone', 'https://images.example.com/games/warzone.jpg', TRUE, 1, 4, TRUE),
(406, 'Rocket League', 'https://images.example.com/games/rocket-league.jpg', TRUE, 1, 4, TRUE);

INSERT INTO resource_games (resource_id, game_id) VALUES
(301, 401),
(301, 403),
(302, 402),
(302, 406),
(303, 401),
(303, 403),
(304, 401),
(304, 403),
(305, 402),
(305, 405),
(306, 404),
(307, 402),
(307, 406),
(309, 401),
(309, 403),
(310, 402),
(310, 405);

-- =========================================================
-- BOOKINGS
-- =========================================================
INSERT INTO bookings
(booking_id, user_id, resource_id, cafe_id, game_id, start_timestamp, end_timestamp,
 booking_status, hold_expires_at, notes, subtotal, discount_amount, tax_amount, total_amount,
 created_at, updated_at)
VALUES
(501, 1002, 301, 101, 401,
 '2026-07-17 19:00:00', '2026-07-17 21:00:00',
 'CONFIRMED', NULL,
 'Requesting mechanical keyboard setup with linear switches if available.',
 300.00, 30.00, 0.00, 270.00,
 '2026-07-17 15:30:00', '2026-07-17 15:32:00'),

(502, 1002, 301, 101, 403,
 '2026-09-10 19:00:00', '2026-09-10 21:00:00',
 'CONFIRMED', NULL,
 'Future booking used to test resource availability.',
 300.00, 0.00, 15.00, 315.00,
 '2026-09-08 12:00:00', '2026-09-08 12:05:00'),

(503, 1004, 301, 101, 401,
 '2026-09-10 15:00:00', '2026-09-10 16:00:00',
 'CONFIRMED', NULL,
 'Short future gaming session.',
 150.00, 15.00, 6.75, 141.75,
 '2026-09-08 16:00:00', '2026-09-08 16:02:00'),

(504, 1004, 302, 101, 402,
 '2026-09-11 18:00:00', '2026-09-11 20:00:00',
 'CONFIRMED', NULL,
 'Console booking for FC 26.',
 400.00, 0.00, 20.00, 420.00,
 '2026-09-08 17:00:00', '2026-09-08 17:05:00'),

(505, 1002, 304, 102, 401,
 '2026-09-12 14:00:00', '2026-09-12 16:00:00',
 'CONFIRMED', NULL,
 'Weekend PC booking.',
 260.00, 26.00, 11.70, 245.70,
 '2026-09-08 18:00:00', '2026-09-08 18:05:00');

-- =========================================================
-- OFFERS
-- =========================================================
INSERT INTO offers
(offer_id, cafe_id, title, promo_code, description, offer_type, discount_type, discount_value,
 bonus_minutes, valid_from, valid_to, start_time, end_time, applicable_days,
 min_booking_minutes, min_booking_amount, is_active, created_at, updated_at)
VALUES
(601, 101, 'Happy Hours Gamer Discount', 'HAPPYHOUR10',
 'Get 10% off on weekday afternoon bookings.',
 'PERCENTAGE_DISCOUNT', 'PERCENTAGE', 10.00,
 0, '2026-06-01', '2026-12-31', '12:00:00', '16:00:00',
 'MON,TUE,WED,THU,FRI', 60, NULL, TRUE,
 '2026-05-28 10:00:00', '2026-08-25 10:00:00'),

(602, 101, 'Weekend Starter Deal', 'WEEKEND50',
 'Flat discount on bookings of at least two hours.',
 'FLAT_DISCOUNT', 'FIXED', 50.00,
 0, '2026-08-01', '2026-12-31', NULL, NULL,
 'SAT,SUN', 120, 250.00, TRUE,
 '2026-07-28 11:00:00', '2026-08-20 11:00:00'),

(603, 102, 'Racing Bonus Time', 'RACE15',
 'Get 15 bonus minutes on qualifying racing simulator bookings.',
 'EXTRA_TIME', NULL, NULL,
 15, '2026-08-15', '2026-11-30', '10:00:00', '18:00:00',
 'MON,TUE,WED,THU,FRI', 60, NULL, TRUE,
 '2026-08-10 10:00:00', '2026-08-20 10:00:00'),

(604, 103, 'Console Evening Discount', 'CONSOLE20',
 '20% off qualifying evening console bookings.',
 'PERCENTAGE_DISCOUNT', 'PERCENTAGE', 20.00,
 0, '2026-08-01', '2026-10-31', '18:00:00', '21:00:00',
 'MON,TUE,WED,THU,FRI', 60, NULL, TRUE,
 '2026-07-25 10:00:00', '2026-08-18 10:00:00'),

(605, 104, 'Indore Launch Offer', 'GAMEHUB75',
 'Flat introductory discount for new customers.',
 'FLAT_DISCOUNT', 'FIXED', 75.00,
 0, '2026-08-01', '2026-09-30', NULL, NULL,
 NULL, 60, 300.00, TRUE,
 '2026-07-30 09:00:00', '2026-08-20 09:00:00');

-- =========================================================
-- PAYMENTS
-- =========================================================
INSERT INTO payments
(payment_id, booking_id, amount, payment_method, payment_status, transaction_reference,
 paid_at, created_at, updated_at)
VALUES
(701, 501, 270.00, 'UPI', 'SUCCESS', 'TXN987654321045',
 '2026-07-17 15:32:00', '2026-07-17 15:30:00', '2026-07-17 15:32:00'),

(702, 502, 315.00, 'CARD', 'SUCCESS', 'TXN202609100502',
 '2026-09-08 12:05:00', '2026-09-08 12:00:00', '2026-09-08 12:05:00'),

(703, 503, 141.75, 'UPI', 'SUCCESS', 'TXN202609100503',
 '2026-09-08 16:02:00', '2026-09-08 16:00:00', '2026-09-08 16:02:00'),

(704, 504, 420.00, 'WALLET', 'SUCCESS', 'TXN202609110504',
 '2026-09-08 17:05:00', '2026-09-08 17:00:00', '2026-09-08 17:05:00'),

(705, 505, 245.70, 'NET_BANKING', 'SUCCESS', 'TXN202609120505',
 '2026-09-08 18:05:00', '2026-09-08 18:00:00', '2026-09-08 18:05:00');

-- =========================================================
-- REVIEWS
-- =========================================================
INSERT INTO reviews
(review_id, booking_id, rating, comment, created_at, updated_at)
VALUES
(801, 501, 5,
 'Insane response times on the VIP machines. Butter smooth frames for Valorant. Highly recommended!',
 '2026-07-17 21:15:00',
 '2026-07-17 21:15:00'),

(802, 505, 5,
 'Great PCs, clean setup and very smooth multiplayer experience.',
 '2026-09-12 16:20:00',
 '2026-09-12 16:20:00'),

(803, 504, 4,
 'The console booth was comfortable and the TV quality was excellent.',
 '2026-09-11 20:30:00',
 '2026-09-11 20:30:00');

-- =========================================================
-- CAFE IMAGES
-- =========================================================
INSERT INTO cafe_images
(image_id, cafe_id, image_url, display_order)
VALUES
(901, 101, 'https://images.example.com/cafes/nexus-main.jpg', 1),
(902, 101, 'https://images.example.com/cafes/nexus-lounge.jpg', 2),
(903, 102, 'https://images.example.com/cafes/pixel-arena-main.jpg', 1),
(904, 102, 'https://images.example.com/cafes/pixel-arena-racing.jpg', 2),
(905, 103, 'https://images.example.com/cafes/gamegrid-main.jpg', 1),
(906, 104, 'https://images.example.com/cafes/indore-gamehub-main.jpg', 1);

-- =========================================================
-- RESOURCE IMAGES
-- =========================================================
INSERT INTO resource_images
(image_id, resource_id, image_url, display_order)
VALUES
(1001, 301, 'https://images.example.com/resources/pc-1.jpg', 1),
(1002, 302, 'https://images.example.com/resources/ps5-booth-1.jpg', 1),
(1003, 303, 'https://images.example.com/resources/pc-2.jpg', 1),
(1004, 304, 'https://images.example.com/resources/arena-pc-1.jpg', 1),
(1005, 305, 'https://images.example.com/resources/ps5-booth-a.jpg', 1),
(1006, 306, 'https://images.example.com/resources/racing-pod-1.jpg', 1),
(1007, 307, 'https://images.example.com/resources/gamegrid-console.jpg', 1),
(1008, 308, 'https://images.example.com/resources/snooker-table-1.jpg', 1),
(1009, 309, 'https://images.example.com/resources/gamehub-pc-1.jpg', 1),
(1010, 310, 'https://images.example.com/resources/gamehub-ps5-1.jpg', 1);

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- QUICK VERIFICATION
-- =========================================================
SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL SELECT 'cafes', COUNT(*) FROM cafes
UNION ALL SELECT 'cafe_address', COUNT(*) FROM cafe_address
UNION ALL SELECT 'amenities', COUNT(*) FROM amenities
UNION ALL SELECT 'cafe_amenities', COUNT(*) FROM cafe_amenities
UNION ALL SELECT 'operating_days', COUNT(*) FROM operating_days
UNION ALL SELECT 'resource_types', COUNT(*) FROM resource_types
UNION ALL SELECT 'resources', COUNT(*) FROM resources
UNION ALL SELECT 'games', COUNT(*) FROM games
UNION ALL SELECT 'resource_games', COUNT(*) FROM resource_games
UNION ALL SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL SELECT 'payments', COUNT(*) FROM payments
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'offers', COUNT(*) FROM offers
UNION ALL SELECT 'cafe_images', COUNT(*) FROM cafe_images
UNION ALL SELECT 'resource_images', COUNT(*) FROM resource_images;
