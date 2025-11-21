using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Analytics.Domain;

public class PlanStat : Entity
{
    private int _cancellationsThisMonth;
    private DateTime _monthTrackingDate;

    public Guid PlanId { get; private set; }

    public int TotalSubscribers { get; private set; }
    public int ActiveSubscribers { get; private set; }

    public float CancellationPercentage => TotalSubscribers == 0 ? 0 : _cancellationsThisMonth / (float)TotalSubscribers * 100;

    private PlanStat() { }

    public static PlanStat Create(Guid planId)
    {
        return new PlanStat
        {
            PlanId = planId,
            _monthTrackingDate = DateTime.UtcNow.Date
        };
    }

    public void AddSubscriber()
    {
        TotalSubscribers++;
        ActiveSubscribers++;
    }

    public void CancelSubscriber()
    {
        if (ActiveSubscribers > 0)
            ActiveSubscribers--;

        _cancellationsThisMonth = GetCancellationsThisMonth();
        _cancellationsThisMonth++;
    }

    public int GetCancellationsThisMonth()
    {
        if (!IsNewMonth())
            return _cancellationsThisMonth;

        _cancellationsThisMonth = 0;
        _monthTrackingDate = DateTime.UtcNow.Date;

        return _cancellationsThisMonth;
    }

    private bool IsNewMonth() => _monthTrackingDate.Month != DateTime.UtcNow.Month
        || _monthTrackingDate.Year != DateTime.UtcNow.Year;
}