using System.Net;
using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Analytics.Domain;

public class ApiServiceStat : Entity
{
    public Guid ApiServiceId { get; init; }
    public long TotalApiCalls { get; private set; }
    public long FailedApiCalls { get; private set; }
    public float TotalResponseTimeMs { get; private set; }
    public int ActiveSubscribers { get; private set; }
    public int TotalSubscribers { get; private set; }
    public float AverageRating { get; private set; }
    public int TotalRatings { get; private set; }

    public float UptimePercentage => TotalApiCalls == 0 ? 100f : MathF.Round(FailedApiCalls / TotalApiCalls * 100f, 2);
    public long SuccessfulApiCalls => TotalApiCalls - FailedApiCalls;
    public float AverageResponseTimeMs => TotalApiCalls == 0 ? 0 : float.Round(TotalResponseTimeMs / TotalApiCalls, 3);

    private ApiServiceStat() { }

    public static ApiServiceStat Create(Guid apiServiceId)
    {
        return new ApiServiceStat
        {
            ApiServiceId = apiServiceId
        };
    }

    public void AddRating(byte rating)
    {
        RecalculateAverageRating(rating, TotalRatings + 1);

        UpdatedAt = DateTime.UtcNow;
    }

    public void ReplaceRating(byte oldRating, byte newRating)
    {
        var delta = newRating - oldRating;
        RecalculateAverageRating(delta, TotalRatings);

        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveRating(byte rating)
    {
        if (TotalRatings == 0)
            return;

        RecalculateAverageRating(-rating, TotalRatings - 1);

        UpdatedAt = DateTime.UtcNow;
    }

    private void RecalculateAverageRating(int ratingDelta, int newTotalRatings)
    {
        var ratingsSum = (AverageRating * TotalRatings) + ratingDelta;

        TotalRatings = newTotalRatings;

        AverageRating = TotalRatings > 0 ? float.Round(ratingsSum / TotalRatings, 1) : 0;
    }

    public void RecordApiCall(HttpStatusCode statusCode, float responseTimeMs)
    {
        TotalApiCalls++;
        TotalResponseTimeMs += float.Round(responseTimeMs, 3);

        if (!IsSuccessfulResponse(statusCode))
            FailedApiCalls++;

        UpdatedAt = DateTime.UtcNow;
    }

    public void AddSubscriber()
    {
        TotalSubscribers++;
        ActiveSubscribers++;

        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveSubscriber()
    {
        if (ActiveSubscribers > 0)
            ActiveSubscribers--;

        UpdatedAt = DateTime.UtcNow;
    }

    private static bool IsSuccessfulResponse(HttpStatusCode statusCode) => statusCode < HttpStatusCode.InternalServerError;
}