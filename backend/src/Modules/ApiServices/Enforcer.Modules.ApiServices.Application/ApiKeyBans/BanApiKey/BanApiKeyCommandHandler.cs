using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.Usages;

namespace Enforcer.Modules.ApiServices.Application.ApiKeyBans.BanApiKey;

internal sealed class BanApiKeyCommandHandler(
    IApiKeyBanRepositoy banRepositoy,
    ISubscriptionRepository subscriptionRepository) : ICommandHandler<BanApiKeyCommand>
{
    public async Task<Result> Handle(BanApiKeyCommand request, CancellationToken cancellationToken)
    {
        var isBanned = await banRepositoy.ExistsByApiKeyAsync(request.ApiKey, cancellationToken);

        if (isBanned)
            return ApiKeyBanErrors.AlreadyBanned;

        var isSubscriptionExist = await subscriptionRepository.ExistsByApiKeyAsync(request.ApiKey, cancellationToken);

        if (!isSubscriptionExist)
            return ApiKeyBanErrors.NotFound(request.ApiKey);

        var createResult = ApiKeyBan.Create(
            request.ApiKey,
            request.Reason,
            request.CreatorId,
            request.ExpiresAt);

        if (createResult.IsFailure)
            return createResult.Error;

        await banRepositoy.AddAsync(createResult.Value, cancellationToken);

        return Result.Success;
    }
}