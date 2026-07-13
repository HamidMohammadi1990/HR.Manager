using JavidHrm.Application.Models.Dtos;

namespace JavidHrm.Application.Features.Users.Queries;

public record GetForgetPasswordOptionResponse
{
    public string Username { get; init; } = default!;
    public List<ForgetPasswordOptionDto> Options { get; init; } = [];
}