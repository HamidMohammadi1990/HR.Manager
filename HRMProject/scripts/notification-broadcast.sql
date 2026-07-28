-- Run this script on HRDb if dotnet ef database update is not available.
-- Adds broadcast notification columns and read-receipt table.

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[dbo].[Notification]') AND name = N'AnnouncementId'
)
BEGIN
    ALTER TABLE [dbo].[Notification] DROP CONSTRAINT [FK_Notification_User_UserId];

    ALTER TABLE [dbo].[Notification] ALTER COLUMN [UserId] INT NULL;

    ALTER TABLE [dbo].[Notification] ADD
        [AnnouncementId] INT NULL,
        [AudienceDepartmentId] INT NULL,
        [AudienceRoleId] INT NULL;

    CREATE INDEX [IX_Notification_AnnouncementId] ON [dbo].[Notification] ([AnnouncementId]);
    CREATE INDEX [IX_Notification_AudienceDepartmentId] ON [dbo].[Notification] ([AudienceDepartmentId]);
    CREATE INDEX [IX_Notification_AudienceRoleId] ON [dbo].[Notification] ([AudienceRoleId]);

    ALTER TABLE [dbo].[Notification] WITH CHECK ADD CONSTRAINT [FK_Notification_User_UserId]
        FOREIGN KEY([UserId]) REFERENCES [dbo].[User] ([Id]) ON DELETE CASCADE;
END
GO

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
            FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id]) ON DELETE CASCADE
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
