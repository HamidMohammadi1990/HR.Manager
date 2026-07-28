-- Fix: run this if notification-broadcast migration failed on NotificationReadReceipt table.
-- SQL Server disallows CASCADE on both NotificationId and UserId (multiple cascade paths).

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = N'NotificationReadReceipt')
BEGIN
    CREATE TABLE [dbo].[NotificationReadReceipt] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [NotificationId] INT NOT NULL,
        [UserId] INT NOT NULL,
        [ReadAtUtc] DATETIME2 NOT NULL,
        CONSTRAINT [PK_NotificationReadReceipt] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_NotificationReadReceipt_Notification_NotificationId]
            FOREIGN KEY ([NotificationId]) REFERENCES [dbo].[Notification] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_NotificationReadReceipt_User_UserId]
            FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id]) ON DELETE NO ACTION
    );

    CREATE UNIQUE INDEX [IX_NotificationReadReceipt_NotificationId_UserId]
        ON [dbo].[NotificationReadReceipt] ([NotificationId], [UserId]);

    CREATE INDEX [IX_NotificationReadReceipt_UserId]
        ON [dbo].[NotificationReadReceipt] ([UserId]);
END
GO

IF NOT EXISTS (
    SELECT 1 FROM [dbo].[__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260728103000_notification-broadcast'
)
BEGIN
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260728103000_notification-broadcast', N'10.0.9');
END
GO
