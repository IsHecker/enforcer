using Microsoft.AspNetCore.Routing.Patterns;

namespace Enforcer.Modules.Gateway.EndpointTrieProvider;

public class Endpoint
{
    public Guid ApiServiceId { get; private set; } = Guid.NewGuid();
    public Guid PlanId { get; private set; } = Guid.NewGuid();
    public string HTTPMethod { get; private set; } = null!;
    public string PublicPath { get; private set; } = null!;
    public string TargetPath { get; private set; } = null!;
    public int? RateLimit { get; private set; }
    public string? RateLimitWindow { get; private set; }
    public bool IsActive { get; private set; }


    public static readonly List<Endpoint> Endpoints =
    [
        new Endpoint
        {
            HTTPMethod = "GET",
            PublicPath = "/users/{id}",
            TargetPath = "/api/v1/users/{id}",
            RateLimit = 1000,
            RateLimitWindow = "1m",
            IsActive = true
        },
        new Endpoint
        {
            HTTPMethod = "POST",
            PublicPath = "/posts",
            TargetPath = "/api/v1/posts",
            RateLimit = 500,
            RateLimitWindow = "1m",
            IsActive = true
        },
        new Endpoint
        {
            HTTPMethod = "GET",
            PublicPath = "/posts",
            TargetPath = "/api/v1/posts",
            RateLimit = 2000,
            RateLimitWindow = "1h",
            IsActive = true
        },
        new Endpoint
        {
            HTTPMethod = "GET",
            PublicPath = "/posts/{postId}/comments",
            TargetPath = "/api/v1/posts/{postId}/comments",
            RateLimit = 2000,
            RateLimitWindow = "1h",
            IsActive = true
        },
        new Endpoint
        {
            HTTPMethod = "DELETE",
            PublicPath = "/posts/{postId}",
            TargetPath = "/api/v1/posts/{postId}",
            RateLimit = null,
            RateLimitWindow = null,
            IsActive = false
        },
        new Endpoint
        {
            HTTPMethod = "PUT",
            PublicPath = "/users/{id}",
            TargetPath = "/api/v1/users/{id}",
            RateLimit = 300,
            RateLimitWindow = "30s",
            IsActive = true
        }
    ];
}

public class Node
{
    // Dynamic segments are prefixed with ":" or "{}"
    public Dictionary<string, Node> Children { get; private set; } = [];
    public Dictionary<string, Endpoint> SupportedMethods { get; private set; } = null!;
    public bool IsOptional { get; init; } = false;
    public bool IsEnd { get; private set; } = false;

    public void MarkAsEnd() => IsEnd = true;
    public void AddSupportedMethod(Endpoint endpoint)
    {
        SupportedMethods ??= [];

        SupportedMethods.TryAdd(endpoint.HTTPMethod, endpoint);
    }
}

public class EndpointTrie
{
    private readonly Node _root = new();
    public EndpointTrie() { }

    // api/{version}/users/{id:int?}/posts/{*slug}
    // api/{version}/blogs
    // api/api/{version}/blogs
    public EndpointTrie(IEnumerable<Endpoint> endpoints)
    {
        foreach (var endpoint in endpoints)
        {
            var currentNode = _root;
            var routePattern = RoutePatternFactory.Parse(endpoint.PublicPath);

            foreach (var segment in routePattern.PathSegments)
            {
                var part = segment.Parts[0];

                var segmentName = "";
                var isOptional = false;

                if (part is RoutePatternLiteralPart literal)
                {
                    segmentName = literal.Content;
                }
                else if (part is RoutePatternParameterPart param)
                {
                    segmentName = param.Name;
                    isOptional = param.IsOptional;
                }

                if (currentNode.Children.TryGetValue(segmentName, out var nextNode))
                {
                    currentNode = nextNode;
                    continue;
                }

                var newNode = new Node()
                {
                    IsOptional = isOptional
                };

                currentNode.Children.Add(segmentName, newNode);
                currentNode = newNode;
            }

            currentNode.AddSupportedMethod(endpoint);
            currentNode.MarkAsEnd();
        }
    }
}