-- Active: 1741678145621@@127.0.0.1@5432@movie
CREATE TYPE status_enum AS ENUM ('Available', 'Not Available');

CREATE TABLE theater (
    id SERIAL PRIMARY KEY,  
    name VARCHAR(30) NOT NULL,
    location VARCHAR(50) NOT NULL,
    status status_enum DEFAULT 'Available'
);



INSERT INTO theater (name, location, status) VALUES
('CineWorld Max', 'Banjara Hills, Hyderabad', 'Available'),
('Star Multiplex', 'Gachibowli, Hyderabad', 'Available'),
('Silver Screen', 'Ameerpet, Hyderabad', 'Not Available'),
('DreamView Cinemas', 'Kukatpally, Hyderabad', 'Available'),
('Galaxy Theater', 'Miyapur, Hyderabad', 'Available');

SELECT*from theater;



CREATE Table customer(
    id SERIAL PRIMARY KEY,
    name varchar(30)  NOT NULL,
    email VARCHAR(30)  UNIQUE NOT NULL,
    phone VARCHAR(10) UNIQUE NOT Null
);

select*from customer;
create table movie_categories(
    id SERIAL PRIMARY KEY,
    description VARCHAR(10)
);
INSERT INTO movie_categories (description) VALUES 
('Hollywood'),
('Bollywood'),
('Tollywood');

CREATE TABLE movie (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    description TEXT,
    banner VARCHAR(60),
    duration VARCHAR(20),
    released_date DATE NOT NULL,
    rating VARCHAR(10) NOT NULL,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES movie_categories(id)
);
INSERT INTO movie (title, description, banner, duration, released_date, rating, category_id) VALUES
('Chava', 'An undercover cop tries to stop a bomb plot in the city.', 'assets/images/Bollywood/chava.jpg', '2h 10m', '2023-01-10', 8.1, 2),
('Do Patti', 'An astronaut’s emotional return to Earth.', 'assets/images/Bollywood/do Patti.jpg', '2h 20m', '2022-12-22', 7.9, 2),
('Fighter', 'Love blooms on an unexpected road trip.', 'assets/images/Bollywood/fighter.avif', '1h 50m', '2023-03-15', 8.3, 2),
('Jawan', 'Hackers plan a massive internet blackout.', 'assets/images/Bollywood/Jawan.webp', '2h 05m', '2022-11-05', 7.4, 2),
('Khuda Hafish', 'A battle to defend a modern empire.', 'assets/images/Bollywood/Khuda-Haafiz.jpg', '2h 30m', '2023-02-19', 8.5, 2),
('Mili', 'A fun-filled drama of college life.', 'assets/images/bollywood/Mili.jpg', '2h 00m', '2022-08-11', 7.2, 2),
('Animal', 'Elite soldiers in a race against time.', 'assets/images/Bollywood/Animal,jpg', '2h 18m', '2023-06-01', 8.0, 2),
('Saitan', 'A journey from street dancer to stage legend.', 'assets/images/Bollywood/saitan.jpg', '1h 57m', '2022-09-23', 7.6, 1),
('Adam Driver', 'A smart home turns hostile on its owners.', 'assets/images/Hollywood/AdamDriver.avif', '2h 01m', '2023-04-10', 7.3, 1),
('Assasing', 'A story of lost love and second chances.', 'assets/images/Hollywood/Assasing.jpg', '2h 12m', '2022-10-18', 7.9, 1),
('kingsMan', 'Myth meets technology in this fantasy epic.', 'assets/images/Hollywood/kingsMan.jpg', '2h 25m', '2023-07-20', 8.4, 1),
('Metrix', 'A gritty tale of gangs and undercover cops.', 'assets/images/Hollywood/Metrix.jpg', '2h 08m', '2022-05-28', 7.0, 1),
('Nightingale', 'A science team uncovers a galactic threat.', 'assets/images/Hollywood/nightingale.webp', '2h 15m', '2023-01-02', 8.2, 1),
('SAMARITAN', 'A comedy of errors before a big wedding.', 'assets/images/Hollywood/SAMARITAN.jpg', '1h 53m', '2022-04-09', 7.5, 1),
('abcd', 'A prince returns to save his kingdom.', 'assets/images/Tollywood/abcd.webp', '2h 30m', '2023-09-16', 8.6, 3),
('efgh', 'The rise of a woman in the music industry.', 'assets/images/Tollywood/efgh.webp', '2h 10m', '2023-05-07', 8.0, 3),
('Geeta Govinda', 'When time is the only enemy.', 'assets/images/Tollywood/GeetaGovinda.webp', '2h 14m', '2022-07-30', 7.8, 3),
('jhg.jpg', 'A heartwarming tale of community spirit.', 'assets/images/Tollywood/jhg.jpg', '2h 00m', '2022-06-12', 7.1, 3),
('kanchana', 'A mystery thriller involving a lost radio signal.', 'assets/images/Tollywood/kanchana.jpg', '1h 58m', '2023-03-01', 7.7, 3),
('Kantara', 'Two programmers fall in love during a hackathon.', 'assets/images/Tollywood/Kantara.jpg', '2h 02m', '2022-12-15', 8.1, 3),
('RRR', 'Two programmers fall in love during a hackathon.', 'assets/images/Tollywood/RRR.jpg', '2h 02m', '2022-12-15', 8.1, 3);

