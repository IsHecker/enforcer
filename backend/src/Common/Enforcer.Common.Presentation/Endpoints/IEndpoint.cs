using Microsoft.AspNetCore.Routing;

namespace Enforcer.Common.Presentation.Endpoints;

public interface IEndpoint
{
    void MapEndpoint(IEndpointRouteBuilder app);
}