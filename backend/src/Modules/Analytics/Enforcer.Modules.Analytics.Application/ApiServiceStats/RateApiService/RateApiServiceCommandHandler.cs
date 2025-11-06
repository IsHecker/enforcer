using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Domain;

namespace Enforcer.Modules.Analytics.Application.ApiServiceStats.RateApiService;

public class RateApiServiceCommandHandler(
    IApiServiceStatRepository serviceStatRepository,
    IRatingRepository ratingRepository) : ICommandHandler<RateApiServiceCommand>
{
    public async Task<Result> Handle(
        RateApiServiceCommand request,
        CancellationToken cancellationToken)
    {
        var apiServiceStat = await serviceStatRepository.GetByApiServiceIdAsync(
            request.ApiServiceId,
            cancellationToken);

        if (apiServiceStat is null)
            return ApiServiceStatErrors.NotFound(request.ApiServiceId);

        var existingRating = await ratingRepository.GetAsync(
            request.ConsumerId,
            request.ApiServiceId,
            cancellationToken);

        if (!request.Rating.HasValue)
            return RemoveRating(existingRating, apiServiceStat);

        if (existingRating is null)
            return await AddRatingAsync(apiServiceStat, request, cancellationToken);

        return ChangeExistingRating(existingRating, apiServiceStat, request.Rating.Value);
    }

    private Result RemoveRating(Rating? existingRating, ApiServiceStat apiServiceStat)
    {
        if (existingRating is null)
            return Result.Success;

        ratingRepository.Delete(existingRating);

        apiServiceStat.RemoveRating(existingRating.Value);
        serviceStatRepository.Update(apiServiceStat);

        return Result.Success;
    }

    private async Task<Result> AddRatingAsync(
        ApiServiceStat apiServiceStat,
        RateApiServiceCommand request,
        CancellationToken cancellationToken)
    {
        var rating = request.Rating.GetValueOrDefault();

        var newRating = Rating.Create(
            request.ConsumerId,
            request.ApiServiceId,
            rating);

        await ratingRepository.AddAsync(newRating, cancellationToken);

        apiServiceStat.AddRating(rating);
        serviceStatRepository.Update(apiServiceStat);

        return Result.Success;
    }

    private Result ChangeExistingRating(
        Rating existingRating,
        ApiServiceStat apiServiceStat,
        byte newRating)
    {
        var oldRating = existingRating.Value;

        existingRating.Update(newRating);
        ratingRepository.Update(existingRating);

        apiServiceStat.ReplaceRating(oldRating, newRating);
        serviceStatRepository.Update(apiServiceStat);

        return Result.Success;
    }
}