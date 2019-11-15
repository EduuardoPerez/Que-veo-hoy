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

USE `que_veo_hoy`;
CREATE TABLE genero (
  id int not null AUTO_INCREMENT,
  nombre varchar(30),     
  PRIMARY KEY(id)
);

USE `que_veo_hoy`;
ALTER TABLE `que_veo_hoy`.`pelicula` 
ADD COLUMN `genero_id` INT NOT NULL AFTER `trama`;

USE `que_veo_hoy`;
CREATE TABLE actor (
  id int not null AUTO_INCREMENT,
  nombre varchar(70),     
  PRIMARY KEY(id)
);

USE `que_veo_hoy`;
CREATE TABLE actor_pelicula (
  id int not null AUTO_INCREMENT,
  actor_id int,
  pelicula_id int,
  PRIMARY KEY(id)
);