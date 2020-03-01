 USE timely_db;

INSERT INTO users (username, password, isAdmin, createdAt, updatedAt) VALUES ("bossyPants", "asdf", 1, "2020-01-01 12:12:12", "2020-02-02 13:13:13");
INSERT INTO users (username, password, isAdmin, createdAt, updatedAt) VALUES ("someCustomer", "asdf", 0, "2020-01-01 12:12:12", "2020-02-02 13:13:13");
INSERT INTO users (username, password, isAdmin, createdAt, updatedAt) VALUES ("workerGuy", "asdf", 0, "2020-01-01 12:12:12", "2020-02-02 13:13:13");
INSERT INTO users (username, password, isAdmin, createdAt, updatedAt) VALUES ("anotherWorker", "asdf", 0, "2020-01-01 12:12:12", "2020-02-02 13:13:13");
-- SELECT * FROM users;

INSERT INTO handymans (firstName, lastName, streetAddress, city, state, zipCode, email, phoneNumber, createdAt, updatedAt, UserId) VALUES ("Guy", "Firey", "123 Front st", "seattle", "WA", "99000", "mybidding@be.done", "5555551234", "2020-01-01 12:12:12", "2020-02-02 13:13:13", 1);
INSERT INTO handymans (firstName, lastName, streetAddress, city, state, zipCode, email, phoneNumber, createdAt, updatedAt, UserId) VALUES ("Terry", "Drone", "245 First st", "seattle", "WA", "99000", "happyworkerbee@notreally.fake", "5555559514", "2020-01-01 12:12:12", "2020-02-02 13:13:13", 3);
INSERT INTO handymans (firstName, lastName, streetAddress, city, state, zipCode, email, phoneNumber, createdAt, updatedAt, UserId) VALUES ("Antony", "Werx", "555 Hill st", "seattle", "WA", "99000", "lugstuff@grunt.oof", "5555554561", "2020-01-01 12:12:12", "2020-02-02 13:13:13", 4);
-- SELECT * FROM handymans;

INSERT INTO customers (firstName, lastName, streetAddress, city, state, zipCode, email, phoneNumber, createdAt, updatedAt, UserId) VALUES ("Hans", "Gruber", "100 Nakatomi Tower", "seattle", "WA", "99000", "snapesmyfavorite@wizard.wiz", "5555556666", "2020-01-01 12:12:12" , "2020-02-02 13:13:13", 2);
-- SELECT * FROM customers;

INSERT INTO servicemenus (title, manHour, numberOfHandyMan, createdAt, updatedAt) VALUES ("dig a hole", 3, 1, "2020-01-01 12:12:12" , "2020-02-02 13:13:13");
INSERT INTO servicemenus (title, manHour, numberOfHandyMan, createdAt, updatedAt) VALUES ("mow a lawn", 2, 1, "2020-01-01 12:12:12" , "2020-02-02 13:13:13");
INSERT INTO servicemenus (title, manHour, numberOfHandyMan, createdAt, updatedAt) VALUES ("move an appliance", 2, 2, "2020-01-01 12:12:12" , "2020-02-02 13:13:13");
-- SELECT * FROM servicemenus;

INSERT INTO servicerequests (status, streetAddress, city, state, zipCode ,startTime, endTime, createdAt, updatedAt, CustomerId, ServiceMenuId) VALUES ("in process", "100 Nakatomi Tower", "seattle", "WA", "99000", "2020-02-02 11:00:00", "2020-02-02 13:13:13", "2020-01-01 12:12:12" , "2020-02-02 13:13:13", 1, 3);
INSERT INTO servicerequests (status, streetAddress, city, state, zipCode ,startTime, endTime, createdAt, updatedAt, CustomerId, ServiceMenuId) VALUES ("complete", "100 Nakatomi Tower", "seattle", "WA", "99000", "2020-02-02 09:00:00", "2020-02-02 11:00:00", "2020-01-01 12:12:12" , "2020-02-02 11:00:00", 1, 2);
SELECT * FROM servicerequests;

INSERT INTO assignments(createdAt, UpdatedAt, ServiceRequestId, HandyManId) VALUES ("2020-01-01 10:10:10", "2020-01-02 11:00:00", 1, 2);
-- SELECT * FROM assignments;