using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.Usages;

namespace Enforcer.Modules.ApiServices.Application.ApiKeyBans.UnbanApiKey;

internal sealed class UnbanApiKeyCommandHandler(IApiKeyBanRepositoy banRepositoy) : ICommandHandler<UnbanApiKeyCommand>
{
    public async Task<Result> Handle(UnbanApiKeyCommand request, CancellationToken cancellationToken)
    {
        var deleteCount = await banRepositoy.DeleteByApiKeyAsync(request.ApiKey, cancellationToken);

        if (deleteCount <= 0)
            return ApiKeyBanErrors.NotFound(request.ApiKey);

        return Result.Success;
    }
}