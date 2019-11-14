CREATE SCHEMA `que_veo_hoy`;

USE `que_veo_hoy`;

CREATE TABLE pelicula (
  id int not null AUTO_INCREMENT,
  titulo varchar(100),     
  duracion int(5),     
  director varchar(400),     
  anio int(5),     
  fecha_lanzamiento date,     
  puntuacion int(2),     
  poster varchar(300),     
  trama varchar(700),     
  PRIMARY KEY(id) 
);

CREATE TABLE genero (
  id int not null AUTO_INCREMENT,
  nombre varchar(30),     
  PRIMARY KEY(id)
);

ALTER TABLE `que_veo_hoy`.`pelicula` 
ADD COLUMN `genero_id` INT NOT NULL AFTER `trama`;
