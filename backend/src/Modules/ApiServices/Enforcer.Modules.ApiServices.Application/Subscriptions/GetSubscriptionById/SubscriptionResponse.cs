namespace Enforcer.Modules.ApiServices.Application.Subscriptions.GetSubscriptionById;

public class SubscriptionResponse
{
    public Guid Id { get; set; }
    public Guid ConsumerId { get; set; }
    public Guid PlanId { get; set; }
    public Guid ApiServiceId { get; set; }
    public string ApiKey { get; set; } = null!;
    public DateTime SubscribedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public bool IsCanceled { get; set; }
}