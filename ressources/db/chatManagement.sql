/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.3-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: chatManagement
-- ------------------------------------------------------
-- Server version	11.8.3-MariaDB

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

CREATE DATABASE IF NOT EXISTS chatManagement;
CREATE USER 'prodUser'@'%' IDENTIFIED BY 'prod@mypassword.mariadb';
GRANT ALL PRIVILEGES ON chatManagement.* TO 'prodUser'@'%';
FLUSH PRIVILEGES;

USE chatManagement;


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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assoc_request`
--

LOCK TABLES `assoc_request` WRITE;
/*!40000 ALTER TABLE `assoc_request` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `assoc_request` ENABLE KEYS */;
UNLOCK TABLES;
commit;

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumer`
--

LOCK TABLES `consumer` WRITE;
/*!40000 ALTER TABLE `consumer` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `consumer` VALUES
(1,'Gabimaru','','1759360645285.jpg',1,'','$2b$05$CfaszxyjlwpMFMLgSPTy9.KE55MjJPhjgn01LMbeOuB6C8LwtZdwu','gabimaru@hell.com','$2b$05$H0ylWFW0wojmG0.c1qg6oeLsWzGZMhA045Y2oqOWc0c6vFR4q2aY2',0,NULL,1,1,'fc603f81-dc3f-4f95-88de-ff43699b6c4c'),
(2,'Natsuki Subaru','','1759360770660.jpg',1,'','$2b$05$vmFU8nIAtlrphdQu12V1ZeUqZP/fNfwNYyeJoY9y/oL3kzfISch9m','natsukisubaru@zero.com','$2b$05$l5EM5yFNcNnjbSoKqbjqVuOTyRWuwVDOZmoGi1.6Jy7WDAinNLvty',0,NULL,1,1,'71b65898-8717-466e-a579-cc39c2743ebc');
/*!40000 ALTER TABLE `consumer` ENABLE KEYS */;
UNLOCK TABLES;
commit;

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumer_settings`
--

LOCK TABLES `consumer_settings` WRITE;
/*!40000 ALTER TABLE `consumer_settings` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `consumer_settings` VALUES
(1,1,1),
(2,2,2);
/*!40000 ALTER TABLE `consumer_settings` ENABLE KEYS */;
UNLOCK TABLES;
commit;

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
set autocommit=0;
INSERT INTO `consumer_talksphere` VALUES
(1,1),
(2,1);
/*!40000 ALTER TABLE `consumer_talksphere` ENABLE KEYS */;
UNLOCK TABLES;
commit;

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
set autocommit=0;
INSERT INTO `is_befriended` VALUES
(2,1),
(1,2);
/*!40000 ALTER TABLE `is_befriended` ENABLE KEYS */;
UNLOCK TABLES;
commit;

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `media` VALUES
(1,2,'1759360952912_1759360952912.webm','audio/webm'),
(2,3,'1759360973137_1759360973137.webm','audio/webm'),
(3,4,'1759360978720_1759360978720.webm','audio/webm'),
(4,5,'1759360990825_1759360990825.webm','audio/webm');
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;
commit;

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `message` VALUES
(1,'Salut','2025-10-01 23:22:21',1,1),
(2,NULL,'2025-10-01 23:22:32',2,1),
(3,NULL,'2025-10-01 23:22:53',1,1),
(4,NULL,'2025-10-01 23:22:58',2,1),
(5,NULL,'2025-10-01 23:23:10',2,1);
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;
commit;

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `settings` VALUES
(1,0.86,15,0,0,0,0,0,0,'1759360913280_customize_theme_1759360913269.jpeg',NULL,1),
(2,0.84,15,0,0,0,0,0,0,'1759360928161_customize_theme_1759360928153.jpeg',NULL,1);
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;
commit;

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `talksphere`
--

LOCK TABLES `talksphere` WRITE;
/*!40000 ALTER TABLE `talksphere` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `talksphere` VALUES
(1,NULL,NULL,'025f1abb-b7f7-42fb-b3fd-c446385bc7b0');
/*!40000 ALTER TABLE `talksphere` ENABLE KEYS */;
UNLOCK TABLES;
commit;

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
set autocommit=0;
/*!40000 ALTER TABLE `talksphere_media` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-10-02 16:17:43
