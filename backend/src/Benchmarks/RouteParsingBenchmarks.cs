using BenchmarkDotNet.Attributes;
using Enforcer.Modules.Gateway.EndpointTrieProvider;
using Microsoft.AspNetCore.Routing.Patterns;

namespace Benchmarks;

[MemoryDiagnoser]
public class RouteParsingBenchmarks
{
    private const string SimpleRoute = "api/users/{id}";
    private const string ComplexRoute = "api/v1/organizations/{orgId}/projects/{projectId}/items/{itemId?}";
    private const string LongRoute = "api/v1/users/{userId}/orders/{orderId?}/items/{itemId}/details/{detailId?}/reviews/{reviewId}/filter/{filterType?}/sort/{sortOrder?}/page/{pageNumber?}/{someanotherparam}";

    [Benchmark]
    [Arguments(SimpleRoute)]
    [Arguments(ComplexRoute)]
    [Arguments(LongRoute)]

    public void MineWhileV2(string route)
    {
        var temp = RouteTemplateParser.Parse(route).GetEnumerator();
        while (temp.MoveNext()) { }
    }

    [Benchmark]
    [Arguments(SimpleRoute)]
    [Arguments(ComplexRoute)]
    [Arguments(LongRoute)]

    public void MineForeachV2(string route)
    {
        foreach (var _ in RouteTemplateParser.Parse(route)) { }
    }

    [Benchmark]
    [Arguments(SimpleRoute)]
    [Arguments(ComplexRoute)]
    [Arguments(LongRoute)]
    public void Other(string route) => RoutePatternFactory.Parse(route);
}