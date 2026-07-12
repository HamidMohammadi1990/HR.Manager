using JavidHrm.Application.Common.Utilities;

namespace JavidHrm.Application.Tests.Common.Utilities;

public class FileUploadSecurityTests
{
    [Fact]
    public void CreateSafeFileName_UsesAllowedExtension()
    {
        var fileName = FileUploadSecurity.CreateSafeFileName("photo.JPG");

        Path.GetExtension(fileName).Should().Be(".jpg");
        Path.GetFileNameWithoutExtension(fileName).Should().HaveLength(32);
    }

    [Fact]
    public void CreateSafeFileName_UsesFallbackWhenExtensionIsNotAllowed()
    {
        var fileName = FileUploadSecurity.CreateSafeFileName("script.exe", ".png");

        fileName.Should().EndWith(".png");
    }

    [Fact]
    public void ResolveSafeFilePath_ReturnsCombinedPathInsideRoot()
    {
        var root = Path.GetTempPath();
        var result = FileUploadSecurity.ResolveSafeFilePath(root, "sample.png");

        result.Should().StartWith(Path.GetFullPath(root));
        result.Should().EndWith("sample.png");
    }

    [Fact]
    public void ResolveSafeFilePath_BlocksPathTraversal()
    {
        var root = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(root);

        try
        {
            var action = () => FileUploadSecurity.ResolveSafeFilePath(root, "..\\outside.txt");
            action.Should().Throw<InvalidOperationException>();
        }
        finally
        {
            Directory.Delete(root, recursive: true);
        }
    }
}
