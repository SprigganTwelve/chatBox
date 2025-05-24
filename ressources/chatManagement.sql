/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.7.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: chatManagement
-- ------------------------------------------------------
-- Server version	11.7.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `assoc_request`
--

DROP TABLE IF EXISTS `assoc_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `assoc_request` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `assoc_request_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `consumer` (`id`),
  CONSTRAINT `assoc_request_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `consumer` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assoc_request`
--

LOCK TABLES `assoc_request` WRITE;
/*!40000 ALTER TABLE `assoc_request` DISABLE KEYS */;
INSERT INTO `assoc_request` VALUES
(6,8,5),
(8,10,5),
(9,10,6),
(11,12,11);
/*!40000 ALTER TABLE `assoc_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consumer`
--

DROP TABLE IF EXISTS `consumer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `consumer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `pseudo` varchar(50) DEFAULT NULL,
  `image` varchar(200) DEFAULT NULL,
  `online` tinyint(1) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `key_friend` varchar(120) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(120) NOT NULL,
  `doubleAuthentification` tinyint(1) DEFAULT 0,
  `number` varchar(50) DEFAULT NULL,
  `availability` tinyint(1) DEFAULT 0,
  `visibility` tinyint(1) DEFAULT 0,
  `folder` varchar(120) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumer`
--

LOCK TABLES `consumer` WRITE;
/*!40000 ALTER TABLE `consumer` DISABLE KEYS */;
INSERT INTO `consumer` VALUES
(4,'Limule','','1744844214065.jpeg',NULL,'','$2b$05$MuBKZkgdXb3kyg7fDhYo4.5GzPYcZchYdprmuDZkNvHpD9XqQzjLS','limule@org.com','$2b$05$5EtyAV0lX9C2IeWbAVozDuOtBfsSA4eVjP/yFAP5O8XSRmEZptwGy',0,NULL,0,0,'3c931fc7-5bdb-43a9-9202-e0c1c8a1dbb8'),
(5,'Itadori yuji','','17449717723441744971772337.jpeg',1,'','$2b$05$cTnxibVmRA6CEe9Z1fP2d.Wt3Iv8wnF7j.37mXCrCP/Ev5jGbf3We','yuji@jjk.com','$2b$05$Nzryy5myQTLTU1uj2f/FwuuFP1OZfImkrGytiJKlr1K7Qtp29k6ha',0,NULL,0,1,'1268d1d1-3fa6-4ed4-ad9f-9b39caf85582'),
(6,'Gojo satoru','','1744966977292.png',1,'','$2b$05$r6SDI9R5sOyCX.3SwoZ1P.tDu9zrJsBvKFthvRkS70CpjSUEhkIpC','satoru@gmail.com','$2b$05$lDoNZ.8HH.ilBkLU1.QC7ebj7WJhBNJHZw3f/bpEnV7NJcQKkNGeK',0,NULL,0,1,'7d0a4d8e-1714-4e80-84b6-4d45c23d23ad'),
(7,'rudeus','','1745012416651.jpg',1,'','$2b$05$23QWMUgp9IVxT.a6/RcRl.3VULDCcrrcRtC.8fU7LTvBn4i/oayI2','rudeus@gmail.com','$2b$05$qcc43Wy7ernVxYCA4WQwYuxjjmjqnKiEtUTzskrps3CEtUWtNvZIy',0,NULL,0,0,'4c620513-be3d-4a5e-bd6c-1b5c016fd5bd'),
(8,'Gojo Satoru','','1745158530367.jpeg',1,'','$2b$05$MH9EISMHhAd0chu6g6mKJu59AVmryrbmP/ntLm55cLMmyRTIWzOmS','gojo@gmail.com','$2b$05$ix6cIesnilQn9Yir1p5WJ.vA01NNhcpErAnlZJQejdUbw3zs48BcS',0,NULL,0,0,'03b8f031-5ecc-43f2-b714-56474be9288a'),
(9,'Gojo Satoru','','1746584036522.jpg',1,'','$2b$05$bxRgJXZFYYe8IeSMiMljXei.2oO6j/mVJMrAvPH0HNjmiTkp5dfZG','gojoadmin@jjk.com','$2b$05$5g5mUdh.u6S4vUkFi99n9.B2v0gpsngqr6hIOiA6SrXmK5wiKdCl.',0,NULL,0,1,'f2e238fc-67e6-4284-b8dd-7d6b9fcbb032'),
(10,'Jojo','','1746584229537.jpg',1,'','$2b$05$sXbKkM6pIhm84wYqgnRB8ufRapwDQdp6WFULwsJ2wFLy3O3khDmIa','jojo@gmail.com','$2b$05$M1ayoyhPSy/Rlb6iUOec/OgQPX3O0CywTz4bPQjTQ57c5gV8lZ1Am',0,NULL,0,0,'e7bf8da8-3f3a-471f-831b-33e8de15b8cb'),
(11,'uzumaki narutkdkdkkd','','17478177962371747817796226.jpeg',1,'','$2b$05$..DfLXH51XgqfBj7vxID8OAtBi662fmLGxGXm2Et1TB56QAfkpH1S','naruto@uzumaki.com','$2b$05$lK07sFM.PDGYuLcn7mCOIOuqIeDYc//JN6NYCK1ev7o9H2LumLm3m',0,NULL,1,1,'bb60fd44-70f6-484f-b0c0-6dd3aaf34f5d'),
(12,'Cebastian','','1747833287240.avif',1,'','$2b$05$k2rvBgDIlZRYXyU9IytQxuCn7SowpAzFbNAR/owb1Joe634vZKaa.','cebastian@bblutler.com','$2b$05$AHzxll5JpArwY3HM8r9Bt.HNTMtCszVBndRdIVrKDGKufHLFGoB2u',0,NULL,0,0,'17772f51-7ee7-4a46-b9db-6e0e8149d95a');
/*!40000 ALTER TABLE `consumer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consumer_settings`
--

DROP TABLE IF EXISTS `consumer_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `consumer_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `consumer_id` int(11) NOT NULL,
  `settings_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `consumer_id` (`consumer_id`),
  UNIQUE KEY `settings_id` (`settings_id`),
  CONSTRAINT `consumer_settings_ibfk_1` FOREIGN KEY (`consumer_id`) REFERENCES `consumer` (`id`),
  CONSTRAINT `consumer_settings_ibfk_2` FOREIGN KEY (`settings_id`) REFERENCES `settings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumer_settings`
--

LOCK TABLES `consumer_settings` WRITE;
/*!40000 ALTER TABLE `consumer_settings` DISABLE KEYS */;
INSERT INTO `consumer_settings` VALUES
(4,4,4),
(5,5,5),
(6,6,6),
(7,7,7),
(8,8,8),
(9,9,9),
(10,10,10),
(11,11,11),
(12,12,12);
/*!40000 ALTER TABLE `consumer_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consumer_talksphere`
--

DROP TABLE IF EXISTS `consumer_talksphere`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `consumer_talksphere` (
  `consumer_id` int(11) NOT NULL,
  `talksphere_id` int(11) NOT NULL,
  PRIMARY KEY (`consumer_id`,`talksphere_id`),
  KEY `talksphere_id` (`talksphere_id`),
  CONSTRAINT `consumer_talksphere_ibfk_1` FOREIGN KEY (`consumer_id`) REFERENCES `consumer` (`id`),
  CONSTRAINT `consumer_talksphere_ibfk_2` FOREIGN KEY (`talksphere_id`) REFERENCES `talksphere` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumer_talksphere`
--

LOCK TABLES `consumer_talksphere` WRITE;
/*!40000 ALTER TABLE `consumer_talksphere` DISABLE KEYS */;
INSERT INTO `consumer_talksphere` VALUES
(5,2),
(6,2),
(5,3),
(7,3),
(6,4),
(7,4),
(6,5),
(8,5),
(9,6),
(11,6),
(9,7),
(12,7);
/*!40000 ALTER TABLE `consumer_talksphere` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `is_befriended`
--

DROP TABLE IF EXISTS `is_befriended`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `is_befriended` (
  `consumer_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  PRIMARY KEY (`consumer_id`,`friend_id`),
  KEY `friend_id` (`friend_id`),
  CONSTRAINT `is_befriended_ibfk_1` FOREIGN KEY (`consumer_id`) REFERENCES `consumer` (`id`),
  CONSTRAINT `is_befriended_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `consumer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `is_befriended`
--

LOCK TABLES `is_befriended` WRITE;
/*!40000 ALTER TABLE `is_befriended` DISABLE KEYS */;
INSERT INTO `is_befriended` VALUES
(6,5),
(7,5),
(5,6),
(7,6),
(8,6),
(5,7),
(6,7),
(6,8),
(11,9),
(12,9),
(9,11),
(9,12);
/*!40000 ALTER TABLE `is_befriended` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` int(11) DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `type` varchar(40) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_media_message` (`message_id`),
  CONSTRAINT `fk_media_message` FOREIGN KEY (`message_id`) REFERENCES `message` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
INSERT INTO `media` VALUES
(1,116,'1744989321962.webm','audio/webm'),
(2,118,'1745012924768.webm','audio/webm'),
(11,135,'1745162696709.webm','audio/webm'),
(12,136,'1745167087363.webm','audio/webm'),
(13,137,'1745167124340.webm','audio/webm'),
(14,140,'1746982678830.webm','audio/webm'),
(15,143,'1746983796528.webm','audio/webm'),
(16,145,'1747049659780.webm','audio/webm'),
(17,146,'1747051747311.webm','audio/webm'),
(18,147,'1747051873636.webm','audio/webm'),
(19,148,'1747052339865.webm','audio/webm'),
(20,149,'1747052817168.webm','audio/webm'),
(21,150,'1747052922027.webm','audio/webm');
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `sender_id` int(11) NOT NULL,
  `talksphere_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `talksphere_id` (`talksphere_id`),
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `consumer` (`id`),
  CONSTRAINT `message_ibfk_2` FOREIGN KEY (`talksphere_id`) REFERENCES `talksphere` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES
(108,'Yo','2025-04-18 13:29:57',5,2),
(109,'Yep','2025-04-18 13:52:14',6,2),
(110,'How have you been since then ? ','2025-04-18 13:52:31',5,2),
(111,'Fine not bones broken and what about you ? ','2025-04-18 13:52:48',6,2),
(112,'same ','2025-04-18 13:52:57',5,2),
(113,'','2025-04-18 13:56:16',5,2),
(115,'muryokusho','2025-04-18 14:41:16',6,2),
(116,'','2025-04-18 15:15:21',5,2),
(117,'listen to this ! ','2025-04-18 21:32:05',5,2),
(118,'fdfgdfg','2025-04-18 21:48:44',7,3),
(132,'Salut bro ','2025-04-20 15:24:13',8,5),
(133,'Yo how are tou ','2025-04-20 15:24:31',6,5),
(134,'Fine bro','2025-04-20 15:24:44',8,5),
(135,'','2025-04-20 15:24:56',8,5),
(136,'','2025-04-20 16:38:07',8,5),
(137,'','2025-04-20 16:38:44',8,5),
(138,'yo satoru','2025-05-11 16:57:30',11,6),
(139,'salut uzumaki naruto','2025-05-11 16:57:42',9,6),
(140,'','2025-05-11 16:57:58',11,6),
(141,'take','2025-05-11 17:16:31',9,6),
(142,'','2025-05-11 17:16:31',9,6),
(143,'','2025-05-11 17:16:36',9,6),
(144,'succed ','2025-05-12 11:32:31',9,6),
(145,'','2025-05-12 11:34:19',11,6),
(146,'','2025-05-12 12:09:07',11,6),
(147,'','2025-05-12 12:11:13',11,6),
(148,'','2025-05-12 12:18:59',9,6),
(149,'take it ','2025-05-12 12:26:57',9,6),
(150,'','2025-05-12 12:28:42',9,6),
(151,'yo','2025-05-21 13:15:57',9,7),
(152,'Butler ','2025-05-21 13:16:43',12,7);
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `opacity` decimal(3,2) DEFAULT 1.00,
  `fontsize` int(11) DEFAULT 15,
  `typing_indicator` tinyint(1) DEFAULT 0,
  `auto_delete_messages` tinyint(1) DEFAULT 0,
  `sound_notification` tinyint(1) DEFAULT 0,
  `read_receipts` tinyint(1) DEFAULT 0,
  `desktop_notification` tinyint(1) DEFAULT 0,
  `mention_notification` tinyint(1) DEFAULT 0,
  `theme` varchar(120) DEFAULT 'cat.jpg',
  `dialect` varchar(50) DEFAULT NULL,
  `full` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES
(4,1.00,15,0,0,0,0,0,0,'cat.jpg',NULL,0),
(5,0.65,15,0,0,0,0,0,0,'1745018346389_customize_theme_1745018346373.jpeg',NULL,1),
(6,0.55,15,0,0,0,0,0,0,'1744984497129_customize_theme_1744984497108.jpeg',NULL,1),
(7,0.70,15,0,0,0,0,0,0,'1745012900473_customize_theme_1745012900465.jpeg',NULL,1),
(8,1.00,15,0,0,0,0,0,0,'1745159264577_customize_theme_1745159264570.jpeg',NULL,1),
(9,1.00,15,0,0,0,0,0,0,'1746982564201_customize_theme_1746982564191.jpeg',NULL,1),
(10,0.70,15,0,0,0,0,0,0,'1746584406619_customize_theme_1746584406611.jpeg',NULL,0),
(11,1.00,15,0,0,0,0,0,0,'1746982641339_customize_theme_1746982641329.jpeg',NULL,1),
(12,0.88,15,0,0,0,0,0,0,'1747836805732_customize_theme_1747836805724.jpeg',NULL,1);
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `talksphere`
--

DROP TABLE IF EXISTS `talksphere`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `talksphere` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image` varchar(120) DEFAULT NULL,
  `name` varchar(120) DEFAULT NULL,
  `folder` varchar(120) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `talksphere`
--

LOCK TABLES `talksphere` WRITE;
/*!40000 ALTER TABLE `talksphere` DISABLE KEYS */;
INSERT INTO `talksphere` VALUES
(2,NULL,NULL,'0fc411ca-54bc-4387-b7a7-b3d6cadce1d4'),
(3,NULL,NULL,'4b62501d-1052-4ba8-895f-fcdfe58e77f6'),
(4,NULL,NULL,'f8d10866-dfd9-4e8c-a35d-26506d6c53ec'),
(5,NULL,NULL,'a0fd6685-ac4c-4e80-8718-7bf88db7972a'),
(6,NULL,NULL,'d0583d0c-0048-4a22-9dca-7ab9b806ef9d'),
(7,NULL,NULL,'500dc653-cc27-49fb-87be-ed66b60c1043');
/*!40000 ALTER TABLE `talksphere` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `talksphere_media`
--

DROP TABLE IF EXISTS `talksphere_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `talksphere_media` (
  `talksphere_id` int(11) NOT NULL,
  `media_id` int(11) NOT NULL,
  PRIMARY KEY (`talksphere_id`,`media_id`),
  KEY `media_id` (`media_id`),
  CONSTRAINT `talksphere_media_ibfk_1` FOREIGN KEY (`talksphere_id`) REFERENCES `talksphere` (`id`),
  CONSTRAINT `talksphere_media_ibfk_2` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `talksphere_media`
--

LOCK TABLES `talksphere_media` WRITE;
/*!40000 ALTER TABLE `talksphere_media` DISABLE KEYS */;
/*!40000 ALTER TABLE `talksphere_media` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-05-24 15:58:58
