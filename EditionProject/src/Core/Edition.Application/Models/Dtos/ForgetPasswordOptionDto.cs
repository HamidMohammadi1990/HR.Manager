using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Models.Dtos;

public record ForgetPasswordOptionDto
(
    string Title, 
    ForgetPasswordOptionType OptionType
);