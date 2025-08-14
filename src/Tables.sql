CREATE TABLE users (
    UUID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status VARCHAR(15) DEFAULT 'active',
    bio TEXT,
    avatar_url VARCHAR(200),
    last_login TIMESTAMP,
    is_google_user TINYINT(0) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `nodes` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `parent_id` int DEFAULT NULL,
  `score` float DEFAULT NULL,
  `total_subtree_score` float NOT NULL DEFAULT '0',
  `leaf_count_in_subtree` int NOT NULL DEFAULT '0',
  `popularity` float NOT NULL DEFAULT '0',
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `statementTrueFalseFlag` tinyint DEFAULT NULL,
  `allChildrenCompleted` tinyint DEFAULT NULL,
  `non_null_leaf_count` int DEFAULT NULL,
  `privacy_level` tinyint DEFAULT 0,
  `UUID` INT,
  KEY `idx_parent_id` (`parent_id`),
  CONSTRAINT `nodes_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `nodes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=295 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique comment ID',
    node_id INT NOT NULL COMMENT 'Foreign key referencing nodes table',
    UUID INT COMMENT 'Optional: ID of commenting user if applicable',
    comment_text TEXT NOT NULL COMMENT 'Content of the comment',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Auto-generated creation timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    prostatus TINYINT(1),
    CONSTRAINT fk_comments_node 
        FOREIGN KEY (node_id) REFERENCES nodes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Stores comments associated with nodes';

CREATE TABLE comment_reactions (
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    reacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reaction_type INT NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(UUID) ON DELETE CASCADE,
    UNIQUE INDEX unique_comment_user (comment_id, user_id)
) ENGINE=InnoDB;

CREATE TABLE topic_roots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    node_id INT,
    title VARCHAR(255),
    UUID INT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Auto-generated creation timestamp',
    FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE
);

CREATE TABLE node_reactions(
  node_id INT,
  UUID INT,
  reaction_type TINYINT,
  reacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE,
  FOREIGN KEY (UUID) REFERENCES users(UUID) ON DELETE CASCADE
);

CREATE TABLE sessions (
  session_id VARCHAR(128) NOT NULL PRIMARY KEY,
  expires INT(11) UNSIGNED NOT NULL,
  data TEXT
) ENGINE=InnoDB;

CREATE TABLE theme_table_dimension(
  theme_table_id INT NOT NULL,
  theme_name VARCHAR(255)
);
INSERT INTO theme_table_dimension VALUES(1, 'light');
INSERT INTO theme_table_dimension VALUES(0, 'dark');
INSERT INTO theme_table_dimension VALUES(2, 'blue');
INSERT INTO theme_table_dimension VALUES(3, 'contrast');


CREATE TABLE user_settings (
  UUID INT NOT NULL PRIMARY KEY,
  theme_table_id TINYINT DEFAULT 1,
  user_type TINYINT,
  FOREIGN KEY (UUID) REFERENCES users(UUID) ON DELETE CASCADE
);

CREATE TABLE user_saved(
  UUID INT NOT NULL,
  node_id INT NOT NULL,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (UUID) REFERENCES users(UUID) ON DELETE CASCADE,
  FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE
);

--not yet implemented
CREATE TABLE user_warnings (
  UUID INT NOT NULL PRIMARY KEY,
  create_root_warning TINYINT(1) DEFAULT 0,
  create_comment_warning TINYINT(1) DEFAULT 0,
  endorse_comment_warning TINYINT(1) DEFAULT 0,
  report_comment_warning TINYINT(1) DEFAULT 0,
  FOREIGN KEY (UUID) REFERENCES users(UUID) ON DELETE CASCADE
);



--not yet implemented
CREATE TABLE user_notifications(
  UUID INT NOT NULL PRIMARY KEY,

  FOREIGN KEY (UUID) REFERENCES users(UUID) ON DELETE CASCADE
)

--not yet implemented
CREATE TABLE root_privacy(
  UUID INT NOT NULL,
  node_id INT NOT NULL,
  permission_type TINYINT,
  PRIMARY KEY(UUID, node_id),
  FOREIGN KEY (UUID) REFERENCES users(UUID) ON DELETE CASCADE,
  FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE
)


SELECT * FROM nodes WHERE id = 820;

SELECT * 
      FROM nodes 
      WHERE 
        title LIKE '%%'
      LIMIT 20

