namespace Enforcer.Common.Application.Data;

public readonly record struct Pagination(int PageNumber = 1, int PageSize = 5)
{
    public static readonly Pagination Default = new();

    public int PageNumber { get; init; } = PageNumber;
    public int PageSize { get; init; } = PageSize;
}