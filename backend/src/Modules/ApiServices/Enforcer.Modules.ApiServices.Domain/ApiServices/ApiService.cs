using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices;

public sealed class ApiService : Entity
{
    public string Name { get; private set; } = null!;
    public string Description { get; private set; } = null!;
    public ApiCategory Category { get; private set; }

    public string ServiceKey { get; private set; } = null!;
    public string TargetBaseUrl { get; private set; } = null!;

    public string? LogoUrl { get; private set; }
    public bool IsPublic { get; private set; }
    public ServiceStatus Status { get; private set; }
    public Guid? ApiDocId { get; private set; }
    public int SubscriptionsCount { get; private set; }
    public string Version { get; private set; } = null!;

    private ApiService() { }


    public static Result<ApiService> Create(
        string name,
        string description,
        ApiCategory category,
        string serviceKey,
        string targetBaseUrl,
        string? logoUrl,
        bool isPublic,
        ServiceStatus status)
    {
        if (string.IsNullOrWhiteSpace(name))
            return Result<ApiService>.Failure(ApiServiceErrors.NameEmpty);

        if (description?.Length > 400)
            return Result<ApiService>.Failure(ApiServiceErrors.DescriptionTooLong);

        if (targetBaseUrl is null)
            return Result<ApiService>.Failure(ApiServiceErrors.TargetBaseUrlRequired);

        var service = new ApiService
        {
            Name = name.Trim(),
            Description = description!,
            Category = category,
            ServiceKey = serviceKey,
            TargetBaseUrl = targetBaseUrl,
            LogoUrl = logoUrl,
            IsPublic = isPublic,
            Status = status,
            ApiDocId = null,
            Version = "1.0.0"
        };

        return service;
    }

    public Result UpdateDetails(
        string name,
        string description,
        ApiCategory category,
        string serviceKey,
        string targetBaseUrl,
        string? logoUrl,
        bool isPublic,
        ServiceStatus status,
        string version)
    {
        var updateVersionResult = UpdateVersion(version);
        if (updateVersionResult.IsFailure)
            return updateVersionResult.Error;

        Name = name;
        Description = description;
        Category = category;
        ServiceKey = serviceKey;
        TargetBaseUrl = targetBaseUrl;
        LogoUrl = logoUrl;
        IsPublic = isPublic;
        Status = status;
        Version = version;

        Raise(new ApiServiceUpdatedEvent(Id));
        return Result.Success;
    }

    public Result Publish()
    {
        if (Status == ServiceStatus.Published)
            return Result.Failure(ApiServiceErrors.AlreadyPublished);

        Status = ServiceStatus.Published;
        Raise(new ApiServicePublishedEvent(Id));

        return Result.Success;
    }

    public Result Deprecate()
    {
        if (Status == ServiceStatus.Deprecated)
            return Result.Failure(ApiServiceErrors.AlreadyDeprecated);

        Status = ServiceStatus.Deprecated;
        Raise(new ApiServiceDeprecatedEvent(Id));

        return Result.Success;
    }

    public void IncrementSubscriptions() => SubscriptionsCount++;
    public Result DecrementSubscriptions()
    {
        if (SubscriptionsCount < 1)
            return Result.Failure(ApiServiceErrors.CannotDecrementSubscriptions);

        SubscriptionsCount--;

        return Result.Success;
    }

    private Result UpdateVersion(string newVersion)
    {
        var newVersionParsed = System.Version.Parse(newVersion);

        var currentVersion = System.Version.Parse(Version);

        if (newVersionParsed <= currentVersion)
            return Result.Failure(ApiServiceErrors.VersionMustBeHigher(Version, newVersion));

        Version = newVersion;
        return Result.Success;
    }
}