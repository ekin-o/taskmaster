using System.Data.SQLite;

namespace Taskmaster.Database
{
   public static class Utils
   {
      public static string GetConnectionString(string path)
      {
         return $"Data Source={path}";
      }
      public static void CreateTables(string dbPath, bool createDatabase = false)
      {
         if (!Path.Exists(dbPath) || createDatabase)
         {
            // this creates a zero-byte file
            SQLiteConnection.CreateFile(dbPath);

            SQLiteConnection m_dbConnection = new SQLiteConnection(GetConnectionString(dbPath));
            m_dbConnection.Open();

            var createTables = @"
            CREATE TABLE Users (
               Id INTEGER PRIMARY KEY AUTOINCREMENT,
               FirstName VARCHAR(50) NOT NULL,
               LastName VARCHAR(50) NOT NULL,
               Email VARCHAR(100) NOT NULL,
               CreateTimestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
               ModifyTimestamp DATETIME NULL
             );

            CREATE TABLE Authentication (
               Id INTEGER PRIMARY KEY,
               Salt VARCHAR(25) NOT NULL,
               Hash VARCHAR(255) NOT NULL,
               UserId INTEGER NOT NULL,
               CONSTRAINT [FK_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id])
             );
         
            CREATE TABLE Lists (
               Id INTEGER PRIMARY KEY AUTOINCREMENT,
               Name VARCHAR(255) NOT NULL,
               Starred BOOLEAN NOT NULL DEFAULT 0,
               Deleted BOOLEAN NOT NULL DEFAULT 0,
               CreateTimestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
               ModifyTimestamp DATETIME NULL,
               OwnerId INTEGER NOT NULL,
               CONSTRAINT [FK_OwnerId] FOREIGN KEY ([OwnerId]) REFERENCES [Users]([Id])
             );

            CREATE TABLE Tasks (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Name VARCHAR(255) NOT NULL,
                Done BOOLEAN NOT NULL DEFAULT 0,
                Deleted BOOLEAN NOT NULL DEFAULT 0,
                Starred BOOLEAN NOT NULL DEFAULT 0,
                DueDate DATETIME NULL,
                CreateTimestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                ModifyTimestamp DATETIME NULL,
                ListId INTEGER NOT NULL,
                CONSTRAINT [FK_ListId] FOREIGN KEY ([ListId]) REFERENCES [Lists]([Id])
             );

            INSERT INTO Users (FirstName, LastName, Email) VALUES ('User', 'One', 'userone@email.com');
            INSERT INTO Users (FirstName, LastName, Email) VALUES ('User', 'Two', 'usertwo@email.com');
            INSERT INTO Users (FirstName, LastName, Email) VALUES ('User', 'Three', 'userthree@email.com');

            INSERT INTO Authentication (Id, Salt, Hash, UserId) VALUES (1, '29P/ZvDT.NoY1pQ=}/hiJ#', 'YkC3CMBnRclNkshwD3XgOj656e41+oNVhG9aCYICu1E=',1);
            INSERT INTO Authentication (Id, Salt, Hash, UserId) VALUES (2, ')&a\u=@)wqY{9k`ujv?pG4', 'zWM1AKTumE/grxZAlJt6s0bpH3hJ0Z2TYObNMeb5kX8=',2);
            INSERT INTO Authentication (Id, Salt, Hash, UserId) VALUES (3, 'tnL%%{V!lS^A.,TE_V;bSy', '3kDjulJ14aiWYttx0LASs4kSH658RoVH1a1nKg/bgfQ=',3);
            ";

            SQLiteCommand command = new SQLiteCommand(createTables, m_dbConnection);
            command.ExecuteNonQuery();
            m_dbConnection.Close();
         }
      }
      public static void PopulateTestingData(string dbPath)
      {
         SQLiteConnection m_dbConnection = new SQLiteConnection(GetConnectionString(dbPath));
         m_dbConnection.Open();

         var populateCmd = @"
          INSERT INTO Lists (Name, OwnerId) VALUES ('My First List', 1);
          INSERT INTO Lists (Name, OwnerId) VALUES ('2nd List', 1);

          INSERT INTO Tasks (Name, ListId) VALUES ('First task', 1);
          INSERT INTO Tasks (Name, ListId) VALUES ('second in the list', 1);
          INSERT INTO Tasks (Name, ListId) VALUES ('newest todo', 1);
          INSERT INTO Tasks (Name, ListId) VALUES ('todo', 2);
         ";

         SQLiteCommand command = new SQLiteCommand(populateCmd, m_dbConnection);
         command.ExecuteNonQuery();
         m_dbConnection.Close();
      }
   }
}
