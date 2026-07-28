-- Adds profile image URL column to User table.

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[dbo].[User]') AND name = N'ProfileImageUrl'
)
BEGIN
    ALTER TABLE [dbo].[User]
        ADD [ProfileImageUrl] NVARCHAR(500) NULL;
END
GO

IF NOT EXISTS (
    SELECT 1 FROM [dbo].[__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260728120000_user-profile-image'
)
BEGIN
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260728120000_user-profile-image', N'10.0.9');
END
GO
