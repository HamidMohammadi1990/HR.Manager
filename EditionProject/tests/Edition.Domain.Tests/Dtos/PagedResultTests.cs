using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Domain.Tests.Dtos;

public class PagedResultTests
{
    private sealed record TestPagedRequest : PagedRequest;

    [Theory]
    [InlineData(0, 10, 0)]
    [InlineData(1, 10, 1)]
    [InlineData(10, 10, 1)]
    [InlineData(11, 10, 2)]
    [InlineData(25, 10, 3)]
    public void Create_WithPagedRequest_CalculatesTotalPages(int totalCount, int pageSize, int expectedTotalPages)
    {
        var request = new TestPagedRequest
        {
            PageNumber = 1,
            PageSize = pageSize
        };

        var result = PagedResult<string>.Create(["item"], request, totalCount);

        result.PageNumber.Should().Be(1);
        result.PageSize.Should().Be(pageSize);
        result.TotalPages.Should().Be(expectedTotalPages);
        result.Items.Should().Equal("item");
    }

    [Fact]
    public void Create_WithExistingPagedResult_CalculatesTotalPagesFromTotalCount()
    {
        var source = new PagedResult
        {
            PageNumber = 2,
            PageSize = 5,
            TotalCount = 12
        };

        var result = PagedResult<int>.Create([1, 2, 3], source);

        result.PageNumber.Should().Be(2);
        result.PageSize.Should().Be(5);
        result.TotalPages.Should().Be(3);
        result.Items.Should().Equal(1, 2, 3);
    }
}
