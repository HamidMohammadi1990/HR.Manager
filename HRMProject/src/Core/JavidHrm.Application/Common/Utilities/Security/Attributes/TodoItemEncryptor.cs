using JavidHrm.Application.Models.Constants;
using JavidHrm.Application.Common.Utilities.JsonAttributes;

namespace JavidHrm.Application.Common.Utilities.Security.Attributes;

public class TodoItemEncryptor() : JsonIntEncryptor(SecurityKeyConstant.TodoItem) { }
public class TodoItemNullableEncryptor() : JsonNullableIntEncryptor(SecurityKeyConstant.TodoItem) { }
