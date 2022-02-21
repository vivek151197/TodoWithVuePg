CREATE DATABASE tododb;

CREATE TABLE todo(
  id INTEGER,
  title TEXT,
  notes TEXT,
  duedate TEXT,
  priority TEXT,
  showhide BOOLEAN,
  done BOOLEAN,
  bordercolor TEXT
);

-- ALTER TABLE todo
-- RENAME COLUMN title TO description;

-- ALTER TABLE todo
-- ALTER COLUMN title TYPE VARCHAR

-- SELECT  
--    column_name, 
--    data_type 
-- FROM 
--    information_schema.columns
-- WHERE 
--    table_name = 'todo';