SELECT * from movie;


UPDATE movie
SET banner = 'assets/images/Bollywood/Animal.jpg'
WHERE title = 'Animal';
UPDATE movie
SET category_id = 2
WHERE title = 'Saitan';


CREATE TABLE movie_show (
    id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    theater_id INT NOT NULL,
    show_time_id INT NOT NULL,
    price DECIMAL(8, 2) NOT NULL,
    Foreign Key (show_time_id) REFERENCES show_time(id),
    FOREIGN KEY (movie_id) REFERENCES movie(id),
    FOREIGN KEY (theater_id) REFERENCES theater(id)
);


INSERT INTO movie_show (movie_id, theater_id, show_time_id, price) VALUES
(22, 1, 1, 180.00),
(23, 2, 2, 220.00),
(24, 1, 3, 250.00),
(25, 3, 4, 200.00),
(26, 2, 1, 210.00);

INSERT INTO movie_show (movie_id, theater_id, show_time_id, price) VALUES
(22, 1, 3, 180.00);

select * from movie_show;
CREATE TABLE movie_show_time (
    id SERIAL PRIMARY KEY,
    movie_show_id INT NOT NULL,
    show_time_id INT NOT NULL,

    FOREIGN KEY (movie_show_id) REFERENCES movie_show(id),
    FOREIGN KEY (show_time_id) REFERENCES show_time(id)
);


create  table show_time(
    id SERIAL PRIMARY KEY,
    description VARCHAR (30) Not NULL
);

INSERT INTO show_time (description) VALUES
('10:00 AM - 1:00 PM'),
('1:30 PM - 4:30 PM'),
('5:00 PM - 8:00 PM'),
('8:30 PM - 11:30 PM');

select*from show_time;
SELECT 
            m.id,
            m.title,
            m.description,
            m.banner,
            m.duration,
            m.released_date,
            m.rating,
            mc.description AS category
        FROM movie m
        LEFT JOIN movie_categories mc ON m.category_id = mc.id
        where category_id=2
        ORDER BY m.id;

        SELECT 
    ms.id AS show_id,
    m.title AS movie_name,
    t.name AS theater_name,
    t.location AS theater_location,
    st.description AS show_time,
    ms.price
FROM movie_show ms
JOIN movie m ON ms.movie_id = m.id
JOIN theater t ON ms.theater_id = t.id
JOIN show_time st ON ms.show_time_id = st.id;


      